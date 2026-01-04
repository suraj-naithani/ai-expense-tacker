import { prisma } from "../utils/connection.js";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { calculatePreviousDateRange, calculatePercentageChange } from "../utils/statsHelper.js";
import { DateRange, TransactionStats, TransactionStatsWithComparison, PaymentStats, MonthlyGraphData, IncomeExpenseSavingsData, DailySpendingData, CategorySpendingData, MonthlySpendingData, CategorySpendingDistributionData } from "../types/stats.js";
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
        completeTotalBalance,
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

    const transactions = await prisma.transaction.findMany({
        where: whereClause,
        select: {
            amount: true,
            type: true,
            createdAt: true,
        },
    });

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

export async function getIncomeExpenseSavingsStats(
    userId: string,
    dateRange: DateRange,
    accountId?: string
): Promise<IncomeExpenseSavingsData> {
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

    const income = incomeStats._sum.amount || 0;
    const expenses = expenseStats._sum.amount || 0;
    const savings = income - expenses;

    const total = income + expenses + savings;

    const incomePercentage = total > 0 ? (income / total) * 100 : 0;
    const expensesPercentage = total > 0 ? (expenses / total) * 100 : 0;
    const savingsPercentage = total > 0 ? (savings / total) * 100 : 0;

    return {
        income: {
            total: income,
            percentage: Math.round(incomePercentage * 100) / 100,
        },
        expenses: {
            total: expenses,
            percentage: Math.round(expensesPercentage * 100) / 100,
        },
        savings: {
            total: savings,
            percentage: Math.round(savingsPercentage * 100) / 100,
        },
    };
}

export async function getDailySpendingStats(
    userId: string,
    accountId?: string
): Promise<DailySpendingData[]> {
    const today = moment().endOf("day").toDate();
    const sixDaysAgo = moment().subtract(6, "days").startOf("day").toDate();

    const whereClause: any = {
        userId,
        isRecurring: false,
        type: "EXPENSE",
        createdAt: {
            gte: sixDaysAgo,
            lte: today,
        },
        ...(accountId && { accountId }),
    };

    const expenses = await prisma.transaction.findMany({
        where: whereClause,
        select: {
            amount: true,
            createdAt: true,
        },
    });

    const dailyMap = expenses.reduce((acc, expense) => {
        const dateKey = moment(expense.createdAt).format("YYYY-MM-DD");
        const dayName = moment(expense.createdAt).format("ddd");

        if (!acc[dateKey]) {
            acc[dateKey] = {
                day: dayName,
                amount: 0,
                date: dateKey,
            };
        }

        acc[dateKey].amount += expense.amount;
        return acc;
    }, {} as Record<string, DailySpendingData>);

    const dailyData: DailySpendingData[] = [];
    for (let i = 6; i >= 0; i--) {
        const targetDate = moment().subtract(i, "days");
        const dateKey = targetDate.format("YYYY-MM-DD");
        const dayName = targetDate.format("ddd");

        const dayData = dailyMap[dateKey] || {
            day: dayName,
            amount: 0,
            date: dateKey,
        };

        dailyData.push(dayData);
    }

    return dailyData;
}

