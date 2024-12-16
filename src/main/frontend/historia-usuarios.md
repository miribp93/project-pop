# Historias de Usuario para el Proyecto


## 1. Módulo de Autenticación (auth)

### Historia de Usuario 1: Registro de Usuario
**Como** usuario nuevo,  
**quiero** registrarme en la aplicación,  
**para** que pueda acceder y utilizar todas las funcionalidades.

**Criterios de Aceptación:**
- El formulario debe solicitar datos como nombre, correo electrónico y contraseña.
- Debe verificar si el correo electrónico ya está registrado.
- Mostrar un mensaje de confirmación tras el registro exitoso.
- Redirigir al usuario a la página de login.

### Historia de Usuario 2: Inicio de Sesión
**Como** usuario registrado,  
**quiero** iniciar sesión en la aplicación,  
**para** que pueda acceder a mi cuenta y gestionar mis anuncios.

**Criterios de Aceptación:**
- El formulario de inicio de sesión debe pedir correo electrónico y contraseña.
- El usuario debe poder iniciar sesión si las credenciales son correctas.
- Si las credenciales son incorrectas, se debe mostrar un mensaje de error.

### Historia de Usuario 3: Recuperación de Contraseña
**Como** usuario,  
**quiero** recuperar mi contraseña olvidada,  
**para** que pueda acceder a mi cuenta si olvidé mi contraseña.

**Criterios de Aceptación:**
- El formulario debe pedir el correo electrónico del usuario.
- Enviar un enlace al correo con instrucciones para restablecer la contraseña.
- Redirigir al usuario a la página de restablecimiento de contraseña tras la solicitud.

### Historia de Usuario 4: Restablecer Contraseña
**Como** usuario,  
**quiero** poder restablecer mi contraseña,  
**para** que pueda acceder nuevamente a mi cuenta si olvidé mi contraseña.

**Criterios de Aceptación:**
- El enlace de restablecimiento de contraseña debe redirigir al usuario a un formulario para ingresar una nueva contraseña.
- El formulario debe validar que la nueva contraseña cumpla con los requisitos de seguridad.
- El sistema debe permitir al usuario iniciar sesión con la nueva contraseña tras un restablecimiento exitoso.

---

## 2. Módulo de Componentes Reutilizables (components)

### Historia de Usuario 5: Mostrar Anuncios en Tarjetas
**Como** usuario,  
**quiero** ver los anuncios en tarjetas,  
**para** que pueda explorar rápidamente los anuncios disponibles.

**Criterios de Aceptación:**
- Los anuncios deben mostrarse en tarjetas con un título, descripción corta y un botón para ver más detalles.
- Cada tarjeta debe tener un diseño consistente y ser visualmente atractiva.
- Las tarjetas deben ser responsivas para adaptarse a diferentes tamaños de pantalla.

### Historia de Usuario 6: Mostrar Información sobre Cookies
**Como** usuario que ingresa al sitio,  
**quiero** ser informado sobre el uso de cookies,  
**para** que pueda dar mi consentimiento explícito para el uso de cookies.

**Criterios de Aceptación:**
- Al ingresar al sitio, debe mostrarse un banner de cookies en la parte inferior de la pantalla.
- El usuario debe poder aceptar o rechazar el uso de cookies.
- El banner debe desaparecer una vez que el usuario haya tomado una acción.

---

## 3. Módulo de Páginas (pages)

### Historia de Usuario 7: Ver la Página de Inicio
**Como** usuario,  
**quiero** ver la página de inicio,  
**para** que pueda acceder fácilmente a los anuncios más recientes y populares.

**Criterios de Aceptación:**
- La página de inicio debe mostrar un listado de anuncios disponibles.
- Los anuncios deben estar organizados de forma clara y permitir la búsqueda por categorías.
- El usuario debe poder hacer clic en un anuncio para ver más detalles.

### Historia de Usuario 8: Buscar Anuncios
**Como** usuario,  
**quiero** buscar anuncios por palabra clave,  
**para** que pueda encontrar lo que estoy buscando de manera eficiente.

**Criterios de Aceptación:**
- La barra de búsqueda debe estar accesible en la página de inicio y en el header.
- Los resultados de la búsqueda deben mostrar anuncios que coincidan con la palabra clave ingresada.
- La búsqueda debe ser sensible a las mayúsculas y minúsculas, y mostrar resultados relevantes.

### Historia de Usuario 9: Ver Detalles de un Anuncio
**Como** usuario,  
**quiero** ver los detalles completos de un anuncio,  
**para** que pueda obtener más información antes de tomar una decisión.

**Criterios de Aceptación:**
- Al hacer clic en un anuncio desde la página de inicio o de resultados, debe redirigirme a la página de detalles del anuncio.
- La página de detalles debe mostrar toda la información relevante, como fotos, descripción, precio, etc.
- Debe haber un botón para contactar con el vendedor o responder al anuncio.

---

## 4. Módulo de Servicios (services)

### Historia de Usuario 10: Autenticación del Usuario
**Como** sistema,  
**quiero** autenticar las solicitudes de los usuarios,  
**para** que pueda asegurarme de que solo los usuarios registrados accedan a sus datos.

**Criterios de Aceptación:**
- El sistema debe verificar el token de autenticación en cada solicitud relevante.
- Si el token es válido, permitir el acceso a los datos. Si no lo es, denegar el acceso y redirigir al usuario a la página de login.

### Historia de Usuario 11: Crear un Anuncio
**Como** usuario,  
**quiero** crear un anuncio,  
**para** que otros usuarios puedan ver mi producto o servicio.

**Criterios de Aceptación:**
- El formulario para crear un anuncio debe permitir ingresar título, descripción, imágenes y precio.
- Debe validar que los campos necesarios estén completos antes de enviarlos.
- El anuncio debe aparecer en la página de inicio y ser visible para otros usuarios.

---

## 5. Módulo de Usuarios (users)

### Historia de Usuario 12: Administrar Anuncios como Administrador
**Como** administrador,  
**quiero** gestionar los anuncios de los usuarios,  
**para** que pueda aprobar, bloquear o eliminar anuncios inapropiados.

**Criterios de Aceptación:**
- La página de administración debe mostrar una lista de anuncios.
- Debe haber opciones para aprobar, bloquear o eliminar anuncios.
- Cada cambio debe reflejarse inmediatamente en el sistema.

### Historia de Usuario 13: Ver Perfil de Usuario
**Como** usuario,  
**quiero** ver mi perfil,  
**para** que pueda gestionar mis datos personales y anuncios.

**Criterios de Aceptación:**
- La página del perfil debe mostrar los datos personales del usuario y una lista de sus anuncios.
- Debe permitir al usuario actualizar su información personal.
- El usuario debe poder editar y eliminar anuncios desde su perfil.

---

## Resumen

Estas historias de usuario están organizadas en torno a las funcionalidades y componentes principales del proyecto. Cada historia define claramente el **quién**, el **qué** y el **por qué**, lo que facilita la planificación y ejecución en Scrum. Al implementar estas historias, se pueden dividir en tareas más pequeñas y asignarlas a diferentes sprints o ciclos de desarrollo.
