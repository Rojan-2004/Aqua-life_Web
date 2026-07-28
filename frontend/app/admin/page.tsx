"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats } from "@/lib/api/dashboard";
import { getAdminNotifications, markNotificationsRead, AdminNotification } from "@/lib/api/admin/notification";
import Image from "next/image";
import Footer from "@/components/Footer";
import {
    Wallet,
    Clock,
    CheckCircle,
    Calendar,
    Package,
    AlertTriangle,
    Users,
    PlusCircle,
    BarChart3,
    Bell,
    LogOut,
    ChevronRight,
} from "lucide-react";

interface AdminStats {
    revenue: number;
    ordersToday: number;
    productsLive: number;
    activeUsers: number;
    pendingOrders?: number;
    deliveredOrders?: number;
    monthlyRevenue?: number;
    totalProducts?: number;
    lowStockProducts?: number;
    totalUsers?: number;
}

const STAT_CARDS = [
    { label: "Total Revenue", valueKey: "revenue", icon: Wallet, format: (v: number) => `Rs. ${v.toLocaleString()}`, href: "/admin/orders", title: "View all transactions" },
    { label: "Pending Orders", valueKey: "pendingOrders", icon: Clock, href: "/admin/orders?status=pending", title: "View pending orders" },
    { label: "Delivered Orders", valueKey: "deliveredOrders", icon: CheckCircle, href: "/admin/orders?status=delivered", title: "View delivered orders" },
    { label: "Monthly Revenue", valueKey: "monthlyRevenue", icon: Calendar, format: (v: number) => `Rs. ${v.toLocaleString()}`, href: "/admin/orders", title: "View monthly transactions" },
    { label: "Total Products", valueKey: "totalProducts", icon: Package, fallbackKey: "productsLive", href: "/admin/products", title: "Manage products" },
    { label: "Low Stock", valueKey: "lowStockProducts", icon: AlertTriangle, href: "/admin/products", title: "View low stock products" },
    { label: "Total Users", valueKey: "totalUsers", icon: Users, fallbackKey: "activeUsers", href: "/admin/users", title: "Manage users" },
];

const QUICK_ACTIONS = [
    { label: "Add Product", href: "/admin/products/add", icon: PlusCircle, desc: "Create a new catalogue item" },
    { label: "Manage Orders", href: "/admin/orders", icon: Package, desc: "Fulfil and update orders" },
    { label: "Manage Users", href: "/admin/users", icon: Users, desc: "View accounts and roles" },
    { label: "Inventory", href: "/admin/products", icon: BarChart3, desc: "View product catalog" },
];

