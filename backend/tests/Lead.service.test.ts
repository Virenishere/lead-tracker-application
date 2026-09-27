jest.mock("../src/lib/prisma", () => ({
    prisma: {
        lead: {
            findMany: jest.fn(),
            count: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}));

import { prisma } from "../src/lib/prisma";
import * as leadService from "../src/services/lead.service";
import AppError from "../src/utils/AppError";

const mockedPrisma = prisma as unknown as {
    lead: {
        findMany: jest.Mock;
        count: jest.Mock;
        findFirst: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
};

describe("getLeads", () => {
    beforeEach(() => jest.clearAllMocks());

    it("returns leads with pagination metadata", async () => {
        mockedPrisma.lead.findMany.mockResolvedValue([{ id: "1", name: "Jane" }]);
        mockedPrisma.lead.count.mockResolvedValue(1);

        const result = await leadService.getLeads({ userId: "u1" });

        expect(result.leads).toHaveLength(1);
        expect(result.pagination).toMatchObject({ page: 1, limit: 10, total: 1, totalPages: 1 });
    });
});

describe("createLead", () => {
    it("passes the fields straight through to prisma", async () => {
        mockedPrisma.lead.create.mockResolvedValue({ id: "1", name: "Jane" });

        const lead = await leadService.createLead({
            name: "Jane",
            email: "jane@example.com",
            phone: "9876543210",
            userId: "u1",
        });

        expect(mockedPrisma.lead.create).toHaveBeenCalledWith({
            data: { name: "Jane", email: "jane@example.com", phone: "9876543210", userId: "u1" },
        });
        expect(lead.id).toBe("1");
    });
});

describe("getLeadsById", () => {
    it("throws NOT_FOUND when the lead does not belong to the user", async () => {
        mockedPrisma.lead.findFirst.mockResolvedValue(null);

        await expect(leadService.getLeadsById("lead-1", "u1")).rejects.toBeInstanceOf(AppError);
    });
});

describe("deleteLeadsById", () => {
    it("throws NOT_FOUND when the lead does not belong to the user", async () => {
        mockedPrisma.lead.findFirst.mockResolvedValue(null);

        await expect(leadService.deleteLeadsById("lead-1", "u1")).rejects.toBeInstanceOf(AppError);
        expect(mockedPrisma.lead.delete).not.toHaveBeenCalled();
    });

    it("deletes the lead when it belongs to the user", async () => {
        mockedPrisma.lead.findFirst.mockResolvedValue({ id: "lead-1", userId: "u1" });
        mockedPrisma.lead.delete.mockResolvedValue({});

        const result = await leadService.deleteLeadsById("lead-1", "u1");

        expect(mockedPrisma.lead.delete).toHaveBeenCalledWith({ where: { id: "lead-1" } });
        expect(result.message).toMatch(/deleted/i);
    });
});