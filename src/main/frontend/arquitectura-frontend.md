# Arquitectura del Proyecto

## Estructura de Carpetas

### `.angular/`
Carpeta generada por Angular CLI, utilizada para almacenar datos de configuración y caché.

---

### `public/`
Carpeta para archivos estáticos accesibles públicamente.

---

### `src/`
Código fuente de la aplicación.

#### `app/`
Contiene módulos, componentes, servicios, interfaces y configuración principal de la aplicación.

- **`auth/`** *(Módulo para gestionar la autenticación de usuarios)*  
  - `forgot-password/`  
    - `forgot-password.component.css`  
    - `forgot-password.component.html`  
    - `forgot-password.component.ts`  
    *(Componente para la recuperación de contraseña. Muestra un campo para ingresar el correo electrónico y envía un enlace al email del usuario para restablecer la contraseña.)*

  - `login/`  
    - `login.component.css`  
    - `login.component.html`  
    - `login.component.ts`  
    *(Componente para el inicio de sesión.)*

  - `register/`  
    - `register.component.css`  
    - `register.component.html`  
    - `register.component.ts`  
    *(Componente para registrar nuevos usuarios. También se reutiliza para que los usuarios actualicen sus datos personales.)*

  - `reset-password/`  
    - `reset-password.component.css`  
    - `reset-password.component.html`  
    - `reset-password.component.ts`  
    *(Componente que permite al usuario restablecer su contraseña tras acceder al enlace enviado por email.)*

- **`components/`** *(Componentes reutilizables de la aplicación)*  
  - `card/`  
    - `card.component.css`  
    - `card.component.html`  
    - `card.component.ts`  
    *(Componente de tarjeta para mostrar anuncios reutilizable en diferentes páginas.)*

  - `cookie-banner/`  
    - `cookie-banner.component.css`  
    - `cookie-banner.component.html`  
    - `cookie-banner.component.ts`  
    *(Componente para informar al ingresar al sitio web del uso de cookies.)*

  - `footer/`  
    - `footer.component.css`  
    - `footer.component.html`  
    - `footer.component.ts`  
    *(Footer del sitio web.)*

  - `header/`  
    - `header.component.css`  
    - `header.component.html`  
    - `header.component.ts`  
    *(Header del sitio web. Contiene botones de inicio y cierre de sesión, barra de búsqueda y menú de navegación.)*

  - `info-function/`  
    - `info-function.component.css`  
    - `info-function.component.html`  
    - `info-function.component.ts`  
    *(Página informativa sobre cómo funciona la aplicación y el proceso para comprar/vender.)*

  - `layout/`  
    - `layout.component.css`  
    - `layout.component.html`  
    - `layout.component.ts`  
    *(Componente de diseño principal que incluye el header, footer y el `<router-outlet>`.)*

  - `material/`  
    - `material.module.ts`  
    *(Módulo centralizado para las dependencias de Angular Material utilizadas en la aplicación.)*

  - `pay/`  
    - `pay.component.css`  
    - `pay.component.html`  
    - `pay.component.ts`  
    *(Página para la integración de la pasarela de pago con múltiples métodos de pago disponibles.)*

- **`interfaces/`** *(Interfaces TypeScript para una tipificación más robusta)*  
  - `anuncio.interface.ts` *(Interfaz para los anuncios.)*  
  - `contactForm.interface.ts` *(Interfaz para formularios de contacto.)*  
  - `user.interface.ts` *(Interfaz para datos de usuario.)*

- **`pages/`** *(Páginas principales de la aplicación)*  
  - `about/`  
    - `about.component.css`  
    - `about.component.html`  
    - `about.component.ts`  
    *(Página "Sobre Nosotros". Explica quiénes son los responsables del sitio web.)*

  - `ad-filter/`  
    - `ad-filter.component.css`  
    - `ad-filter.component.html`  
    - `ad-filter.component.ts`  
    *(Página para filtrar y mostrar anuncios por categorías, productos o servicios.)*

  - `ad-specific/`  
    - `ad-specific.component.css`  
    - `ad-specific.component.html`  
    - `ad-specific.component.ts`  
    *(Página que muestra los detalles completos de un anuncio seleccionado.)*

  - `contact/`  
    - `contact.component.css`  
    - `contact.component.html`  
    - `contact.component.ts`  
    *(Formulario de contacto. Envía un mensaje a una dirección de correo predefinida del sitio web.)*

  - `home/`  
    - `home.component.css`  
    - `home.component.html`  
    - `home.component.ts`  
    *(Página principal que muestra todos los anuncios disponibles.)*

  - `search-results/`  
    - `search-results.component.css`  
    - `search-results.component.html`  
    - `search-results.component.ts`  
    *(Página que muestra los resultados de búsqueda basados en la barra de búsqueda.)*

- **`services/`** *(Servicios centralizados para la lógica del negocio y comunicación con el backend)*  
  - `ad.service.ts` *(Manejo de peticiones al backend relacionadas con anuncios.)*  
  - `auth.service.ts` *(Manejo de peticiones al backend relacionadas con autenticación de usuarios.)*  
  - `auth-interceptor.service.ts` *(Intercepta y modifica peticiones HTTP, por ejemplo, para añadir tokens de autenticación a las solicitudes salientes.)*  
  - `notification.service.ts` *(Servicio para centralizar las notificaciones y alertas en toda la aplicación.)*

- **`users/`** *(Módulo para funcionalidades relacionadas con los usuarios)*  
  - `admin-dashboard/`  
    - `admin-dashboard.component.css`  
    - `admin-dashboard.component.html`  
    - `admin-dashboard.component.ts`  
    *(Página de administración para gestionar usuarios y anuncios. Permite bloquear y eliminar usuarios o anuncios.)*

  - `user-ad/`  
    - `user-ad.component.css`  
    - `user-ad.component.html`  
    - `user-ad.component.ts`  
    *(Formulario para que los usuarios creen o editen anuncios.)*

  - `user-card/`  
    - `user-card.component.css`  
    - `user-card.component.html`  
    - `user-card.component.ts`  
    *(Tarjeta específica para mostrar los anuncios de un usuario en su perfil, con opciones para modificar o eliminar anuncios.)*

  - `user-profile/`  
    - `user-profile.component.css`  
    - `user-profile.component.html`  
    - `user-profile.component.ts`  
    *(Perfil de usuario. Permite visualizar y gestionar la información personal del usuario y sus anuncios.)*

- `app.component.css`  
- `app.component.html`  
- `app.component.ts`  
- `app.config.ts` *(Configuraciones globales de la aplicación.)*  
- `app.routes.ts` *(Rutas principales de la aplicación.)*

---

#### `assets/`
*(Carpeta para almacenar imágenes y recursos estáticos.)*

---

#### `environments/`
*(Archivos de configuración para diferentes entornos: desarrollo, producción, etc.)*

---

### Archivos raíz
- `index.html`  
- `main.ts`  
- `style.css`  
