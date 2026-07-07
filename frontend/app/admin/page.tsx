"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAdminStats, getRecentOrders } from "@/lib/api/dashboard";

interface AdminStats {
    revenue: number;
    ordersToday: number;
    productsLive: number;
    activeUsers: number;
}

interface AdminOrder {
    id: string;
    customer: string;
    status: string;
    total?: number;
}

const statusColors: Record<string, { bg: string; text: string }> = {
    Delivered: { bg: "rgba(74,222,128,0.15)", text: "#4ade80" },
    Shipped: { bg: "rgba(77,217,232,0.15)", text: "#4dd9e8" },
    Pending: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24" },
    Cancelled: { bg: "rgba(248,113,113,0.15)", text: "#f87171" },
};

export default function AdminPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState<AdminStats>({
        revenue: 0,
        ordersToday: 0,
        productsLive: 0,
        activeUsers: 0,
    });
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    getAdminStats(),
                    getRecentOrders(),
                ]);
                const s = statsRes?.data;
                setStats({
                    revenue: s?.revenue ?? 0,
                    ordersToday: s?.ordersToday ?? 0,
                    productsLive: s?.productsLive ?? 0,
                    activeUsers: s?.activeUsers ?? 0,
                });
                setOrders(ordersRes?.data ?? []);
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
        { label: "Total Revenue", value: `Rs. ${stats.revenue}` },
        { label: "Orders Today", value: stats.ordersToday },
        { label: "Products Live", value: stats.productsLive },
        { label: "Active Users", value: stats.activeUsers },
    ];

    const quickLinks = [
        { label: "Products", href: "/admin/products", desc: "Add, edit, archive listings" },
        { label: "Users", href: "/admin/users", desc: "View accounts and roles" },
        // Orders route not built yet — enable once /admin/orders exists:
        // { label: "Orders", href: "/admin/orders", desc: "Fulfil and update orders" },
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
            <section style={{ maxWidth: 1440, margin: "0 auto", padding: "64px 32px" }}>
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
                    {statCards.map((s) => (
                        <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 20 }}>
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{s.label}</p>
                            <p style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginTop: 8 }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
                    {quickLinks.map((q) => (
                        <Link key={q.label} href={q.href} style={{ textDecoration: "none", display: "block" }}>
                            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 20, cursor: "pointer", transition: "0.2s all" }}>
                                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{q.label}</h3>
                                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{q.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recent Orders Table */}
                <div>
                    <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Recent Orders</h2>

                    {loadingData ? (
                        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading recent orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)" }}>
                            <p style={{ fontSize: 32 }}>🐟</p>
                            <p style={{ marginTop: 8 }}>No orders yet.</p>
                        </div>
                    ) : (
                        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" }}>
                            {orders.map((o, i) => (
                                <div
                                    key={o.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "16px 20px",
                                        borderBottom: i !== orders.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                                    }}
                                >
                                    <div>
                                        <p style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{o.customer || "Customer"}</p>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
                                            {o.id}
                                            {typeof o.total === "number" ? ` · Rs. ${o.total}` : ""}
                                        </p>
                                    </div>
                                    <span
                                        style={{
                                            background: statusColors[o.status]?.bg || "rgba(255,255,255,0.1)",
                                            color: statusColors[o.status]?.text || "rgba(255,255,255,0.6)",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            padding: "4px 12px",
                                            borderRadius: 20,
                                        }}
                                    >
                                        {o.status || "Pending"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
