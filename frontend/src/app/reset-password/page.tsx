"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error === "INVALID_TOKEN") {
        return (
            <div className="min-h-screen bg-[--card] flex items-center justify-center px-4">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Invalid Reset Link</CardTitle>
                        <CardDescription>The link has expired or is invalid.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild>
                            <Link href="/forgot-password">Request New Link</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (done) {
        return (
            <div className="min-h-screen bg-[--card] flex items-center justify-center px-4">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Password Updated!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p>You can now sign in with your new password.</p>
                        <Button asChild>
                            <Link href="/signin">Go to Sign In</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="min-h-screen bg-[--card] flex items-center justify-center px-4">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Missing Token</CardTitle>
                        <CardDescription>Please use the link from your email.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild>
                            <Link href="/forgot-password">Request Reset Link</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (password.length < 6) {
            toast.error("Password too short");
            return;
        }

        setLoading(true);
        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token,
            });

            if (error) throw error;

            setDone(true);
            toast.success("Password updated successfully!");
            router.push("/signin")
        } catch (err: unknown) {
            toast.error("Failed", { description: err.message || "Invalid or expired link" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[--card] flex items-center justify-center px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-2">
                    <CardTitle>Reset Your Password</CardTitle>
                    <CardDescription>Enter a strong new password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm">Confirm Password</Label>
                            <Input
                                id="confirm"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Updating..." : "Update Password"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <Link href="/signin" className="text-primary hover:underline">
                            ← Back to sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}