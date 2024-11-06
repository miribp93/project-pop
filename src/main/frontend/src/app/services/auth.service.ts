import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, UserSession } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) {}

  // Método para autenticar usuario
  login(username: string, password: string): Observable<UserSession> {
    const body = { username, password };

    return this.http.post<any>(`/auth/login`, body).pipe(
      tap(data => {
        // Guardamos el token y el rol en el localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        // localStorage.setItem('role', data.role); // Suponiendo que la respuesta incluye un campo `role`
        alert("Bienvenido");
      }),
      catchError(this.handleError)
    );
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // localStorage.removeItem('role'); // También eliminamos el rol
    console.log("Vuelve pronto");
  }

  // Método para obtener el rol del usuario
  getUserRole(): string {
    const role = localStorage.getItem('role');
    return role ? role : 'guest'; // Si no hay rol, consideramos 'guest'
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Obtener datos del usuario autenticado
  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');

    if (!token) {
      // Maneja el caso donde el token no está presente
      console.error('Token no encontrado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    // Crea el objeto de HttpHeaders con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User>('/api/user/profile', { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para solicitar de nuevo la contraseña
  resetPassword(email: string): Observable<any> {
    return this.http.post('/api/auth/forgot-password', { email }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener todos los usuarios
  findAll(): Observable<User[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no encontrado en localStorage');
      return throwError(() => new Error('Token no encontrado'));    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<User[]>(`/api/user/all`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Método que indica si el usuario está bloqueado o no
  updateUserStatus(userId: number, isBlocked: boolean): Observable<void> {
    return this.http.put<void>(`/api/users/${userId}/status`, { isBlocked }).pipe(
      catchError(this.handleError)
    );
  }

  // Registro de un nuevo usuario
  register(userData: any): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(`/api/user/register`, userData, { headers }).pipe(
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

  // Método para subir foto
  uploadPhoto(photoData: FormData): Observable<{ photoUrl: string }> {
    return this.http.post<{ photoUrl: string }>(
      '/api/user/upload-photo',
      photoData
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar usuario
  delete(id: string): Observable<User> {
    return this.http.delete<User>(`/api/user/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Función para manejar errores de respuesta HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 200 && error.error instanceof SyntaxError) {
      console.error('Error: La respuesta no es JSON.', error);
      return throwError(
        () => new Error('La respuesta del servidor no es JSON. Verifique la URL o el servidor.')
      );
    } else {
      console.error('Error:', error);
      return throwError(() => new Error(`Error en la solicitud: ${error.message}`));
    }
  }
}
