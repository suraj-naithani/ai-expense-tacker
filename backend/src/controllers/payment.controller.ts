import { Request, Response } from "express";
import { prisma } from "../utils/connection.js";
import { CreatePaymentRequest, PaymentFilters, UpdatePaymentRequest } from "../types/payment.js";

export const createPayment = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const body = req.body as CreatePaymentRequest;

    try {
        const { amount, personName, type, description, dueDate, status } = body;

        const payment = await prisma.payment.create({
            data: {
                userId,
                amount,
                personName,
                type,
                description: description || undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                status: status || "PENDING",
            },
        });

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment,
        });
    } catch (error) {
        console.error("Create payment error:", error);
        return res.status(500).json({ success: false, message: "Failed to create payment" });
    }
};

export const getPayments = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;

    try {
        const { page = "1", limit = "10", type, status } = req.query as unknown as PaymentFilters;

        const pageNumber = Math.max(parseInt(page || "1", 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit || "10", 10) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const where: any = {
            userId,
        };

        if (type) where.type = type;
        if (status) where.status = status;

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limitNumber,
            }),
            prisma.payment.count({ where }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Payments fetched successfully",
            data: payments,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber) || 1,
            },
        });
    } catch (error) {
        console.error("Get payments error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch payments" });
    }
};

export const updatePayment = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const id = req.params.id;
    const body = req.body as UpdatePaymentRequest;

    try {
        if (body.status !== undefined) {
            const existingPayment = await prisma.payment.findFirst({
                where: { id, userId },
            });

            if (!existingPayment) {
                return res.status(404).json({ success: false, message: "Payment not found" });
            }

            if (existingPayment.status === "PAID" && (body.status === "PENDING" || body.status === "OVERDUE")) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot change status of paid payment to pending or overdue",
                });
            }
        }

        const updateData: any = {};
        if (body.amount !== undefined) updateData.amount = body.amount;
        if (body.personName !== undefined) updateData.personName = body.personName;
        if (body.type !== undefined) updateData.type = body.type;
        if (body.description !== undefined) updateData.description = body.description || null;
        if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
        if (body.status !== undefined) updateData.status = body.status;

        const result = await prisma.payment.updateMany({
            where: { id, userId },
            data: updateData,
        });

        if (result.count === 0) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Payment updated successfully",
        });
    } catch (error) {
        console.error("Update payment error:", error);
        return res.status(500).json({ success: false, message: "Failed to update payment" });
    }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const id = req.params.id;
    const { status } = req.body as { status: "PENDING" | "PAID" | "OVERDUE" };

    try {
        const existingPayment = await prisma.payment.findFirst({
            where: { id, userId },
        });

        if (!existingPayment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        if (existingPayment.status === "PAID" && (status === "PENDING" || status === "OVERDUE")) {
            return res.status(400).json({
                success: false,
                message: "Cannot change status of paid payment to pending or overdue",
            });
        }

        const result = await prisma.payment.updateMany({
            where: { id, userId },
            data: { status },
        });

        if (result.count === 0) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
        });
    } catch (error) {
        console.error("Update payment status error:", error);
        return res.status(500).json({ success: false, message: "Failed to update payment status" });
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const id = req.params.id;

    try {
        const result = await prisma.payment.deleteMany({
            where: { id, userId },
        });

        if (result.count === 0) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        return res.status(200).json({ success: true, message: "Payment deleted successfully" });
    } catch (error) {
        console.error("Delete payment error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete payment" });
    }
};

export const bulkDeletePayments = async (req: Request, res: Response) => {
    const userId = (req as any).user.id as string;
    const { ids } = req.body as { ids: string[] };

    try {
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Payment IDs array is required and must not be empty",
            });
        }

        const result = await prisma.payment.deleteMany({
            where: {
                id: { in: ids },
                userId,
            },
        });

        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                message: "No payments found with the provided IDs that belong to you",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.count} payment(s)`,
            data: {
                deletedCount: result.count,
            },
        });
    } catch (error) {
        console.error("Bulk delete payments error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete payments",
        });
    }
};

