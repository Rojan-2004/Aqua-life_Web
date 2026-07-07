"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserDashboard } from "@/lib/api/dashboard";

interface UserOrder {
    id: string;
    total: number;
    status: string;
    createdAt?: string;
}

interface UserDashboardData {
    orders: UserOrder[];
    wishlist: number;
    tanks: number;
}

const statusColors: Record<string, { bg: string; text: string }> = {
    Delivered: { bg: "rgba(74,222,128,0.15)", text: "#4ade80" },
    Shipped: { bg: "rgba(77,217,232,0.15)", text: "#4dd9e8" },
    Pending: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24" },
    Cancelled: { bg: "rgba(248,113,113,0.15)", text: "#f87171" },
};

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const [data, setData] = useState<UserDashboardData>({
        orders: [],
        wishlist: 0,
        tanks: 0,
    });
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await getUserDashboard();
                const d = res?.data;
                setData({
                    orders: d?.orders ?? [],
                    wishlist: d?.wishlist ?? 0,
                    tanks: d?.tanks ?? 0,
                });
            } catch (e) {
                console.error("Failed to load dashboard data", e);
            } finally {
                setLoadingData(false);
            }
        }
        if (user) load();
    }, [user]);

    if (loading) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
                <p style={{ color: "#4dd9e8", fontSize: 18, fontWeight: 600 }}>Loading dashboard...</p>
            </div>
        );
    }

    if (!user) {
        router.push("/frontend/login");
        return null;
    }

    const name = user.firstName || user.username || user.name || user.email || "User";
    const userInitials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
    const hasProfilePic = user.profilePicture && user.profilePicture !== "default-profile.png";
    const profilePicUrl = hasProfilePic ? `/profile_pictures/${user.profilePicture}` : null;

    const handleLogout = async () => {
        await logout();
        router.push("/frontend/login");
    };

    const stats = [
        { label: "My Orders", value: data.orders?.length ?? 0, icon: "📦" },
        { label: "Wishlist Items", value: data.wishlist ?? 0, icon: "❤️" },
        { label: "Active Tanks", value: data.tanks ?? 0, icon: "🐠" },
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
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        {user.role === "admin" && (
                            <Link
                                href="/admin"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    textDecoration: "none",
                                    background: "rgba(77, 217, 232, 0.1)",
                                    border: "1px solid rgba(77, 217, 232, 0.3)",
                                    padding: "6px 14px",
                                    borderRadius: 30,
                                    color: "#4dd9e8",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    transition: "0.2s all"
                                }}
                            >
                                🛡️ Admin Panel
                            </Link>
                        )}

                        <Link
                            href="/dashboard/profile"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                textDecoration: "none",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                padding: "6px 14px",
                                borderRadius: 30,
                                transition: "0.2s all"
                            }}
                        >
                            <div style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden"
                            }}>
                                {profilePicUrl ? (
                                    <img src={profilePicUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>{userInitials}</span>
                                )}
                            </div>
                            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600 }}>Profile Settings</span>
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
                                transition: "0.2s hover"
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <section style={{ maxWidth: 1440, margin: "0 auto", padding: "64px 32px" }}>
                <div style={{ marginBottom: 40 }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                        AquaLife Dashboard
                    </p>
                    <h1 style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>
                        Welcome, {name}
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 8 }}>
                        Track your orders, wishlist, and active tanks at a glance.
                    </p>
                </div>

                {/* Stat Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
                    {stats.map((s) => (
                        <div key={s.label} style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 12,
                            padding: 20
                        }}>
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{s.icon} {s.label}</p>
                            <p style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginTop: 8 }}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Orders */}
                <div>
                    <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Recent Orders</h2>

                    {loadingData ? (
                        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 24 }}>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading your orders...</p>
                        </div>
                    ) : data.orders?.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)" }}>
                            <p style={{ fontSize: 32 }}>🐟</p>
                            <p style={{ marginTop: 8 }}>No orders yet. Explore the shop to get started.</p>
                        </div>
                    ) : (
                        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" }}>
                            {data.orders.map((o, i) => (
                                <div
                                    key={o.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "16px 20px",
                                        borderBottom: i !== data.orders.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                                    }}
                                >
                                    <div>
                                        <p style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Order {o.id}</p>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
                                            {typeof o.total === "number" ? `Rs. ${o.total}` : "—"}
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
