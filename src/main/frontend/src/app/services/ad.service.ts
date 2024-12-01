import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Ad } from '../interfaces/anuncio.interfaces'; // Revisa que esta ruta sea válida
import { environments } from '../../environments/environments'; // Revisa que esta ruta sea válida

@Injectable({
  providedIn: 'root',
})
export class AdService {
  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) {} // Inyecta HttpClient

  // Método para obtener todos los anuncios
  getAllAds(): Observable<Ad[]> {
    return this.http.get<Ad[]>(`/api/ad/all`).pipe(
      catchError((error) => {
        console.error('Error al obtener todos los anuncios:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Método para obtener anuncios por categoría
  getAdsByCategory(category: string): Observable<Ad[]> {
    return this.http.get<Ad[]>(`/api/ad/category/${category}`).pipe(
      catchError((error) => {
        console.error('Error al obtener anuncios por categoría:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Método para obtener anuncios por tipo
  getAdsByType(typeAd: string): Observable<Ad[]> {
    return this.http.get<Ad[]>(`/api/ad/type/${typeAd}`).pipe(
      catchError((error) => {
        console.error('Error al obtener anuncios por tipo:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Método para obtener anuncios por tipo y categoría //NO LO USO
  getAdsByTypeAndCategory(typeAd: string, category: string): Observable<Ad[]> {
    return this.http
      .get<Ad[]>(`/api/ad/type/${typeAd}/category/${category}`)
      .pipe(
        catchError((error) => {
          console.error(
            'Error al obtener anuncios por tipo y categoría:',
            error
          );
          return of([]); // Devuelve un array vacío en caso de error
        })
      );
  }

  // Método para obtener un anuncio completo por ID
  getAdComplete(idAd: number): Observable<Ad | undefined> {
    return this.http.get<Ad>(`/api/ad/complete/${idAd}`).pipe(
      catchError((error) => {
        console.error('Error al obtener el anuncio completo:', error);
        return of(undefined); // Devuelve undefined en caso de error
      })
    );
  }
  getAdPhoto(id: number): Observable<string[]> {
    return this.http.get<{ photos: string }[]>(`/api/ad/photos/${id}`).pipe(
      map((response) =>
        response.map((item) => `data:image/jpeg;base64,${item.photos}`) // Construye la URL Base64
      )
    );
  }



  //Metodo para
  // Método para obtener la foto de perfil obtener los anuncios de cada usuario
  getMyAds(): Observable<Ad[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<Ad[]>(`/api/ad/myads`, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener todos los anuncios:', error);
        return of([]); // Devuelve un array vacío en caso de error
      })
    );
  }

  // Método para obtener un anuncio por ID //
  getAdById(id: number): Observable<Ad | undefined> {
    return this.http.get<Ad>(`/api/ad/id/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener anuncio por ID:', error);
        return of(undefined); // Devuelve undefined en caso de error
      })
    );
  }

  // Método para crear un anuncio
  // createAd(AdData: Ad): Observable<Ad> {
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json',
  //   });
  //   return this.http
  //     .post<Ad>(`/api/ad/create`, AdData, { headers })
  //     .pipe(catchError(this.handleError));
  // }

   // Método para crear anuncio con archivos
   createAd(adData: Ad, files: File[]): Observable<Ad> {
    const formData = new FormData();
    const token = localStorage.getItem('token');

    // Agregar datos del anuncio como JSON
    formData.append('createAdDTO', JSON.stringify(adData));

    // Agregar fotos
    files.forEach((file) => formData.append('photos', file));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post<Ad>(`/api/ad/create1`, formData, { headers });
  }




  updateAd(adId: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .put(`/api/ad/update/${adId}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }


  // Método para eliminar un anuncio
  deleteAd(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .delete<void>(`/api/ad/delete-my-ad/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Función para manejar errores de respuesta HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError(
      () => new Error(`Error en la solicitud: ${error.message}`)
    );
  }
}
