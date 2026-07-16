"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCart, CartItemData } from "@/lib/api/cart";
import { placeOrder } from "@/lib/api/order";
import Footer from "@/components/Footer";

import Image from "next/image";

const SHIPPING_FLAT = 50;
const FREE_SHIPPING_THRESHOLD = 50000;

export default function CheckoutPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItemData[]>([]);
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        province: "",
        district: "",
        city: "Kathmandu",
        street: "",
        postalCode: "",
        landmark: "",
    });

    useEffect(() => {
        if (!loading && !user) router.replace("/frontend/login");
    }, [user, loading, router]);

    useEffect(() => {
        if (user && !form.email) {
            setForm(f => ({
                ...f,
                fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                email: user.email || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        getCart()
            .then((res) => setCartItems(res.data ?? []))
            .catch((e) => {
                console.error("Failed to load cart", e);
                setError("Could not load your cart.");
            });
    }, [user]);

    const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const subtotal = cartItems.reduce((s, i) => s + (i.product?.price ?? 0) * i.quantity, 0);
    const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const total = subtotal + shipping;

    const placeOrderHandler = async () => {
        if (!form.fullName || !form.email || !form.phone || !form.province || !form.district || !form.city || !form.street || !form.postalCode) {
            setError("Please fill in all required fields.");
            return;
        }
        setPlacing(true);
        setError("");
        try {
            const shippingAddress = {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                province: form.province,
                district: form.district,
                city: form.city,
                street: form.street,
                postalCode: form.postalCode,
                landmark: form.landmark,
            };
            const res = await placeOrder(shippingAddress);
            if (res.success && res.orderId) {
                router.push(`/checkout/success?orderId=${res.orderId}`);
            } else {
                setError(res.message || "Something went wrong.");
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Something went wrong.");
        } finally {
            setPlacing(false);
        }
    };

    const inputStyle = {
        width: "100%",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "12px 16px",
        color: "#fff",
        fontSize: 14,
        fontFamily: "inherit",
        outline: "none",
        boxSizing: "border-box" as const,
        transition: "border-color 0.2s",
    };
    const labelStyle = {
        color: "rgba(255,255,255,0.5)",
        fontSize: 11,
        letterSpacing: 1,
        textTransform: "uppercase" as const,
        display: "block",
        marginBottom: 7,
    };

    if (loading || !user) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
                <p style={{ color: "#4dd9e8", fontSize: 18 }}>Loading...</p>
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
            <header style={{ background: "rgba(17,24,39,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href={user?.role === "admin" ? "/admin" : "/dashboard"} style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                        <Image
                            src="/logo/Aqua_life_logo.png"
                            alt="AquaLife"
                            width={120}
                            height={36}
                            style={{ objectFit: "contain" }}
                            priority
                        />
                    </Link>
                    <nav style={{ display: "flex", gap: 28 }}>
                        {["Catalog", "Freshwater", "Marine", "Plants", "Supplies"].map((n) => (
                            <span key={n} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer" }}>{n}</span>
                        ))}
                    </nav>
                </div>
            </header>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 0" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 48 }}>
                    {[
                        { n: "✓", label: "CART", done: true },
                        { n: "2", label: "SHIPPING", done: false, active: true },
                        { n: "3", label: "PAYMENT", done: false },
                    ].map((step, i) => (
                        <React.Fragment key={step.label}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: step.done ? "#4ade80" : step.active ? "linear-gradient(135deg,#2d9cdb,#4dd9e8)" : "rgba(255,255,255,0.1)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontWeight: 700, fontSize: 14,
                                }}>
                                    {step.n}
                                </div>
                                <span style={{ color: step.active ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 11, letterSpacing: 1, fontWeight: step.active ? 700 : 400 }}>{step.label}</span>
                            </div>
                            {i < 2 && <div style={{ width: 120, height: 1, background: "rgba(255,255,255,0.15)", margin: "0 8px", marginBottom: 22 }} />}
                        </React.Fragment>
                    ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>
                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 32 }}>
                        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 28, display: "flex", alignItems: "center", gap: 10 }}>
                            🚚 Shipping Information
                        </h2>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                            <div>
                                <label style={labelStyle}>Full Name *</label>
                                <input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="John Doe" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Email *</label>
                                <input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="john@example.com" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>Phone Number *</label>
                            <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+977 9800000000" style={inputStyle} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                            <div>
                                <label style={labelStyle}>Province *</label>
                                <input value={form.province} onChange={(e) => set("province", e.target.value)} placeholder="e.g. Bagmati" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>District *</label>
                                <input value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="e.g. Kathmandu" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                            <div>
                                <label style={labelStyle}>City *</label>
                                <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Kathmandu" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Postal Code *</label>
                                <input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} placeholder="44600" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>Street Address *</label>
                            <input value={form.street} onChange={(e) => set("street", e.target.value)} placeholder="Street Name, House No." style={inputStyle} />
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <label style={labelStyle}>Landmark / Area</label>
                            <input value={form.landmark} onChange={(e) => set("landmark", e.target.value)} placeholder="Near Patan Durbar" style={inputStyle} />
                        </div>

                        {error && <p style={{ color: "#f87171", fontSize: 13, marginTop: 16 }}>{error}</p>}

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 36 }}>
                            <Link href="/cart" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                                ← Back to Cart
                            </Link>
                            <button onClick={placeOrderHandler} disabled={placing || cartItems.length === 0}
                                style={{
                                    background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                                    border: "none", borderRadius: 30,
                                    padding: "14px 48px",
                                    color: "#fff", fontSize: 15, fontWeight: 700,
                                    cursor: placing ? "not-allowed" : "pointer",
                                    fontFamily: "inherit",
                                    opacity: placing ? 0.7 : 1,
                                    letterSpacing: 0.5,
                                }}>
                                {placing ? "Placing Order..." : "PLACE ORDER"}
                            </button>
                        </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 24, position: "sticky", top: 90 }}>
                        <h3 style={{ color: "#fff", fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Order Summary</h3>

                        {cartItems.length === 0 ? (
                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Your cart is empty.</p>
                        ) : (
                            <>
                                <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                                    {cartItems.map((item) => (
                                        <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                            <div style={{ width: 52, height: 52, borderRadius: 8, background: "rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {item.product?.images?.[0]
                                                    ? <img src={item.product.images[0]} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    : <span>🐟</span>}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.product?.name}</p>
                                                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Qty: {item.quantity}</p>
                                            </div>
                                            <p style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>Rs. {((item.product?.price ?? 0) * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Subtotal</span>
                                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>Rs. {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Delivery Fee</span>
                                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
                                    </div>
                                </div>

                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16, marginTop: 12 }}>
                                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>TOTAL AMOUNT</span>
                                    <p style={{ fontSize: 26, fontWeight: 800, background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginTop: 4 }}>
                                        Rs. {total.toLocaleString()}
                                    </p>
                                </div>
                            </>
                        )}

                        <div style={{ marginTop: 20, background: "rgba(77,217,232,0.07)", border: "1px solid rgba(77,217,232,0.2)", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <span style={{ fontSize: 16 }}>🔒</span>
                            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.5 }}>
                                Your payment is secured by industry-standard encryption. AquaLife guarantees the safety of your transaction.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