export default function AdminPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState<AdminStats>({
        revenue: 0,
        ordersToday: 0,
        productsLive: 0,
        activeUsers: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        monthlyRevenue: 0,
        totalProducts: 0,
        lowStockProducts: 0,
        totalUsers: 0,
    });
    const [loadingData, setLoadingData] = useState(true);
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [showNotif, setShowNotif] = useState(false);

    const unread = notifications.filter((n) => !n.isRead).length;

    const markRead = async () => {
        try {
            await markNotificationsRead();
            setNotifications((list) => list.map((n) => ({ ...n, isRead: true })));
        } catch (e) {
            console.error("Failed to mark notifications read", e);
        }
    };

    useEffect(() => {
        if (user && user.role === "admin") {
            getAdminNotifications()
                .then((res) => setNotifications(res.data ?? []))
                .catch((e) => console.error("Failed to load notifications", e));
        }
    }, [user]);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes] = await Promise.all([
                    getAdminStats(),
                ]);
                const s = statsRes?.data;
                setStats({
                    revenue: s?.revenue ?? 0,
                    ordersToday: s?.ordersToday ?? 0,
                    productsLive: s?.productsLive ?? 0,
                    activeUsers: s?.activeUsers ?? 0,
                    pendingOrders: s?.pendingOrders ?? 0,
                    deliveredOrders: s?.deliveredOrders ?? 0,
                    monthlyRevenue: s?.monthlyRevenue ?? 0,
                    totalProducts: s?.totalProducts ?? 0,
                    lowStockProducts: s?.lowStockProducts ?? 0,
                    totalUsers: s?.totalUsers ?? 0,
                });
            } catch (e) {
                console.error("Failed to load admin data", e);
            } finally {
                setLoadingData(false);
            }
        }
        if (user && user.role === "admin") fetchData();
    }, [user]);

    if (loading) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
                <p style={{ color: "#4dd9e8", fontSize: 18, fontWeight: 600 }}>Loading admin panel...</p>
            </div>
        );
    }

    if (!user || user.role !== "admin") {
        router.push("/dashboard");
        return null;
    }

    const handleLogout = async () => {
        await logout();
        router.push("/frontend/login");
    };

    return (
        <div style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh" }}>

            {/* Header Navigation Bar */}
            <header style={{
                background: "rgba(10,14,26,0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", height: 64, display: "flex", alignItems: "center", gap: 32 }}>
                    {/* Logo */}
                    <Link href="/admin" style={{ textDecoration: "none", flexShrink: 0 }}>
                        <Image
                            src="/assets/logo/Aqua_life_logo.png"
                            alt="AquaLife"
                            width={120}
                            height={36}
                            style={{ objectFit: "contain" }}
                            priority
                        />
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
                        <Link
                            href="/dashboard"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                textDecoration: "none",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                padding: "8px 16px",
                                borderRadius: 10,
                                color: "rgba(255,255,255,0.85)",
                                fontSize: 13,
                                fontWeight: 600,
                                transition: "border-color 0.15s, background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                            }}
                        >
                            <ChevronRight size={16} strokeWidth={2.5} style={{ transform: "rotate(180deg)" }} />
                            Dashboard
                        </Link>

                        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.08)" }} />

                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => {
                                    setShowNotif((s) => !s);
                                    if (!showNotif) markRead();
                                }}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 10,
                                    padding: "8px 14px",
                                    color: "#fff",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    position: "relative",
                                    transition: "border-color 0.15s, background 0.15s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                }}
                            >
                                <Bell size={16} />
                                {unread > 0 && (
                                    <span style={{ background: "#f87171", color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700, padding: "0px 5px", minWidth: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                                        {unread}
                                    </span>
                                )}
                            </button>

                            {showNotif && (
                                <div style={{ position: "absolute", top: 44, right: 0, width: 320, background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, overflow: "hidden", zIndex: 200, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                                    <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                                        <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Notifications</p>
                                    </div>
                                    {notifications.length === 0 ? (
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, padding: 20, textAlign: "center" }}>No notifications yet.</p>
                                    ) : (
                                        notifications.map((n) => (
                                            <div key={n.id} style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: n.isRead ? "transparent" : "rgba(77,217,232,0.05)" }}>
                                                <p style={{ color: n.isRead ? "rgba(255,255,255,0.6)" : "#fff", fontSize: 13, lineHeight: 1.5 }}>{n.message}</p>
                                                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleLogout}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 10,
                                padding: "8px 14px",
                                color: "rgba(255,255,255,0.75)",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                transition: "border-color 0.15s, background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)";
                                e.currentTarget.style.background = "rgba(248,113,113,0.08)";
                                e.currentTarget.style.color = "#f87171";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                            }}
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Admin Content */}
            <section style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 32px 64px" }}>
                <div style={{ marginBottom: 32 }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                        Admin Panel
                    </p>
                    <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 700 }}>
                        Store Overview
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8 }}>
                        Live metrics from across the AquaLife platform.
                    </p>
                </div>

                {/* Stat Cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 16,
                    marginBottom: 32,
                }}>
                    {STAT_CARDS.map((s, idx) => {
                        const Icon = s.icon;
                        const raw = (stats as any)[s.valueKey];
                        const fallback = s.fallbackKey ? (stats as any)[s.fallbackKey] : undefined;
                        const display = typeof s.format === "function" ? s.format(raw ?? 0) : (raw ?? fallback ?? 0);
                        return (
                            <Link key={s.label + idx} href={s.href} style={{ textDecoration: "none" }}>
                                <div title={s.title} style={{
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 14,
                                    padding: "18px 20px",
                                    transition: "all 0.2s",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(77,217,232,0.35)";
                                        e.currentTarget.style.background = "rgba(77,217,232,0.06)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    <span style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        background: "rgba(77,217,232,0.1)",
                                        border: "1px solid rgba(77,217,232,0.15)",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#4dd9e8",
                                        flexShrink: 0,
                                    }}>
                                        <Icon size={18} strokeWidth={2} />
                                    </span>
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginBottom: 2 }}>{s.label}</p>
                                        <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: "-0.2px" }}>{display}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>Quick Actions</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                        {QUICK_ACTIONS.map((q) => {
                            const Icon = q.icon;
                            return (
                                <Link key={q.label} href={q.href} style={{ textDecoration: "none", display: "block" }}>
                                    <div style={{
                                        background: "rgba(255,255,255,0.03)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: 14,
                                        padding: "18px 20px",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = "rgba(77,217,232,0.35)";
                                            e.currentTarget.style.background = "rgba(77,217,232,0.06)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                        }}
                                    >
                                        <span style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            background: "rgba(77,217,232,0.1)",
                                            border: "1px solid rgba(77,217,232,0.15)",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#4dd9e8",
                                            flexShrink: 0,
                                        }}>
                                            <Icon size={18} strokeWidth={2} />
                                        </span>
                                        <div style={{ minWidth: 0 }}>
                                            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{q.label}</h3>
                                            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.4 }}>{q.desc}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <Footer />
            </section>

        </div>
    );
}
