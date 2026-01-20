"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { currentUser as mockUser } from "@/lib/mock-data";

export type UserRole = "doctor" | "nurse" | "hospital_admin" | "system_admin";

interface User {
    id: string;
    name: string;
    role: UserRole;
    hospital: string;
    avatar?: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    userRole: UserRole;
    setUserRole: (role: UserRole) => void;
    login: (email: string, password: string) => Promise<{ user: User | null; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRoleState] = useState<UserRole>("doctor");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                    setUserRoleState(data.user.role.toLowerCase() as UserRole);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const setUserRole = (role: UserRole) => {
        setUserRoleState(role);
        if (user) {
            setUser({ ...user, role });
        }
    };

    const login = async (email: string, password: string): Promise<{ user: User | null; error?: string }> => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                setUserRoleState(data.user.role.toLowerCase() as UserRole);
                return { user: data.user };
            } else {
                return { user: null, error: data.error || "Login failed" };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return { user: null, error: "An unexpected error occurred" };
        }
    };

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            // Redirect to login if needed
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userRole, setUserRole, login, logout }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
