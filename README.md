## 1. Project Description

Educore Backend is the server-side component of the Educore application ecosystem. It exposes RESTful APIs that the frontend consumes to support core features of an education-focused platform. The codebase follows a conventional Node.js project structure to keep configuration, routing, business logic, and data models decoupled and easy to maintain.

Key goals:
- Provide a clean, organized API surface for the Educore frontend.
- Maintain a modular MVC-like structure (routes → controllers → models).
- Centralize configuration and middleware for consistency and reuse.
- Enable straightforward local development and deployment.

Primary features:
- Structured API routing in `routes/` with corresponding logic in `controllers/`.
- Reusable middleware in `middleware/` for concerns like validation, security, logging, and error handling.
- Centralized configuration in `config/` (e.g., environment variables, database connections).
- Data models in `models/` to encapsulate application data structures.



## 2. Tech Stack

This repository is a Node.js backend. Based on the project layout, it likely uses an Express-style routing approach. Update the list below to match the exact dependencies declared in `package.json`.

### Core Dependencies

- **express**: Fast, minimalist web application framework for Node.js.
- **cors**: Middleware to enable Cross-Origin Resource Sharing.
- **body-parser**: Parses incoming request bodies in middleware.
- **cookie-parser**: Parses Cookie header and populates `req.cookies`.

### Database & Data Modeling

- **mongoose**: Elegant MongoDB object modeling for Node.js.
- **validator**: Library for robust string validation and sanitization.

### Authentication & Security

- **jsonwebtoken**: Implements JSON Web Token (JWT) authentication.
- **bcryptjs**: Secure password hashing and comparison.

### File Upload & Media Management

- **multer**: Middleware for handling multipart/form-data (file uploads).
- **cloudinary**: Cloud-based image and video storage and management.

### Payment Processing

- **razorpay**: Integration with Razorpay payment gateway (India).

### Email Services

- **nodemailer**: Comprehensive email sending library for Node.js.

### Configuration & Utilities

- **dotenv**: Loads environment variables from `.env` files.
- **path**: Node.js core module for file and directory path utilities.

---

See `package.json` for the definitive list of dependencies and scripts.

---

## 3. Installation Guide

Prerequisites:
- Node.js (LTS recommended)
- npm (bundled with Node.js) or Yarn

Steps:
1. Clone the repository
   ```bash
   git clone https://github.com/Avihdf/Educore-Backend-Repo.git
   cd Educore-Backend-Repo
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables
   - Create a `.env` file at the project root (if applicable).
   - Example variables (adapt names to your project):
     ```
     PORT=5000
     NODE_ENV=development
     # For databases:
     DATABASE_URL=your-connection-string
     # or
     MONGODB_URI=your-mongodb-uri
     # For auth:
     JWT_SECRET=your-secret
     ```
   - Ensure `.env` is git-ignored (see `.gitignore`).

4. Run the application
   - Development (if a dev script is configured):
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

Check `package.json` for available scripts.

---

## 4. Usage Guide

- After starting the server, the API will listen on the configured `PORT` (e.g., http://localhost:5000).
- Use a REST client (e.g., cURL, Postman, Insomnia) to interact with the API endpoints.
- If CORS is enabled, the Educore frontend can consume these endpoints directly during local development.

Typical workflow:
- Start database (if required) and ensure the `DATABASE_URL`/`MONGODB_URI` is reachable.
- Start backend using the steps above.
- Configure the frontend app to point to the backend base URL (e.g., `VITE_API_URL=http://localhost:5000` or similar).

---

## 5. API Documentation

This section catalogs the API endpoints exposed by the backend. The endpoints are defined in the `routes/` directory, with corresponding request handlers in `controllers/`.

Add each endpoint using the template below. Replace placeholders with your actual routes, parameters, and response shapes.

Template for documenting an endpoint:
- Method + Path: e.g., GET /api/resource
- Description: What the endpoint does in one or two sentences.
- Authentication: e.g., Bearer JWT required or None.
- Path Params:
  - paramName (type): description
- Query Params:
  - paramName (type, optional): description
- Request Body (JSON):
  ```json
  {
    "field": "type and description",
    "anotherField": "..."
  }
  ```
- Responses:
  - 200 OK
    ```json
    {
      "data": {},
      "message": "Success"
    }
    ```
  - 400 Bad Request
    ```json
    { "error": "Validation error details" }
    ```
  - 401 Unauthorized
    ```json
    { "error": "Authentication required" }
    ```
  - 404 Not Found
    ```json
    { "error": "Resource not found" }
    ```
  - 500 Internal Server Error
    ```json
    { "error": "Something went wrong" }
    ```

## API Modules and Mount Points

Below is an overview of the main API modules, their mount points, and typical endpoints. All routes are referenced using their local development addresses (e.g., `http://localhost:5000`).

