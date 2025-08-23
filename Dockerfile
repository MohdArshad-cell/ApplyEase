# Stage 1: Build with Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Copy source code and build
COPY src src
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-alpine

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/aplyease-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Start app
ENTRYPOINT ["java","-jar","app.jar"]
