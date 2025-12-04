import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../utils/auth.js";

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const headers = fromNodeHeaders(req.headers);

        const session = await auth.api.getSession({ headers });

        (req as any).session = session;
        (req as any).user = session?.user;

        if (!session || !session.user) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Invalid or missing session" });
        }

        const expiresAt = session.session?.expiresAt;
        if (expiresAt && new Date(expiresAt) < new Date()) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Session expired" });
        }

        return next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


