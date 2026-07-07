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
        setLoading(true);
        try {
            // First, try to get user data from server action
            const data = await getUserData();
            if (data) {
                setUser(data);
            } else {
                // If no user data, try client-side cookie parsing as fallback
                if (typeof window !== "undefined") {
                    const match = document.cookie.match(/(^| )user_data=([^;]+)/);
                    if (match) {
                        try {
                            const parsed = JSON.parse(decodeURIComponent(match[2]));
                            setUser(parsed);
                        } catch (e) {
                            console.error("Error parsing user_data cookie directly:", e);
                            setUser(null);
                        }
                    } else {
                        setUser(null);
                    }
                }
            }
        } catch (err) {
            console.error("Error fetching user data from cookies:", err);
            setUser(null);
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
