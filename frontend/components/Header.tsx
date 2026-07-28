"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCart } from "@/lib/api/cart";
import { getWishlist } from "@/lib/api/wishlist";
import Image from "next/image";

const NAV = [
    { label: "Home", href: "/dashboard" },
    { label: "Catalog", href: "/catalogue" },
    { label: "AI Assistant", href: "/ai-assistant" },
];

export default function Header() {
    const { user, logout } = useAuth();
    const path = usePathname();
    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!user || user.role === "admin") return;
        getCart()
            .then((data) => {
                const items = data?.items ?? data?.cart?.items ?? [];
                const count = items.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity ?? 0), 0);
                setCartCount(count);
            })
            .catch(() => {});
        getWishlist()
            .then((data) => {
                const items = data?.data ?? [];
                setWishlistCount(items.length);
            })
            .catch(() => {});
    }, [user]);

    return (
        <>
            <header style={{
                background: "rgba(10,14,26,0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}>
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 48px", height: 64, display: "flex", alignItems: "center", gap: 40 }}>
                    {/* Logo */}
                    <Link href={user?.role === "admin" ? "/admin" : "/dashboard"} style={{ textDecoration: "none", flexShrink: 0 }}>
                        <Image
                            src="/assets/logo/Aqua_life_logo.png"
                            alt="AquaLife"
                            width={120}
                            height={36}
                            style={{ objectFit: "contain" }}
                            priority
                            onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                            }}
                        />
                    </Link>

                    {/* Nav */}
                    <nav style={{ display: "flex", gap: 4, alignItems: "center", flex: 1 }}>
                        {NAV.map((n) => (
                            <Link key={n.href} href={n.href} style={{
                                textDecoration: "none",
                                color: path === n.href ? "#fff" : "rgba(255,255,255,0.6)",
                                fontSize: 14,
                                fontWeight: path === n.href ? 600 : 400,
                                padding: "6px 14px",
                                borderRadius: 8,
                                background: path === n.href ? "rgba(255,255,255,0.07)" : "transparent",
                                transition: "all 0.15s",
                            }}>
                                {n.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        {/* Search */}
                        <div style={{ position: "relative" }}>
                            <input
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    background: "rgba(255,255,255,0.06)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 20,
                                    padding: "8px 16px 8px 36px",
                                    color: "#fff",
                                    fontSize: 13,
                                    fontFamily: "inherit",
                                    outline: "none",
                                    width: 200,
                                }}
                            />
                            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)", fontSize: 14 }}>🔍</span>
                        </div>

                        {/* Cart */}
                        {user?.role !== "admin" && (
                            <Link href="/cart" style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 20,
                                padding: "7px 16px",
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 600,
                                textDecoration: "none",
                            }}>
                                🛒 Cart
                                {cartCount > 0 && (
                                    <span style={{
                                        background: "#4dd9e8",
                                        color: "#0a0e1a",
                                        borderRadius: "50%",
                                        width: 18,
                                        height: 18,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Wishlist */}
                        {user?.role !== "admin" && (
                            <Link href="/wishlist" style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 20,
                                padding: "7px 16px",
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 600,
                                textDecoration: "none",
                            }}>
                                🤍 Wishlist
                                {wishlistCount > 0 && (
                                    <span style={{
                                        background: "#f87171",
                                        color: "#fff",
                                        borderRadius: "50%",
                                        width: 18,
                                        height: 18,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Profile avatar */}
                        <Link href="/dashboard/profile" style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 13,
                            textDecoration: "none",
                        }}>
                            {user?.firstName?.charAt(0) || "U"}
                        </Link>

                        {user?.role === "admin" && (
                            <Link href="/admin" style={{
                                color: "#4dd9e8",
                                fontSize: 13,
                                fontWeight: 600,
                                textDecoration: "none",
                                border: "1px solid rgba(77,217,232,0.3)",
                                padding: "6px 14px",
                                borderRadius: 20,
                            }}>🛡️</Link>
                        )}

                        <button onClick={() => logout()} style={{
                            background: "none",
                            border: "none",
                            color: "rgba(255,255,255,0.35)",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}>
                            Logout
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}
