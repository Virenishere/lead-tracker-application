import {
    createLeadValidator,
    updateLeadStatusValidator,
    getLeadsQueryValidator,
} from "../src/validator/lead.validator";

describe("createLeadValidator", () => {
    it("accepts a valid lead and lowercases the email", () => {
        const result = createLeadValidator.safeParse({
            name: "Jane Doe",
            email: "JANE@Example.com",
            phone: "9876543210",
        });

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.email).toBe("jane@example.com");
        }
    });

    it("rejects an invalid email", () => {
        const result = createLeadValidator.safeParse({
            name: "Jane Doe",
            email: "not-an-email",
            phone: "9876543210",
        });

        expect(result.success).toBe(false);
    });

    it("rejects a phone number that is too short", () => {
        const result = createLeadValidator.safeParse({
            name: "Jane Doe",
            email: "jane@example.com",
            phone: "123",
        });

        expect(result.success).toBe(false);
    });

    it("rejects an empty name", () => {
        const result = createLeadValidator.safeParse({
            name: "",
            email: "jane@example.com",
            phone: "9876543210",
        });

        expect(result.success).toBe(false);
    });
});

describe("updateLeadStatusValidator", () => {
    it("rejects a status that is not part of the enum", () => {
        const result = updateLeadStatusValidator.safeParse({ status: "MADE_UP" });
        expect(result.success).toBe(false);
    });
});

describe("getLeadsQueryValidator", () => {
    it("applies defaults when no query params are provided", () => {
        const result = getLeadsQueryValidator.parse({});
        expect(result).toMatchObject({
            sortBy: "createdAt",
            sortOrder: "desc",
            page: 1,
            limit: 10,
        });
    });

    it("coerces page and limit from query strings", () => {
        const result = getLeadsQueryValidator.parse({ page: "3", limit: "25" });
        expect(result.page).toBe(3);
        expect(result.limit).toBe(25);
    });

    it("treats an empty search string as undefined", () => {
        const result = getLeadsQueryValidator.parse({ search: "" });
        expect(result.search).toBeUndefined();
    });
});