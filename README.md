# Aplyease Backend

![Banner](https://socialify.git.ci/Aplyease/aplyease-backend/network?theme=Dark)

![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white) ![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB330?style=for-the-badge&logo=springboot&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-00758F?style=for-the-badge&logo=mysql&logoColor=white)

## Executive Summary

This project provides a robust backend API for the Aplyease platform, built with Java and Spring Boot. It is meticulously designed to handle user authentication, job application management, and administrative functionalities, facilitating seamless operations for clients, agents, and administrators.

The Aplyease backend is engineered to streamline the recruitment process, enabling efficient management of job applications and user profiles. By leveraging a microservices-oriented architecture principles (though not explicitly stated, inferred from modularity), it aims for scalability and maintainability.

## Architecture & Tech Stack

| Technology   | Version | Key Responsibility                                       |
| :----------- | :------ | :-------------------------------------------------------- |
| Java         | N/A     | Primary programming language for backend logic.           |
| Maven        | N/A     | Build automation and dependency management.               |
| Spring Boot  | N/A     | Framework for rapid application development and API creation. |
| MySQL Driver | N/A     | Enables interaction with the MySQL database.              |

## System Signatures

The project's core components are defined by the following Java classes and their functionalities:

*   **`AplyeaseBackendApplication`**: The entry point for the Spring Boot application, responsible for bootstrapping the entire system.
*   **`SecurityConfig`**: Orchestrates the application's security posture, defining authentication mechanisms and authorization rules using Spring Security.
*   **`AdminController`**, **`AuthController`**, **`JobApplicationController`**, **`UserController`**: These controllers expose RESTful endpoints, acting as the gateways for various user interactions and data management operations.
*   **`GlobalExceptionHandler`**: Implements a centralized error handling strategy, ensuring consistent and informative error responses across the API.
*   **`JwtTokenProvider`**: Manages the generation, validation, and parsing of JSON Web Tokens (JWT) for secure stateless authentication.
*   **`UserRepository`**, **`RoleRepository`**, **`JobApplicationRepository`**: These interfaces leverage Spring Data JPA to abstract database interactions, providing efficient data persistence and retrieval for users, roles, and job applications.

## Directory Blueprint

```
src/
├── main/
│   ├── java/
│   │   └── com/aplyease/backend/  # Core application logic and domain
│   │       ├── AplyeaseBackendApplication.java  # Application entry point
│   │       ├── config/              # Application configuration classes (e.g., security)
│   │       │   └── SecurityConfig.java
│   │       ├── controller/          # RESTful API endpoints
│   │       │   ├── AdminController.java
│   │       │   ├── AuthController.java
│   │       │   ├── JobApplicationController.java
│   │       │   ├── MeController.java
│   │       │   └── UserController.java
│   │       ├── dto/                 # Data Transfer Objects for request/response serialization
│   │       │   ├── AdminApplicationDto.java
│   │       │   ├── AdminDashboardStatsDto.java
│   │       │   ├── AgentAnalyticsDto.java
│   │       │   ├── AgentDashboardStatsDto.java
│   │       │   ├── AgentDetailAnalyticsDto.java
│   │       │   ├── AgentPerformanceDto.java
│   │       │   ├── ApplicationDto.java
│   │       │   ├── ApplicationSummaryDto.java
│   │       │   ├── ApplicationUpdateRequestDto.java
│   │       │   ├── ChangePasswordDto.java
│   │       │   ├── ClientAnalyticsDto.java
│   │       │   ├── EmployeeDashboardDto.java
│   │       │   ├── ErrorDetailsDto.java
│   │       │   ├── JobApplicationDto.java
│   │       │   ├── JobApplicationResponseDto.java
│   │       │   ├── JwtAuthResponse.java
│   │       │   ├── JWTAuthResponseDto.java
│   │       │   ├── LoginDto.java
│   │       │   ├── LoginResponseDto.java
│   │       │   ├── SignUpDto.java
│   │       │   ├── StatusUpdateDto.java
│   │       │   ├── UserCreateRequestDto.java
│   │       │   ├── UserDto.java
│   │       │   ├── UserProfileUpdateDto.java
│   │       │   └── UserUpdateRequestDto.java
│   │       ├── exception/           # Custom exception classes and handlers
│   │       │   ├── GlobalExceptionHandler.java
│   │       │   └── ResourceNotFoundException.java
│   │       ├── model/               # Domain entities representing database tables
│   │       │   ├── JobApplication.java
│   │       │   ├── Role.java
│   │       │   └── User.java
│   │       ├── repository/          # Spring Data JPA repositories for data access
│   │       │   ├── JobApplicationRepository.java
│   │       │   ├── RoleRepository.java
│   │       │   └── UserRepository.java
│   │       ├── security/            # Security-related configurations and components
│   │       │   ├── CustomUserDetailsService.java
│   │       │   ├── JwtAuthenticationFilter.java
│   │       │   └── JwtTokenProvider.java
│   │       └── service/             # Business logic implementation
│   │           ├── AdminService.java
│   │           ├── AuthService.java
│   │           ├── JobApplicationService.java
│   │           └── UserService.java
│   │           └── impl/            # Service implementation classes
│   │               ├── AdminServiceImpl.java
│   │               ├── AuthServiceImpl.java
│   │               ├── JobApplicationServiceImpl.java
│   │               └── UserServiceImpl.java
│   └── resources/
│       ├── static/              # Static assets (e.g., JavaScript, CSS)
│       │   ├── js/
│       │   │   ├── add-application.js
│       │   │   ├── admin-dashboard-logic.js
│       │   │   ├── agent-dashboard-logic.js
│       │   │   ├── client-dashboard-logic.js
│       │   │   ├── dashboard.js
│       │   │   ├── home.js
│       │   │   ├── job-tracker.js
│       │   │   ├── login.js
│       │   │   ├── main.js
│       │   │   ├── particles-config.js
│       │   │   └── register.js
│       └── application.properties # Spring Boot application configuration
├── test/
│   └── java/
│       └── com/aplyease/backend/  # Unit and integration tests
│           └── AplyeaseBackendApplicationTests.java
```

## Deployment & Operation

### Prerequisites

*   Java Development Kit (JDK) 17 or later
*   Apache Maven
*   MySQL Database

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone <repository-url>
    cd aplyease-backend
    ```

2.  **Configure Database:**
    Update the `src/main/resources/application.properties` file with your MySQL database connection details:
    ```properties
    spring.datasource.url=<your-mysql-jdbc-url>
    spring.datasource.username=<your-mysql-username>
    spring.datasource.password=<your-mysql-password>
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
    ```

### Local Development

1.  **Build the Project:**
    ```bash
    mvn clean install
    ```

2.  **Run the Application:**
    ```bash
    mvn spring-boot:run
    ```
    The application will be accessible at `http://localhost:8080` (or the configured port).

### Production Build

1.  **Create Executable JAR:**
    ```bash
    mvn clean package
    ```
    This will create a JAR file in the `target/` directory.

2.  **Run the JAR:**
    ```bash
    java -jar target/aplyease-backend-0.0.1-SNAPSHOT.jar
    ```
    Ensure the production database configuration is correctly set in your environment variables or a separate production properties file.

## Acknowledgements & Contact

This project was developed with meticulous attention to engineering best practices.

*   **Email:** [support@aplyease.com](mailto:support@aplyease.com)
*   **WhatsApp:** [Link to WhatsApp Group/Contact]
*   **Location:** [Your Company/Team Location]

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.