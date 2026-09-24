import express from "express";
import cors from "cors"
import helmet from "helmet";
import pinoHttp from "pino-http";

import healthRoutes from "./routes/health.routes";
import userRoutes from "./routes/user.routes";
import leadRoutes from "./routes/lead.routes";
import logger from "./utils/logger";
import { apiRateLimiter } from "./middlewares/rate-limit.middleware";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware";

const app = express();

app.use(cors()); // Adds headers: Access-Control-Allow-Origin: *
app.use(helmet()); // Enable Helmet security headers early in the middleware stack
app.use(express.json(
    {limit: "1mb"}
)); // express built-in middleware function with request size limit of 1mb 


// HTTP request logging
app.use(
    pinoHttp({
        logger,
    })
);

// Global API rate limiting
app.use("/api/v1", apiRateLimiter);

// Health check routes
app.use("/api/v1", healthRoutes);

// Authentication & User management routes
app.use("/api/v1/auth", userRoutes);

// Lead management routes (protected)
app.use("/api/v1/leads", leadRoutes);

// 404 Route Not Found Handler
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
