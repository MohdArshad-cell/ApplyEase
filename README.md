# Aplyease Backend

![Banner](https://socialify.git.ci/Aplyease/backend/network?theme=Dark)

[![Java](https://img.shields.io/badge/Java-21-orange)](https://spring.io/projects/spring-boot) [![Maven](https://img.shields.io/badge/Maven-3.9.6-blue)](https://maven.apache.org/download.cgi) [![MySQL](https://img.shields.io/badge/MySQL-8.0-green)](https://www.mysql.com/downloads/)

## Executive Summary

This project provides a robust backend API solution built with Java and Spring Boot, designed to manage job applications and user interactions efficiently. It leverages a microservices architecture (inferred from controller segregation) and a MySQL database for persistent storage.

The backend is engineered to streamline the entire job application lifecycle, from initial submission to final placement. It empowers administrators with comprehensive dashboards and analytics, agents with tools to manage their performance and client interactions, and clients with a clear overview of their applications.

## Architecture & Tech Stack

| Technology     | Version | Key Responsibility                                      |
| :------------- | :------ | :------------------------------------------------------- |
| Java           | 21      | Primary programming language for backend logic.          |
| Spring Boot    | N/A     | Framework for building the web application and APIs.     |
| Maven          | 3.9.6   | Dependency management and build automation.              |
| MySQL Driver   | N/A     | JDBC driver for connecting to the MySQL database.        |
| MySQL          | 8.0     | Relational database for storing application data.        |

## System Signatures

The analysis of the codebase reveals several key components and their roles:

*   **Spring Boot Application Class (`AplyeaseBackendApplication`)**: The entry point for the Spring Boot application, responsible for bootstrapping and configuring the application context.
*   **Security Configuration (`SecurityConfig`)**: Implements robust security measures, including authentication and authorization, using Spring Security. It defines `authenticationManager`, `passwordEncoder`, and `securityFilterChain` beans for managing security aspects.
*   **Controllers (`AdminController`, `AuthController`, `JobApplicationController`, `UserController`)**: These classes expose RESTful endpoints to handle incoming API requests, orchestrating business logic and data flow. They interact with services to perform operations related to users, authentication, and job applications.
*   **Data Transfer Objects (DTOs)**: A comprehensive set of DTOs (`AdminApplicationDto`, `UserDto`, `JobApplicationDto`, etc.) are utilized to define the structure of data exchanged between the client and server, ensuring clear and consistent data contracts.
*   **Models (`JobApplication`, `Role`, `User`)**: These represent the core entities of the application, mapping directly to the database schema and encapsulating business data.
*   **Repositories (`JobApplicationRepository`, `UserRepository`, `RoleRepository`)**: These interfaces leverage Spring Data JPA to provide data access and persistence operations for the respective model entities, abstracting away direct SQL queries.
*   **Services (`AdminService`, `AuthService`, `JobApplicationService`, `UserService`)**: These classes encapsulate the business logic and orchestrate complex operations. They act as intermediaries between controllers and repositories.
*   **Security Components (`CustomUserDetailsService`, `JwtAuthenticationFilter`, `JwtTokenProvider`)**: These components are crucial for implementing JSON Web Token (JWT) based authentication and authorization, ensuring secure API access.

## Directory Blueprint

```
.
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── aplyease
│   │   │           └── backend
│   │   │               ├── AplyeaseBackendApplication.java  # Main application entry point
│   │   │               ├── config                     # Spring Boot configuration classes (e.g., SecurityConfig)
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── controller                 # RESTful API endpoints
│   │   │               │   ├── AdminController.java
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── JobApplicationController.java
│   │   │               │   ├── MeController.java
│   │   │               │   └── UserController.java
│   │   │               ├── dto                          # Data Transfer Objects for API requests/responses
│   │   │               │   ├── AdminApplicationDto.java
│   │   │               │   ├── AdminDashboardStatsDto.java
│   │   │               │   ├── AgentAnalyticsDto.java
│   │   │               │   ├── AgentDashboardStatsDto.java
│   │   │               │   ├── AgentDetailAnalyticsDto.java
│   │   │               │   ├── AgentPerformanceDto.java
│   │   │               │   ├── ApplicationDto.java
│   │   │               │   ├── ApplicationSummaryDto.java
│   │   │               │   ├── ApplicationUpdateRequestDto.java
│   │   │               │   ├── ChangePasswordDto.java
│   │   │               │   ├── ClientAnalyticsDto.java
│   │   │               │   ├── EmployeeDashboardDto.java
│   │   │               │   ├── ErrorDetailsDto.java
│   │   │               │   ├── JobApplicationDto.java
│   │   │               │   ├── JobApplicationResponseDto.java
│   │   │               │   ├── JwtAuthResponse.java
│   │   │               │   ├── JWTAuthResponseDto.java
│   │   │               │   ├── LoginDto.java
│   │   │               │   ├── LoginResponseDto.java
│   │   │               │   ├── SignUpDto.java
│   │   │               │   ├── StatusUpdateDto.java
│   │   │               │   ├── UserCreateRequestDto.java
│   │   │               │   ├── UserDto.java
│   │   │               │   ├── UserProfileUpdateDto.java
│   │   │               │   └── UserUpdateRequestDto.java
│   │   │               ├── exception                    # Exception handling
│   │   │               │   ├── GlobalExceptionHandler.java
│   │   │               │   └── ResourceNotFoundException.java
│   │   │               ├── model                        # JPA entities representing database tables
│   │   │               │   ├── JobApplication.java
│   │   │               │   ├── Role.java
│   │   │               │   └── User.java
│   │   │               ├── repository                   # Spring Data JPA repositories for data access
│   │   │               │   ├── JobApplicationRepository.java
│   │   │               │   ├── RoleRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── security                     # Security-related components (JWT, UserDetails)
│   │   │               │   ├── CustomUserDetailsService.java
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   └── JwtTokenProvider.java
│   │   │               └── service                      # Business logic services
│   │   │                   ├── AdminService.java
│   │   │                   ├── AuthService.java
│   │   │                   ├── JobApplicationService.java
│   │   │                   ├── UserService.java
│   │   │                   └── impl                         # Service implementation classes
│   │   │                       ├── AdminServiceImpl.java
│   │   │                       ├── AuthServiceImpl.java
│   │   │                       ├── JobApplicationServiceImpl.java
│   │   │                       └── UserServiceImpl.java
│   │   └── resources
│   │       └── static
│   │           └── js         # Static JavaScript files for frontend interactions
│   │               ├── add-application.js
│   │               ├── admin-dashboard-logic.js
│   │               ├── agent-dashboard-logic.js
│   │               ├── client-dashboard-logic.js
│   │               ├── dashboard.js
│   │               ├── home.js
│   │               ├── job-tracker.js
│   │               ├── login.js
│   │               ├── main.js
│   │               ├── particles-config.js
│   │               └── register.js
│   └── test
│       └── java
│           └── com
│               └── aplyease
│                   └── backend
│                       └── AplyeaseBackendApplicationTests.java # Unit and integration tests
└── pom.xml                                            # Maven project configuration file
```

## Deployment & Operation

This project is built using Maven.

### Prerequisites

*   Java Development Kit (JDK) 21 or higher
*   Maven 3.9.6 or higher
*   MySQL Server (configured and running)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd backend
    ```

2.  **Configure MySQL:**
    *   Ensure your MySQL server is running.
    *   Create a database (e.g., `aplyease_db`).
    *   Update the `application.properties` or `application.yml` file in `src/main/resources` with your MySQL connection details (username, password, database name).

### Local Development

1.  **Build the project:**
    ```bash
    mvn clean install
    ```

2.  **Run the application:**
    ```bash
    mvn spring-boot:run
    ```
    The application will typically start on `http://localhost:8080`.

### Production Build

1.  **Build the executable JAR:**
    ```bash
    mvn clean package
    ```
    This will create a JAR file in the `target/` directory.

2.  **Run the executable JAR:**
    ```bash
    java -jar target/aplyease-backend-<version>.jar
    ```
    Ensure your production MySQL database is configured and accessible.

## Acknowledgements & Contact

*   **License**: This project is licensed under the MIT License.

*   **Contact**:
    *   📧 Email: [info@aplyease.com](mailto:info@aplyease.com)
    *   📍 Location: [Your Company Address Here]