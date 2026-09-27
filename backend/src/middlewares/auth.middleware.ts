import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { prisma } from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS, ERROR_CODES } from "../utils/ErrorList.js";

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
        let token: string | undefined =
            req.signedCookies?.accessToken || req.cookies?.accessToken;

        // Fallback to Bearer token header if cookie is absent
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            throw new AppError(
                "Authentication required. Please log in.",
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
