import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { prisma } from "../lib/prisma";
import AppError from "../utils/AppError";
import { HTTP_STATUS, ERROR_CODES } from "../utils/ErrorList";

export interface AuthenticatedUser {
    id: string;
    name: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError(
                "Authentication required. Please provide a valid Bearer token in the Authorization header.",
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_CODES.AUTH_REQUIRED
            );
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new AppError(
                "Authentication token is missing.",
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_CODES.AUTH_REQUIRED
            );
        }

        const decoded = AuthService.verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (!user) {
            throw new AppError(
                "The user belonging to this token no longer exists.",
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_CODES.USER_NOT_FOUND
            );
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
