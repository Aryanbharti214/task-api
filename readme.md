# Task API

A RESTful CRUD API built with **Node.js, Express.js, PostgreSQL, and Docker**.

This project was developed as part of the **FlyRank Backend AI Engineering Internship**.

The project demonstrates how the same API can evolve through multiple storage implementations without changing the API contract:

```text
A1: In-memory JavaScript array
            ↓
A2: SQLite database
            ↓
A3: PostgreSQL + Docker
```

The current version runs both the **Node.js API** and **PostgreSQL database** using Docker Compose.

```text
Client
   ↓
Express API
   ↓
Controller
   ↓
Repository
   ↓
PostgreSQL
   ↓
Docker Volume
```

The complete application stack can be started using one command:

```bash
docker compose up --build
```

---

## Features

* Create tasks
* Retrieve all tasks
* Retrieve a task by ID
* Update existing tasks
* Delete tasks
* PostgreSQL database storage
* PostgreSQL running inside Docker
* Node.js API running inside Docker
* Docker Compose multi-container setup
* Persistent database storage using Docker volumes
* Automatic database table creation
* Automatic seed data on first run
* Repository-based database layer
* Parameterized SQL queries
* Input validation
* Proper HTTP status codes
* Environment-based configuration
* Swagger UI API documentation
* Health check endpoint
* PostgreSQL database inspection using `psql`

---

# Technology Stack

* Node.js
* Express.js
* PostgreSQL 17
* `pg` / node-postgres
* Docker
* Docker Compose
* Swagger UI Express
* OpenAPI 3.0

---

# Project Structure

```text
task-api/
│
├── controllers/
│   └── task.controller.js
│
├── repositories/
│   └── task.repository.js
│
├── routes/
│   └── task.routes.js
│
├── docs/
│   ├── postgres-database.png
│   ├── sqlite-db-browser.png
│   └── swagger-screenshot.png
│
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── compose.yaml
├── db.js
├── Dockerfile
├── package.json
├── package-lock.json
├── server.js
├── swagger.json
└── readme.md
```

The existing `tasks.db` file belongs to the previous SQLite implementation from A2 and is no longer used by the current PostgreSQL version.

---

# Architecture

## A1 — In-Memory Storage

The original version stored tasks inside a JavaScript array.

```text
Client
   ↓
Express API
   ↓
JavaScript Array
```

Data disappeared whenever the Node.js process restarted.

---

## A2 — SQLite

The second version replaced the in-memory array with SQLite.

```text
Client
   ↓
Express API
   ↓
SQLite
   ↓
tasks.db
```

The API endpoints remained unchanged while tasks became persistent.

---

## A3 — PostgreSQL + Docker

The current version uses PostgreSQL as a separate database server.

```text
Client
   ↓
localhost:3000
   ↓
Docker
┌──────────────────────────────┐
│                              │
│   API Container              │
│   Node.js + Express          │
│          ↓                   │
│   Controller                 │
│          ↓                   │
│   Repository                 │
│          ↓                   │
│   pg Pool                    │
│          ↓                   │
│       db:5432                │
│          ↓                   │
│   PostgreSQL Container       │
│          ↓                   │
│   Docker Volume              │
│                              │
└──────────────────────────────┘
```

The API behavior remains the same.

Only the storage implementation changed.

This demonstrates an important backend engineering principle:

> Storage is an implementation detail behind the API contract.

---

# Repository Layer

Database-specific SQL is kept inside:

```text
repositories/task.repository.js
```

The request flow is:

```text
HTTP Request
     ↓
Route
     ↓
Controller
     ↓
Repository
     ↓
PostgreSQL
```

Controllers handle:

* Request validation
* HTTP status codes
* Response formatting

The repository handles:

* SQL queries
* PostgreSQL interaction
* Database results

This prevents database-specific logic from being mixed directly into HTTP controllers.

---

# Prerequisites

You only need:

* Git
* Docker Desktop

You do **not** need to install PostgreSQL or Node.js locally when running the complete Docker stack.

---

# Environment Configuration

