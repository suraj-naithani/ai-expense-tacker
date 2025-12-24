import { z } from "zod";

const amount = z
    .number()
    .positive("Amount must be greater than zero");

const type = z.enum(["EXPENSE", "INCOME"] as const);

const accountId = z
    .string()
    .min(1, "Account is required");

const categoryId = z.string().min(1).optional();

const description = z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or less")
    .optional();

const isRecurring = z.boolean().optional();

const recurringInterval = z
    .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as const)
    .optional();

export const createTransactionSchema = z
    .object({
        accountId,
        categoryId,
        amount,
        type,
        description,
        isRecurring,
        recurringInterval,
    })
    .superRefine((data, ctx) => {
        if (data.isRecurring && !data.recurringInterval) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Recurring interval is required when isRecurring is true",
                path: ["recurringInterval"],
            });
        }
    });

export const deleteTransactionParamSchema = z.object({
    id: z.string(),
});

export const updateRecurringSchema = z
    .object({
        isActive: z.boolean().optional(),
        recurringInterval,
        nextExecutionDate: z.string().datetime().optional(),
    })
    .refine(
        (data) => !!data.isActive || !!data.recurringInterval || !!data.nextExecutionDate,
        {
            message: "At least one field must be provided",
        },
    );

export const updateTransactionSchema = z
    .object({
        accountId: z.string().optional(),
        categoryId: z.string().optional(),
        amount: z.number().optional(),
        type: z.enum(["EXPENSE", "INCOME"] as const).optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
        recurringInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as const).optional(),
    })
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided",
        },
    );

export const toggleRecurringParamSchema = z.object({
    id: z.string(),
});

export const bulkDeleteTransactionsSchema = z.object({
    ids: z.array(z.string().min(1, "Transaction ID cannot be empty")).min(1, "At least one transaction ID is required"),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateRecurringInput = z.infer<typeof updateRecurringSchema>;
