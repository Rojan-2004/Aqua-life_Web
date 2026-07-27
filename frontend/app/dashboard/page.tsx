"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getUserDashboard, getAdminStats } from "@/lib/api/dashboard";
import { getCatalogue } from "@/lib/api/product";
import ProductCard, { ProductCardData } from "../catalogue/_components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { getAdminNotifications, markNotificationsRead, AdminNotification } from "@/lib/api/admin/notification";

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

const heroSlides = [
    {
        headline: "Premium Aquatic Ecosystems",
        sub: "Everything you need for the perfect aquarium",
        cta: "Shop Now",
        href: "/catalogue",
        image: "/assets/image/background_img2.png",
    },
    {
        headline: "AI Fish Identifier",
        sub: "Snap a photo — know your fish instantly",
        cta: "Try It Free",
        href: "/ai-assistant",
        image: "/assets/image/background_img3.png",
    },
    {
        headline: "Find Your Perfect Fish",
        sub: "2,400+ species available",
        cta: "Browse Catalogue",
        href: "/catalogue",
        image: "/assets/image/background_img2.png",
    },
];

const categoryShowcase = [
    { name: "Fish", desc: "2,400+ species", href: "/catalogue?category=Fish" },
    { name: "Plants", desc: "120 varieties", href: "/catalogue?category=Plants" },
    { name: "Equipment", desc: "Premium brands", href: "/catalogue?category=Equipment" },
    { name: "Food", desc: "450 products", href: "/catalogue?category=Food" },
    { name: "Decoration", desc: "Unique pieces", href: "/catalogue?category=Decoration" },
];

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/frontend/login");
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
                <p style={{ color: "#4dd9e8", fontSize: 18, fontWeight: 600 }}>Loading dashboard...</p>
            </div>
        );
    }

    return user.role === "admin" ? (
        <AdminView user={user} logout={logout} />
    ) : (
        <CustomerView user={user} logout={logout} />
    );
}

