import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

    return this.http.post<any>(`/auth/login`, body, { headers });
  }

<<<<<<< HEAD
  logout(): void {
    this.http.post<any>('/auth/logout', {}).subscribe(
      () => {
        localStorage.removeItem('token');
      },
      (error) => {
        console.error('Error en el logout:', error);

      }
    );
=======
  findAll(): Observable<User[]> {
    return this.http.get<User[]>(`/user`)
>>>>>>> 2f363a8cebb28f0ca9e777ded353ddb1a4fbf825
  }


  findAll(): Observable<User[]> {
    return this.http.get<User[]>(`/api/user`)
  }


  register(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`/api/user/register`, userData, { headers });
  }

<<<<<<< HEAD
  update(user: User): Observable<User[]> {
    return this.http.put<any>( '/api/user', user);
  }

  delete(): Observable<User[]> {
    return this.http.delete<any>(`/:id`)
=======
  //Actualizar datos personales ususario
  update(user: User): Observable<User> {
    return this.http.put<any>(`/api/user/update`);
  }

  delete(): Observable<User[]> {
    return this.http.delete<any>(`/api/user/delete/:id`)
>>>>>>> 2f363a8cebb28f0ca9e777ded353ddb1a4fbf825
  }

  // Ver perfil get
  // Asignar roles post
  // Subir foto de perfil post
  // Cerrar sesión post


}
