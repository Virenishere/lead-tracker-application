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

import request from "supertest";
import app from "../src/app";

describe("GET /api/v1/health", () => {
    it("responds with 200 and a status message", async () => {
        const res = await request(app).get("/api/v1/health");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Backend is running");
    });
});