import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import AppError from "../utils/AppError";
import { HTTP_STATUS, ERROR_CODES } from "../utils/ErrorList";

interface ValidationTargets {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

export const validate = (schema: ZodSchema | ValidationTargets) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if ("safeParse" in schema && typeof schema.safeParse === "function") {
                req.body = await schema.parseAsync(req.body);
            } else {
                const targets = schema as ValidationTargets;

                if (targets.body) {
                    req.body = await targets.body.parseAsync(req.body);
                }
                if (targets.query) {
                    const parsedQuery = (await targets.query.parseAsync(req.query)) as Record<string, any>;
                    for (const key of Object.keys(req.query)) {
                        delete (req.query as any)[key];
                    }
                    Object.assign(req.query, parsedQuery);
                }
                if (targets.params) {
                    const parsedParams = (await targets.params.parseAsync(req.params)) as Record<string, any>;
                    for (const key of Object.keys(req.params)) {
                        delete (req.params as any)[key];
                    }
                    Object.assign(req.params, parsedParams);
                }
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }));

                const appError = new AppError(
                    "Validation failed",
                    HTTP_STATUS.BAD_REQUEST,
                    ERROR_CODES.VALIDATION_ERROR,
                    formattedErrors
                );
                return next(appError);
            }
            next(error);
        }
    };
};