import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};

// ¿Para qué sirve?
// Este interceptor automatiza la inclusión del token de acceso en las solicitudes HTTP. Es especialmente útil en aplicaciones que:

// Autentican usuarios y usan tokens para validar el acceso a recursos protegidos en el backend.
// Necesitan que todas (o algunas) solicitudes HTTP incluyan un encabezado Authorization con el token correspondiente.
// Ventajas:
// Centralización: No necesitas agregar manualmente el encabezado en cada lugar donde realizas una solicitud HTTP; el interceptor lo hace automáticamente.

// Seguridad: Asegura que las solicitudes solo incluyan el token cuando sea necesario.

// Modularidad: Separas la lógica de autenticación de los componentes y servicios individuales.
