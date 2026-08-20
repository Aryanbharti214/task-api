require("dotenv").config();

const express = require("express");
const { initDatabase } = require("./db");

require("./config/supabase");

const app = express();
const port = process.env.PORT || 3000;

const taskRoutes = require("./routes/task.routes");
const authRoutes = require("./routes/auth.routes");
const publicRoutes = require("./routes/public.routes");
const protectedRoutes = require("./routes/protected.routes");

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/public", publicRoutes);
app.use("/protected", protectedRoutes);

app.use("/", taskRoutes);

async function startServer() {
    try {
        await initDatabase();

        console.log("Supabase client initialized");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();