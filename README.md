# Full Stack Open Part 4

This repository contains the backend code for **Part 4** of the **Full Stack Open Course** offered by the University of Helsinki. The backend is built using **Node.js** and **Express**, and it provides a RESTful API for managing blogs and users. The application also includes user authentication using JSON Web Tokens (JWT).

## Features

- **Blog Management**: Create, read, update, and delete blogs.
- **User Management**: Create and manage users.
- **Authentication**: Secure endpoints using JWT for user authentication.
- **Testing**: Comprehensive test suite for both blogs and users.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing blogs and users.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JSON Web Tokens (JWT)**: For user authentication.
- **Bcrypt**: For hashing user passwords.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.
- **Dotenv**: For managing environment variables.
- **Supertest**: For testing HTTP endpoints.
- **Nodemon**: For automatic server restarts during development.

## Getting Started

### Prerequisites

- **Node.js**: Make sure you have Node.js installed on your machine.
- **MongoDB**: Ensure MongoDB is installed and running.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/josemigueli/fso-part4.git
   cd fso-part4
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   MONGODB_URI=your_mongodb_uri
   TEST_MONGODB_uri=your_test_mongodb_uri
   PORT=your_port
   SECRET=your_jwt_secret
   ```

### Running the Application

- **Development Mode**:

  ```bash
  npm run dev
  ```

  This will start the server using `nodemon` for automatic restarts.

- **Production Mode**:

  ```bash
  npm start
  ```

- **Running Tests**:
  ```bash
  npm test
  ```

## API Endpoints

### Blogs

- **GET /api/blogs**: Retrieve all blogs.
- **POST /api/blogs**: Create a new blog (requires authentication).
- **DELETE /api/blogs/:id**: Delete a blog by ID (requires authentication).
- **PUT /api/blogs/:id**: Update a blog by ID (requires authentication).

### Users

- **GET /api/users**: Retrieve all users.
- **POST /api/users**: Create a new user.

### Authentication

- **POST /api/login**: Authenticate a user and receive a JWT.

### Testing

- **POST /api/testing/reset**: Reset the database (only available in test environment).

## Testing

The application includes a comprehensive test suite for both blogs and users. The tests are written using **Supertest** and **Node's built-in test runner**.

### Running Tests

To run the tests, use the following command:

```bash
npm run test
```

### Test Mode

To put the app into test mode:

```bash
npm run start:test
```

## Environment Variables

- **MONGODB_URI**: The URI for connecting to the MongoDB database.
- **TEST_MONGODB_URI**: The URI for connecting to the test MongoDB database.
- **PORT**: The port on which the server will run.
- **SECRET**: The secret key used for signing JWTs.

## License

This project is licensed under the **MIT License**.
