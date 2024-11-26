import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Ad } from '../interfaces/anuncio.interfaces'; // Revisa que esta ruta sea válida
import { environments } from '../../environments/environments'; // Revisa que esta ruta sea válida

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {} // Inyecta HttpClient

  // Método para obtener todos los anuncios
  getAllAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(`/api/ad/all`).pipe(
      catchError(error => {
        console.error('Error al obtener todos los anuncios:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Método para obtener anuncios por categoría
  getAdsByCategory(category: string): Observable<Ad[]> {
    return this.http.get<Ad[]>(`/api/ad/category/${category}`).pipe(
      catchError(error => {
        console.error('Error al obtener anuncios por categoría:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Método para obtener anuncios por tipo
  getAdsByType(typeAd: string): Observable<Ad[]> {
    return this.http.get<Ad[]>(`/api/ad/type/${typeAd}`).pipe(
      catchError(error => {
        console.error('Error al obtener anuncios por tipo:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Método para obtener anuncios por tipo y categoría //NO LO USO
  getAdsByTypeAndCategory(typeAd: string, category: string): Observable<Ad[]> {
    return this.http.get<Ad[]>(`/api/ad/type/${typeAd}/category/${category}`).pipe(
      catchError(error => {
        console.error('Error al obtener anuncios por tipo y categoría:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Método para obtener un anuncio completo por ID
  getAdComplete(idAd: number): Observable<Ad | undefined> {
    return this.http.get<Ad>(`/api/ad/complete/${idAd}`).pipe(
      catchError(error => {
        console.error('Error al obtener el anuncio completo:', error);
        return of(undefined); // Devuelve undefined en caso de error
      })
    );
  }

  //Metodo para obtener los anuncios de cada usuario
  getMyAds(): Observable<Ad[]> {

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });


    return this.http.get<Ad[]>(`/api/ad/myads` , { headers }).pipe(
      catchError(error => {
        console.error('Error al obtener todos los anuncios:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Método para obtener un anuncio por ID //
  getAdById(id: number): Observable<Ad | undefined> {
    return this.http.get<Ad>(`/api/ad/id/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener anuncio por ID:', error);
        return of(undefined); // Devuelve undefined en caso de error
      })
    );
  }

  // Método para crear un anuncio
  createAd(ad: Ad, files: File[]): Observable<Ad> {
    const formData = new FormData();

    // Convertir el objeto `ad` a JSON y añadirlo al FormData como `ad`
    formData.append('ad', JSON.stringify(ad));

    // Agregar cada archivo al FormData bajo el nombre `photos`
    files.forEach(file => {
      formData.append('photos', file, file.name);
    });

    // Configurar el encabezado de autorización
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Ad>(`/api/ad/create`, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para modificar un anuncio
  updateAd(ad: Ad): Observable<Ad> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Ad>(`/api/ad/${ad.idAd}`, ad, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para eliminar un anuncio
  deleteAd(id : number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);


    return this.http.delete<void>(`/api/ad/delete-my-ad/${id}`, {headers}).pipe(
      catchError(this.handleError)
    );
  }

  // Función para manejar errores de respuesta HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error(`Error en la solicitud: ${error.message}`));
  }
}
