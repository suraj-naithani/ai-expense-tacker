import { Request, Response } from "express";
import { calculatePaymentStats, getCategorySpendingDistribution, getCategorySpendingStats, getDailySpendingStats, getIncomeExpenseSavingsStats, getTransactionGraphData, getTransactionStatsWithComparison, getYearlyMonthlySpendingStats } from "../services/stats.service.js";
import { DailySpendingQueryParams, IncomeExpenseSavingsQueryParams, PaymentStatsQueryParams, TransactionGraphQueryParams, TransactionStatsQueryParams } from "../types/stats.js";
import { calculateDateRange, calculatePercentageChange } from "../utils/statsHelper.js";

export const getTransactionStats = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const {
            timeRange = "monthly",
            startDate: customStartDate,
            endDate: customEndDate,
            accountId,
        } = req.query as TransactionStatsQueryParams;

        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "accountId is required",
            });
        }

        let dateRange;
        try {
            dateRange = calculateDateRange(
                timeRange || "monthly",
                customStartDate,
                customEndDate
            );
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Invalid date range parameters",
            });
        }

        const stats = await getTransactionStatsWithComparison(userId, dateRange, accountId);

        const periodSavings = stats.current.totalIncome - stats.current.totalExpenses;

        const responseData = {
            totalBalance: stats.completeTotalBalance,
            periodSavings: periodSavings,
            totalTransactions: stats.current.totalTransactions,
            totalIncome: stats.current.totalIncome,
            totalExpenses: stats.current.totalExpenses,
            incomeCount: stats.current.incomeCount,
            expenseCount: stats.current.expenseCount,
            comparisons: stats.comparisons,
            periods: stats.periods,
            timeRange: timeRange || "monthly",
        };

        res.status(200).json({
            success: true,
            message: "Transaction stats retrieved successfully",
            data: responseData,
        });
    } catch (error: any) {
        console.error("Get transaction stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch transaction stats",
        });
    }
};

export const getDashboardStats = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const dateRange = calculateDateRange("monthly");

        const stats = await getTransactionStatsWithComparison(userId, dateRange);

        const monthlySavings = stats.current.totalIncome - stats.current.totalExpenses;
        const previousMonthlySavings = stats.previous.totalIncome - stats.previous.totalExpenses;

        const currentSavingsRate = stats.current.totalIncome > 0
            ? (monthlySavings / stats.current.totalIncome) * 100
            : 0;
        const previousSavingsRate = stats.previous.totalIncome > 0
            ? (previousMonthlySavings / stats.previous.totalIncome) * 100
            : 0;

        const savingsRateChange = calculatePercentageChange(currentSavingsRate, previousSavingsRate);

        const responseData = {
            totalBalance: {
                amount: stats.completeTotalBalance,
                change: stats.comparisons.totalBalance.change,
                type: stats.comparisons.totalBalance.type,
            },
            monthlyIncome: {
                amount: stats.current.totalIncome,
                change: stats.comparisons.totalIncome.change,
                type: stats.comparisons.totalIncome.type,
            },
            monthlyExpense: {
                amount: stats.current.totalExpenses,
                change: stats.comparisons.totalExpenses.change,
                type: stats.comparisons.totalExpenses.type,
            },
            savingsRate: {
                percentage: Math.round(currentSavingsRate * 100) / 100,
                change: savingsRateChange.change,
                type: savingsRateChange.type,
            },
        };

        res.status(200).json({
            success: true,
            message: "Dashboard stats retrieved successfully",
            data: responseData,
        });
    } catch (error: any) {
        console.error("Get dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch dashboard stats",
        });
    }
};

export const getPaymentStats = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const { accountId } = req.query as PaymentStatsQueryParams;

        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "accountId is required",
            });
        }

        const stats = await calculatePaymentStats(userId);

        res.status(200).json({
            success: true,
            message: "Payment stats retrieved successfully",
            data: stats,
        });
    } catch (error: any) {
        console.error("Get payment stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch payment stats",
        });
    }
};

