import { prisma } from "../utils/connection.js";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { calculatePreviousDateRange, calculatePercentageChange } from "../utils/statsHelper.js";
import { DateRange, TransactionStats, TransactionStatsWithComparison, PaymentStats, MonthlyGraphData } from "../types/stats.js";
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

/**
 * Calculate complete total balance (all-time) for a user/account
 * Optimized to use a single aggregation query
 */
async function calculateCompleteTotalBalance(
    userId: string,
    accountId?: string
): Promise<number> {
    const whereClause: any = {
        userId,
        isRecurring: false,
        ...(accountId && { accountId }),
    };

    const [incomeStats, expenseStats] = await Promise.all([
        prisma.transaction.aggregate({
            where: {
                ...whereClause,
                type: "INCOME",
            },
            _sum: {
                amount: true,
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
        }),
    ]);

    const totalIncome = incomeStats._sum.amount || 0;
    const totalExpenses = expenseStats._sum.amount || 0;
    return totalIncome - totalExpenses;
}

export async function getTransactionStatsWithComparison(
    userId: string,
    currentRange: DateRange,
    accountId?: string
): Promise<TransactionStatsWithComparison & { completeTotalBalance: number }> {
    const previousRange = calculatePreviousDateRange(currentRange);

    // Calculate all stats in parallel for optimal performance
    const [currentStats, previousStats, completeTotalBalance] = await Promise.all([
        calculateTransactionStats(userId, currentRange, accountId),
        calculateTransactionStats(userId, previousRange, accountId),
        calculateCompleteTotalBalance(userId, accountId),
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
        completeTotalBalance, // All-time total balance
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

export async function getTransactionGraphData(
    userId: string,
    accountId?: string
): Promise<MonthlyGraphData[]> {
    // Calculate date range for last 12 months
    const startDate = moment().subtract(11, "months").startOf("month").toDate();
    const endDate = moment().endOf("month").toDate();

    const whereClause: any = {
        userId,
        isRecurring: false,
        createdAt: {
            gte: startDate,
            lte: endDate,
        },
        ...(accountId && { accountId }),
    };

    // Single Prisma query to fetch all transactions
    const transactions = await prisma.transaction.findMany({
        where: whereClause,
        select: {
            amount: true,
            type: true,
            createdAt: true,
        },
    });

    // Use reduce to group by month and aggregate - more efficient than forEach
    const monthlyMap = transactions.reduce((acc, transaction) => {
        const monthKey = moment(transaction.createdAt).format("YYYY-MM");
        const monthLabel = moment(transaction.createdAt).format("MMM");

        if (!acc[monthKey]) {
            acc[monthKey] = { income: 0, expense: 0, monthLabel };
        }

        if (transaction.type === "INCOME") {
            acc[monthKey].income += transaction.amount;
        } else if (transaction.type === "EXPENSE") {
            acc[monthKey].expense += transaction.amount;
        }

        return acc;
    }, {} as Record<string, { income: number; expense: number; monthLabel: string }>);

    // Generate all 12 months with proper ordering
    const monthlyData: MonthlyGraphData[] = [];
    for (let i = 11; i >= 0; i--) {
        const targetDate = moment().subtract(i, "months");
        const monthKey = targetDate.format("YYYY-MM");
        const monthData = monthlyMap[monthKey] || {
            income: 0,
            expense: 0,
            monthLabel: targetDate.format("MMM")
        };

        monthlyData.push({
            month: monthData.monthLabel,
            income: monthData.income,
            expense: monthData.expense,
            savings: monthData.income - monthData.expense,
        });
    }

    return monthlyData;
}

