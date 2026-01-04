import express from "express";
import {
    getDashboardStats,
    getTransactionStats,
    getPaymentStats,
    getReportStats,
    getTransactionGraphStats,
    getIncomeExpenseSavingsStatsController,
    getDailySpendingStatsController,
    getAllAccountsDailySpendingStatsController,
    getCategorySpendingStatsController,
    getAllAccountsCategorySpendingStatsController,
    getAllAccountsYearlyMonthlySpendingStatsController,
    getCategorySpendingDistributionController,
} from "../controllers/stats.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const app = express.Router();

app.use(authMiddleware);

app.get("/transaction", getTransactionStats);

app.get("/transaction/graph", getTransactionGraphStats);

app.get("/income-expense-savings", getIncomeExpenseSavingsStatsController);

app.get("/daily-spending", getDailySpendingStatsController);

app.get("/category-spending", getCategorySpendingStatsController);

app.get("/category-spending-distribution", getCategorySpendingDistributionController);

app.get("/payment", getPaymentStats);

app.get("/report", getReportStats);

app.get("/dashboard", getDashboardStats);

app.get("/dashboard/daily-spending", getAllAccountsDailySpendingStatsController);

app.get("/dashboard/category-spending", getAllAccountsCategorySpendingStatsController);

app.get("/dashboard/yearly-monthly-spending", getAllAccountsYearlyMonthlySpendingStatsController);

export default app;

