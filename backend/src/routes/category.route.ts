import express from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate, validateParams } from "../middleware/validate.middleware.js";
import { createCategorySchema, deleteCategoryParamSchema, updateCategorySchema } from "../validators/category.validator.js";

const app = express.Router();

app.use(authMiddleware);

app.post("/create-category", validate(createCategorySchema), createCategory);

app.get("/get-category", getCategories);

app.patch("/update-category/:id", validate(updateCategorySchema), updateCategory);

app.delete("/delete-category/:id", validateParams(deleteCategoryParamSchema), deleteCategory);

export default app;

