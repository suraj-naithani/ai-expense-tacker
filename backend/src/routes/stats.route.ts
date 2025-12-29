import express from "express";
import {
    getDashboardStats,
    getTransactionStats,
    getPaymentStats,
    getReportStats,
} from "../controllers/stats.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const app = express.Router();

app.use(authMiddleware);

app.get("/transaction", getTransactionStats);

// Dashboard stats route
app.get("/dashboard", getDashboardStats);

// Payment stats route
app.get("/payment", getPaymentStats);

// Report stats route
app.get("/report", getReportStats);

export default app;