### Authentication APIs
- **Mount Point:** `/api/auth`
- **Endpoints:**
    - `POST /api/auth/login` — Authenticate user and issue session/JWT
    - `POST /api/auth/register` — Create a new account
    - `POST /api/auth/logout` — Invalidate session/JWT
    - `GET /api/auth/me` — Return current authenticated user
- **Description:** Handles user authentication flows.

### User Data APIs
- **Mount Point:** `/api`
- **Endpoints:**  
    - `GET /api/userData` — Retrieve user profile or general user-related data
    - `PUT /api/userData` — Update user profile information
- **Description:** Provides user profile and global user data for frontend consumption.

### Educator APIs

#### Student List
- **Mount Point:** `/api`
- **Endpoints:**  
    - `GET /api/educator/studentlist` — List and filter students
- **Description:** Retrieve and filter educator’s students.

#### Dashboard
- **Mount Point:** `/api`
- **Endpoints:**  
    - `GET /api/educator/dashboard` — Get aggregated metrics (courses, enrollments, revenue, activity)
- **Description:** Returns educator dashboard statistics.

#### Profile Management
- **Mount Point:** `/api/educator`
- **Endpoints:**  
    - `GET /api/educator/profile` — Get educator profile
    - `PUT /api/educator/profile` — Update educator profile
- **Description:** Manage educator profile, including avatar uploads.

#### Add Course
- **Mount Point:** `/api`
- **Endpoints:**  
    - `POST /api/educator/addcourse` — Create a new course with metadata and media
- **Description:** Create new courses, including file uploads for course media.

#### Course List and Management
- **Mount Point:** `/api`
- **Endpoints:**  
    - `GET /api/educator/courses` — List educator’s courses
    - `GET /api/educator/courses/:id` — Get course details
    - `PATCH /api/educator/courses/:id` — Update course info
    - `DELETE /api/educator/courses/:id` — Delete a course
- **Description:** Manage educator’s courses.

### Student APIs

#### Profile
- **Mount Point:** `/api/student`
- **Endpoints:**  
    - `GET /api/student/profile` — Get student profile
    - `PUT /api/student/profile` — Update student profile
- **Description:** Manage student profile and enrolled course summary.

#### Course Details
- **Mount Point:** `/api/student`
- **Endpoints:**  
    - `GET /api/student/coursedetails/:courseId` — Fetch course details for a student
- **Description:** Retrieve course syllabus, sections, and enrollment state.

### Payments
- **Mount Point:** `/api/payment`
- **Endpoints:**  
    - `POST /api/payment/create` — Initiate payment
    - `POST /api/payment/webhook` — Payment provider webhook
    - `GET /api/payment/status/:id` — Check payment status
- **Description:** Handle payment initiation and callbacks for course purchases.

### Enrollment
- **Mount Point:** `/api`
- **Endpoints:**  
    - `POST /api/student/enroll` — Enroll in a course
    - `GET /api/student/enrollments` — List user’s enrollments
    - `GET /api/student/enrollments/:courseId` — Get enrollment status for a course
- **Description:** Manage student enrollments after payment or free access.

### Course Player
- **Mount Point:** `/api`
- **Endpoints:**  
    - `GET /api/student/courseplayer/:lessonId` — Retrieve lesson content
 
- **Description:** Secure access to course content enrolled students.

---

**Authentication and Authorization:**  
- Cookies and JWTs are used for session management.
- CORS is configured with credentials for secure frontend-backend communication.
- Role-based access control is enforced for educator and student endpoints.

**Database:**  
- MongoDB via Mongoose, with models defined in `/models`.

**Endpoint Discovery:**  
Refer to the route files for exact HTTP methods, request bodies, and response formats.  
Key files:  
- `routes/auth.js` — Authentication endpoints  
- `routes/userData.js` — User data endpoints  
- `routes/Educator/*` — Educator endpoints  
- `routes/Student/*` — Student endpoints



## 6. Folder Structure

Overview of the main files and directories:

```text
Educore-Backend-Repo/
├─ config/         # Environment-based configuration (e.g., database, app settings)
├─ controllers/    # Request handlers and business logic for each route/module
├─ middleware/     # Reusable middleware (auth, validation, error handling, logging)
├─ models/         # Data models/schemas and related data-access logic
├─ routes/         # API route definitions and module-level routers
├─ server.js       # Application entrypoint (initializes app, middleware, routes, server)
├─ package.json    # Project metadata, scripts, and dependencies
├─ package-lock.json
├─.gitignore
└─.env
```

Guidance:
- Add per-module subfolders as needed under `controllers/`, `models/`, and `routes/` (e.g., `users`, `courses`).
- Centralize environment variables and service configuration in `config/`.
- Keep middleware generic and reusable across routes.