export async function getCategorySpendingStats(
    userId: string,
    accountId?: string
): Promise<CategorySpendingData[]> {
    const startDate = moment().subtract(11, "months").startOf("month").toDate();
    const endDate = moment().endOf("month").toDate();

    const allCategories = await prisma.category.findMany({
        where: { userId },
        select: {
            name: true,
        },
    });

    const categoryNames = new Set<string>(allCategories.map((cat) => cat.name));

    const whereClause: any = {
        userId,
        isRecurring: false,
        type: "EXPENSE",
        categoryId: { not: null },
        ...(accountId && { accountId }),
        createdAt: {
            gte: startDate,
            lte: endDate,
        },
    };

    const expenses = await prisma.transaction.findMany({
        where: whereClause,
        select: {
            amount: true,
            createdAt: true,
            category: {
                select: {
                    name: true,
                },
            },
        },
    });

    const monthlyMap = expenses.reduce((acc, expense) => {
        if (!expense.category?.name) return acc;

        const monthKey = moment(expense.createdAt).format("YYYY-MM");
        const monthLabel = moment(expense.createdAt).format("MMM");
        const categoryName = expense.category.name;

        if (!acc[monthKey]) {
            acc[monthKey] = {
                month: monthLabel,
            } as CategorySpendingData;
            categoryNames.forEach((catName) => {
                (acc[monthKey] as any)[catName] = 0;
            });
        }

        (acc[monthKey] as any)[categoryName] = ((acc[monthKey] as any)[categoryName] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, CategorySpendingData>);

    const categorySpendingData: CategorySpendingData[] = [];
    for (let i = 11; i >= 0; i--) {
        const targetDate = moment().subtract(i, "months");
        const monthKey = targetDate.format("YYYY-MM");
        const monthLabel = targetDate.format("MMM");

        const monthData = monthlyMap[monthKey] || {
            month: monthLabel,
        } as CategorySpendingData;

        categoryNames.forEach((catName) => {
            if (!(catName in monthData)) {
                (monthData as any)[catName] = 0;
            }
        });

        categorySpendingData.push(monthData);
    }

    return categorySpendingData;
}

export async function getYearlyMonthlySpendingStats(
    userId: string,
    accountId?: string
): Promise<MonthlySpendingData[]> {
    const startDate = moment().subtract(11, "months").startOf("month").toDate();
    const endDate = moment().endOf("month").toDate();

    const whereClause: any = {
        userId,
        isRecurring: false,
        type: "EXPENSE",
        createdAt: {
            gte: startDate,
            lte: endDate,
        },
        ...(accountId && { accountId }),
    };

    const expenses = await prisma.transaction.findMany({
        where: whereClause,
        select: {
            amount: true,
            createdAt: true,
        },
    });

    const monthlyMap = expenses.reduce((acc, expense) => {
        const monthKey = moment(expense.createdAt).format("YYYY-MM");
        const monthLabel = moment(expense.createdAt).format("MMM");

        if (!acc[monthKey]) {
            acc[monthKey] = {
                month: monthLabel,
                amount: 0,
            };
        }

        acc[monthKey].amount += expense.amount;
        return acc;
    }, {} as Record<string, MonthlySpendingData>);

    const monthlyData: MonthlySpendingData[] = [];
    for (let i = 11; i >= 0; i--) {
        const targetDate = moment().subtract(i, "months");
        const monthKey = targetDate.format("YYYY-MM");
        const monthLabel = targetDate.format("MMM");

        const monthData = monthlyMap[monthKey] || {
            month: monthLabel,
            amount: 0,
        };

        monthlyData.push(monthData);
    }

    return monthlyData;
}

export async function getCategorySpendingDistribution(
    userId: string,
    accountId: string
): Promise<CategorySpendingDistributionData[]> {
    const startDate = moment().startOf("month").toDate();
    const endDate = moment().endOf("month").toDate();

    const whereClause: any = {
        userId,
        isRecurring: false,
        type: "EXPENSE",
        categoryId: { not: null },
        accountId,
        createdAt: {
            gte: startDate,
            lte: endDate,
        },
    };

    const expenses = await prisma.transaction.findMany({
        where: whereClause,
        select: {
            amount: true,
            category: {
                select: {
                    name: true,
                },
            },
        },
    });

    const categoryMap = expenses.reduce((acc, expense) => {
        if (!expense.category?.name) return acc;

        const categoryName = expense.category.name;
        acc[categoryName] = (acc[categoryName] || 0) + expense.amount;
        return acc;
    }, {} as Record<string, number>);

    const distributionData: CategorySpendingDistributionData[] = Object.entries(categoryMap).map(
        ([categoryName, amount]) => ({
            category: categoryName,
            amount: amount,
        })
    );

    return distributionData;
}
