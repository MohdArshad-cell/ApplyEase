# Aplyease Backend

![Banner](https://socialify.git.ci/aplyease/aplyease-backend/network?theme=Dark)

![Java](https://img.shields.io/badge/Java-21-blue) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-green) ![Maven](https://img.shields.io/badge/Maven-3.9.6-orange) ![MySQL](https://img.shields.io/badge/MySQL%20Driver-8.0.33-critical)

## Executive Summary

This backend service is engineered using Java and Maven, leveraging the robust Spring Boot framework to deliver a high-performance API. It facilitates seamless management of job applications, user profiles, and administrative dashboards, connecting clients, agents, and administrators within a unified ecosystem.

The system is designed to streamline recruitment processes, providing real-time analytics and operational oversight. Key achievements include supporting **dynamic user roles**, enabling **detailed analytics for administrators and agents**, and ensuring a **secure and scalable API infrastructure**.

## Architecture & Tech Stack

| Technology    | Version   | Key Responsibility                                         |
| :------------ | :-------- | :-------------------------------------------------------- |
| Java          | 21        | Core programming language for backend logic.              |
| Maven         | 3.9.6     | Build automation and dependency management.               |
| Spring Boot   | 3.2.0     | Microservices framework, rapid application development.   |
| MySQL Driver  | 8.0.33    | JDBC driver for connecting to MySQL databases.            |

## System Signatures

The backend's architecture is characterized by several key components that contribute to its functionality and robustness:

*   **Spring Boot:** As the primary framework, Spring Boot orchestrates the entire application lifecycle, managing dependency injection, configuration, and enabling rapid development of RESTful APIs.
*   **Spring Security:** Implements robust security measures, including JWT-based authentication and authorization, ensuring secure access to API endpoints.
*   **`@RestController` and `@Service`:** These annotations delineate architectural responsibilities, with `@RestController` handling incoming API requests and `@Service` encapsulating business logic.
*   **JPA/Hibernate (Implied by Repository Structure):** While not explicitly listed as a dependency, the repository interfaces (e.g., `UserRepository`, `JobApplicationRepository`) strongly suggest the use of Java Persistence API (JPA) with an ORM like Hibernate for data persistence with the MySQL database.
*   **DTOs (Data Transfer Objects):** Extensive use of DTOs (e.g., `UserDto`, `ApplicationDto`) facilitates efficient data exchange between the API and its clients, enforcing a clear contract for data structures.

## Directory Blueprint

```
.
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── aplyease
│   │   │           └── backend
│   │   │               ├── AplyeaseBackendApplication.java  # Application entry point
│   │   │               ├── config                               # Application configurations (e.g., Security)
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── controller                           # API endpoint controllers
│   │   │               │   ├── AdminController.java
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── JobApplicationController.java
│   │   │               │   ├── MeController.java
│   │   │               │   └── UserController.java
│   │   │               ├── dto                                  # Data Transfer Objects for API payloads
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
│   │   │               ├── exception                            # Custom exception handling
│   │   │               │   ├── GlobalExceptionHandler.java
│   │   │               │   └── ResourceNotFoundException.java
│   │   │               ├── model                                # JPA Entity models
│   │   │               │   ├── JobApplication.java
│   │   │               │   ├── Role.java
│   │   │               │   └── User.java
│   │   │               ├── repository                           # Spring Data JPA repositories
│   │   │               │   ├── JobApplicationRepository.java
│   │   │               │   ├── RoleRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── security                             # Security-related components
│   │   │               │   ├── CustomUserDetailsService.java
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   └── JwtTokenProvider.java
│   │   │               └── service                              # Business logic services
│   │   │                   ├── AdminService.java
│   │   │                   ├── AuthService.java
│   │   │                   ├── JobApplicationService.java
│   │   │                   ├── UserService.java
│   │   │                   └── impl                                 # Service implementation classes
│   │   │                       ├── AdminServiceImpl.java
│   │   │                       ├── AuthServiceImpl.java
│   │   │                       ├── JobApplicationServiceImpl.java
│   │   │                       └── UserServiceImpl.java
│   ├── test
│   │   └── java
│   │       └── com
│   │           └── aplyease
│   │               └── backend
│   │                   └── AplyeaseBackendApplicationTests.java # Unit and integration tests
│   └── resources
│       ├── application.properties  # Spring Boot application configuration
│       └── static
│           └── js               # Static JavaScript files for frontend interactions
│               ├── add-application.js
│               ├── admin-dashboard-logic.js
│               ├── agent-dashboard-logic.js
│               ├── client-dashboard-logic.js
│               ├── dashboard.js
│               ├── home.js
│               ├── job-tracker.js
│               ├── login.js
│               ├── main.js
│               ├── particles-config.js
│               └── register.js
└── pom.xml                                                    # Maven project configuration and dependencies
```

## Deployment & Operation

This project is built and managed using Maven.

### Prerequisites

*   Java Development Kit (JDK) 21 or later.
*   Maven 3.9.6 or later.
*   A running MySQL database instance.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd aplyease-backend
    ```

2.  **Configure database connection:**
    Update the `src/main/resources/application.properties` file with your MySQL database credentials and connection details.

### Local Development

1.  **Build the project:**
    ```bash
    mvn clean install
    ```

2.  **Run the application:**
    ```bash
    mvn spring-boot:run
    ```
    The application will typically start on `http://localhost:8080` (or a port configured in `application.properties`).

### Production Build

1.  **Package the application:**
    ```bash
    mvn clean package
    ```
    This will create an executable JAR file in the `target/` directory.

2.  **Run the JAR:**
    ```bash
    java -jar target/aplyease-backend-0.0.1-SNAPSHOT.jar
    ```
    Ensure that the `application.properties` (or environment variables) are configured for your production database and other settings.

## Acknowledgements & Contact

*   **License:** MIT License

*   **Contact:**
    *   📧 Email: <your_email@example.com>
    *   📱 WhatsApp: <your_whatsapp_number>
    *   📍 Location: <your_location>