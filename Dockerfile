FROM amazoncorretto-21
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "jar", "/app.jar"]

#PARA CREAR IMAGENES EN DOCKER
# cd backend
# docker build -t backend:1.0
# docker image list