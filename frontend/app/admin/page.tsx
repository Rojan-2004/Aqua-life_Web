"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats } from "@/lib/api/dashboard";
import { getAdminNotifications, markNotificationsRead, AdminNotification } from "@/lib/api/admin/notification";
import Footer from "@/components/Footer";

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

    const statCards = [
        { label: "Total Revenue", value: `Rs. ${stats.revenue.toLocaleString()}`, icon: "💰" },
        { label: "Pending Orders", value: stats.pendingOrders ?? 0, icon: "⏳" },
        { label: "Delivered Orders", value: stats.deliveredOrders ?? 0, icon: "✅" },
        { label: "Monthly Revenue", value: `Rs. ${(stats.monthlyRevenue ?? 0).toLocaleString()}`, icon: "📅" },
        { label: "Total Products", value: stats.totalProducts || stats.productsLive, icon: "📦" },
        { label: "Low Stock", value: stats.lowStockProducts ?? 0, icon: "⚠️" },
        { label: "Total Users", value: stats.totalUsers || stats.activeUsers, icon: "👤" },
    ];

    const quickActions = [
        { label: "Add Product", href: "/admin/products/add", icon: "➕", desc: "Create a new catalogue item" },
        { label: "Manage Orders", href: "/admin/orders", icon: "📦", desc: "Fulfil and update orders" },
        { label: "Manage Users", href: "/admin/users", icon: "👤", desc: "View accounts and roles" },
        { label: "Inventory", href: "/admin/products", icon: "📊", desc: "View product catalog" },
    ];

    return (
        <div style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh" }}>

            {/* Header Navigation Bar */}
            <header style={{
                background: "rgba(17, 24, 39, 0.8)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                position: "sticky",
                top: 0,
                zIndex: 100
            }}>
                <div style={{ maxWidth: 1440, margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 24, fontWeight: 800, background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🌊 AquaLife</span>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>/ Admin</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <Link
                            href="/dashboard"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                textDecoration: "none",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                padding: "6px 14px",
                                borderRadius: 30,
                                color: "rgba(255,255,255,0.7)",
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
                            ⬅ Back to Dashboard
                        </Link>

                        <div style={{ position: "relative" }}>
                            <button
                                onClick={() => {
                                    setShowNotif((s) => !s);
                                    if (!showNotif) markRead();
                                }}
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 30,
                                    padding: "7px 14px",
                                    color: "#fff",
                                    fontSize: 13,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    position: "relative",
                                }}
                            >
                                🔔
                                {unread > 0 && (
                                    <span style={{ background: "#f87171", color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700, padding: "1px 5px", marginLeft: 4 }}>
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
                                background: "transparent",
                                border: "none",
                                color: "rgba(255,255,255,0.5)",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Admin Content */}
            <section className="max-w-7xl mx-auto px-8 lg:px-10 py-8">
                <div style={{ marginBottom: 40 }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                        Admin Panel
                    </p>
                    <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>
                        Store Overview
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8 }}>
                        Live metrics from across the AquaLife platform.
                    </p>
                </div>

                {/* Stat Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 }}>
                    {statCards.map((s) => (
                        <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 20, transition: "0.2s all" }}>
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 4 }}>{s.label}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 20 }}>{s.icon}</span>
                                <p style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ marginBottom: 40 }}>
                    <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Quick Actions</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                        {quickActions.map((q) => (
                            <Link key={q.label} href={q.href} style={{ textDecoration: "none", display: "block" }}>
                                <div style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 12,
                                    padding: 20,
                                    cursor: "pointer",
                                    transition: "0.2s all",
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.border = "1px solid rgba(77,217,232,0.3)";
                                        e.currentTarget.style.background = "rgba(77,217,232,0.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                        <span style={{ fontSize: 20 }}>{q.icon}</span>
                                        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>{q.label}</h3>
                                    </div>
                                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{q.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <Footer />
            </section>

        </div>
    );
}
