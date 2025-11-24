"use client";

import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { SessionUser } from "@/types/auth";

export function useUser() {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchSession = async () => {
            try {
                const { data: session } = await authClient.getSession();
                if (!isMounted) return;
                if (session?.user) {
                    setUser(session.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching session", error);
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchSession();

        return () => {
            isMounted = false;
        };
    }, []);

    return { user, loading, isAuthenticated: !!user };
}