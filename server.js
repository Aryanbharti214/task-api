const express = require("express");
const { initDatabase } = require("./db");

const app = express();
const port = process.env.PORT || 3000;

const taskRoutes = require("./routes/task.routes");

app.use(express.json());
app.use("/", taskRoutes);

async function startServer() {
    try {
        await initDatabase();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();