import express from "express";
import {
    bulkDeletePayments,
    createPayment,
    deletePayment,
    getPayments,
    updatePayment,
    updatePaymentStatus,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate, validateParams } from "../middleware/validate.middleware.js";
import {
    bulkDeletePaymentsSchema,
    createPaymentSchema,
    deletePaymentParamSchema,
    updatePaymentSchema,
    updatePaymentStatusSchema,
} from "../validators/payment.validator.js";

const app = express.Router();

app.use(authMiddleware);

app.post("/create-payment", validate(createPaymentSchema), createPayment);

app.get("/get-payments", getPayments);

app.patch("/update-payment/:id", validate(updatePaymentSchema), updatePayment);

app.patch("/update-payment-status/:id", validateParams(deletePaymentParamSchema), validate(updatePaymentStatusSchema), updatePaymentStatus);

app.delete("/delete-payment/:id", validateParams(deletePaymentParamSchema), deletePayment);

app.delete("/bulk-delete-payments", validate(bulkDeletePaymentsSchema), bulkDeletePayments);

export default app;

