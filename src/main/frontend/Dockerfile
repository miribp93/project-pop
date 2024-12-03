# Etapa de construcción (build-step)
FROM node:18 AS build-step

WORKDIR /usr/local/app

# Copiar los archivos del proyecto al contenedor
COPY ./ /usr/local/app

# Instalar las dependencias
RUN npm install

# Construir la aplicación Angular
RUN npm run build --prod

# Etapa para servir con Nginx
FROM nginx:1.23.1

# Limpiar el contenido de la carpeta html de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos generados por Angular al contenedor Nginx
COPY --from=build-step /usr/local/app/dist/frontend /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando por defecto para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]