function AdminView({ user, logout }: { user: any; logout: () => void }) {
    const [stats, setStats] = useState({
        revenue: 0,
        ordersToday: 0,
        productsLive: 0,
        activeUsers: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        monthlyRevenue: 0,
        lowStockProducts: 0
    });
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

    const unread = notifications.filter((n) => !n.isRead).length;

    const fetchStatsAndNotifications = async () => {
        try {
            const [statsRes, notifRes] = await Promise.all([
                getAdminStats(),
                getAdminNotifications()
            ]);

            const s = statsRes?.data;
            setStats({
                revenue: s?.revenue ?? 0,
                ordersToday: s?.ordersToday ?? 0,
                productsLive: s?.productsLive ?? s?.totalProducts ?? 0,
                activeUsers: s?.activeUsers ?? s?.totalUsers ?? 0,
                pendingOrders: s?.pendingOrders ?? 0,
                deliveredOrders: s?.deliveredOrders ?? 0,
                monthlyRevenue: s?.monthlyRevenue ?? 0,
                lowStockProducts: s?.lowStockProducts ?? 0,
            });

            setNotifications(notifRes.data ?? []);
        } catch (err) {
            console.error("Failed to load admin dashboard data", err);
        } finally {
            setLoadingStats(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markNotificationsRead();
            setNotifications((list) => list.map((n) => ({ ...n, isRead: true })));
        } catch (e) {
            console.error("Failed to mark notifications read", e);
        }
    };

    useEffect(() => {
        fetchStatsAndNotifications();
    }, []);

    const fmt = (n: number) => {
        if (n >= 100000) return `Rs. ${(n / 100000).toFixed(1)}L`;
        if (n >= 1000) return `Rs. ${(n / 1000).toFixed(1)}K`;
        return `Rs. ${n}`;
    };

    const adminStats = [
        { label: "Total Revenue", value: fmt(stats.revenue), icon: "💰", note: "Completed orders" },
        { label: "Monthly Revenue", value: fmt(stats.monthlyRevenue), icon: "📅", note: "Current month" },
        { label: "Delivered Orders", value: stats.deliveredOrders, icon: "✅", note: "All time" },
        { label: "Pending Orders", value: stats.pendingOrders, icon: "⏳", note: "Needs attention" },
        { label: "Orders Today", value: stats.ordersToday, icon: "📦", note: "Today's volume" },
        { label: "Products Live", value: stats.productsLive, icon: "🐠", note: "Active listings" },
        { label: "Low Stock Alert", value: stats.lowStockProducts, icon: "⚠️", note: "Items under 10" },
        { label: "Total Users", value: stats.activeUsers, icon: "👥", note: "Registered accounts" },
    ];

    const quickLinks = [
        { label: "Manage Orders", href: "/admin/orders", icon: "📦", desc: "View, update, fulfil orders" },
        { label: "Products", href: "/admin/products", icon: "🐠", desc: "Add, edit, archive listings" },
        { label: "Add Product", href: "/admin/products/add", icon: "➕", desc: "Create a new catalogue item" },
        { label: "Users", href: "/admin/users", icon: "👥", desc: "View accounts and roles" },
    ];

    return (
        <div style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh" }}>
            {/* Admin announcement bar */}
            <div style={{
                background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)",
                textAlign: "center",
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                letterSpacing: 0.3,
            }}>
                🚚 FREE DELIVERY on all orders · Rs. 50 flat delivery fee · VAT included in all prices
            </div>

            {/* Header */}
            <header style={{ background: "rgba(10,14,26,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Image src="/assets/logo/Aqua_life_logo.png" alt="AquaLife" width={120} height={36} style={{ objectFit: "contain" }} priority />
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>/ Dashboard</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <button onClick={logout} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Logout</button>
                    </div>
                </div>
            </header>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Admin Overview</p>
                <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 700, marginBottom: 6 }}>Store Dashboard</h1>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 36 }}>Live business metrics and system operations.</p>

                {/* Business stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 48 }}>
                    {adminStats.map(s => (
                        <div key={s.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
                                <p style={{ fontSize: 20 }}>{s.icon}</p>
                            </div>
                            <p style={{ color: "#fff", fontSize: 26, fontWeight: 800 }}>{s.value}</p>
                            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 4 }}>{s.note}</p>
                        </div>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
                    {/* Quick Actions (Left) */}
                    <div>
                        <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 18 }}>Quick Actions</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {quickLinks.map(l => (
                                <Link key={l.label} href={l.href} style={{ textDecoration: "none" }}>
                                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, transition: "all 0.2s" }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(77,217,232,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}>
                                        <p style={{ fontSize: 26, marginBottom: 12 }}>{l.icon}</p>
                                        <p style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{l.label}</p>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 6, lineHeight: 1.4 }}>{l.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* System Notifications (Right Sidebar) */}
                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: 24 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <div>
                                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Notifications</h3>
                                {unread > 0 && <span style={{ color: "#f87171", fontSize: 12, fontWeight: 500 }}>{unread} unread</span>}
                            </div>
                            {unread > 0 && (
                                <button onClick={handleMarkAllRead} style={{ background: "none", border: "none", color: "#4dd9e8", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 320, overflowY: "auto" }}>
                            {notifications.length === 0 ? (
                                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No notifications yet.</p>
                            ) : (
                                notifications.map((n) => (
                                    <div key={n.id} style={{
                                        padding: "12px 14px",
                                        borderRadius: 10,
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        background: n.isRead ? "rgba(255,255,255,0.01)" : "rgba(77,217,232,0.03)",
                                        transition: "all 0.2s"
                                    }}>
                                        <p style={{ color: n.isRead ? "rgba(255,255,255,0.6)" : "#fff", fontSize: 13, lineHeight: 1.4 }}>{n.message}</p>
                                        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, marginTop: 6 }}>{new Date(n.createdAt).toLocaleString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function CustomerView({ user, logout }: { user: any; logout: () => void }) {
    const router = useRouter();
    const [data, setData] = useState<UserDashboardData>({
        orders: 0,
        wishlist: 0,
        reviews: 0,
        recentOrders: [],
    });
    const [featured, setFeatured] = useState<ProductCardData[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [activeSlide, setActiveSlide] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setActiveSlide(s => (s + 1) % heroSlides.length), 5000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
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

    const name = user.firstName || user.username || user.name || user.email || "User";

    const customerStats = [
        { label: "Total Orders", value: data.orders ?? 0, icon: "📦" },
        { label: "Wishlist", value: data.wishlist ?? 0, icon: "❤️" },
        { label: "My Reviews", value: data.reviews ?? 0, icon: "⭐" },
    ];

    return (
        <div style={{
            fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
            background: "#0a0e1a",
            minHeight: "100vh",
        }}>
            <Header />

            {/* Hero Slider */}
            <div style={{ position: "relative", height: 520, overflow: "hidden", marginBottom: 0 }}>
                {heroSlides.map((slide, i) => (
                    <div key={i} style={{
                        position: "absolute",
                        inset: 0,
                        opacity: i === activeSlide ? 1 : 0,
                        transition: "opacity 0.8s ease",
                    }}>
                        <div style={{
                            backgroundImage: `url(${slide.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "100%",
                            height: "100%",
                        }} />
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(10,14,26,0.65)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: "0 24px",
                        }}>
                            {/* Delivery banner poster */}
                            <div style={{
                                background: "linear-gradient(135deg, rgba(45,156,219,0.9), rgba(77,217,232,0.9))",
                                borderRadius: 12,
                                padding: "10px 24px",
                                marginBottom: 24,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 10,
                                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                            }}>
                                <span style={{ fontSize: 18 }}>🚚</span>
                                <span style={{ color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>FREE DELIVERY on all orders · Rs. 50 flat delivery fee · VAT included</span>
                            </div>

                            <p style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 2, marginBottom: 16 }}>AquaLife</p>
                            <h1 style={{ color: "#fff", fontSize: 48, fontWeight: 800, lineHeight: 1.15, marginBottom: 16, maxWidth: 680 }}>{slide.headline}</h1>
                            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 18, marginBottom: 32 }}>{slide.sub}</p>
                            <Link href={slide.href} style={{
                                background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)",
                                color: "#fff",
                                padding: "14px 36px",
                                borderRadius: 30,
                                fontSize: 15,
                                fontWeight: 700,
                                textDecoration: "none",
                                transition: "opacity 0.2s",
                            }}>
                                {slide.cta} →
                            </Link>
                        </div>
                    </div>
                ))}

                {/* Slide dots */}
                <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
                    {heroSlides.map((_, i) => (
                        <button key={i} onClick={() => setActiveSlide(i)} style={{
                            width: i === activeSlide ? 24 : 8,
                            height: 8,
                            borderRadius: 4,
                            background: i === activeSlide ? "#4dd9e8" : "rgba(255,255,255,0.3)",
                            border: "none",
                            cursor: "pointer",
                            transition: "all 0.3s",
                        }} />
                    ))}
                </div>
            </div>

            {/* Stats bar */}
            <div style={{
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                padding: "20px 48px",
            }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 48, alignItems: "center" }}>
                    {customerStats.map((s) => (
                        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 20 }}>{s.icon}</span>
                            <div>
                                <p style={{ color: "#fff", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{s.value}</p>
                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>{s.label}</p>
                            </div>
                        </div>
                    ))}
                    <div style={{ marginLeft: "auto" }}>
                        <Link href="/catalogue" style={{ background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", borderRadius: 20, padding: "8px 20px", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                            Shop Now →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Category showcase */}
            <section style={{ padding: "60px 0" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
                        {categoryShowcase.map((c) => (
                            <Link key={c.name} href={c.href} style={{ textDecoration: "none" }}>
                                <div style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    borderRadius: 14,
                                    padding: "24px 16px",
                                    textAlign: "center",
                                    transition: "all 0.2s",
                                    cursor: "pointer",
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,180,216,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
                                >
                                    <p style={{ fontSize: 28, marginBottom: 8 }}>
                                        {c.name === "Fish" ? "🐠" : c.name === "Plants" ? "🌿" : c.name === "Equipment" ? "⚙️" : c.name === "Food" ? "🍽️" : "🪸"}
                                    </p>
                                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.name}</p>
                                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{c.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section style={{ padding: "60px 0" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.07)", paddingBottom: 16 }}>
                        <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>Featured Products</h2>
                        <Link href="/catalogue" style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                            View all →
                        </Link>
                    </div>

                    {loadingData ? (
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading products...</p>
                    ) : featured.length === 0 ? (
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No featured products yet.</p>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
                            {featured.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Recent Orders */}
            <section style={{ padding: "60px 0" }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px" }}>
                    <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Recent Orders</h2>

                    {loadingData ? (
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 24 }}>
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading your orders...</p>
                        </div>
                    ) : data.recentOrders.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.3)" }}>
                            <p style={{ fontSize: 32 }}>🐟</p>
                            <p style={{ marginTop: 8 }}>No orders yet. <Link href="/catalogue" style={{ color: "#4dd9e8" }}>Start shopping</Link></p>
                        </div>
                    ) : (
                        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
                            {data.recentOrders.map((o, i) => (
                                <div
                                    key={o.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "16px 20px",
                                        borderBottom: i !== data.recentOrders.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
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
            </section>

            {/* Newsletter */}
            <section style={{ background: "rgba(0,180,216,0.06)", borderTop: "1px solid rgba(0,180,216,0.15)", borderBottom: "1px solid rgba(0,180,216,0.15)", padding: "60px 48px" }}>
                <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Stay in the Loop</h2>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 28 }}>Subscribe for new arrivals, care tips, and exclusive offers.</p>
                    <div style={{ display: "flex", gap: 10 }}>
                        <input placeholder="your@email.com" style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                        <button style={{ background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", border: "none", borderRadius: 10, padding: "12px 24px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Subscribe</button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
