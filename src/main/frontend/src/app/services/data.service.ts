import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';  // Asegúrate de importar HttpClient
import { catchError, Observable, of, throwError } from 'rxjs';
import { Anuncio, ad } from '../interfaces/anuncio.interfaces';  // Asegúrate de tener esta interfaz
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

  getAnunciosByAnimal(animal: string): Observable<Anuncio[]> {
    console.log('URL solicitada:', `${this.baseUrl}/anuncios?tipo_animal=${animal}`);  // Imprime la URL para asegurarte
    return this.http.get<Anuncio[]>(`${this.baseUrl}/anuncios?tipo_animal=${animal}`).pipe(
      catchError(error => {
        console.error('Error al obtener anuncios por tipo de animal:', error);  // Captura el error si algo sale mal
        return of([]);  // Devuelve un array vacío si hay un error
      })
    );
  }

  //Metodo para traer todos los anuncios
  getAnonces(): Observable<ad[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no encontrado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<ad[]>(`/api/ad/all`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  // Función para manejar errores de respuesta HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error:', error);
    return throwError(() => new Error(`Error en la solicitud: ${error.message}`));
  }



}
