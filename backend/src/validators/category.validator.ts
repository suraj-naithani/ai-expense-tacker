import { z } from "zod";

const name = z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name must be 100 characters or less");

const icon = z
    .string()
    .trim()
    .min(1, "Icon is required")
    .max(10, "Icon must be 10 characters or less");

export const createCategorySchema = z.object({
    name,
    icon,
});

export const updateCategorySchema = createCategorySchema.partial();

export const deleteCategoryParamSchema = z.object({
    id: z.string(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

