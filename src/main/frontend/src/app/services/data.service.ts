import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';  // Asegúrate de importar HttpClient
import { catchError, Observable, of, throwError } from 'rxjs';
import { Anuncio, Ad } from '../interfaces/anuncio.interfaces';  // Asegúrate de tener esta interfaz
import { environments } from '../../environments/environments';  // Revisa que esta ruta sea válida

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {}  // HttpClient está siendo inyectado aquí

  getAnuncios(): Observable<Anuncio[]> {
    return this.http.get<Anuncio[]>(`${this.baseUrl}/anuncios`);
  }

   //Metodo para traer todos los anuncios
   getAnonces(): Observable<Ad[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no encontrado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Ad[]>(`/ad/all`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getAnuncioById( id: string ): Observable<Anuncio|undefined> {
    return this.http.get<Anuncio>(`${ this.baseUrl }/anuncios/${ id }`)
    .pipe(
      catchError( error => of(undefined) )
    );
  }


  getAnunciosByCategoria(categoria: string): Observable<Anuncio[]> {
    console.log('URL solicitada:', `${this.baseUrl}/anuncios?tipo_anuncio=${categoria}`);  // Verifica la URL generada
    return this.http.get<Anuncio[]>(`${this.baseUrl}/anuncios?tipo_anuncio=${categoria}`).pipe(
      catchError(error => {
        console.error('Error al obtener anuncios por categoría:', error);  // Para capturar errores
        return of([]);  // Devuelve un array vacío si hay un error
      })
    );
  }

  getAdsByCategoria(category: string): Observable<Ad[]> {
    console.log('URL solicitada:', `user/category?=${category}`);
    return this.http.get<Ad[]>(`user/category?=${category}`).pipe(
      catchError(error => {
        console.error('Error al obtener anuncios por categoría:', error);  // Para capturar errores
        return of([]);  // Devuelve un array vacío si hay un error
      })
    );
  }

  getAnunciosByAnimal(animal: string): Observable<Anuncio[]> {
    console.log('URL solicitada:', `${this.baseUrl}/anuncios?tipo_animal=${animal}`);  // Imprime la URL para asegurarte
    return this.http.get<Anuncio[]>(`${this.baseUrl}/anuncios?tipo_animal=${animal}`).pipe(
      catchError(error => {
        console.error('Error al obtener anuncios por tipo de animal:', error);  // Captura el error si algo sale mal
        return of([]);  // Devuelve un array vacío si hay un error
      })
    );
  }

  createAd(ad: Ad, files: File[]): Observable<Ad> {
    const formData = new FormData();

    // Convertir el objeto `ad` a JSON y añadirlo al FormData como `ad`
    formData.append('ad', JSON.stringify(ad));

    // Agregar cada archivo al FormData bajo el nombre `photos`
    files.forEach((file, index) => {
      formData.append('photos', file, file.name);
    });

    // Configurar el encabezado de autorización
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Ad>(`${this.baseUrl}/create`, formData, { headers });
  }

  updateAd(ad: Ad): Observable<Ad> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Ad>(`/api/user/${ad.id_user}`, ad, { headers }).pipe(
      catchError(this.handleError)
    );
  }



  // Función para manejar errores de respuesta HTTP
 private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error(`Error en la solicitud: ${error.message}`));
  }



}
