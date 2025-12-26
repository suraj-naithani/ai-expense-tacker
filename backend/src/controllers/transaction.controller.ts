import { Request, Response } from "express";
import moment from "moment";
import { prisma } from "../utils/connection.js";
import { CreateTransactionRequest, TransactionFilters, UpdateTransactionRequest } from "../types/transaction.js";
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
    const body = req.body as UpdateTransactionRequest;

    try {
        const existing = await prisma.transaction.findFirst({
            where: { id, userId },
        });

        if (!existing) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        let nextExecutionDate: Date | undefined;

        if (existing.isRecurring && (body.recurringInterval || (body.isActive === true && existing.isActive === false))) {
            nextExecutionDate = calculateNextExecutionDate(
                new Date(),
                body.recurringInterval || existing.recurringInterval as any,
            );
        }

        const updated = await prisma.transaction.update({
            where: { id: existing.id },
            data: {
                type: body.type,
                amount: body.amount,
                description: body.description,
                categoryId: body.categoryId,
                isActive: body.isActive,
                recurringInterval: body.recurringInterval,
                ...(nextExecutionDate && { nextExecutionDate }),
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

        const updated = await prisma.transaction.update({
            where: { id: existing.id },
            data: {
                isActive: newIsActive,
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

export const bulkDeleteTransactions = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const { ids } = req.body as { ids: string[] };

    try {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Transaction IDs array is required and must not be empty"
            });
        }

        // Directly delete transactions that belong to the user with the given ids
        const result = await prisma.transaction.deleteMany({
            where: {
                id: { in: ids },
                userId,
            },
        });

        // If nothing was deleted, it means none of the IDs belonged to the user
        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                message: "No transactions found with the provided IDs that belong to you"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.count} transaction(s)`,
            data: {
                deletedCount: result.count,
            },
        });
    } catch (error) {
        console.error("Bulk delete transactions error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete transactions"
        });
    }
};

export const getCalendarTransactions = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;

    try {
        const { year, month, accountId } = req.query as {
            year?: string;
            month?: string;
            accountId?: string;
        };

        // Get current date if not provided
        const currentMoment = moment();
        const yearNum = year ? parseInt(year, 10) : currentMoment.year();
        const monthNum = month ? parseInt(month, 10) : currentMoment.month() + 1;

        // Get start and end dates for the month using moment
        const startDate = moment({ year: yearNum, month: monthNum - 1, day: 1 }).startOf("day").toDate();
        const endDate = moment({ year: yearNum, month: monthNum - 1, day: 1 }).endOf("month").toDate();

        const where: any = {
            userId,
            isRecurring: false,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (accountId) where.accountId = accountId;

        // Fetch all transactions for the month
        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                amount: true,
                type: true,
                description: true,
                createdAt: true,
            },
        });

        // Group transactions by date (order is preserved since transactions are sorted by createdAt desc)
        const groupedByDate: Record<string, typeof transactions> = {};
        transactions.forEach((transaction) => {
            const dateKey = moment(transaction.createdAt).format("YYYY-MM-DD");
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = [];
            }
            groupedByDate[dateKey].push(transaction);
        });

        // Calculate daily data
        const dailyData: Array<{
            date: string;
            count: number;
            sum: number;
            latestTransactions: Array<{
                description: string | null;
                amount: number;
                type: string;
            }>;
        }> = [];

        let totalExpense = 0;
        let totalIncome = 0;
        let expenseCount = 0;
        let incomeCount = 0;

        Object.entries(groupedByDate).forEach(([date, dayTransactions]) => {
            // Get 2 latest transactions (already sorted by createdAt desc, so first 2 are latest)
            const latestTransactions = dayTransactions.slice(0, 2).map((t) => ({
                description: t.description,
                amount: t.amount,
                type: t.type,
            }));

            // Calculate daily sum (net: income - expenses) and count
            const daySum = dayTransactions.reduce((sum, t) => {
                return sum + (t.type === "INCOME" ? t.amount : -t.amount);
            }, 0);
            const dayCount = dayTransactions.length;

            // Calculate monthly totals
            dayTransactions.forEach((t) => {
                if (t.type === "INCOME") {
                    totalIncome += t.amount;
                    incomeCount++;
                } else {
                    totalExpense += t.amount;
                    expenseCount++;
                }
            });

            dailyData.push({
                date,
                count: dayCount,
                sum: daySum,
                latestTransactions,
            });
        });

        // Sort daily data by date
        dailyData.sort((a, b) => a.date.localeCompare(b.date));

        // Calculate monthly summary
        const daysWithTransactions = Object.keys(groupedByDate).length;
        const netIncome = totalIncome - totalExpense;
        // Calculate average daily spending (only for days with transactions, rounded to 2 decimals)
        const averageDailySpending = daysWithTransactions > 0
            ? Math.round((totalExpense / daysWithTransactions) * 100) / 100
            : 0;

        return res.status(200).json({
            success: true,
            message: "Calendar transactions fetched successfully",
            data: {
                dailyData,
                monthlySummary: {
                    totalIncome: {
                        amount: totalIncome,
                        count: incomeCount,
                    },
                    totalExpenses: {
                        amount: totalExpense,
                        count: expenseCount,
                    },
                    netIncome,
                    daysWithTransactions,
                    averageDailySpending,
                },
            },
        });
    } catch (error) {
        console.error("Get calendar transactions error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch calendar transactions",
        });
    }
};

export const getDateTransactions = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;

    try {
        const { date, accountId } = req.query as {
            date?: string;
            accountId?: string;
        };

        if (!date) {
            return res.status(400).json({
                success: false,
                message: "Date parameter is required (format: YYYY-MM-DD)",
            });
        }

        // Parse date and create start/end of day using moment
        const dateMoment = moment(date, "YYYY-MM-DD");
        if (!dateMoment.isValid()) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Expected YYYY-MM-DD",
            });
        }
        const startDate = dateMoment.startOf("day").toDate();
        const endDate = dateMoment.endOf("day").toDate();

        const where: any = {
            userId,
            isRecurring: false,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        };

        if (accountId) where.accountId = accountId;

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                userId: true,
                amount: true,
                type: true,
                description: true,
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
        });

        return res.status(200).json({
            success: true,
            message: "Date transactions fetched successfully",
            data: transactions,
        });
    } catch (error) {
        console.error("Get date transactions error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch date transactions",
        });
    }
};

export const getUpcomingRecurringTransactions = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;

    try {
        const now = new Date();

        const upcomingRecurring = await prisma.transaction.findMany({
            where: {
                userId,
                isRecurring: true,
                isActive: true,
                nextExecutionDate: {
                    gte: now,
                },
            },
            orderBy: {
                nextExecutionDate: "asc",
            },
            take: 5,
            select: {
                id: true,
                amount: true,
                type: true,
                description: true,
                nextExecutionDate: true,
                recurringInterval: true,
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
        });

        return res.status(200).json({
            success: true,
            message: "Upcoming recurring transactions fetched successfully",
            data: upcomingRecurring,
        });
    } catch (error) {
        console.error("Get upcoming recurring transactions error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch upcoming recurring transactions",
        });
    }
};