import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User, UserSession } from '../interfaces/user.interface';
import { BehaviorSubject, of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send a POST request and update the user state on successful login', () => {
      const mockResponse = {
        token: 'mockToken',
        username: 'mockUser',
        roles: ['user'],
      };

      service.login('mockUser', 'mockPassword').subscribe((userSession) => {
        expect(userSession).toEqual({
          token: 'mockToken',
          username: 'mockUser',
          roles: ['user'],
        });

        const storedToken = localStorage.getItem('token');
        expect(storedToken).toBe('mockToken');
      });

      const req = httpMock.expectOne('/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'mockUser', password: 'mockPassword' });

      req.flush(mockResponse); // Simula la respuesta del servidor
    });

    it('should handle errors', () => {
      service.login('mockUser', 'mockPassword').subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error).toBeTruthy();
        },
      });

      const req = httpMock.expectOne('/auth/login');
      req.flush('Error occurred', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('refreshToken', () => {
    it('should send a POST request to refresh the token', () => {
      localStorage.setItem('refreshToken', 'mockRefreshToken');
      const mockResponse = { token: 'newMockToken' };

      service.refreshToken().subscribe((newToken) => {
        expect(newToken).toBe('newMockToken');
        expect(localStorage.getItem('token')).toBe('newMockToken');
      });

      const req = httpMock.expectOne('/auth/refresh-token');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'mockRefreshToken' });

      req.flush(mockResponse);
    });

    it('should throw an error if no refresh token is found', () => {
      localStorage.removeItem('refreshToken');

      service.refreshToken().subscribe({
        next: () => fail('Expected an error'),
        error: (error) => {
          expect(error.message).toContain('No se encontró el refresh token');
        },
      });

      httpMock.expectNone('/auth/refresh-token'); // No debería haber una solicitud
    });
  });

  // describe('logout', () => {
  //   it('should clear localStorage and reset user state', () => {
  //     // Espiar la propiedad href de window.location
  //     const locationSpy = spyOn(window.location, 'href', 'set');

  //     localStorage.setItem('token', 'mockToken');
  //     service.logout();

  //     expect(localStorage.getItem('token')).toBeNull();
  //     expect(service.isAuthenticated()).toBeFalse();
  //     expect(locationSpy).toHaveBeenCalledWith('/home');
  //   });
  // });

  describe('isTokenExpired', () => {
    it('should return true if the token is expired', () => {
      const expiredToken = btoa(
        JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 1000 })
      );
      localStorage.setItem('token', `header.${expiredToken}.signature`);

      expect(service.isTokenExpired()).toBeTrue();
    });

    it('should return false if the token is valid', () => {
      const validToken = btoa(
        JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 1000 })
      );
      localStorage.setItem('token', `header.${validToken}.signature`);

      expect(service.isTokenExpired()).toBeFalse();
    });
  });

  describe('getAccessToken', () => {
    it('should return the token from localStorage', () => {
      localStorage.setItem('token', 'mockToken');
      expect(service.getAccessToken()).toBe('mockToken');
    });
  });

  describe('isAuthenticated', () => {
    it('should return false if the user is not authenticated', () => {
      // Espiar el BehaviorSubject y simular un usuario no autenticado (null)
      spyOn(service['userSubject'], 'getValue').and.returnValue(null); // Simulamos que no hay usuario autenticado

      const result = service.isAuthenticated();
      expect(result).toBeFalse(); // Comprobamos que no esté autenticado
    });

    it('should return true if the user is authenticated', () => {
      // Espiar el BehaviorSubject y simular un usuario autenticado
      const mockUserSession: UserSession = { token: 'mockToken', username: 'mockUser', roles: ['user'] };
      spyOn(service['userSubject'], 'getValue').and.returnValue(mockUserSession); // Simulamos un usuario autenticado

      const result = service.isAuthenticated();
      expect(result).toBeTrue(); // Comprobamos que esté autenticado
    });
  });
});
