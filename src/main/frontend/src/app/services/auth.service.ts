import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { User, UserSession } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Usamos un BehaviorSubject para gestionar el estado de autenticación
  private userSubject: BehaviorSubject<UserSession | null> =
    new BehaviorSubject<UserSession | null>(this.getUserFromLocalStorage());
  public user$: Observable<UserSession | null> =
    this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Método para autenticar usuario
  login(username: string, password: string): Observable<UserSession> {
    const body = { username, password };

    return this.http.post<any>(`/auth/login`, body).pipe(
      tap((data) => {
        // Guardamos el token y el rol en el localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);

        // Asegurarse de que 'roles' existe y es un array, y acceder al primer rol
        const role =
          Array.isArray(data.roles) && data.roles.length > 0
            ? data.roles[0]
            : null;
        localStorage.setItem('role', role);

        // Creamos un objeto UserSession
        const userSession: UserSession = {
          token: data.token,
          username: data.username,
          roles: data.roles,
        };

        // Actualizamos el estado del usuario
        this.userSubject.next(userSession);
      }),
      catchError(this.handleError)
    );
  }
  // Método para cerrar sesión
  logout(): void {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');

    // Actualizar el estado del usuario
    this.userSubject.next(null);

    console.log('Vuelve pronto');
  }

  // Registro de un nuevo usuario
  register(userData: any): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<User>(`/api/user/register`, userData, { headers })
      .pipe(catchError(this.handleError));
  }

  // Método para solicitar de nuevo la contraseña
  sendEmailPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`,{}, { headers, responseType: 'text' } // Cambiar el tipo de respuesta a texto
    ).pipe(
      catchError(this.handleError)
    );
  }

  //Restablecer contraseña
  /*resetPassword(email: string, newPassword: string) {

    const headers = new HttpHeaders({'Content-Type': 'application/json',});

    return this.http.post(`/auth/reset-password`, { email, newPassword }, {headers});
  }*/

    resetPassword(email: string, newPassword: string) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      const body = new HttpParams()
        .set('email', email)
        .set('newPassword', newPassword);

      return this.http.post(`/auth/reset-password`, body.toString(), { headers,responseType: 'text' as 'json' });
    }


  // Método para obtener el rol del usuario
  getUserRole(): string {
    const role = localStorage.getItem('role');
    return role ? role : 'guest'; // Si no hay rol, consideramos 'guest'
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.userSubject.value !== null; // Comprobamos el estado del usuario con el BehaviorSubject
  }

  getCurrentUser(): Observable<User> {
    const token = localStorage.getItem('token');

    if (!token) {
      // Maneja el caso donde el token no está presente
      console.error('Token no encontrado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    // Crea el objeto de HttpHeaders con el token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<User>('/api/user/profile', { headers })
      .pipe(catchError(this.handleError));
  }

  // Método para obtener la foto de perfil
  getProfilePhoto(): Observable<Blob> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no encontrado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<Blob>('/api/user/profile-photo', {
        headers,
        responseType: 'blob' as 'json', // Especifica que la respuesta será un Blob
      })
      .pipe(catchError(this.handleError));
  }

  // Método para obtener todos los usuarios
  getdAll(): Observable<User[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token no encontrado en localStorage');
      return throwError(() => new Error('Token no encontrado'));
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get<User[]>(`/api/user/all`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Método para bloquear usuario
  blockUser(userId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` , 'Content-Type': 'application/json',});

    return this.http
    .put<void>(`/api/user/block/${userId}`, {}, { headers, responseType: 'text' as 'json' })
    .pipe(catchError(this.handleError));
  }

  // Método para desbloquear usuario
  unblockUser(userId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', });

    return this.http
    .put<void>(`/api/user/unblock/${userId}`, {}, { headers, responseType: 'text' as 'json' })
    .pipe(catchError(this.handleError));
  }

  // Actualización de datos del usuario
  updateUser(user: User): Observable<User> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(
        () => new Error('No se encontró el token de autenticación')
      );
    }

    const headers = new HttpHeaders({Authorization: `Bearer ${token}`,'Content-Type': 'application/json', });

    return this.http
      .put<User>(`/api/user/update`, user, { headers }) // Envía los datos del usuario
      .pipe(catchError(this.handleError));
  }

  // Eliminar usuario
  deleteUser(): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    if (!token) {
      return throwError(
        () => new Error('No se encontró el token de autenticación')
      );
    }

    return this.http
      .delete<User>(`/api/user/delete`, { headers }) // Envía los datos del usuario
      .pipe(catchError(this.handleError));
  }

  deleteUserAdmin(userId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http
      .delete<void>(`/api/user/delete/${userId}`, { headers })
      .pipe(catchError(this.handleError));
}

  //subir foto, modificacion 19/11/24
  uploadPhoto(photoData: FormData): Observable<{ photoUrl: string }> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(
        () => new Error('No se encontró el token de autenticación')
      );
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .post<{ photoUrl: string }>('/api/user/upload-profile-photo', photoData, { headers,responseType: 'text' as 'json' })
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          console.log('Respuesta de la API:', response);
        })
      );
  }

  // Función para manejar errores de respuesta HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error:', error);
    return throwError(
      () => new Error(`Error en la solicitud: ${error.message}`)
    );
  }

  // Método privado para obtener el usuario desde localStorage
  private getUserFromLocalStorage(): UserSession | null {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (token && username && role) {
      return {
        token,
        username,
        roles: [role], // Puedes extender esto para manejar múltiples roles
      };
    }
    return null;
  }
}
