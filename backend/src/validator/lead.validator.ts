import { z } from "zod";
import { LeadStatus } from "../generated/prisma/enums";

export const createLeadValidator = z.object({
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

    phone: z
        .string()
        .trim()
        .min(10, { message: "Phone number must be at least 10 characters" })
        .max(15, { message: "Phone number cannot exceed 15 characters" }),
});

export const updateLeadValidator = z.object({
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

    phone: z
        .string()
        .trim()
        .min(10, { message: "Phone number must be at least 10 characters" })
        .max(15, { message: "Phone number cannot exceed 15 characters" })
        .optional(),
});

export const updateLeadStatusValidator = z.object({
    status: z.nativeEnum(LeadStatus, {
        message: "Invalid lead status. Must be NEW, CONTACTED, QUALIFIED, CONVERTED, or LOST.",
    }),
});

export const getLeadsQueryValidator = z.object({
    search: z.string().trim().optional().transform((val) => (val === "" ? undefined : val)),
    status: z.preprocess(
        (val) => (val === "" || val === "ALL" ? undefined : val),
        z.nativeEnum(LeadStatus).optional()
    ),
    sortBy: z.enum(["name", "email", "createdAt", "updatedAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type createType = z.infer<typeof createLeadValidator>;
export type updateType = z.infer<typeof updateLeadValidator>;
export type updateStatusType = z.infer<typeof updateLeadStatusValidator>;
export type getLeadsQueryType = z.infer<typeof getLeadsQueryValidator>;