"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCart, removeCartItem, CartItemData } from "@/lib/api/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const VAT_RATE = 0.13;
const SHIPPING_FLAT = 50;
const FREE_SHIPPING_THRESHOLD = 50000;

export default function CartPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [items, setItems] = useState<CartItemData[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) router.replace("/frontend/login");
    }, [loading, user, router]);

    useEffect(() => {
        if (!user) return;
        getCart()
            .then((res) => setItems(res.data ?? []))
            .catch((e) => console.error("Failed to load cart", e))
            .finally(() => setLoadingData(false));
    }, [user]);

    const handleRemove = async (cartItemId: string) => {
        setRemoving(cartItemId);
        try {
            await removeCartItem(cartItemId);
            setItems((prev) => prev.filter((i) => i.id !== cartItemId));
        } catch (e) {
            console.error("Failed to remove item", e);
        } finally {
            setRemoving(null);
        }
    };

    const subtotal = items.reduce(
        (s, i) => s + (i.product?.price ?? 0) * i.quantity,
        0
    );
    const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const vat = 0;
    const total = subtotal + shipping;

    if (loading || !user) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
                <p style={{ color: "#4dd9e8", fontSize: 18, fontWeight: 600 }}>Loading...</p>
            </div>
        );
    }

    if (user.role === "admin") {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
                <div style={{ textAlign: "center", padding: 40 }}>
                    <p style={{ fontSize: 48, marginBottom: 16 }}>🔒</p>
                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Admin accounts cannot purchase products</h2>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 24 }}>Please use a regular user account to shop.</p>
                    <Link href="/dashboard" style={{ color: "#4dd9e8", fontWeight: 600, fontSize: 14, textDecoration: "none" }}>← Back to Dashboard</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh" }}>
            <Header />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
                <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 700, marginBottom: 28 }}>Your Cart</h1>

                {loadingData ? (
                    <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading cart...</p>
                ) : items.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
                        <p style={{ fontSize: 32 }}>🛒</p>
                        <p style={{ marginTop: 8 }}>Your cart is empty.</p>
                        <Link href="/catalogue" style={{ color: "#4dd9e8", fontWeight: 600, fontSize: 14 }}>Browse products →</Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {items.map((item) => (
                                <div key={item.id} style={{ display: "flex", gap: 16, alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 16 }}>
                                    <div style={{ width: 72, height: 72, borderRadius: 10, background: "rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {item.product?.images?.[0] ? (
                                            <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <span style={{ fontSize: 24 }}>🐟</span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>{item.product?.name}</p>
                                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 2 }}>Qty: {item.quantity} · Rs. {((item.product?.price ?? 0) * item.quantity).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        disabled={removing === item.id}
                                        style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
                                    >
                                        {removing === item.id ? "Removing..." : "Remove"}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, position: "sticky", top: 90 }}>
                            <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Subtotal</span>
                                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Rs. {subtotal.toLocaleString()}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Shipping</span>
                                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
                                </div>
                            </div>
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, marginTop: 16 }}>
                                <p style={{ fontSize: 24, fontWeight: 800, background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Rs. {total.toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => router.push("/checkout")}
                                style={{ marginTop: 20, width: "100%", background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", border: "none", borderRadius: 30, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                            >
                                PROCEED TO CHECKOUT
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
