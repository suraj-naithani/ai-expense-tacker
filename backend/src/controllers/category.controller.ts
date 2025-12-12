import { Request, Response } from "express";
import { prisma } from "../utils/connection.js";

const createCategory = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { name, icon } = req.body;

    try {
        const category = await prisma.category.create({
            data: {
                userId,
                name,
                icon,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        console.error("Create category error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create category",
        });
    }
};

const getCategories = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const categories = await prisma.category.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                icon: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories,
        });
    } catch (error) {
        console.error("Get categories error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
        });
    }
};

const updateCategory = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const categoryId = req.params.id;
    const { name, icon } = req.body;

    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { id: true, userId: true },
        });

        if (!category || category.userId !== userId) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: {
                ...(name && { name }),
                ...(icon && { icon }),
            },
        });

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: updatedCategory,
        });
    } catch (error) {
        console.error("Update category error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update category",
        });
    }
};

const deleteCategory = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const categoryId = req.params.id;

    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { id: true, userId: true },
        });

        if (!category || category.userId !== userId) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        await prisma.category.delete({
            where: { id: categoryId },
        });

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error("Delete category error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete category",
        });
    }
};

export { createCategory, getCategories, updateCategory, deleteCategory };

