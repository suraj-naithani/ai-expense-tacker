import "./config/env.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { corsOptions } from "./constants/config.js";
import { auth } from "./utils/auth.js";
import rateLimit from "express-rate-limit";
import { connectDB } from "./utils/connection.js";

import accountRoute from "./routes/account.route.js";
import categoryRoute from "./routes/category.route.js";
import transactionRoute from "./routes/transaction.route.js";
import paymentRoute from "./routes/payment.route.js";
import statsRoute from "./routes/stats.route.js";
import { startRecurringTransactionsCron } from "./cron/recurringTransactions.cron.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.get("/", (req, res) => {
    res.send("🚀 Server is running successfully!");
});

app.use("/api/v1/accounts", accountRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/transactions", transactionRoute);
app.use("/api/v1/payments", paymentRoute);
app.use("/api/v1/stats", statsRoute);

connectDB().then(() => {
    // Start cron after DB connection is ready
    startRecurringTransactionsCron();

    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
});
