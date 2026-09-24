import { Request, Response, NextFunction } from "express";
import * as leadService from "../services/lead.service";
import AppError from "../utils/AppError";
import { HTTP_STATUS, ERROR_CODES } from "../utils/ErrorList";

export const LeadController = {
    /**
     * Get all leads for the authenticated user with search, filter, sorting, and pagination
     */
    async getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.AUTH_REQUIRED
                );
            }

            const { search, status, sortBy, sortOrder, page, limit } = req.query as any;

            const result = await leadService.getLeads({
                userId: req.user.id,
                search: search ? String(search) : undefined,
                status: status ? (status as any) : undefined,
                sortBy: sortBy ? (sortBy as any) : undefined,
                sortOrder: sortOrder ? (sortOrder as any) : undefined,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined,
            });

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: result.leads,
                pagination: result.pagination,
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get a single lead by ID for the authenticated user
     */
    async getLeadById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.AUTH_REQUIRED
                );
            }

            const leadId = req.params.id as string;
            const lead = await leadService.getLeadsById(leadId, req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: lead,
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Create a new lead for the authenticated user
     */
    async createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.AUTH_REQUIRED
                );
            }

            const { name, email, phone } = req.body;
            const lead = await leadService.createLead({
                name,
                email,
                phone,
                userId: req.user.id,
            });

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: "Lead created successfully",
                data: lead,
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update lead details (name, email, phone) by ID
     */
    async updateLead(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.AUTH_REQUIRED
                );
            }

            const leadId = req.params.id as string;
            const updatedLead = await leadService.updateLeadsById(
                leadId,
                req.user.id,
                req.body
            );

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Lead updated successfully",
                data: updatedLead,
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update lead status by ID
     */
    async updateLeadStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.AUTH_REQUIRED
                );
            }

            const leadId = req.params.id as string;
            const { status } = req.body;

            const updatedLead = await leadService.updateLeadStatus(
                leadId,
                req.user.id,
                status
            );

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: "Lead status updated successfully",
                data: updatedLead,
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Delete a lead by ID
     */
    async deleteLead(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HTTP_STATUS.UNAUTHORIZED,
                    ERROR_CODES.AUTH_REQUIRED
                );
            }

            const leadId = req.params.id as string;
            const result = await leadService.deleteLeadsById(leadId, req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            next(error);
        }
    },
};
