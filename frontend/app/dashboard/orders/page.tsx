"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getOrders, OrderData } from "@/lib/api/order";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { PRODUCT_PLACEHOLDER } from "@/lib/utils/placeholder";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    pending: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24" },
    processing: { bg: "rgba(77,217,232,0.15)", text: "#4dd9e8" },
    packed: { bg: "rgba(45,156,219,0.15)", text: "#2d9cdb" },
    shipped: { bg: "rgba(77,217,232,0.15)", text: "#4dd9e8" },
    out_for_delivery: { bg: "rgba(45,156,219,0.15)", text: "#2d9cdb" },
    delivered: { bg: "rgba(74,222,128,0.15)", text: "#4ade80" },
    cancelled: { bg: "rgba(248,113,113,0.15)", text: "#f87171" },
};

const formatStatus = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, " ") : "Pending";

export default function OrderHistoryPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<OrderData[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/frontend/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (!user) return;
        getOrders({ limit: 50 })
            .then((data) => {
                setOrders(data.data ?? []);
            })
            .catch((e) => console.error("Failed to load orders", e))
            .finally(() => setLoadingData(false));
    }, [user]);

    if (loading || !user) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
                <p style={{ color: "#4dd9e8", fontSize: 18, fontWeight: 600 }}>Loading orders...</p>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh" }}>
            <Header />

            <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 48px" }}>
                <BackButton href="/dashboard" label="← Back to Dashboard" />

                <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Order History</h1>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 32 }}>Track and review your past purchases.</p>

                {loadingData ? (
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
                        <p style={{ fontSize: 36 }}>📦</p>
                        <p style={{ marginTop: 8 }}>No orders yet.</p>
                        <Link href="/catalogue" style={{ color: "#4dd9e8", fontWeight: 600, fontSize: 14, textDecoration: "none", marginTop: 12, display: "inline-block" }}>
                            Start shopping →
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {orders.map((order) => (
                            <div key={order.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
                                {/* Order header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div>
                                        <p style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Order #{order.id.slice(0, 8)}</p>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
                                            {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <span style={{
                                            background: STATUS_COLORS[order.status]?.bg || "rgba(255,255,255,0.1)",
                                            color: STATUS_COLORS[order.status]?.text || "rgba(255,255,255,0.6)",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            padding: "4px 12px",
                                            borderRadius: 20,
                                        }}>
                                            {formatStatus(order.status)}
                                        </span>
                                        <span style={{ color: "#4dd9e8", fontSize: 14, fontWeight: 700 }}>Rs. {order.total.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Order items */}
                                <div style={{ padding: "12px 20px" }}>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: idx !== order.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                                            <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {item.product?.images?.[0] ? (
                                                    <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                ) : (
                                                    <img src={PRODUCT_PLACEHOLDER} alt={item.product?.name || "Product"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product?.name || "Product"}</p>
                                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Qty: {item.quantity}</p>
                                            </div>
                                            <p style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Shipping address */}
                                {order.shippingAddress && (
                                    <div style={{ padding: "12px 20px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>Shipping to</p>
                                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
                                            {order.shippingAddress.fullName}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.district}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
