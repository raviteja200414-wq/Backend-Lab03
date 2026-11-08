# Lab 3: REST API, Query Parameters, Validation, Debugging

**Deployment URL:** (https://backend-labs-aurora.onrender.com/)

---

## Student Details

| Field | Details |
|-------|---------|
| **Name** | Bollepelli Raviteja |
| **Registration Number** | 252U1R1041 |
| **Section** | 223 2A |
| **Course** | Backend Development Fundamentals |
| **Lab** | Lab 3 – Node.js and Express Server |

---

## Objective

To upgrade the existing routing infrastructure into a clean, fully functional REST API. This includes implementing search, sorting, and filtering via query parameters, adding rigorous input validation, ensuring correct HTTP status codes, and practicing debugging common server and database errors.
---

## Project Description

This project transforms previous basic routes into a production-ready RESTful API for managing a `books` resource. Key implementations include:

1. **Standardized REST Endpoints:** Using nouns (`/books`) and appropriate HTTP methods (GET, POST, PUT, DELETE).
2. **Query Parameters:** Enhancing the `GET /books` endpoint to support `search_q` (partial title match), `order_by`, `order` (ASC/DESC), `limit`, `offset`, `min_price`, and `max_price`.
3. **Input Validation:** Verifying POST/PUT request bodies to reject requests with missing fields or invalid data types (e.g., non-numeric price) with a `400 Bad Request`.
4. **Standardized Responses:** Ensuring all responses, especially errors, follow a consistent JSON format like `{ "message": "..." }`.
5. **Proper Status Codes:** Returning `201 Created` for successful POST requests, `200 OK` for updates/deletes, and `404 Not Found` for missing resources.

---

## Technologies Used

- Node.js
- Express.js
- JavaScript
- npm

---

## Project Structure

```
lab-03/
├── node_modules/
├── screenshots/
│   ├── [INSERT GET BOOKS SCREENSHOT]
│   ├── [INSERT POST BOOKS SCREENSHOT]
│   ├── [INSERT VALIDATION ERROR SCREENSHOT]
│   ├── [INSERT UPDATE BOOKS SCREENSHOT]
│   ├── [INSERT DELETE BOOKS SCREENSHOT]
│   └── [INSERT 404 ERROR SCREENSHOT]
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── server.js
└── database.js
```

---

## Explanation of package.json

The `package.json` file stores information about the Node.js project and its dependencies.

- **name**: Specifies the project name.
- **version**: Specifies the current project version.
- **description**: Provides a short description of the project.
- **main**: Specifies the main entry file (`server.js`).
- **scripts**: Defines commands that can be executed using npm.
- **author**: Specifies the project author.
- **license**: Specifies the project's license.
- **dependencies**: Lists packages required by the application (`express`).

The `package-lock.json` file records the exact dependency versions used for installation. The `node_modules` folder contains the installed packages.

---

## Installation

### Prerequisites

- Node.js installed on the computer.
- npm, which is installed with Node.js.

### Steps

1. Clone the GitHub repository:

```bash
git clone https://github.com/Invy4/backend_labs_AURORA.git
```

2. Navigate to the Lab 1 folder:

```bash
cd backend_labs_AURORA/lab-01
```

3. Install the required dependencies:

```bash
npm install
```

The `node_modules` folder is generated automatically when the dependencies are installed.

---

## Execution

### 1. Run the Basic HTTP Server

Run the following command:

```bash
node http-server.js
```

Open the following URL in your browser:

```
http://localhost:3000
```

The basic HTTP server returns `Hello` for every request.

Stop the server by pressing `Ctrl + C` before starting the Express server.

### 2. Run the Express Server

Run the following command:

```bash
node server.js
```

Open the following URL in your browser:

```
http://localhost:3000
```

The Express server displays the welcome message.

---

## API Endpoints

The following endpoints are provided by the Express server (`server.js`).

| Method | Endpoint | Description | Expected Status |
|--------|----------|-------------|-----------------|
| GET | `/books` | Retrieves a list of books. Supports query params (`search_q`, `order_by`, `order`, `limit`, `offset`, `min_price`, `max_price`). | 200 OK |
| GET | `/books/:id` | Returns a specific book based on the given ID parameter. | 200 OK (404 if missing) |
| POST | `/books` | Creates an entry for the book in the database. Validates title, author, and numeric price. | 201 Created (400 on bad input) |
| PUT | `/books/:id` | Updates the book with the given ID using the provided body info. | 200 OK (404 if missing) |
| DELETE | `/books/:id` | Deletes the book with the given ID parameter. | 200 OK (404 if missing) |
| GET | Any unknown path | Returns a standard JSON Page Not Found message. | 404 Not Found |

---

## Screenshots

The following screenshots demonstrate the REST API endpoint responses using Postman.

### 1. GET /books (with query parameters and filters)

![[INSERT GET BOOKS SCREENSHOT HERE]](screenshots/get_books.png)

### 2. GET /books/:id (Single Book)

![[INSERT GET SINGLE BOOK SCREENSHOT HERE]](screenshots/get_book_id.png)

### 3. POST /books (Successful Creation - 201)

![[INSERT POST SUCCESS SCREENSHOT HERE]](screenshots/post_books_success.png)

### 4. POST /books (Validation Error - 400)

![[INSERT POST VALIDATION ERROR SCREENSHOT HERE]](screenshots/post_validation_error.png)

### 5. PUT /books/:id (Successful Update - 200)

![[INSERT PUT UPDATE SCREENSHOT HERE]](screenshots/put_books.png)

### 6. DELETE /books/:id (Successful Deletion - 200)

![[INSERT DELETE SCREENSHOT HERE]](screenshots/delete_books.png)

### 7. Missing ID / Unknown Route (404 Response)

![[INSERT 404 ERROR SCREENSHOT HERE]](screenshots/404_error.png)

---

## Testing (Postman)

The REST API endpoints must be tested using an API client like Postman, as web browsers can only natively perform GET requests.

- **GET (Success with Filters):** Send a GET request to `/books?search_q=harry&order_by=price&order=DESC&min_price=10&max_price=50` and verify that the filtered list of books is returned with status code `200 OK`.
- **POST (Successful Creation):** Send a POST request to `/books` with a valid JSON body (e.g., `{"title": "Dune", "author": "Frank Herbert", "price": 40}`) and verify that it returns status code `201 Created`.
- **POST (Validation Failure):** Send a POST request missing a required field like `title`, or provide a string for `price`. Verify that the server rejects it, returning status code `400 Bad Request` with a clear JSON error message.
- **PUT / DELETE (Success):** Send a PUT or DELETE request to an existing book ID (e.g., `/books/1`) and verify that it returns status code `200 OK`.
- **Not Found (Failure):** Send a GET, PUT, or DELETE request to a non-existent ID (e.g., `/books/9999`) and verify that the server returns status code `404 Not Found`.

## Notes: Problems Faced and Solutions

| Problem | Solution |
|---------|----------|
| Both servers use port 3000 | Run only one server at a time; stop with `Ctrl + C` before switching |
| `node_modules` being committed | Added `node_modules/` to `.gitignore`; reinstall with `npm install` |
| Understanding `http` vs Express | `http` is lower-level and requires manual routing; Express abstracts this cleanly |

---

## Important Notes

- Install dependencies using `npm install`.
- Do not upload the `node_modules/` folder to GitHub.
- Do not commit or share any `.env` file containing secrets.
- The HTTP server and Express server both use port 3000 – run them one at a time.
- Ensure all screenshot files exist in the `screenshots/` folder before submission.
