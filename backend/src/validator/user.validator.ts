import { z } from "zod";

export const registerUserSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Name is required" })
        .max(100, { message: "Name cannot exceed 100 characters" }),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(50, { message: "Password cannot exceed 50 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});

// Alias for backward compatibility
export const createUserValidator = registerUserSchema;

export const loginUserSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" }),

    password: z
        .string()
        .min(1, { message: "Password is required" }),
});

export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, { message: "Current password is required" }),

    newPassword: z
        .string()
        .min(8, { message: "New password must be at least 8 characters long" })
        .max(50, { message: "New password cannot exceed 50 characters" })
        .regex(/[A-Z]/, { message: "New password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "New password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "New password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "New password must contain at least one special character" }),
});

export const updateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: "Name cannot be empty" })
        .max(100, { message: "Name cannot exceed 100 characters" })
        .optional(),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email({ message: "Invalid email address" })
        .optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;