export const getReportStats = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        res.status(200).json({
            success: true,
            message: "Report stats retrieved successfully",
            data: {},
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch report stats",
        });
    }
};

export const getTransactionGraphStats = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const { accountId } = req.query as TransactionGraphQueryParams;

        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "accountId is required",
            });
        }

        const graphData = await getTransactionGraphData(userId, accountId);

        res.status(200).json({
            success: true,
            message: "Transaction graph stats retrieved successfully",
            data: graphData,
        });
    } catch (error: any) {
        console.error("Get transaction graph stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch transaction graph stats",
        });
    }
};

export const getIncomeExpenseSavingsStatsController = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const {
            timeRange = "monthly",
            startDate: customStartDate,
            endDate: customEndDate,
            accountId,
        } = req.query as IncomeExpenseSavingsQueryParams;

        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "accountId is required",
            });
        }

        let dateRange;
        try {
            dateRange = calculateDateRange(
                timeRange || "monthly",
                customStartDate,
                customEndDate
            );
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message || "Invalid date range parameters",
            });
        }

        const stats = await getIncomeExpenseSavingsStats(userId, dateRange, accountId);

        res.status(200).json({
            success: true,
            message: "Income, expense, and savings stats retrieved successfully",
            data: stats,
        });
    } catch (error: any) {
        console.error("Get income expense savings stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch income expense savings stats",
        });
    }
};

export const getDailySpendingStatsController = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const { accountId } = req.query as DailySpendingQueryParams;

        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "accountId is required",
            });
        }

        const dailySpending = await getDailySpendingStats(userId, accountId);

        res.status(200).json({
            success: true,
            message: "Daily spending stats retrieved successfully",
            data: dailySpending,
        });
    } catch (error: any) {
        console.error("Get daily spending stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch daily spending stats",
        });
    }
};

export const getAllAccountsDailySpendingStatsController = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const dailySpending = await getDailySpendingStats(userId);

        res.status(200).json({
            success: true,
            message: "Daily spending stats for all accounts retrieved successfully",
            data: dailySpending,
        });
    } catch (error: any) {
        console.error("Get all accounts daily spending stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch daily spending stats for all accounts",
        });
    }
};

export const getCategorySpendingStatsController = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const { accountId } = req.query as { accountId?: string };

        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "accountId is required",
            });
        }

        const categorySpending = await getCategorySpendingStats(userId, accountId);

        res.status(200).json({
            success: true,
            message: "Category spending stats retrieved successfully",
            data: categorySpending,
        });
    } catch (error: any) {
        console.error("Get category spending stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch category spending stats",
        });
    }
};

export const getAllAccountsCategorySpendingStatsController = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const categorySpending = await getCategorySpendingStats(userId);

        res.status(200).json({
            success: true,
            message: "Category spending stats for all accounts retrieved successfully",
            data: categorySpending,
        });
    } catch (error: any) {
        console.error("Get all accounts category spending stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch category spending stats for all accounts",
        });
    }
};

export const getAllAccountsYearlyMonthlySpendingStatsController = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const monthlySpending = await getYearlyMonthlySpendingStats(userId);

        res.status(200).json({
            success: true,
            message: "Yearly monthly spending stats for all accounts retrieved successfully",
            data: monthlySpending,
        });
    } catch (error: any) {
        console.error("Get all accounts yearly monthly spending stats error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch yearly monthly spending stats for all accounts",
        });
    }
};

export const getCategorySpendingDistributionController = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const { accountId } = req.query as { accountId?: string };

        if (!accountId) {
            return res.status(400).json({
                success: false,
                message: "accountId is required",
            });
        }

        const distribution = await getCategorySpendingDistribution(userId, accountId);

        res.status(200).json({
            success: true,
            message: "Category spending distribution retrieved successfully",
            data: distribution,
        });
    } catch (error: any) {
        console.error("Get category spending distribution error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch category spending distribution",
        });
    }
};

