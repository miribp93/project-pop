import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User, UserLogin, UserSession } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //Metodo para solicitar de nuevo la contraseña
  resetPassword(email: string): Observable<any> {
    return this.http.post('/api/auth/forgot-password', { email });
  }

  //Metodo para subir foto
  uploadPhoto(photoData: FormData): Observable<{ photoUrl: string }> {
    return this.http.post<{ photoUrl: string }>(
      '/api/user/upload-photo',
      photoData
    );
  }

  //Metodo que indica si el usuario esta bloqueado o no
  updateUserStatus(userId: number, isBlocked: boolean): Observable<void> {
       return this.http.put<void>(`/api/users/${userId}/status`, { isBlocked });
  }
  constructor(private http: HttpClient) {}

  // Método para autenticar usuario
  // Mientras se pueda, evitar el objeto any y usar una interfaz declarando el objeto que esperas
  login(username: string, password: string): Observable<UserSession> {
    const body = { username, password };

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
    return this.http
      .get<User[]>(`/api/user`)
      .pipe(catchError(this.handleError));
  }

  // Registro de un nuevo usuario
  register(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<any>(`/api/user/register`, userData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Actualización de datos del usuario
  update(user: User): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<User>(`/api/user/${user.id_user}`, user, { headers })
      .pipe(catchError(this.handleError));
  }

  // Obtener datos del usuario autenticado
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`/api/user/current`).pipe(
      catchError(this.handleError)
    );
  }
  

   /*login(usuario: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { usuario, password };

    return this.http.post<any>(`/auth/login`, body, { headers }).pipe.(
      localStorage.setItem('token', respo)
      catchError(this.handleError)
    );
  }*/

  //Eliminar usuario
  delete(id: string): Observable<any> {
    return this.http
      .delete<any>(`/api/user/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Función para manejar errores de respuesta HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 200 && error.error instanceof SyntaxError) {
      console.error('Error: La respuesta no es JSON.', error);
      return throwError(
        'La respuesta del servidor no es JSON. Verifique la URL o el servidor.'
      );
    } else {
      console.error('Error:', error);
      return throwError(`Error en la solicitud: ${error.message}`);
    }
  }
}
