import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // Método para autenticar usuario
  login(usuario: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { usuario, password };

    return this.http.post<any>(`/auth/login`, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

 //Método para cerrar sesión
  logout(): void {
    this.http.post<any>('/auth/logout', {}).subscribe(
      () => {
        localStorage.removeItem('token');
      },
      (error) => {
        console.error('Error en el logout:', error);
      }
    );
  }

  //obtener todos los usuarios
  findAll(): Observable<User[]> {
    return this.http.get<User[]>(`/api/user`).pipe(
      catchError(this.handleError)
    );
  }

  // Registro de un nuevo usuario
  register(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`/api/user/register`, userData, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Actualización de datos del usuario
  update(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<User>(`/api/user/${user.id_user}`, user, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener datos del usuario autenticado
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`/api/user/current`).pipe(
      catchError(this.handleError)
    );
  }

  //Eliminar usuario
  delete(id: string): Observable<any> {
    return this.http.delete<any>(`/api/user/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Función para manejar errores de respuesta HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 200 && error.error instanceof SyntaxError) {
      console.error('Error: La respuesta no es JSON.', error);
      return throwError('La respuesta del servidor no es JSON. Verifique la URL o el servidor.');
    } else {
      console.error('Error:', error);
      return throwError(`Error en la solicitud: ${error.message}`);
    }
  }
}
