## Dev

1. Clonar el proyecto
2. Ejecutar `npm install`
3. Levantar backend `npm run backend`
4. Ejecutar la app `npm start` o bien `ng serve -o`

# Proyecto Angular con Material

Este proyecto Angular está diseñado para gestionar anuncios, usuarios y la autenticación utilizando Angular Material. A continuación, se detalla la estructura del proyecto, así como la funcionalidad de cada componente y servicio.

## Estructura del Proyecto

El proyecto está organizado en diferentes carpetas que contienen componentes y servicios relacionados.

# Características

- **Registro de Usuarios**: Permite a los usuarios crear una cuenta ingresando sus datos personales y de contacto.
- **Inicio de Sesión**: Los usuarios pueden iniciar sesión en la aplicación utilizando su nombre de usuario y contraseña.
- **Gestión de Anuncios**: Los usuarios pueden visualizar anuncios de productos y servicios, con detalles como descripción, tipo de anuncio y precio.
- **Pago**: Los usuarios pueden realizar pagos a través de la aplicación, proporcionando la información necesaria para completar la transacción.

### Componentes

1. **AboutComponent** (`about.component.ts`)

   - **Descripción**: Muestra información sobre la aplicación.
   - **Métodos**:
     - No tiene métodos específicos, ya que es un componente simple que solo muestra contenido estático.

2. **AnoncesComponent** (`anonces.component.ts`)

   - **Descripción**: Muestra un anuncio específico basado en el ID proporcionado en la URL.
   - **Métodos**:
     - `ngOnInit()`: Se ejecuta al iniciar el componente. Obtiene el ID del anuncio desde la ruta activa y llama al servicio para cargar el anuncio.
     - `regresar()`: Navega de vuelta a la página de inicio.
     - `comprar()`: Navega de vuelta a la página de inicio, posiblemente después de realizar una compra.

3. **AnoncesListComponent** (`anonces-list.component.ts`)

   - **Descripción**: Muestra una lista de anuncios basados en una categoría seleccionada.
   - **Métodos**:
     - `ngOnInit()`: Obtiene la categoría de los parámetros de la ruta y llama a `getAnuncios()` para cargar los anuncios de esa categoría.
     - `getAnuncios()`: Lógica para obtener anuncios filtrados por categoría.
     - `getAnuncioById(id: string)`: Lógica para obtener un anuncio específico por su ID.
     - `setPaginatedAnuncios()`: Configura los anuncios para ser paginados.
     - `onPageChange(event: PageEvent)`: Maneja la lógica para los cambios de página en la paginación.

4. **ContactComponent** (`contact.component.ts`)

   - **Descripción**: Formulario de contacto para enviar consultas o mensajes.
   - **Métodos**:
     - No tiene métodos definidos en el archivo actual, pero probablemente se incluirán métodos para manejar el envío del formulario en versiones futuras.

5. **HomeComponent** (`home.component.ts`)

   - **Descripción**: Página principal que muestra los anuncios destacados.
   - **Métodos**:
     - `ngOnInit()`: Inicializa el componente y carga los anuncios.
     - `setPaginatedProducts()`: Configura los productos para ser paginados.
     - `onPageChange(event: PageEvent)`: Maneja los cambios de página.

6. **ProductComponent** (`product.component.ts`)
   - **Descripción**: Similar a `AnoncesComponent`, muestra un anuncio específico, pero se puede utilizar para la funcionalidad de compra.
   - **Métodos**:
     - `ngOnInit()`: Obtiene el ID del anuncio de la ruta activa y carga el anuncio correspondiente.
     - `regresar()`: Navega de vuelta a la página de inicio.
     - `comprar()`: Navega a la página de pago.

### Servicios

1. **AuthService** (`auth.service.ts`)

   - **Descripción**: Maneja la autenticación de usuarios.
   - **Métodos**:
     - `login(usuario: string, password: string)`: Envía una solicitud al backend para autenticar al usuario con las credenciales proporcionadas.
     - `logout()`: Elimina la sesión del usuario.
     - `findAll()`: Obtiene una lista de todos los usuarios.

2. **DataService** (`data.service.ts`)
   - **Descripción**: Proporciona métodos para interactuar con los datos de anuncios.
   - **Métodos**:
     - `getAnuncioById(id: string)`: Obtiene un anuncio específico por su ID.
     - `getAnunciosByCategory(categoria: string)`: Obtiene todos los anuncios que pertenecen a una categoría específica.
     - `getAllAnuncios()`: Obtiene todos los anuncios disponibles.

## Instalación

Para instalar las dependencias del proyecto, utiliza el siguiente comando:

```bash
npm install
```
