import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //private apiUrl = 'https://tu-backend.com/api'; // URL base del backend

  constructor(private http: HttpClient) {}

  // Método para autenticar usuario
  login(usuario: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { usuario, password };

    return this.http.post<any>(`/auth/login`, body, { headers });
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
  }

  // Método para registrar un nuevo usuario
  register(userData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`/api/user/register`, userData, { headers });
  }

  update(user: User): Observable<User> {
    return this.http.put<any>(this.apiUrl, user);
  }

  delete(): Observable<User[]> {
    return this.http.delete<any>(`${this.apiUrl}/:name`)
  }
}
