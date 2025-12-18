import express from "express";
import {
    createTransaction,
    deleteTransaction,
    getTransactions,
    toggleRecurring,
    updateRecurringTransaction,
    updateTransaction,
} from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate, validateParams } from "../middleware/validate.middleware.js";
import {
    createTransactionSchema,
    deleteTransactionParamSchema,
    toggleRecurringParamSchema,
    updateRecurringSchema,
    updateTransactionSchema,
} from "../validators/transaction.validator.js";

const app = express.Router();

app.use(authMiddleware);

app.post("/create-transaction", validate(createTransactionSchema), createTransaction);

app.get("/get-transactions", getTransactions);

app.patch("/update-transaction/:id", validate(updateTransactionSchema), updateTransaction);

app.patch("/update-recurring/:id", validate(updateRecurringSchema), updateRecurringTransaction);

app.patch("/toggle-recurring/:id", validateParams(toggleRecurringParamSchema), toggleRecurring);

app.delete("/delete-transaction/:id", validateParams(deleteTransactionParamSchema), deleteTransaction);

export default app;