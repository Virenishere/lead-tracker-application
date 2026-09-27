import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/user.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import logger from "./utils/logger.js";
import { apiRateLimiter } from "./middlewares/rate-limit.middleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

const allowedOrigins = [
    process.env.CORS_ORIGIN,
    "http://localhost:5173",
].filter(Boolean) as string[];

const COOKIE_SECRET = process.env.COOKIE_SECRET || process.env.JWT_REFRESH_SECRET || "lead_tracker_cookie_secret_key";

// Configure CORS for credentials (HttpOnly cookies across origins)
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(helmet());
app.use(cookieParser(COOKIE_SECRET));
app.use(express.json({ limit: "1mb" }));

// HTTP request logging (redact sensitive authorization headers and cookies)
app.use(
    pinoHttp({
        logger,
        redact: {
            paths: [
                "req.headers.authorization",
                "req.headers.cookie",
                "res.headers['set-cookie']",
            ],
            censor: "[REDACTED]",
        },
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
