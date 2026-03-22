import express from "express";
import cors from "cors";
import v1Routes from "./app/routes/v1/index.js";
import { errorHandler } from "./app/middleware/error.middleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", v1Routes);

// Global Error Handler
app.use(errorHandler);

export default app;
