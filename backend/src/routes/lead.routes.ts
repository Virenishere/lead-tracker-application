import { Router } from "express";
import { LeadController } from "../controllers/lead.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
    createLeadValidator,
    updateLeadValidator,
    updateLeadStatusValidator,
    getLeadsQueryValidator,
} from "../validator/lead.validator";

const router = Router();

// Protect all lead endpoints with JWT authentication middleware
router.use(authenticate);

// GET /api/v1/leads - List all leads for logged-in user (with search, filter, pagination)
router.get(
    "/",
    validate({ query: getLeadsQueryValidator }),
    LeadController.getLeads
);

// POST /api/v1/leads - Create a new lead
router.post(
    "/",
    validate(createLeadValidator),
    LeadController.createLead
);

// GET /api/v1/leads/:id - Get a single lead by ID
router.get(
    "/:id",
    LeadController.getLeadById
);

// PATCH /api/v1/leads/:id - Update lead details (name, email, phone)
router.patch(
    "/:id",
    validate(updateLeadValidator),
    LeadController.updateLead
);

// PATCH /api/v1/leads/:id/status - Update lead status
router.patch(
    "/:id/status",
    validate(updateLeadStatusValidator),
    LeadController.updateLeadStatus
);

// DELETE /api/v1/leads/:id - Delete a lead
router.delete(
    "/:id",
    LeadController.deleteLead
);

export default router;
