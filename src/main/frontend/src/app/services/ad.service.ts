import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';  // Asegúrate de importar HttpClient
import { catchError, Observable, of, throwError } from 'rxjs';
import { Anuncio, Ad } from '../interfaces/anuncio.interfaces';  // Asegúrate de tener esta interfaz
import { environments } from '../../environments/environments';  // Revisa que esta ruta sea válida

@Injectable({
  providedIn: 'root'
})
export class AdService {

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






//   //Metodo para visualizar todos los anuncios
//   getAllAds(): Observable<Ad[]> {
//   return this.http.get<Ad[]>('/api/ad/all').pipe(
//     catchError(error => {
//       console.error('Error al obtener todos los anuncios:', error);
//       return of([]); // Devuelve un array vacío en caso de error
//     })
//   );
// }


//  //Metodo para visualizar de acuerdo a la categoria
//  getAdByCategory(category: string): Observable<Ad[]> {
//   console.log('URL solicitada:', `user/category?=${category}`);
//   return this.http.get<Ad[]>(`api/ad/category?=${category}`).pipe(
//     catchError(error => {
//       console.error('Error al obtener anuncios por categoría:', error);  // Para capturar errores
//       return of([]);  // Devuelve un array vacío si hay un error
//     })
//   );
// }
// getAdById( id: string ): Observable<Anuncio|undefined> {
//   return this.http.get<Anuncio>(`api/ad/anuncios/${ id }`)
//   .pipe(
//     catchError( error => of(undefined) )
//   );
// }


getAllAds(): Observable<Ad[]> {
  return this.http.get<Ad[]>('/api/ad/all').pipe(
    catchError(error => {
      console.error('Error al obtener todos los anuncios:', error);
      return of([]); // Devuelve un array vacío en caso de error
    })
  );
}


getAdsByCategory(category: string): Observable<Ad[]> {
  return this.http.get<Ad[]>(`/api/ad/category/${category}`).pipe(
    catchError(error => {
      console.error('Error al obtener anuncios por categoría:', error);
      return of([]); // Devuelve un array vacío en caso de error
    })
  );
}

getAdsByType(typeAd: string): Observable<Ad[]> {
  return this.http.get<Ad[]>(`/api/ad/type/${typeAd}`).pipe(
    catchError(error => {
      console.error('Error al obtener anuncios por tipo:', error);
      return of([]); // Devuelve un array vacío en caso de error
    })
  );
}

getAdsByTypeAndCategory(typeAd: string, category: string): Observable<Ad[]> {
  return this.http.get<Ad[]>(`/api/ad/type/${typeAd}/category/${category}`).pipe(
    catchError(error => {
      console.error('Error al obtener anuncios por tipo y categoría:', error);
      return of([]); // Devuelve un array vacío en caso de error
    })
  );
}

getAdComplete(idAd: number): Observable<Ad | undefined> {
  return this.http.get<Ad>(`/api/ad/complete/${idAd}`).pipe(
    catchError(error => {
      console.error('Error al obtener el anuncio completo:', error);
      return of(undefined); // Devuelve undefined en caso de error
    })
  );
}


  //Metodo para crear anuncios
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

    return this.http.post<Ad>(`api/ad/create`, formData, { headers });
  }

  //Metodo para modificar anuncios
  updateAd(ad: Ad): Observable<Ad> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Ad>(`/api/ad/${ad.id_ad}`, ad, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteAd(id_ad: number): Observable<void> {
    return this.http.delete<void>(`/api/ad/${id_ad}`).pipe(
      catchError(this.handleError)
    );
  }




  // Función para manejar errores de respuesta HTTP
 private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error en la solicitud:', error);
    return throwError(() => new Error(`Error en la solicitud: ${error.message}`));
  }



}
