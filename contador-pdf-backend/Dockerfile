# Etapa 1: Build de la app con Gradle
FROM eclipse-temurin:19-jdk AS build

WORKDIR /app

# Copiar todo el backend (asegúrate de que el Dockerfile esté dentro de contador-pdf-backend/)
COPY . .

# Asegurar permisos de ejecución para gradlew
RUN chmod +x ./gradlew

# Compilar el proyecto (sin ejecutar tests)
RUN ./gradlew clean build -x test

# Etapa 2: Imagen final
FROM eclipse-temurin:19-jre

WORKDIR /app

# Copiar el .jar generado desde la etapa de build
COPY --from=build /app/build/libs/*.jar app.jar

# Exponer el puerto de Spring Boot
EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
