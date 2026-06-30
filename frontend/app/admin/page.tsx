"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif" }}>
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

    const stats = [
        { label: "Total Revenue", value: "Rs. 2.4L", change: "+12%", up: true },
        { label: "Orders Today", value: "186", change: "+5%", up: true },
        { label: "Products Live", value: "1,204", change: "-3%", up: false },
        { label: "Active Users", value: "8,940", change: "+9%", up: true },
    ];

    const orders = [
        { name: "Neon Tetra Bundle", customer: "Maya Chen", id: "#4821", status: "Delivered" },
        { name: "Premium Coral", customer: "Arjun Rao", id: "#4820", status: "Shipped" },
        { name: "60-Gallon Aquarium", customer: "Priya Shah", id: "#4819", status: "Pending" },
    ];

    const statusColors: Record<string, { bg: string; text: string }> = {
        Delivered: { bg: "rgba(74,222,128,0.15)", text: "#4ade80" },
        Shipped: { bg: "rgba(77,217,232,0.15)", text: "#4dd9e8" },
        Pending: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24" },
    };

    return (
        <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh" }}>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />

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
                        Manage products, orders, and users across the AquaLife platform.
                    </p>
                </div>

                {/* Stat Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 40 }}>
                    {stats.map((s) => (
                        <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{s.label}</p>
                                <span style={{ color: s.up ? "#4ade80" : "#f87171", fontSize: 12, fontWeight: 600 }}>{s.change}</span>
                            </div>
                            <p style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginTop: 8 }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 40 }}>
                    <Link href="/admin/products" style={{ textDecoration: "none", display: "block" }}>
                        <div style={{ background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", borderRadius: 12, padding: 24, cursor: "pointer" }}>
                            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Manage Products</h3>
                            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>Add, edit, or remove fish, food, and aquarium supplies.</p>
                        </div>
                    </Link>
                    <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24, cursor: "pointer" }}>
                        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Manage Orders</h3>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Review, update, and fulfill customer orders.</p>
                    </div>
                    <Link href="/admin/users" style={{ textDecoration: "none", display: "block" }}>
                        <div style={{ background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", borderRadius: 12, padding: 24, cursor: "pointer" }}>
                            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Manage Users</h3>
                            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>View accounts, roles, and customer activity.</p>
                        </div>
                    </Link>
                </div>

                {/* Recent Orders Table */}
                <div>
                    <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Recent Orders</h2>
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
                                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{o.name}</p>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>{o.customer} · {o.id}</p>
                                </div>
                                <span
                                    style={{
                                        background: statusColors[o.status].bg,
                                        color: statusColors[o.status].text,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        padding: "4px 12px",
                                        borderRadius: 20,
                                    }}
                                >
                                    {o.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
