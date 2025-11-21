import jwt from "jsonwebtoken";
import { Response } from "express";
import nodemailer from "nodemailer";

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

const sendEmail = async ({ to, subject, text, html }: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.GMAIL_ID,
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.GMAIL_ID,
            to,
            subject,
            text: text || "",
            html: html || text?.replace(/\n/g, "<br>"),
        });

        console.log(`Email sent to ${to} with subject: ${subject}`);
        console.log("Email content:", text);
        console.log("Email content:", html);
    } catch (error) {
        console.error("Full error:", error);
        return error;
    }
};

export { sendToken, cookieOptions, sendEmail };