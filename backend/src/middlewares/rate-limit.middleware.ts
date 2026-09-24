import rateLimit from "express-rate-limit";
import { HTTP_STATUS, ERROR_CODES } from "../utils/ErrorList";

export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // 100 requests per IP per 15 minutes
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
            success: false,
            error: {
                code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
                message: "Too many requests from this IP, please try again after 15 minutes.",
            },
        });
    },
});

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 15, // 15 auth attempts (login/register) per IP per 15 minutes
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
            success: false,
            error: {
                code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
                message: "Too many authentication attempts, please try again after 15 minutes.",
            },
        });
    },
});