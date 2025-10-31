import jwt from "jsonwebtoken";
import { Response } from "express";

const isProd = (process.env.NODE_ENV || "development") === "production";

const cookieOptions: { maxAge: number; sameSite: "none" | "lax" | "strict" | boolean; httpOnly: boolean; secure: boolean } = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: isProd ? "none" : "lax",
    httpOnly: true,
    secure: isProd,
};

const sendToken = (res: Response, user: any, code: number, message: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment variables");
    }
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: "15d" });

    return res
        .status(code)
        .cookie("read-me-generator", token, cookieOptions)
        .json({
            success: true,
            message,
            user
        });
};

export { sendToken, cookieOptions };