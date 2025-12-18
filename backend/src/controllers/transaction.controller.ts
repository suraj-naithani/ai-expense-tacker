import { Request, Response } from "express";
import { prisma } from "../utils/connection.js";
import { CreateTransactionRequest, TransactionFilters } from "../types/transaction.js";
import { calculateNextExecutionDate } from "../utils/dateCalculator.js";
import { createOneTimeTransaction, createRecurringTemplateWithFirstOccurrence } from "../utils/transactionHelper.js";


export const createTransaction = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const body = req.body as CreateTransactionRequest;

    try {
        const { accountId, categoryId, amount, type, description, isRecurring, recurringInterval } = body;

        const account = await prisma.financialAccount.findFirst({
            where: { id: accountId, userId },
        });

        if (!account) {
            return res.status(400).json({ success: false, message: "Invalid account" });
        }

        if (categoryId) {
            const category = await prisma.category.findFirst({
                where: { id: categoryId, userId },
            });

            if (!category) {
                return res.status(400).json({ success: false, message: "Invalid category" });
            }
        }


        if (isRecurring && recurringInterval) {
            const { template, occurrence } = await createRecurringTemplateWithFirstOccurrence({
                userId,
                accountId,
                categoryId,
                amount,
                type,
                description,
                recurringInterval,
            });

            return res.status(201).json({
                success: true,
                message: "Recurring transaction created successfully",
                data: {
                    template,
                    firstOccurrence: occurrence,
                },
            });
        }

        const transaction = await createOneTimeTransaction({
            userId,
            accountId,
            categoryId,
            amount,
            type,
            description,
        });

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction,
        });
    } catch (error) {
        console.error("Create transaction error:", error);
        return res.status(500).json({ success: false, message: "Failed to create transaction" });
    }
};

export const getTransactions = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;

    try {
        const { page = "1", limit = "10", type, categoryId, accountId, isRecurring } =
            req.query as unknown as TransactionFilters;

        const pageNumber = Math.max(parseInt(page || "1", 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit || "10", 10) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const where: any = {
            userId,
            isRecurring: isRecurring === "false" ? false : isRecurring === "true" ? true : undefined,
        };

        if (type) where.type = type;
        if (categoryId) where.categoryId = categoryId;
        if (accountId) where.accountId = accountId;

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limitNumber,
                select: {
                    id: true,
                    userId: true,
                    amount: true,
                    type: true,
                    description: true,
                    isRecurring: true,
                    recurringInterval: true,
                    nextExecutionDate: true,
                    isActive: true,
                    parentRecurringId: true,
                    createdAt: true,
                    updatedAt: true,
                    account: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            icon: true,
                        },
                    },
                },
            }),
            prisma.transaction.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Transactions fetched successfully",
            data: transactions,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber) || 1,
            },
        });
    } catch (error) {
        console.error("Get transactions error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch transactions" });
    }
};


export const updateTransaction = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const id = req.params.id;
    const body = req.body as CreateTransactionRequest;

    try {
        const existing = await prisma.transaction.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        const updated = await prisma.transaction.update({
            where: { id: existing.id },
            data: {
                type: body.type,
                amount: body.amount,
                description: body.description,
                categoryId: body.categoryId,
                accountId: body.accountId,
                isRecurring: body.isRecurring,
                recurringInterval: body.recurringInterval,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error("Update transaction error:", error);
        return res.status(500).json({ success: false, message: "Failed to update transaction" });
    }
};

export const updateRecurringTransaction = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const id = req.params.id;
    const { isActive, recurringInterval, nextExecutionDate } = req.body as {
        isActive?: boolean;
        recurringInterval?: string;
        nextExecutionDate?: string;
    };

    try {
        const existing = await prisma.transaction.findFirst({
            where: { id, userId, isRecurring: true },
        });

        if (!existing) {
            return res.status(404).json({ success: false, message: "Recurring transaction not found" });
        }

        const data: any = {};

        if (typeof isActive === "boolean") data.isActive = isActive;
        if (recurringInterval) data.recurringInterval = recurringInterval;
        if (nextExecutionDate) {
            data.nextExecutionDate = new Date(nextExecutionDate);
        } else if (recurringInterval && existing.nextExecutionDate) {
            data.nextExecutionDate = calculateNextExecutionDate(
                new Date(existing.nextExecutionDate),
                recurringInterval as any,
            );
        }

        const updated = await prisma.transaction.update({
            where: { id: existing.id },
            data,
        });

        return res.status(200).json({
            success: true,
            message: "Recurring transaction updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error("Update recurring transaction error:", error);
        return res.status(500).json({ success: false, message: "Failed to update recurring transaction" });
    }
};

export const deleteTransaction = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const id = req.params.id;

    try {
        const existing = await prisma.transaction.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        await prisma.transaction.delete({ where: { id: existing.id } });

        return res.status(200).json({ success: true, message: "Transaction deleted successfully" });
    } catch (error) {
        console.error("Delete transaction error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete transaction" });
    }
};

export const toggleRecurring = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const id = req.params.id;

    try {
        const existing = await prisma.transaction.findFirst({
            where: { id, userId, isRecurring: true },
        });

        if (!existing) {
            return res.status(404).json({ success: false, message: "Recurring transaction not found" });
        }

        const newIsActive = !existing.isActive;

        let nextExecutionDate = existing.nextExecutionDate
            ? new Date(existing.nextExecutionDate)
            : new Date();

        if (newIsActive) {
            const now = new Date();
            if (nextExecutionDate <= now && existing.recurringInterval) {
                nextExecutionDate = calculateNextExecutionDate(now, existing.recurringInterval as any);
            }
        }

        const updated = await prisma.transaction.update({
            where: { id: existing.id },
            data: {
                isActive: newIsActive,
                nextExecutionDate,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Recurring transaction toggled successfully",
            data: updated,
        });
    } catch (error) {
        console.error("Toggle recurring transaction error:", error);
        return res.status(500).json({ success: false, message: "Failed to toggle recurring transaction" });
    }
};