Real environment values are stored in:

```text
.env
```

The `.env` file is excluded from Git.

A safe configuration template is provided through:

```text
.env.example
```

Example:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=dev
POSTGRES_DB=tasks
PORT=3000
```

When running Node.js directly on the host during development, the local database URL may be:

```env
DATABASE_URL=postgres://postgres:dev@localhost:5433/tasks
```

Inside Docker Compose, the API communicates with PostgreSQL using the Docker service name:

```text
db:5432
```

instead of `localhost`.

---

# Run the Project

## 1. Clone the repository

```bash
git clone https://github.com/Aryanbharti214/task-api.git
```

## 2. Enter the project

```bash
cd task-api
```

## 3. Create the environment file

```bash
cp .env.example .env
```

## 4. Start the complete stack

```bash
docker compose up --build
```

Docker Compose starts:

```text
api
 └── Node.js + Express

db
 └── PostgreSQL 17
```

The API becomes available at:

```text
http://localhost:3000
```

No manual database setup is required.

---

# Docker Compose

The project contains two services:

```text
api
db
```

The `api` service is built using the project's `Dockerfile`.

The `db` service runs PostgreSQL 17.

The API communicates with PostgreSQL through Docker's internal network:

```text
api
 ↓
db:5432
 ↓
PostgreSQL
```

The database does not need to expose PostgreSQL port `5432` directly to the host machine.

---

# Docker Volume

PostgreSQL data is stored in a Docker named volume.

```text
PostgreSQL Container
        ↓
Docker Volume
        ↓
taskdata
```

Containers can be destroyed and recreated while the database rows remain available.

---

# Automatic Database Setup

When the API starts, `db.js` connects to PostgreSQL using `DATABASE_URL`.

The application automatically creates the `tasks` table when it does not already exist.

The table contains:

| Column  | Type    | Description       |
| ------- | ------- | ----------------- |
| `id`    | SERIAL  | Primary key       |
| `title` | TEXT    | Task title        |
| `done`  | BOOLEAN | Completion status |

Conceptually:

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT FALSE
);
```

---

# Automatic Seed Data

The application checks whether the `tasks` table is empty.

If no tasks exist, three example tasks are inserted.

Example:

```text
task1
task2
task3
```

The seed only runs when the table is empty.

Therefore restarting the application does not continuously duplicate the sample data.

---

# API Endpoints

| Method | Endpoint     | Description         | Success |
| ------ | ------------ | ------------------- | ------- |
| GET    | `/`          | API information     | `200`   |
| GET    | `/health`    | Server health       | `200`   |
| GET    | `/tasks`     | Retrieve all tasks  | `200`   |
| GET    | `/tasks/:id` | Retrieve task by ID | `200`   |
| POST   | `/tasks`     | Create a task       | `201`   |
| PUT    | `/tasks/:id` | Update a task       | `200`   |
| DELETE | `/tasks/:id` | Delete a task       | `204`   |

---

# API Usage

## Get All Tasks

```bash
curl -i http://localhost:3000/tasks
```

Example response:

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "message": "All Tasks",
  "taskList": [
    {
      "id": 1,
      "title": "task1",
      "done": false
    },
    {
      "id": 2,
      "title": "task2",
      "done": true
    },
    {
      "id": 3,
      "title": "task3",
      "done": true
    }
  ]
}
```

---

## Get Task by ID

```bash
curl -i http://localhost:3000/tasks/1
```

Example response:

```json
{
  "task": {
    "id": 1,
    "title": "task1",
    "done": false
  }
}
```

If the task does not exist:

```http
HTTP/1.1 404 Not Found
```

```json
{
  "error": "Task not found"
}
```

---

## Create Task

```bash
curl -i \
  -X POST \
  http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Docker Compose"}'
```

Example response:

```http
HTTP/1.1 201 Created
```

```json
{
  "message": "Task Created successfully",
  "task": {
    "id": 4,
    "title": "Learn Docker Compose",
    "done": false
  }
}
```

PostgreSQL creates the new ID and returns the inserted row using:

```sql
INSERT INTO tasks (title, done)
VALUES ($1, $2)
RETURNING *;
```

---

## Update Task

```bash
curl -i \
  -X PUT \
  http://localhost:3000/tasks/4 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
