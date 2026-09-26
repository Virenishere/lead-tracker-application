import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import AppError from "../utils/AppError";
import { HTTP_STATUS, ERROR_CODES } from "../utils/ErrorList";
import {
    RegisterUserInput,
    LoginUserInput,
    ChangePasswordInput,
    UpdateProfileInput,
} from "../validator/user.validator";

const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "default_access_secret_key_change_me_in_prod";
const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || "default_refresh_secret_key_change_me_in_prod";

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export interface JwtPayload {
    userId: string;
    email: string;
}

export class AuthService {
    /**
     * Register a new user
     */
    static async register(data: RegisterUserInput) {
        const { name, email, password } = data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new AppError(
                "A user with this email address already exists",
                HTTP_STATUS.CONFLICT,
                ERROR_CODES.USER_ALREADY_EXISTS
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const accessToken = this.generateAccessToken({ userId: user.id, email: user.email });
        const refreshToken = this.generateRefreshToken({ userId: user.id, email: user.email });

        return { user, accessToken, refreshToken };
    }

    /**
     * Login user with email and password
     */
    static async login(data: LoginUserInput) {
        const { email, password } = data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError(
                "Invalid email or password",
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_CODES.INVALID_CREDENTIALS
            );
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw new AppError(
                "Invalid email or password",
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_CODES.INVALID_CREDENTIALS
            );
        }

        const accessToken = this.generateAccessToken({ userId: user.id, email: user.email });
        const refreshToken = this.generateRefreshToken({ userId: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Refresh access token using HttpOnly refresh token
     */
    static async refreshAccessToken(token: string) {
        const decoded = this.verifyRefreshToken(token);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
        });

        if (!user) {
            throw new AppError(
                "User no longer exists",
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_CODES.USER_NOT_FOUND
            );
        }

        const newAccessToken = this.generateAccessToken({ userId: user.id, email: user.email });
        const newRefreshToken = this.generateRefreshToken({ userId: user.id, email: user.email });

        return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
    }

    /**
     * Get user profile by userId
     */
    static async getProfile(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new AppError(
                "User not found",
                HTTP_STATUS.NOT_FOUND,
                ERROR_CODES.USER_NOT_FOUND
            );
        }

        return user;
    }

    /**
     * Update user profile
     */
    static async updateProfile(userId: string, data: UpdateProfileInput) {
        const { name, email } = data;

        if (email) {
            const existing = await prisma.user.findFirst({
                where: { email, NOT: { id: userId } },
            });
            if (existing) {
                throw new AppError(
                    "This email is already in use by another account",
                    HTTP_STATUS.CONFLICT,
                    ERROR_CODES.USER_ALREADY_EXISTS
                );
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name && { name }),
                ...(email && { email }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return updatedUser;
    }

    /**
     * Change user password
     */
    static async changePassword(userId: string, data: ChangePasswordInput) {
        const { currentPassword, newPassword } = data;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new AppError(
                "User not found",
                HTTP_STATUS.NOT_FOUND,
                ERROR_CODES.USER_NOT_FOUND
            );
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            throw new AppError(
                "Incorrect current password",
                HTTP_STATUS.BAD_REQUEST,
                ERROR_CODES.INVALID_CREDENTIALS
            );
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        return { message: "Password updated successfully" };
    }

    /**
     * Generate short-lived Access Token (15m)
     */
    static generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload, JWT_ACCESS_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN as any,
        });
    }

    /**
     * Generate long-lived Refresh Token (7d)
     */
    static generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN as any,
        });
    }

    /**
     * Verify Access Token
     */
    static verifyAccessToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, JWT_ACCESS_SECRET) as unknown as JwtPayload;
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                throw new AppError(
                    "Access token has expired",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.TOKEN_EXPIRED
                );
            }
            throw new AppError(
                "Invalid access token",
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_CODES.INVALID_TOKEN
            );
        }
    }

    /**
     * Verify Refresh Token
     */
    static verifyRefreshToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET) as unknown as JwtPayload;
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                throw new AppError(
                    "Refresh token has expired. Please log in again.",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.REFRESH_TOKEN_EXPIRED
                );
            }
            throw new AppError(
                "Invalid refresh token",
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_CODES.INVALID_REFRESH_TOKEN
            );
        }
    }

    // Backward compatibility helper
    static generateToken(payload: JwtPayload): string {
        return this.generateAccessToken(payload);
    }

    static verifyToken(token: string): JwtPayload {
        return this.verifyAccessToken(token);
    }
}