import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import AppError from "../utils/AppError";
import { HTTP_STATUS, ERROR_CODES } from "../utils/ErrorList";
import logger from "../utils/logger";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode: number = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    let errorCode: string = err.errorCode || ERROR_CODES.INTERNAL_SERVER_ERROR;
    let message: string = err.message || "An unexpected error occurred on the server.";
    let details: any = err.details || undefined;

    // Handle AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        errorCode = err.errorCode;
        message = err.message;
        details = err.details;
    }
    // Handle Zod Error
    else if (err instanceof ZodError) {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        errorCode = ERROR_CODES.VALIDATION_ERROR;
        message = "Validation error";
        details = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }));
    }
    // Handle Prisma Errors
    else if (err?.name === "PrismaClientValidationError") {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        errorCode = ERROR_CODES.VALIDATION_ERROR;
        message = "Invalid database query parameters.";
    }
    else if (err?.code && typeof err.code === "string" && err.code.startsWith("P")) {
        statusCode = HTTP_STATUS.BAD_REQUEST;
        errorCode = ERROR_CODES.DATABASE_ERROR;

        if (err.code === "P2002") {
            statusCode = HTTP_STATUS.CONFLICT;
            errorCode = ERROR_CODES.USER_ALREADY_EXISTS;
            const target = err.meta?.target ? ` (${(err.meta.target as string[]).join(", ")})` : "";
            message = `A record with this field already exists${target}.`;
        } else if (err.code === "P2025") {
            statusCode = HTTP_STATUS.NOT_FOUND;
            errorCode = ERROR_CODES.NOT_FOUND;
            message = "Requested database record was not found.";
        } else {
            message = "Database operation error.";
        }
    }
    // Handle JWT errors
    else if (err.name === "JsonWebTokenError") {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        errorCode = ERROR_CODES.INVALID_TOKEN;
        message = "Invalid authentication token.";
    } else if (err.name === "TokenExpiredError") {
        statusCode = HTTP_STATUS.UNAUTHORIZED;
        errorCode = ERROR_CODES.TOKEN_EXPIRED;
        message = "Authentication token has expired.";
    }

    // Log error details using Pino logger
    logger.error({
        statusCode,
        errorCode,
        message,
        details,
        path: req.originalUrl,
        method: req.method,
        stack: err.stack,
    });

    res.status(statusCode).json({
        success: false,
        error: {
            code: errorCode,
            message,
            ...(details !== undefined && { details }),
        },
    });
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
    const error = new AppError(
        `Route not found: ${req.method} ${req.originalUrl}`,
        HTTP_STATUS.NOT_FOUND,
        ERROR_CODES.ROUTE_NOT_FOUND
    );
    next(error);
};