# PostgreSQL Command Line (psql) Navigation Guide

This document provides a comprehensive list of psql commands and SQL statements for navigating, inspecting, and querying your PostgreSQL database. It's designed as a quick reference for interacting directly with your `book_review_db` database.

---

## I. Connecting to PostgreSQL

### Connect as PostgreSQL Superuser (postgres)

Use this for initial setup tasks like creating databases or users.

```bash
# Common for Linux/WSL:
sudo -u postgres psql

# Alternatively (may require password):
psql -U postgres
```

### Connect to Your Project Database (`book_review_db`) as `book_app_user`

Use this for daily interactions with your application's database.

```bash
psql -U book_app_user -d book_review_db -h localhost -p 5432
# You will be prompted for the password for 'book_app_user' (e.g., 'some-passwd').
```

---

## II. Database & User Management (Initial Setup)

These commands are typically run once during the initial setup of your database. Execute them when connected as the postgres superuser (`postgres=#` prompt).

### Create Your Project Database

```sql
CREATE DATABASE book_review_db;
```

### Create a Dedicated Database User (e.g., `book_app_user`)

Replace `some-passwd` with your chosen secure password.

```sql
CREATE USER book_app_user WITH PASSWORD 'some-passwd';
```

### Grant Privileges to Your Database User

This gives `book_app_user` full access to `book_review_db`.

```sql
GRANT ALL PRIVILEGES ON DATABASE book_review_db TO book_app_user;
```

### Optional: Create User Matching System Username (e.g., `adduser`)

If you prefer to use your system username (e.g., `adduser`) for `DB_USER` and rely on peer authentication for local connections.

```sql
CREATE USER adduser WITH PASSWORD 'your_secure_password_for_this_user';
GRANT ALL PRIVILEGES ON DATABASE book_review_db TO adduser;
```

---

## III. Inspecting Database Structure (inside psql)

These commands are run inside the psql shell (e.g., at `book_review_db=>` or `postgres=#` prompt).

### List All Databases

```psql
\l
```

### List Tables in Current Database

```psql
\dt
```

### Describe Table Schema (e.g., for `users` table)

Shows columns, types, indexes, and constraints for a table.

```psql
\d users
```

### List PostgreSQL Users/Roles

```psql
\du
```

### Show pg\_hba.conf File Path

Useful for locating the authentication configuration file.

```sql
SHOW hba_file;
```

### Connect to a Specific Database as a Specific User (from within psql)

```psql
\c book_review_db book_app_user
# You will be prompted for the password for 'book_app_user'.
```

---

## IV. Querying Data (SELECT) (inside psql)

These SQL SELECT statements are run inside the psql shell (at the `book_review_db=>` prompt).

### List All Users (excluding passwords)

```sql
SELECT id, username, email, created_at FROM users;
```

### List All Books

```sql
SELECT id, title, author, genre, created_at FROM books;
```

### List All Reviews (basic columns)

```sql
SELECT id, book_id, reviewer_id, review_text, rating, created_at FROM reviews;
```

### List All Reviews with Reviewer Username and Book Title

This query joins reviews with users and books to provide more context.

```sql
SELECT
    r.id AS review_id,
    r.review_text,
    r.rating,
    b.title AS book_title,
    u.username AS reviewer_username,
    r.created_at
FROM
    reviews r
JOIN
    users u ON r.reviewer_id = u.id
JOIN
    books b ON r.book_id = b.id;
```

### Check if a Specific User Exists/Was Deleted

Replace `'YOUR_USER_ID_HERE'` with the actual UUID of the user.

```sql
SELECT id, username, email FROM users WHERE id = 'YOUR_USER_ID_HERE';
-- Expected output: (0 rows) if deleted.
```

### Check if a Specific Book Exists/Was Deleted

Replace `'YOUR_BOOK_ID_HERE'` with the actual UUID of the book.

```sql
SELECT id, title FROM books WHERE id = 'YOUR_BOOK_ID_HERE';
-- Expected output: (0 rows) if deleted.
```

### Check if a Specific Review Exists/Was Deleted

Replace `'YOUR_REVIEW_ID_HERE'` with the actual UUID of the review.

```sql
SELECT id, review_text FROM reviews WHERE id = 'YOUR_REVIEW_ID_HERE';
-- Expected output: (0 rows) if deleted.
```

### Check all reviews for a specific Book ID

Replace `'YOUR_BOOK_ID_HERE'` with the actual UUID of the book.

```sql
SELECT id, review_text, rating, reviewer_id FROM reviews WHERE book_id = 'YOUR_BOOK_ID_HERE';
```

---

## V. Exiting psql

### Quit the psql shell

```psql
\q
```
