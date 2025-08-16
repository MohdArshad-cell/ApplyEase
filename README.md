AplyEase
Custom Gem

Show thinking
Of course. Here is a README.md file that summarizes all the progress we've made on the AplyEase project so far.

AplyEase - AI-Powered Job Application Platform 🚀
This is a full-stack web application designed to streamline the job application process. This project features a secure backend API built with Java Spring Boot and a responsive, user-friendly frontend created with plain HTML, CSS, and JavaScript.

Tech Stack 🛠️
Backend: Java 17+, Spring Boot, Spring Security

Frontend: HTML5, CSS3, JavaScript (ES6)

Database: MySQL / MariaDB

Authentication: JSON Web Tokens (JWT)

IDE: Eclipse

Core Features Implemented ✨
We have successfully built the foundational user management and application shell.

1. Secure User Authentication
User Registration: A futuristic, dark-themed registration page that securely creates new users. Passwords are never stored in plain text; they are hashed using BCrypt.

User Login: A secure login system that validates user credentials.

JWT-Based Authorization: Upon successful login, the backend generates a JWT token. This token is stored in the browser and sent with future requests to access protected resources.

2. Responsive, Multi-Page UI
A consistent, multi-page frontend structure with a shared, professional navbar and footer.

Homepage (index.html): The main landing page for the application.

Login & Register Pages: Beautifully styled, responsive forms with a "frosted glass" effect and a futuristic dark theme.

Dynamic Navbar: The navigation bar intelligently shows a "Login" button to visitors and a "Logout" button to authenticated users.

Setup & Installation
Follow these steps to get the project running on your local machine.

Backend (Spring Boot)
Database Setup:

Ensure you have a MySQL or MariaDB server running.

Create a database named aplyease_db.

Run the SQL scripts provided earlier to create the users, roles, and user_roles tables.

Configure Connection:

Open the src/main/resources/application.properties file.

Update the spring.datasource.username and spring.datasource.password properties with your database credentials.

Run the Application:

Open the project in your Eclipse IDE.

Locate the AplyeaseBackendApplication.java file.

Right-click the file and select Run As > Java Application.

The server will start on http://localhost:8080.

Frontend (HTML/CSS/JS)
The frontend is served directly by the Spring Boot backend.

Make sure the backend application is running.

Open your web browser and navigate to http://localhost:8080.

API Endpoints
The following authentication endpoints have been implemented:

Method	Endpoint	Description	Access
POST	/api/auth/register	Registers a new user in the database.	Public
POST	/api/auth/login	Authenticates a user and returns a JWT token.	Public
