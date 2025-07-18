# Etapa 1: Build de la app con Gradle
FROM eclipse-temurin:19-jdk AS build

# Crear carpeta de trabajo
WORKDIR /app

# Copiar archivos
COPY . .

# Dar permisos al gradlew (importante en Linux)
RUN chmod +x ./gradlew

# Ejecutar build sin tests
RUN ./gradlew clean build -x test

# Etapa 2: Imagen final y ligera
FROM eclipse-temurin:19-jre

WORKDIR /app

# Copiar el jar desde la etapa anterior
COPY --from=build /app/build/libs/contador-pdf-backend-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto de Spring Boot
EXPOSE 8080

# Comando para correr el JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
