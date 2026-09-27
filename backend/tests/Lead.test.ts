jest.mock("../src/lib/prisma", () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    },
}));

jest.mock("../src/middlewares/auth.middleware", () => ({
    authenticate: (req: any, _res: any, next: any) => {
        req.user = { id: "u1", name: "Jane", email: "jane@example.com" };
        next();
    },
}));

jest.mock("../src/services/lead.service", () => ({
    getLeads: jest.fn(),
    getLeadsById: jest.fn(),
    createLead: jest.fn(),
    updateLeadsById: jest.fn(),
    updateLeadStatus: jest.fn(),
    deleteLeadsById: jest.fn(),
}));

import request from "supertest";
import app from "../src/app";
import * as leadService from "../src/services/lead.service";
import AppError from "../src/utils/AppError";
import { HTTP_STATUS, ERROR_CODES } from "../src/utils/ErrorList";

const mockedService = leadService as jest.Mocked<typeof leadService>;

describe("GET /api/v1/leads", () => {
    it("returns the paginated list of leads", async () => {
        mockedService.getLeads.mockResolvedValue({
            leads: [{ id: "1", name: "Jane" } as any],
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
        });

        const res = await request(app).get("/api/v1/leads");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveLength(1);
    });
});

describe("GET /api/v1/leads/:id", () => {
    it("returns a single lead", async () => {
        mockedService.getLeadsById.mockResolvedValue({ id: "1", name: "Jane" } as any);

        const res = await request(app).get("/api/v1/leads/1");

        expect(res.status).toBe(200);
        expect(res.body.data.id).toBe("1");
    });
});

describe("POST /api/v1/leads", () => {
    it("rejects an invalid payload before it reaches the service", async () => {
        const res = await request(app)
            .post("/api/v1/leads")
            .send({ name: "", email: "bad", phone: "1" });

        expect(res.status).toBe(400);
        expect(mockedService.createLead).not.toHaveBeenCalled();
    });

    it("creates a lead with a valid payload", async () => {
        mockedService.createLead.mockResolvedValue({ id: "1", name: "Jane" } as any);

        const res = await request(app).post("/api/v1/leads").send({
            name: "Jane",
            email: "jane@example.com",
            phone: "9876543210",
        });

        expect(res.status).toBe(201);
        expect(res.body.data.id).toBe("1");
    });
});

describe("PATCH /api/v1/leads/:id/status", () => {
    it("rejects an invalid status value", async () => {
        const res = await request(app)
            .patch("/api/v1/leads/1/status")
            .send({ status: "NOT_A_REAL_STATUS" });

        expect(res.status).toBe(400);
        expect(mockedService.updateLeadStatus).not.toHaveBeenCalled();
    });

    it("updates the status with a valid value", async () => {
        mockedService.updateLeadStatus.mockResolvedValue({ id: "1", status: "CONTACTED" } as any);

        const res = await request(app)
            .patch("/api/v1/leads/1/status")
            .send({ status: "CONTACTED" });

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe("CONTACTED");
    });
});

describe("DELETE /api/v1/leads/:id", () => {
    it("returns 404 when the service reports the lead is missing", async () => {
        mockedService.deleteLeadsById.mockRejectedValue(
            new AppError("Lead not found", HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND)
        );

        const res = await request(app).delete("/api/v1/leads/missing-id");

        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe("NOT_FOUND");
    });

    it("deletes a lead successfully", async () => {
        mockedService.deleteLeadsById.mockResolvedValue({ message: "Lead deleted successfully" });

        const res = await request(app).delete("/api/v1/leads/1");

        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/deleted/i);
    });
});