```

Example response:

```json
{
  "message": "task updated successfully",
  "task": {
    "id": 4,
    "title": "Learn Docker Compose",
    "done": true
  }
}
```

---

## Delete Task

```bash
curl -i \
  -X DELETE \
  http://localhost:3000/tasks/4
```

Successful deletion returns:

```http
HTTP/1.1 204 No Content
```

A `204` response contains no response body.

---

# Input Validation

The API validates incoming data before interacting with PostgreSQL.

Creating a task with an empty or missing title returns:

```http
HTTP/1.1 400 Bad Request
```

Example invalid request:

```bash
curl -i \
  -X POST \
  http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{}'
```

Requests for resources that do not exist return:

```http
HTTP/1.1 404 Not Found
```

---

# HTTP Status Codes

| Status | Meaning                        |
| ------ | ------------------------------ |
| `200`  | Request completed successfully |
| `201`  | Resource successfully created  |
| `204`  | Resource successfully deleted  |
| `400`  | Invalid request                |
| `404`  | Task not found                 |
| `500`  | Internal server/database error |

---

# Parameterized SQL Queries

All user-controlled values are passed separately from SQL statements.

For example:

```javascript
const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1",
    [id]
);
```

Instead of unsafe string interpolation such as:

```javascript
pool.query(
    `SELECT * FROM tasks WHERE id = ${id}`
);
```

PostgreSQL's numbered placeholders are used:

```text
$1
$2
$3
```

For example:

```javascript
await pool.query(
    `
    UPDATE tasks
    SET title = $1,
        done = $2
    WHERE id = $3
    `,
    [title, done, id]
);
```

This keeps SQL structure separate from user-provided values.

---

# PostgreSQL Queries Used

## Retrieve Every Task

```sql
SELECT * FROM tasks ORDER BY id;
```

## Retrieve One Task

```sql
SELECT * FROM tasks
WHERE id = $1;
```

## Insert Task

```sql
INSERT INTO tasks (title, done)
VALUES ($1, $2)
RETURNING *;
```

## Update Task

```sql
UPDATE tasks
SET title = $1,
    done = $2
WHERE id = $3
RETURNING *;
```

## Delete Task

```sql
DELETE FROM tasks
WHERE id = $1;
```

---

# Inspect PostgreSQL

The PostgreSQL database can be inspected directly from the running Compose service.

```bash
docker compose exec db psql -U postgres -d tasks
```

Inside `psql`, list tables:

```sql
\dt
```

View the stored tasks:

```sql
SELECT * FROM tasks;
```

Exit:

```sql
\q
```

---

# PostgreSQL Database Screenshot

The screenshot below shows the `tasks` table running inside the PostgreSQL Docker container.

![PostgreSQL Database](./docs/postgres-database.png)

---

# Swagger Documentation

Interactive API documentation is available at:

```text
http://localhost:3000/api-docs
```

Swagger UI can be used to inspect and test the API endpoints directly.

![Swagger UI](./docs/swagger-screenshot.png)

---

# Persistence Test

Docker volume persistence can be verified manually.

## 1. Create a task

```bash
curl -i \
  -X POST \
  http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Docker persistence test"}'
```

## 2. Stop and remove the Compose containers

```bash
docker compose down
```

## 3. Start the stack again

```bash
docker compose up
```

## 4. Retrieve tasks

```bash
curl http://localhost:3000/tasks
```

The previously created task still exists.

The reason is:

```text
Containers removed
       ↓
Docker volume remains
       ↓
PostgreSQL container recreated
       ↓
Existing database data restored
```

---

# Important Docker Volume Behavior

This command keeps the named volume:

```bash
docker compose down
```

This command removes the volume:

```bash
docker compose down -v
```

Using `-v` deletes the PostgreSQL data and causes the application to initialize a fresh database the next time it starts.

---

# Clean Clone Test

A clean machine should be able to run the complete application without manually installing PostgreSQL.

```bash
git clone https://github.com/Aryanbharti214/task-api.git
cd task-api

