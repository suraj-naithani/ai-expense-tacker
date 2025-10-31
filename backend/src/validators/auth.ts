import { z } from "zod";

// Reusable primitives
const usernameSchema = z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username may contain letters, numbers, and underscore only")
    .transform((v: string) => v.toLowerCase());

const emailSchema = z
    .email({ message: "Please provide a valid email address" })
    .transform((v: string) => v.toLowerCase());

// At least 8 chars, 1 upper, 1 lower, 1 digit; symbols optional but allowed
const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");

export const signUpSchema = z
    .object({
        username: usernameSchema,
        email: emailSchema,
        password: passwordSchema,
    })
    .strict();

export const signInSchema = z
    .object({
        email: emailSchema,
        password: z.string().min(1, "Password is required"),
    })
    .strict();

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;