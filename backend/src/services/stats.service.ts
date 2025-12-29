import { prisma } from "../utils/connection.js";
import { Prisma } from "@prisma/client";
import { calculatePreviousDateRange, calculatePercentageChange } from "../utils/statsHelper.js";
import { DateRange, TransactionStats, TransactionStatsWithComparison, PaymentStats } from "../types/stats.js";
import { PaymentStatus } from "../types/payment.js";

export async function calculateTransactionStats(
    userId: string,
    dateRange: DateRange,
    accountId?: string
): Promise<TransactionStats> {
    const { startDate, endDate } = dateRange;

    const whereClause: any = {
        userId,
        isRecurring: false,
        createdAt: {
            gte: startDate,
            lte: endDate,
        },
        ...(accountId && { accountId }),
    };

    const [incomeStats, expenseStats, totalCount] = await Promise.all([
        prisma.transaction.aggregate({
            where: {
                ...whereClause,
                type: "INCOME",
            },
            _sum: {
                amount: true,
            },
            _count: {
                id: true,
            },
        }),
        prisma.transaction.aggregate({
            where: {
                ...whereClause,
                type: "EXPENSE",
            },
            _sum: {
                amount: true,
            },
            _count: {
                id: true,
            },
        }),
        prisma.transaction.count({
            where: whereClause,
        }),
    ]);

    const totalIncome = incomeStats._sum.amount || 0;
    const totalExpenses = expenseStats._sum.amount || 0;
    const incomeCount = incomeStats._count.id || 0;
    const expenseCount = expenseStats._count.id || 0;
    const totalBalance = totalIncome - totalExpenses;

    return {
        totalBalance,
        totalTransactions: totalCount,
        totalIncome,
        totalExpenses,
        incomeCount,
        expenseCount,
    };
}

export async function getTransactionStatsWithComparison(
    userId: string,
    currentRange: DateRange,
    accountId?: string
): Promise<TransactionStatsWithComparison> {
    const previousRange = calculatePreviousDateRange(currentRange);
    const [currentStats, previousStats] = await Promise.all([
        calculateTransactionStats(userId, currentRange, accountId),
        calculateTransactionStats(userId, previousRange, accountId),
    ]);

    const balanceComparison = calculatePercentageChange(
        currentStats.totalBalance,
        previousStats.totalBalance
    );
    const transactionComparison = calculatePercentageChange(
        currentStats.totalTransactions,
        previousStats.totalTransactions
    );
    const incomeComparison = calculatePercentageChange(
        currentStats.totalIncome,
        previousStats.totalIncome
    );
    const expenseComparison = calculatePercentageChange(
        currentStats.totalExpenses,
        previousStats.totalExpenses
    );

    return {
        current: currentStats,
        previous: previousStats,
        comparisons: {
            totalBalance: balanceComparison,
            totalTransactions: transactionComparison,
            totalIncome: incomeComparison,
            totalExpenses: expenseComparison,
        },
        periods: {
            current: {
                start: currentRange.startDate.toISOString(),
                end: currentRange.endDate.toISOString(),
            },
            previous: {
                start: previousRange.startDate.toISOString(),
                end: previousRange.endDate.toISOString(),
            },
        },
    };
}

export async function calculatePaymentStats(
    userId: string
): Promise<PaymentStats> {
    const whereClause: Prisma.PaymentWhereInput = {
        userId,
        status: {
            in: ["PENDING", "OVERDUE"] as PaymentStatus[],
        },
    };

    const [unpaidLentStats, unpaidBorrowedStats, activeCount] = await Promise.all([
        prisma.payment.aggregate({
            where: {
                ...whereClause,
                type: "LENT",
            },
            _sum: {
                amount: true,
            },
        }),
        prisma.payment.aggregate({
            where: {
                ...whereClause,
                type: "BORROWED",
            },
            _sum: {
                amount: true,
            },
        }),
        prisma.payment.count({
            where: whereClause,
        }),
    ]);

    const unpaidLent = unpaidLentStats._sum?.amount || 0;
    const unpaidBorrowed = unpaidBorrowedStats._sum?.amount || 0;
    const activePaymentsCount = activeCount;
    const netBalance = unpaidLent - unpaidBorrowed;

    return {
        unpaidLent,
        unpaidBorrowed,
        activePaymentsCount,
        netBalance,
    };
}

