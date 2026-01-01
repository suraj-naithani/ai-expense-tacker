import express from "express";
import {
    getDashboardStats,
    getTransactionStats,
    getPaymentStats,
    getReportStats,
    getTransactionGraphStats,
    getIncomeExpenseSavingsStatsController,
    getDailySpendingStatsController,
} from "../controllers/stats.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const app = express.Router();

app.use(authMiddleware);

app.get("/transaction", getTransactionStats);

app.get("/transaction/graph", getTransactionGraphStats);

app.get("/income-expense-savings", getIncomeExpenseSavingsStatsController);

app.get("/daily-spending", getDailySpendingStatsController);

app.get("/payment", getPaymentStats);

app.get("/report", getReportStats);

// Dashboard stats route
app.get("/dashboard", getDashboardStats);

export default app;

