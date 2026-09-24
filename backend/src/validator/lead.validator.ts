import {z} from "zod";

export const createLeadValidator = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.number(),
    status: z.boolean(),
});


// Name, Email, Phone, Status, Created At