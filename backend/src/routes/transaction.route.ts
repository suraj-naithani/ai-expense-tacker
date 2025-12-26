import express from "express";
import {
    bulkDeleteTransactions,
    createTransaction,
    deleteTransaction,
    getTransactions,
    toggleRecurring,
    updateTransaction,
    getCalendarTransactions,
    getDateTransactions,
    getUpcomingRecurringTransactions,
} from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate, validateParams } from "../middleware/validate.middleware.js";
import {
    bulkDeleteTransactionsSchema,
    createTransactionSchema,
    deleteTransactionParamSchema,
    toggleRecurringParamSchema,
    updateTransactionSchema,
} from "../validators/transaction.validator.js";

const app = express.Router();

app.use(authMiddleware);

app.post("/create-transaction", validate(createTransactionSchema), createTransaction);

app.get("/get-transactions", getTransactions);

app.patch("/update-transaction/:id", validate(updateTransactionSchema), updateTransaction);

app.patch("/toggle-recurring/:id", validateParams(toggleRecurringParamSchema), toggleRecurring);

app.delete("/delete-transaction/:id", validateParams(deleteTransactionParamSchema), deleteTransaction);

app.delete("/bulk-delete-transactions", validate(bulkDeleteTransactionsSchema), bulkDeleteTransactions);

app.get("/calendar", getCalendarTransactions);

app.get("/date", getDateTransactions);

app.get("/upcoming-recurring", getUpcomingRecurringTransactions);

export default app;