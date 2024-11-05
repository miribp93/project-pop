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

    return this.http.post<any>(`/auth/login`, body).pipe(
      tap(data => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        alert("Bienvenido")
      })

    );
  }


logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    console.log("Vuelve pronto")
  }

  //obtener todos los usuarios
//   findAll(): Observable<User[]> {
//     return this.http
//       .get<User[]>(`/api/user`)
//       .pipe(catchError(this.handleError));
//   }

findAll(): Observable<User[]> {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token no encontrado en localStorage');
    return throwError(() => new Error('Token no encontrado'));
  }
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<User[]>(`/api/user/all`, { headers }).pipe(
    catchError(this.handleError)
  );
}

  // Registro de un nuevo usuario
  register(userData: any): Observable<User> {
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


  //Eliminar usuario
  delete(id: string): Observable<User> {
    return this.http
      .delete<User>(`/api/user/${id}`)
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
