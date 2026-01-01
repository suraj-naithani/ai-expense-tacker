import { Request, Response } from "express";
import { prisma } from "../utils/connection.js";
import { calculateDateRange } from "../utils/statsHelper.js";
import { getTransactionStatsWithComparison, calculatePaymentStats, getTransactionGraphData } from "../services/stats.service.js";
import { TransactionStatsQueryParams, PaymentStatsQueryParams, TransactionGraphQueryParams } from "../types/stats.js";

// Transaction Stats
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

        const responseData = {
            totalBalance: stats.completeTotalBalance, // Complete all-time balance
            totalTransactions: stats.current.totalTransactions, // Monthly
            totalIncome: stats.current.totalIncome, // Monthly
            totalExpenses: stats.current.totalExpenses, // Monthly
            incomeCount: stats.current.incomeCount, // Monthly
            expenseCount: stats.current.expenseCount, // Monthly
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

// Dashboard Stats
export const getDashboardStats = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        // TODO: Implement dashboard stats logic
        res.status(200).json({
            success: true,
            message: "Dashboard stats retrieved successfully",
            data: {},
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch dashboard stats",
        });
    }
};

// Payment Stats
export const getPaymentStats = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const { accountId } = req.query as PaymentStatsQueryParams;

        // Note: Payment model doesn't have accountId field, but we accept it for API consistency
        // accountId is required for consistency with transaction stats API
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

// Report Stats
export const getReportStats = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        // TODO: Implement report stats logic
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

// Transaction Graph Stats
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

