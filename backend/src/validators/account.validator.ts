import { z } from "zod";

const name = z
    .string()
    .trim()
    .min(1, "Account name is required")
    .max(100, "Account name must be 100 characters or less");

const type = z
    .enum(["CURRENT", "SAVINGS", "CREDIT_CARD", "CASH", "INVESTMENT", "OTHER"])
    .default("CURRENT");

const balance = z.coerce.number().default(0);

const isDefault = z.boolean().optional();

export const createAccountSchema = z.object({
    name,
    type,
    balance,
    isDefault,
});

export const updateAccountSchema = createAccountSchema.partial();

export const deleteAccountParamSchema = z.object({
    id: z.string().cuid("Invalid account ID"),
});

export const deleteAccountsSchema = z.object({
    ids: z
        .array(z.string().cuid("Invalid account ID in array"))
        .min(1, "At least one ID is required")
        .max(50, "Cannot delete more than 50 accounts at once"),
});

export const makeDefaultSchema = z.object({});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;