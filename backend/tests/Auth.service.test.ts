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
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../src/lib/prisma";
import { AuthService } from "../src/services/auth.service";
import AppError from "../src/utils/AppError";

const mockedPrisma = prisma as unknown as {
    user: {
        findUnique: jest.Mock;
        findFirst: jest.Mock;
        create: jest.Mock;
        update: jest.Mock;
    };
};

describe("AuthService.register", () => {
    beforeEach(() => jest.clearAllMocks());

    it("throws when the email is already registered", async () => {
        mockedPrisma.user.findUnique.mockResolvedValue({ id: "1" });

        await expect(
            AuthService.register({ name: "Jane", email: "jane@example.com", password: "Passw0rd!" })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("creates a user and returns both tokens on success", async () => {
        mockedPrisma.user.findUnique.mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
        mockedPrisma.user.create.mockResolvedValue({
            id: "1",
            name: "Jane",
            email: "jane@example.com",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        (jwt.sign as jest.Mock).mockReturnValue("signed-token");

        const result = await AuthService.register({
            name: "Jane",
            email: "jane@example.com",
            password: "Passw0rd!",
        });

        expect(result.user.email).toBe("jane@example.com");
        expect(result.accessToken).toBe("signed-token");
        expect(result.refreshToken).toBe("signed-token");
    });
});

describe("AuthService.login", () => {
    beforeEach(() => jest.clearAllMocks());

    it("rejects an unknown email", async () => {
        mockedPrisma.user.findUnique.mockResolvedValue(null);

        await expect(
            AuthService.login({ email: "ghost@example.com", password: "whatever" })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("rejects a wrong password", async () => {
        mockedPrisma.user.findUnique.mockResolvedValue({ id: "1", password: "hashed" });
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(
            AuthService.login({ email: "jane@example.com", password: "wrong" })
        ).rejects.toBeInstanceOf(AppError);
    });

    it("returns the user and tokens on a correct password", async () => {
        mockedPrisma.user.findUnique.mockResolvedValue({
            id: "1",
            name: "Jane",
            email: "jane@example.com",
            password: "hashed",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue("signed-token");

        const result = await AuthService.login({ email: "jane@example.com", password: "Passw0rd!" });

        expect(result.accessToken).toBe("signed-token");
        expect(result.user.email).toBe("jane@example.com");
    });
});