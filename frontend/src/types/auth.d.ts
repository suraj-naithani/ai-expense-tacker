export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    sessions: Session[];
    accounts: Account[];
}

export interface Session {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
    userId: string;

    // Relation
    user: User;
}

export interface Account {
    id: string;
    accountId: string;           // e.g., Google's user ID
    providerId: string;          // "google" | "github" | "discord"
    userId: string;

    accessToken: string | null;
    refreshToken: string | null;
    idToken: string | null;
    accessTokenExpiresAt: Date | null;
    refreshTokenExpiresAt: Date | null;
    scope: string | null;
    password: string | null;     // only for credentials

    createdAt: Date;
    updatedAt: Date;

    // Relation
    user: User;
}

export interface Verification {
    id: string;
    identifier: string;   // usually email
    value: string;        // the token/code
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

// 2. UNIONS & HELPER TYPES → type only
export type Provider = "google" | "github" | "discord" | "credentials";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// 3. FORM TYPES (these don't exist in DB → use type + Pick/Omit)
export type EmailPasswordSignup = {
    name: string;
    email: string;
    password: string;
};

export type EmailPasswordSignin = {
    email: string;
    password: string;
};

export type GoogleOAuthProfile = {
    name: string;
    email: string;
    image?: string | null;
};

// 4. RE-EXPORT EVERYTHING (so you can do: import { User, EmailPasswordSignup } from "@/types")
export * from "./index";