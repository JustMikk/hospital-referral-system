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
    login: (role: UserRole) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Default to doctor for initial state, or try to read from localStorage if we were persisting
    const [userRole, setUserRoleState] = useState<UserRole>("doctor");
    const [user, setUser] = useState<User | null>({
        ...mockUser,
        role: "doctor" as UserRole, // Cast to ensure type safety
    });

    const setUserRole = (role: UserRole) => {
        setUserRoleState(role);
        if (user) {
            setUser({ ...user, role });
        }
    };

    const login = (role: UserRole) => {
        setUserRole(role);
        // In a real app, we'd fetch user data here
    };

    const logout = () => {
        // In a real app, clear tokens etc.
        // For now, maybe reset to default or null? 
        // Let's just keep it simple for the UI test
    };

    return (
        <AuthContext.Provider value={{ user, userRole, setUserRole, login, logout }}>
            {children}
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
