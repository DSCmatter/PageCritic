# Book API cURL commands and responses (WSL2 / Ubuntu)

**Note:** I fixed minor syntax issues (like stray spaces in `http: //localhost` → `http://localhost`). Every command is followed by the actual response you recorded.

---

## Conventions

* Base URL: `http://localhost:5000`
* All commands are meant to be run on Bash/Zsh (WSL2 Ubuntu)
* Authenticated endpoints require `Authorization: Bearer <TOKEN>`

---

## 1) Auth

### 1.1 Signup

```bash
curl -X POST \
  http://localhost:5000/api/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "curluser",
    "email": "curl@example.com",
    "password": "curlpassword123"
}'
```

**Response**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "7863e38f-0649-494d-9b1a-a7b3ae611566",
    "username": "curluser",
    "email": "curl@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4NjNlMzhmLTA2NDktNDk0ZC05YjFhLWE3YjNhZTYxMTU2NiIsImVtYWlsIjoiY3VybEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiY3VybHVzZXIiLCJpYXQiOjE3NTMzODIyNzcsImV4cCI6MTc1MzM4NTg3N30.NagMIeA9n_yvKXUqpx63WGH-tM7bkl3_gBzLTHdCf68"
}
```

### 1.2 Login

```bash
curl -X POST \
  http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "curl@example.com",
    "password": "curlpassword123"
}'
```

**Response**

```json
{
  "message": "Logged in successfully",
  "user": {
    "id": "7863e38f-0649-494d-9b1a-a7b3ae611566",
    "username": "curluser",
    "email": "curl@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4NjNlMzhmLTA2NDktNDk0ZC05YjFhLWE3YjNhZTYxMTU2NiIsImVtYWlsIjoiY3VybEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiY3VybHVzZXIiLCJpYXQiOjE3NTMzODIzNzgsImV4cCI6MTc1MzM4NTk3OH0.0cBU4xeCr3-A4WOZjCy_HlVFEED3dwXLSplU2oek7J4"
}
```

### 1.3 Get current user ("/me")

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4NjNlMzhmLTA2NDktNDk0ZC05YjFhLWE3YjNhZTYxMTU2NiIsImVtYWlsIjoiY3VybEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiY3VybHVzZXIiLCJpYXQiOjE3NTMzODIzNzgsImV4cCI6MTc1MzM4NTk3OH0.0cBU4xeCr3-A4WOZjCy_HlVFEED3dwXLSplU2oek7J4"

curl -X GET \
  http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Response**

```json
{
  "id": "7863e38f-0649-494d-9b1a-a7b3ae611566",
  "username": "curluser",
  "email": "curl@example.com"
}
```

### 1.4 Delete current user account

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImExYTU3OTAzLWQxMzUtNGQyNS1iMDE0LTM5ZTU2MmQ5MDdhMCIsImVtYWlsIjoiZGVsZXRlQGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0b2RlbGV0ZXVzZXIiLCJpYXQiOjE3NTMzODYwNDEsImV4cCI6MTc1MzM4OTY0MX0.FpaR7RPAoxmOh2NfsOahRxcGPSkmUqlYHexA4UDB2KY"

curl -X DELETE \
  http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Response**

```json
{
  "message": "User account deleted successfully"
}
```

---

## 2) Books

### 2.1 Get all books

```bash
curl http://localhost:5000/api/books
```

**Response**

```json
{
  "books": [
    {
      "id": "5d252b54-c28f-46b8-80a6-82998ffd0bf2",
      "title": "Thousand Eons of World",
      "author": "ArchmageOfTerror",
      "genre": "Fantasy",
      "created_at": "2025-07-24T19:01:18.430Z",
      "average_rating": "0.00"
    }
  ],
  "pagination": {
    "totalBooks": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

### 2.2 With pagination

```bash
curl "http://localhost:5000/api/books?page=1&limit=2"
```

**Response**

```json
{
  "pagination": {
    "totalBooks": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

### 2.3 Filter by genre (no results)

```bash
curl "http://localhost:5000/api/books?genre=Testing"
```

**Response**

```json
{
  "books": [],
  "pagination": {
    "totalBooks": 0,
    "totalPages": 0,
    "currentPage": 1,
    "limit": 10
  }
}
```

### 2.4 Filter by genre (Fantasy)

```bash
curl "http://localhost:5000/api/books?genre=Fantasy"
```

**Response**

```json
{
  "books": [
    {
      "id": "5d252b54-c28f-46b8-80a6-82998ffd0bf2",
      "title": "Thousand Eons of World",
      "author": "ArchmageOfTerror",
      "genre": "Fantasy",
      "created_at": "2025-07-24T19:01:18.430Z",
      "average_rating": "0.00"
    }
  ],
  "pagination": {
    "totalBooks": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

### 2.5 Filter by author (no results shown)

```bash
curl "http://localhost:5000/api/books?author=Curl%20Author"
```

**Response**

```json
{
  "books": [],
  "pagination": {
    "totalBooks": 0,
    "totalPages": 0,
    "currentPage": 1,
    "limit": 10
  }
}
```

### 2.6 Filter by author (ArchmageOfTerror)

```bash
curl "http://localhost:5000/api/books?author=ArchmageOfTerror"
```

**Response**

```json
{
  "books": [
    {
      "id": "5d252b54-c28f-46b8-80a6-82998ffd0bf2",
      "title": "Thousand Eons of World",
      "author": "ArchmageOfTerror",
      "genre": "Fantasy",
      "created_at": "2025-07-24T19:01:18.430Z",
      "average_rating": "0.00"
    }
  ],
  "pagination": {
    "totalBooks": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

### 2.7 Multiple filters (no results)

```bash
curl "http://localhost:5000/api/books?genre=Testing&author=Curl%20Author&page=1&limit=1"
```

**Response**

```json
{
  "books": [],
  "pagination": {
    "totalBooks": 0,
    "totalPages": 0,
    "currentPage": 1,
    "limit": 1
  }
}
```

### 2.8 Add a book

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4NjNlMzhmLTA2NDktNDk0ZC05YjFhLWE3YjNhZTYxMTU2NiIsImVtYWlsIjoiY3VybEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiY3VybHVzZXIiLCJpYXQiOjE3NTMzODIzNzgsImV4cCI6MTc1MzM4NTk3OH0.0cBU4xeCr3-A4WOZjCy_HlVFEED3dwXLSplU2oek7J4"

curl -X POST \
  http://localhost:5000/api/books \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Thousand Eons of World",
    "author": "ArchmageOfTerror",
    "genre": "Fantasy"
}'
```

**Response**

```json
{
  "message": "Book added successfully",
  "book": {
    "id": "5d252b54-c28f-46b8-80a6-82998ffd0bf2",
    "title": "Thousand Eons of World",
    "author": "ArchmageOfTerror",
    "genre": "Fantasy",
    "created_at": "2025-07-24T19:01:18.430Z"
  }
}
```

### 2.9 Delete a book

```bash
BOOK_TO_DELETE_ID="5d252b54-c28f-46b8-80a6-82998ffd0bf2"
AUTH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4NjNlMzhmLTA2NDktNDk0ZC05YjFhLWE3YjNhZTYxMTU2NiIsImVtYWlsIjoiY3VybEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiY3VybHVzZXIiLCJpYXQiOjE3NTMzODgxOTcsImV4cCI6MTc1MzM5MTc5N30.2wYS5Mo2JM3ytM6YYxMVXZ7GiwDenLpBmxfoxzI0nvk"

curl -X DELETE \
  "http://localhost:5000/api/books/$BOOK_TO_DELETE_ID" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Response**

```json
{
  "message": "Book deleted successfully."
}
```

---

## 3) Reviews

### 3.1 Add a review

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4NjNlMzhmLTA2NDktNDk0ZC05YjFhLWE3YjNhZTYxMTU2NiIsImVtYWlsIjoiY3VybEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiY3VybHVzZXIiLCJpYXQiOjE3NTMzODIzNzgsImV4cCI6MTc1MzM4NTk3OH0.0cBU4xeCr3-A4WOZjCy_HlVFEED3dwXLSplU2oek7J4"
BOOK_ID="5d252b54-c28f-46b8-80a6-82998ffd0bf2"

curl -X POST \
  "http://localhost:5000/api/books/$BOOK_ID/reviews" \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "review_text": "This book exceeded my expectations! A true masterpiece.",
    "rating": 5
}'
```

**Response**

```json
{
  "message": "Review added successfully",
  "review": {
    "id": "aafdea6b-23f2-4804-acdc-c046a0e8d937",
    "book_id": "5d252b54-c28f-46b8-80a6-82998ffd0bf2",
    "reviewer_id": "7863e38f-0649-494d-9b1a-a7b3ae611566",
    "review_text": "This book exceeded my expectations! A true masterpiece.",
    "rating": 5,
    "created_at": "2025-07-24T19:27:23.373Z"
  }
}
```

### 3.2 View a book (and its reviews)

```bash
BOOK_ID="5d252b54-c28f-46b8-80a6-82998ffd0bf2"

curl "http://localhost:5000/api/books/$BOOK_ID"
```

**Response**

```
<The response body was not pasted in your message. Insert it here if you need it later.>
```

### 3.3 Delete a review

```bash
REVIEW_ID="3a3e44d6-e7cd-4d39-9641-9c9c2a0ffcab"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4NjNlMzhmLTA2NDktNDk0ZC05YjFhLWE3YjNhZTYxMTU2NiIsImVtYWlsIjoiY3VybEBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiY3VybHVzZXIiLCJpYXQiOjE3NTMzODgxOTcsImV4cCI6MTc1MzM5MTc5N30.2wYS5Mo2JM3ytM6YYxMVXZ7GiwDenLpBmxfoxzI0nvk"

curl -X DELETE \
  "http://localhost:5000/api/reviews/$REVIEW_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Response**

```json
{
  "message": "Review deleted successfully."
}
```

---

