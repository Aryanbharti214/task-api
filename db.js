const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "tasks.db");

const db = new Database(dbPath);

// Create table if it does not already exist
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT 0 CHECK (done IN (0, 1))
    )
`);

// Check whether the table is empty
const row = db
    .prepare("SELECT COUNT(*) AS count FROM tasks")
    .get();

// Seed only when there are no tasks
if (row.count === 0) {
    const insertTask = db.prepare(
        "INSERT INTO tasks (title, done) VALUES (?, ?)"
    );

    insertTask.run("task1", 0);
    insertTask.run("task2", 1);
    insertTask.run("task3", 1);

    console.log("Database seeded with example tasks");
}

module.exports = db;