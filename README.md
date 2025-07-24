# Book Review Platform - Backend

This repository contains the backend API for a Book Review Platform, built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**. It provides a robust set of RESTful endpoints for user authentication, book management, and review functionalities.

---

## Features

### User Authentication

* User registration (Signup).
* User login, returning a JSON Web Token (JWT) for authentication.
* Protected routes accessible only by authenticated users.
* Retrieve authenticated user's profile.
* Delete a user's own account.

### Book Management

* Add new books (title, author, genre) - authenticated access only.
* Retrieve a paginated list of all books.
* Filter books by genre and/or author.
* View details of a single book, including its average rating and associated reviews.
* Delete books - authenticated access only.

### Review Management

* Add reviews and ratings (1-5 stars) to books - authenticated access only.
* View all reviews for a specific book (integrated into book detail endpoint).
* Delete reviews - authenticated access only, only the original reviewer can delete their own review.
* Automatically calculates and displays the average rating for each book.

---

## Technologies Used

* **Runtime:** Node.js
* **Language:** TypeScript
* **Web Framework:** Express.js
* **Database:** PostgreSQL
* **Database Client:** `pg` (Node.js PostgreSQL client)
* **Authentication:** JWT with `jsonwebtoken` and `bcryptjs` for password hashing.
* **Environment Variables:** dotenv

---

## Getting Started

Follow these steps to set up and run the backend locally.

### Prerequisites

Ensure you have the following installed on your system:

* Node.js (LTS version recommended)
* npm (comes with Node.js) or pnpm
* PostgreSQL (version 14 or higher recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/book-review-platform.git
cd book-review-platform
```

### 2. Backend Setup

Navigate into the backend directory and install dependencies:

```bash
cd backend
npm install # or pnpm install
```

### 3. Environment Variables

Create a `.env` file in the `backend/` directory and add the following configuration:

```env
# PostgreSQL Database Configuration
DB_USER=book_app_user
DB_PASSWORD=some-passwd
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=book_review_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=1h

# Server Configuration
PORT=5000
```

### 4. PostgreSQL Database Setup

**Create the database and user:**

```sql
CREATE DATABASE book_review_db;
CREATE USER book_app_user WITH PASSWORD 'some-passwd';
GRANT ALL PRIVILEGES ON DATABASE book_review_db TO book_app_user;
```

**Initialize the schema:**
Create a file `backend/sql/init.sql` and add the schema provided in the documentation. Then run:

```bash
psql -U book_app_user -d book_review_db -h localhost -p 5432 -f sql/init.sql
```

### 5. Run the Backend Server

```bash
npm run dev
```

Server will start on [http://localhost:5000](http://localhost:5000).

---

## API Endpoints (Backend)

All endpoints are prefixed with `/api`.

### Authentication

* **POST /api/auth/signup** – Register a new user.
* **POST /api/auth/login** – Authenticate user and get JWT.
* **GET /api/auth/me** – Get current authenticated user's profile (Protected).
* **DELETE /api/auth/me** – Delete the current authenticated user's account (Protected).

### Books

* **POST /api/books** – Add a new book (Protected).
* **GET /api/books** – Get all books with filters and pagination.
* **GET /api/books/\:id** – Get details of a single book.
* **DELETE /api/books/\:id** – Delete a book by ID (Protected).

### Reviews

* **POST /api/books/\:id/reviews** – Add a review to a specific book (Protected).
* **DELETE /api/reviews/\:id** – Delete a review (Protected).

---

## Database Schema

### `users`

* `id` (UUID, PK)
* `username` (VARCHAR, UNIQUE)
* `email` (VARCHAR, UNIQUE)
* `password` (VARCHAR, HASHED)
* `created_at` (TIMESTAMP)

### `books`

* `id` (UUID, PK)
* `title` (VARCHAR)
* `author` (VARCHAR)
* `genre` (VARCHAR)
* `created_at` (TIMESTAMP)

### `reviews`

* `id` (UUID, PK)
* `book_id` (UUID, FK to books.id, ON DELETE CASCADE)
* `reviewer_id` (UUID, FK to users.id, ON DELETE CASCADE)
* `review_text` (TEXT)
* `rating` (INTEGER, 1-5)
* `created_at` (TIMESTAMP)

---

## Known Limitations

* No extensive input validation.
* No user roles (e.g., admin).
* Basic error handling.
* No rate limiting or advanced security.

---

## Future Enhancements

* Robust input validation.
* User roles (Admin, Reviewer).
* Password reset functionality.
* Image uploads for book covers.
* Advanced sorting and search.
* Logging integration.
* Unit and integration tests.

---
