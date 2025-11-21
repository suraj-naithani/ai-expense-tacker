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
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #333;">Password Reset Request</h2>
                        <p>Hello ${user.name || ""},</p>
                        <p>We received a request to reset your password.</p>
                        <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Reset Password
                        </a>
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">
                            If the button doesn't work, copy this link:<br>
                            <strong>${url}</strong>
                        </p>
                        <p style="color: #999; font-size: 12px;">This link expires in 1 hour.</p>
                    </div>
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
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #10b981;">Almost there!</h2>
                        <p>Welcome${user.name ? `, ${user.name}` : ""}!</p>
                        <p>Please confirm your email address to activate your account:</p>
                        <a href="${url}" style="display: inline-block; padding: 14px 28px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                            Verify Email Address
                        </a>
                        <p style="margin-top: 20px; color: #666; font-size: 14px;">
                            Or copy this link:<br><strong>${url}</strong>
                        </p>
                        <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
                    </div>
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