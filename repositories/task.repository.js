const { pool } = require("../db");

async function findAll() {
    const result = await pool.query(
        "SELECT * FROM tasks ORDER BY id"
    );

    return result.rows;
}

async function findById(id) {
    const result = await pool.query(
        "SELECT * FROM tasks WHERE id = $1",
        [id]
    );

    return result.rows[0];
}

async function create(title, done = false) {
    const result = await pool.query(
        `
        INSERT INTO tasks (title, done)
        VALUES ($1, $2)
        RETURNING *
        `,
        [title, done]
    );

    return result.rows[0];
}

async function update(id, title, done) {
    const result = await pool.query(
        `
        UPDATE tasks
        SET title = $1,
            done = $2
        WHERE id = $3
        RETURNING *
        `,
        [title, done, id]
    );

    return result.rows[0];
}

async function deleteById(id) {
    const result = await pool.query(
        "DELETE FROM tasks WHERE id = $1",
        [id]
    );

    return result.rowCount;
}
module.exports = {
    findAll, findById,create,update,deleteById
};