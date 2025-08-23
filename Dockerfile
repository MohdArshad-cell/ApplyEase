# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-alpine

# Set working directory inside the container
WORKDIR /app

# Copy Maven wrapper and project files
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Copy source code
COPY src src

# Make Maven wrapper executable
RUN chmod +x mvnw

# Build the Spring Boot application
RUN ./mvnw clean package -DskipTests

# Copy the generated JAR to container
COPY target/aplyease-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the default port
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java","-jar","/app/app.jar"]
