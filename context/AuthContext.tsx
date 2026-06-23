"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserData, clearAuthCookies } from "@/lib/cookies";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    name?: string;
    fullName?: string;
    email: string;
    username: string;
    phoneNumber?: string;
    profilePicture?: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    updateUser: (userData: User) => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const data = await getUserData();
            setUser(data);
        } catch (err) {
            console.error("Error fetching user data from cookies:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        await clearAuthCookies();
        setUser(null);
    };

    const updateUser = (userData: User) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser, refreshUser }}>
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
