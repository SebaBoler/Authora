# AuthService

AuthService is a user authentication and authorization service built using NestJS, Drizzle ORM, PostgreSQL, Argon2, and Postmark. The service supports user registration, login, account activation, role-based access control (RBAC), and sending activation codes via email.

## Features

- **User Registration:** Register new users and send an activation email with a code.
- **Login:** Authenticate users with email and password.
- **Account Activation:** Activate user accounts using a code sent via email.
- **RBAC:** Role-Based Access Control for managing user permissions.
- **Email Notifications:** Send account-related emails using Postmark.

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- Postmark account for sending emails

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SebaBoler/Authora.git
   cd Authora
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure the database:**

   Create a `.env` file in the root directory with the following content:

   ```plaintext
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USERNAME=your_database_username
   POSTGRES_PASSWORD=your_database_password
   POSTGRES_DATABASE=your_database_name
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION_TIME=86400
   JWT_REFRESH_EXPIRATION_TIME=7d
   POSTMARK_API_KEY=your_postmark_api_key
   NODE_ENV=development
   PORT=3000
   ```

4. **Run the database migrations:**

   Ensure your PostgreSQL database is running, then run the migrations to set up the database schema.

   ```bash
   npx drizzle-kit generate:postgres
   ```

   or

   ```bash
   npm run drizzle:pg
   ```

## Usage

1. **Start the application:**

   ```bash
   npm run start
   ```

2. **Swagger Documentation**

The Swagger documentation for the Authora API is automatically generated using `swagger-jsdoc`. It provides a detailed overview of all the API endpoints, including request parameters and response structures.

To access the Swagger UI:

1. Ensure the application is running by executing `npm run start`.
2. Open your web browser and navigate to `http://localhost:3000/api-docs`.

This will display the interactive Swagger UI, where you can explore and test the API endpoints.

3. **Role-Based Access Control (RBAC):**

   Use the `@Roles` decorator to restrict access to certain endpoints based on user roles. For example:

   ```typescript
   @UseGuards(JwtAuthGuard, RolesGuard)
   @Roles('admin')
   @Get('admin')
   getAdminData(@Request() req) {
     return { message: 'This is admin data', user: req.user };
   }
   ```

## Project Structure

- **`src/auth`:** Authentication and authorization logic, including guards and strategies.
- **`src/users`:** User entity and service.
- **`src/email`:** Email service using Postmark.
- **`src/roles`:** Role and permission management.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
