const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

async function initDatabase() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            done BOOLEAN NOT NULL DEFAULT FALSE
        )
    `);

    const result = await pool.query(
        "SELECT COUNT(*) FROM tasks"
    );

    const count = Number(result.rows[0].count);

    if (count === 0) {
        await pool.query(`
            INSERT INTO tasks (title, done)
            VALUES
                ($1, $2),
                ($3, $4),
                ($5, $6)
        `, [
            "task1", false,
            "task2", true,
            "task3", true
        ]);

        console.log("Database seeded with example tasks");
    }

    console.log("PostgreSQL connected");
}

module.exports = {
    pool,
    initDatabase
};