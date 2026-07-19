# Task API

A RESTful CRUD API built using Node.js and Express.js.

This project was developed as part of the FlyRank Backend AI Engineering Internship (Week 2 Assignment). The API manages an in-memory list of tasks and demonstrates the four CRUD operations: Create, Read, Update, and Delete.

## Features

- Create a new task
- Retrieve all tasks
- Retrieve a task by ID
- Update an existing task
- Delete a task
- Input validation
- Proper HTTP status codes
- Health check endpoint
- Interactive API documentation using Swagger UI

---

# Technology Stack

- Node.js
- Express.js
- Swagger UI Express
- OpenAPI 3.0

---

# Project Structure

```
task-api/
│
├── controllers/
│   └── task.controller.js
│
├── routes/
│   └── task.routes.js
│
├── swagger.json
├── server.js
├── package.json
└── README.md
```

---

# Installation

## Clone the repository

```bash
git clone https://github.com/Aryanbharti214/task-api
```

## Navigate to the project directory

```bash
cd task-api
```

## Install dependencies

```bash
npm install
```

## Start the server

```bash
node server.js
```

The server will start on:

```
http://localhost:3000
```

---

# Swagger Documentation

Swagger UI is available at:

```
http://localhost:3000/api-docs
```

The documentation provides an interactive interface for testing every endpoint using the **Try it out** feature.

---

# API Endpoints

| HTTP Method | Endpoint | Description |
|-------------|----------|-------------|
| GET | `/` | Returns API information |
| GET | `/health` | Returns server health status |
| GET | `/tasks` | Returns all tasks |
| GET | `/tasks/:id` | Returns a task by ID |
| POST | `/tasks` | Creates a new task |
| PUT | `/tasks/:id` | Updates an existing task |
| DELETE | `/tasks/:id` | Deletes a task |

---

# Example Request

### Create a Task

**Endpoint**

```http
POST /tasks
```

**Request Body**

```json
{
  "title": "Learn Express"
}
```

---

# Example curl Command

```bash
curl -i -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Learn Express"}'
```

### Example Response

```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "Task Created successfully",
  "task": {
    "id": 3,
    "title": "Learn Express",
    "done": false
  }
}
```

---

# HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 404 | Not Found |

---

# Sample Task Object

```json
{
  "id": 1,
  "title": "Learn Express",
  "done": false
}
```

---

# In-Memory Storage

Tasks are stored in an in-memory JavaScript array.

Since no database is used, all tasks are removed whenever the server is restarted. This behavior is intentional and matches the assignment requirements.

---

# Swagger UI Screenshot

Add a screenshot of the Swagger UI after running the application.

Example:

```md
![Swagger UI](docs/Screenshot%202026-07-19%20at%207.40.39 PM.png)
![Swagger UI](docs/Screenshot%202026-07-19%20at%207.40.50 PM.png)
```

Project structure:

```
task-api/
│
├── docs/
│   └── swagger-screenshot.png
```

---

# Future Improvements

- Database integration using MongoDB
- User authentication and authorization
- Pagination
- Search and filtering
- Docker support
- Unit and integration testing

