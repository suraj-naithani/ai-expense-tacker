import { Request, Response } from "express";
import { prisma } from "../utils/connection.js";

const createAccount = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { name, type, balance, isDefault } = req.body;

    try {
        const accountCount = await prisma.financialAccount.count({
            where: { userId },
        });

        const makeDefault = isDefault === true || accountCount === 0;

        if (makeDefault) {
            await prisma.financialAccount.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        const account = await prisma.financialAccount.create({
            data: {
                userId,
                name,
                type,
                balance,
                isDefault: makeDefault,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            data: account,
        });
    } catch (error) {
        console.error("Create account error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create account",
        });
    }
}

const getAccounts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;

        const accounts = await prisma.financialAccount.findMany({
            where: { userId },
            orderBy: [
                { isDefault: "desc" },
                { createdAt: "desc" },
            ],
            select: {
                id: true,
                name: true,
                type: true,
                balance: true,
                isDefault: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Accounts fetched successfully",
            data: accounts,
        });
    } catch (error) {
        console.error("Get accounts error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch accounts",
        });
    }
}

const updateAccount = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const accountId = req.params.id;
    const { name, type, balance, isDefault } = req.body;

    try {
        const account = await prisma.financialAccount.findUnique({
            where: { id: accountId },
            select: { id: true, userId: true, isDefault: true },
        });

        if (!account || account.userId !== userId) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        if (isDefault === true) {
            await prisma.financialAccount.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        const updatedAccount = await prisma.financialAccount.update({
            where: { id: accountId },
            data: {
                name,
                type,
                balance,
                isDefault: isDefault ?? account.isDefault,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Account updated successfully",
            data: updatedAccount,
        });
    } catch (error) {
        console.error("Update account error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update account",
        });
    }
};

const deleteAccount = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const accountId = req.params.id;

    try {
        const account = await prisma.financialAccount.findUnique({
            where: { id: accountId },
            select: { id: true, userId: true, isDefault: true },
        });

        if (!account || account.userId !== userId) {
            return res.status(404).json({
                success: false,
                message: "Account not found",
            });
        }

        await prisma.financialAccount.delete({
            where: { id: accountId },
        });

        if (account.isDefault) {
            await prisma.financialAccount.updateMany({
                where: { userId },
                data: { isDefault: true },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Delete account error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete account",
        });
    }
};

export { createAccount, getAccounts, updateAccount, deleteAccount };