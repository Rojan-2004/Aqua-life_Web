"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserDashboard } from "@/lib/api/dashboard";
import { getCatalogue } from "@/lib/api/product";
import ProductCard, { ProductCardData } from "../catalogue/_components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface RecentOrder {
    id: string;
    total: number;
    status: string;
    items: { product: { name: string; images: string[] } | null }[];
}

interface UserDashboardData {
    orders: number;
    wishlist: number;
    reviews: number;
    recentOrders: RecentOrder[];
}

const statusColors: Record<string, { bg: string; text: string }> = {
    delivered: { bg: "rgba(74,222,128,0.15)", text: "#4ade80" },
    shipped: { bg: "rgba(77,217,232,0.15)", text: "#4dd9e8" },
    pending: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24" },
    cancelled: { bg: "rgba(248,113,113,0.15)", text: "#f87171" },
};

const formatStatus = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "Pending";

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const [data, setData] = useState<UserDashboardData>({
        orders: 0,
        wishlist: 0,
        reviews: 0,
        recentOrders: [],
    });
    const [featured, setFeatured] = useState<ProductCardData[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Redirect to login when there is no authenticated user.
    // Must run inside an effect (never during render) otherwise we update
    // the Router component while DashboardPage is still rendering.
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/frontend/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;

        async function load() {
            try {
                const [statsRes, catRes] = await Promise.allSettled([
                    getUserDashboard(),
                    getCatalogue({ limit: 4, featured: true }),
                ]);
                if (cancelled) return;

                if (statsRes.status === "fulfilled") {
                    const d = statsRes.value?.data;
                    setData({
                        orders: d?.orders ?? 0,
                        wishlist: d?.wishlist ?? 0,
                        reviews: d?.reviews ?? 0,
                        recentOrders: d?.recentOrders ?? [],
                    });
                } else {
                    const status = (
                        statsRes.reason as { response?: { status?: number } }
                    )?.response?.status;
                    if (status === 401) {
                        // Token is invalid/expired: clear auth and send to login.
                        await logout();
                        router.replace("/frontend/login");
                        return;
                    }
                    console.error("Failed to load dashboard data", statsRes.reason);
                }

                if (catRes.status === "fulfilled") {
                    setFeatured(catRes.value?.products ?? []);
                } else {
                    console.error("Failed to load featured products", catRes.reason);
                }
            } finally {
                if (!cancelled) setLoadingData(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [user, logout, router]);

    if (loading || !user) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
                <p style={{ color: "#4dd9e8", fontSize: 18, fontWeight: 600 }}>Loading dashboard...</p>
            </div>
        );
    }

    const name = user.firstName || user.username || user.name || user.email || "User";

    const stats = [
        { label: "Total Orders", value: data.orders ?? 0, icon: "📦" },
        { label: "Wishlist Items", value: data.wishlist ?? 0, icon: "❤️" },
        { label: "My Reviews", value: data.reviews ?? 0, icon: "⭐" },
    ];

    return (
        <div style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh" }}>

            <Header />

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
                        Manage your aquarium ecosystem and explore premium aquatic supplies.
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
                    ) : data.recentOrders.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)" }}>
                            <p style={{ fontSize: 32 }}>🐟</p>
                            <p style={{ marginTop: 8 }}>No orders yet. <Link href="/catalogue" style={{ color: "#4dd9e8" }}>Start shopping</Link></p>
                        </div>
                    ) : (
                        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, overflow: "hidden" }}>
                            {data.recentOrders.map((o, i) => (
                                <div
                                    key={o.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "16px 20px",
                                        borderBottom: i !== data.recentOrders.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                                    }}
                                >
                                    <div>
                                        <p style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                                            {o.items?.[0]?.product?.name ?? "Order"}
                                            {o.items?.length > 1 ? ` +${o.items.length - 1} more` : ""}
                                        </p>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
                                            Order {o.id.slice(0, 8)} · Rs. {o.total}
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
                                        {formatStatus(o.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Featured Products / Shop */}
                <div style={{ marginTop: 48 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600 }}>Featured Products</h2>
                        <Link href="/catalogue" style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>View all →</Link>
                    </div>
                    {loadingData ? (
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading products...</p>
                    ) : featured.length === 0 ? (
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No featured products yet.</p>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 20 }}>
                            {featured.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
