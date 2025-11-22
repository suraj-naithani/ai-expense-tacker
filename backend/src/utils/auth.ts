import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { sendEmail } from "./features.js";

const prisma = new PrismaClient({});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,

        requireEmailVerification: true,

        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Reset Your Password",
                text: `Click this link to reset your password: ${url}\n\nThis link expires in 1 hour.`,
                html: `
                    <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <title>Reset Your Password</title>
                        </head>
                        <body style="margin:0; padding:0; background:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; padding:40px 20px;">
                                <tr>
                                    <td align="center">
                                        <table width="100%" style="max-width:500px; background:white; border-radius:16px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
                                            <!-- Header -->
                                            <tr>
                                                <td style="background:linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding:40px 30px; text-align:center;">
                                                    <h1 style="color:white; margin:0; font-size:28px; font-weight:700;">Password Reset</h1>
                                                    <p style="color:rgba(255,255,255,0.9); margin:12px 0 0; font-size:16px;">Secure your account</p>
                                                </td>
                                            </tr>

                                            <!-- Body -->
                                            <tr>
                                                <td style="padding:40px 30px; text-align:center;">
                                                    <h2 style="color:#1e293b; margin:0 0 16px; font-size:22px;">Forgot your password?</h2>
                                                    <p style="color:#64748b; font-size:16px; line-height:1.6; margin:0 0 32px;">
                                                        No worries! Click the button below to set a new password.
                                                    </p>

                                                    <!-- Button -->
                                                    <a href="${url}" style="display:inline-block; padding:14px 32px; background:#3b82f6; color:white; text-decoration:none; border-radius:12px; font-weight:600; font-size:16px; box-shadow:0 4px 12px rgba(59,130,246,0.4);">
                                                        Reset Password
                                                    </a>

                                                    <p style="color:#94a3b8; font-size:14px; margin:32px 0 0;">
                                                        Or copy this link:<br/>
                                                        <a href="${url}" style="color:#3b82f6; word-break:break-all;">${url}</a>
                                                    </p>
                                                </td>
                                            </tr>

                                            <!-- Footer -->
                                            <tr>
                                                <td style="background:#f1f5f9; padding:30px; text-align:center;">
                                                    <p style="color:#64748b; font-size:13px; margin:0;">
                                                        This link expires in 1 hour.<br/>
                                                        If you didn't request this, you can safely ignore this email.
                                                    </p>
                                                    <p style="color:#94a3b8; font-size:12px; margin:20px 0 0;">
                                                        © ${new Date().getFullYear()} YourAppName. All rights reserved.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                    </html>
                `,
            });
        },
    },

    emailVerification: {
        sendOnSignIn: true,
        autoSignInAfterVerification: true,

        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: "Verify Your Email Address",
                text: `Please verify your email by clicking this link: ${url}`,
                html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                            <title>Verify Your Email</title>
                        </head>
                        <body style="margin:0; padding:0; background:#f8fafc; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc; padding:40px 20px;">
                                <tr>
                                    <td align="center">
                                        <table width="100%" style="max-width:500px; background:white; border-radius:16px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.05);">
                                            <!-- Header -->
                                            <tr>
                                                <td style="background:linear-gradient(135deg, #10b981 0%, #059669 100%); padding:40px 30px; text-align:center;">
                                                    <h1 style="color:white; margin:0; font-size:28px; font-weight:700;">Welcome${user.name ? `, ${user.name}` : ""}!</h1>
                                                    <p style="color:rgba(255,255,255,0.9); margin:12px 0 0; font-size:16px;">Just one step left to activate your account</p>
                                                </td>
                                            </tr>

                                            <!-- Body -->
                                            <tr>
                                                <td style="padding:40px 30px; text-align:center;">
                                                    <h2 style="color:#1e293b; margin:0 0 16px; font-size:22px;">Verify Your Email Address</h2>
                                                    <p style="color:#64748b; font-size:16px; line-height:1.6; margin:0 0 32px;">
                                                        Click the button below to confirm your email and get started.
                                                    </p>

                                                    <!-- Button -->
                                                    <a href="${url}" style="display:inline-block; padding:14px 32px; background:#10b981; color:white; text-decoration:none; border-radius:12px; font-weight:600; font-size:16px; box-shadow:0 4px 12px rgba(16,185,129,0.3);">
                                                        Verify Email Address
                                                    </a>

                                                    <p style="color:#94a3b8; font-size:14px; margin:32px 0 0;">
                                                        Or copy this link if the button doesn't work:<br/>
                                                        <a href="${url}" style="color:#10b981; word-break:break-all;">${url}</a>
                                                    </p>
                                                </td>
                                            </tr>

                                            <!-- Footer -->
                                            <tr>
                                                <td style="background:#f1f5f9; padding:30px; text-align:center;">
                                                    <p style="color:#64748b; font-size:13px; margin:0;">
                                                        This link expires in 24 hours.<br/>
                                                        If you didn't create an account, you can safely ignore this email.
                                                    </p>
                                                    <p style="color:#94a3b8; font-size:12px; margin:20px 0 0;">
                                                        © ${new Date().getFullYear()} YourAppName. All rights reserved.
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>
                    `,
            });
        }
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    trustedOrigins: ["http://localhost:3000"],
});