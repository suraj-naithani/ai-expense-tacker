import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodSchema) => (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: parsed.error.issues.map(i => ({
                path: i.path.join("."),
                message: i.message,
            })),
        });
    }
    req.body = parsed.data;
    next();
};