cp .env.example .env

docker compose up --build
```

Then:

```bash
curl -i http://localhost:3000/tasks
```

The application should:

1. Build the Node.js API image.
2. Start PostgreSQL.
3. Create the `tasks` table.
4. Insert three example tasks if the database is empty.
5. Start the Express API.
6. Serve the API on port `3000`.

No manual SQL setup is required.

---

# Storage Evolution

The same API has now used three different persistence strategies.

```text
A1
Client
  ↓
Express
  ↓
JavaScript Array


A2
Client
  ↓
Express
  ↓
SQLite
  ↓
tasks.db


A3
Client
  ↓
Express
  ↓
Repository
  ↓
PostgreSQL
  ↓
Docker Volume
```

Throughout these changes, the main API routes remained:

```text
GET    /tasks
GET    /tasks/:id
POST   /tasks
PUT    /tasks/:id
DELETE /tasks/:id
```

This demonstrates that clients should depend on the API contract rather than the underlying storage implementation.

---

# Docker Development Flow

The complete stack is managed with Docker Compose.

Start:

```bash
docker compose up
```

Start and rebuild the API image:

```bash
docker compose up --build
```

Check running services:

```bash
docker compose ps
```

Stop the stack:

```bash
docker compose down
```

View API logs:

```bash
docker compose logs api
```

View database logs:

```bash
docker compose logs db
```

Open PostgreSQL:

```bash
docker compose exec db psql -U postgres -d tasks
```

---

# Git Commit Stages

A3 was developed stage by stage.

```text
Stage 0: Postgres in Docker + gitignore
Stage 1: connect via env and create table
Stage 2: read from Postgres
Stage 3: full CRUD on Postgres
Stage 4: docker-compose the whole stack
Stage 5: one-command stack + docs
```

The staged development process makes each infrastructure and storage change independently testable.

---

# What I Learned

Through this assignment I practiced:

* Docker images and containers
* PostgreSQL as a database server
* Docker volumes
* Docker networking
* Docker Compose
* Dockerfiles
* Environment variables
* `.env` and `.env.example`
* PostgreSQL connection strings
* `node-postgres` / `pg`
* PostgreSQL connection pooling
* Asynchronous database operations
* Repository architecture
* Parameterized SQL queries
* SQL `SELECT`
* SQL `INSERT`
* SQL `UPDATE`
* SQL `DELETE`
* PostgreSQL `RETURNING`
* Database seeding
* Persistent container storage
* Multi-container application architecture
* Reproducible development environments

The most important observation is that the API contract remained stable while the storage implementation changed.

```text
Memory
   ↓
SQLite
   ↓
PostgreSQL
```

The client does not need to know where the data is stored.

---

# Previous SQLite Version

The repository still contains screenshots and development history from the previous SQLite assignment.

The A2 version used:

```text
better-sqlite3
tasks.db
DB Browser for SQLite
```

The current A3 application uses:

```text
pg
PostgreSQL
Docker
Docker Compose
```

The SQLite assets are retained only to document the project's evolution.

---

# Future Improvements

* PostgreSQL-backed `/health` check using `SELECT 1`
* Docker Compose database health checks
* Automated integration tests
* Unit tests for controllers and repositories
* Database migrations
* Pagination
* Filtering by completion status
* Search
* `created_at` and `updated_at` timestamps
* Structured error handling middleware
* Logging
* Authentication and authorization
* CI/CD pipeline
* Production Docker image optimization
* Redis caching


1. A user signs up or logs in through the Express API.
2. Express forwards the credentials to Supabase Auth.
3. Supabase validates the credentials and returns an access token and refresh token.
4. The client sends the access token as:

   Authorization: Bearer <token>

5. authMiddleware extracts the JWT.
6. The middleware verifies it using Supabase auth.getUser(token).
7. A valid user's information is attached to req.user.
8. The protected controller executes only after successful authentication.