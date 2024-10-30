import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Asegúrate de importar HttpClient
import { catchError, Observable, of } from 'rxjs';
import { Anuncio } from '../interfaces/anuncio.interfaces';  // Asegúrate de tener esta interfaz
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




}
