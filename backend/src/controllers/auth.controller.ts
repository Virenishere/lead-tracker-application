import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import AppError from "../utils/AppError";
import { HTTP_STATUS, ERROR_CODES } from "../utils/ErrorList";

export const AuthController = {
    
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await AuthService.register(req.body);
            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: "User registered successfully",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await AuthService.login(req.body);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Login successful",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.AUTH_REQUIRED
                );
            }

            const profile = await AuthService.getProfile(req.user.id);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: profile,
            });
        } catch (error) {
            next(error);
        }
    },

    async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.AUTH_REQUIRED
                );
            }

            const updatedProfile = await AuthService.updateProfile(req.user.id, req.body);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Profile updated successfully",
                data: updatedProfile,
            });
        } catch (error) {
            next(error);
        }
    },

    async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.AUTH_REQUIRED
                );
            }

            const result = await AuthService.changePassword(req.user.id, req.body);
            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    },
};