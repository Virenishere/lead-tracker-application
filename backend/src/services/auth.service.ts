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

const JWT_SECRET = process.env.JWT_SECRET || "lead_tracker_jwt_secret_key_change_in_prod";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

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

        const token = this.generateToken({ userId: user.id, email: user.email });

        return { user, token };
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

        const token = this.generateToken({ userId: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            token,
        };
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
     * Helper to generate JWT token
     */
    static generateToken(payload: JwtPayload): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN as any,
        });
    }

    /**
     * Helper to verify JWT token
     */
    static verifyToken(token: string): JwtPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as JwtPayload;
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                throw new AppError(
                    "Authentication token has expired. Please log in again.",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.TOKEN_EXPIRED
                );
            }
            throw new AppError(
                "Invalid authentication token",
                HTTP_STATUS.UNAUTHORIZED,
                ERROR_CODES.INVALID_TOKEN
            );
        }
    }
}