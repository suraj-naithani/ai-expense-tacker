import { z } from "zod";

const amount = z
    .number()
    .positive("Amount must be greater than zero");

const personName = z
    .string()
    .min(1, "Person name is required")
    .max(100, "Person name must be 100 characters or less");

const type = z.enum(["LENT", "BORROWED"] as const);

const status = z.enum(["PENDING", "PAID", "OVERDUE"] as const);

const description = z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or less")
    .optional();

const dueDate = z.string().datetime().optional();

export const createPaymentSchema = z.object({
    amount,
    personName,
    type,
    description,
    dueDate,
    status: status.optional(),
});

export const updatePaymentSchema = z
    .object({
        amount,
        personName,
        type,
        description,
        dueDate,
        status,
    })
    .partial()
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field must be provided",
        },
    );

export const updatePaymentStatusSchema = z.object({
    status,
});

export const deletePaymentParamSchema = z.object({
    id: z.string(),
});

export const bulkDeletePaymentsSchema = z.object({
    ids: z.array(z.string().min(1, "Payment ID cannot be empty")).min(1, "At least one payment ID is required"),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type UpdatePaymentStatusInput = z.infer<typeof updatePaymentStatusSchema>;

