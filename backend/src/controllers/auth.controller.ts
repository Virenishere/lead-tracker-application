import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import AppError from "../utils/AppError";
import { HTTP_STATUS, ERROR_CODES } from "../utils/ErrorList";

const isProduction = process.env.NODE_ENV === "production";

const ACCESS_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    maxAge: 15 * 60 * 1000, // 15 minutes
    path: "/",
    signed: true,
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ("none" as const) : ("lax" as const),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/api/v1/auth",
    signed: true,
};

export const AuthController = {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { user, accessToken, refreshToken } = await AuthService.register(req.body);

            // Set both tokens in HttpOnly Cookies
            res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
            res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: "User registered successfully",
                data: {
                    user,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { user, accessToken, refreshToken } = await AuthService.login(req.body);

            // Set both tokens in HttpOnly Cookies
            res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
            res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Login successful",
                data: {
                    user,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const refreshToken = req.signedCookies?.refreshToken || req.cookies?.refreshToken;

            if (!refreshToken) {
                throw new AppError(
                    "Refresh token cookie is missing. Please log in again.",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.REFRESH_TOKEN_REQUIRED
                );
            }

            const { user, accessToken, refreshToken: newRefreshToken } = await AuthService.refreshAccessToken(refreshToken);

            // Update both HttpOnly Cookies
            res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
            res.cookie("refreshToken", newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: {
                    user,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                path: "/",
            });

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                path: "/api/v1/auth",
            });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Logged out successfully",
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