export default class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor(
        message: string,
        statusCode: number = 500,
        errorCode: string = "INTERNAL_SERVER_ERROR",
        details?: any
    ) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = "AppError";
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;
        this.details = details;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}