import jwt from "jsonwebtoken";
import { Response } from "express";

// Cookie options that adapt to environment
const cookieOptions: { maxAge: number; sameSite: "none" | "lax" | "strict" | boolean; httpOnly: boolean; secure: boolean } = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: env.isProduction() ? ("none" as const) : ("lax" as const),
    httpOnly: true,
    secure: env.isProduction(), // HTTPS only in production
};

const sendToken = (res: Response, user: any, code: number, message: string) => {
    const token = jwt.sign({ _id: user.id }, env.JWT_SECRET, { expiresIn: "15d" });

    return res
        .status(code)
        .cookie("read-me-generator", token, cookieOptions)
        .json({
            success: true,
            message,
            user,
        });
};

export { sendToken, cookieOptions };