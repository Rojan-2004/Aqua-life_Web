"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const NAV = [
    { label: "Home", href: "/dashboard" },
    { label: "Catalog", href: "/catalogue" },
    { label: "AI Aqua Assistant", href: "/ai-assistant" },
];

export default function Header() {
    const { user, logout } = useAuth();
    const path = usePathname();

    return (
        <header style={{
            background: "rgba(10,14,26,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            position: "sticky",
            top: 0,
            zIndex: 100,
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Link href="/dashboard" style={{ textDecoration: "none" }}>
                    <span style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        🌊 AquaLife
                    </span>
                </Link>

                <nav style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {NAV.map((n) => (
                        <Link key={n.href} href={n.href} style={{
                            textDecoration: "none",
                            color: path === n.href ? "#fff" : "rgba(255,255,255,0.5)",
                            fontSize: 14,
                            fontWeight: path === n.href ? 600 : 400,
                            padding: "6px 14px",
                            borderRadius: 30,
                            background: path === n.href ? "rgba(255,255,255,0.07)" : "transparent",
                            transition: "all 0.15s",
                        }}>
                            {n.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Link href="/cart" style={{
                        textDecoration: "none",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 30,
                        padding: "7px 16px",
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 13,
                        fontWeight: 600,
                    }}>
                        🛒 Cart
                    </Link>

                    {user?.role === "admin" && (
                        <Link href="/admin" style={{
                            textDecoration: "none",
                            background: "rgba(77,217,232,0.08)",
                            border: "1px solid rgba(77,217,232,0.25)",
                            borderRadius: 30,
                            padding: "7px 16px",
                            color: "#4dd9e8",
                            fontSize: 13,
                            fontWeight: 600,
                        }}>
                            🛡️ Admin
                        </Link>
                    )}

                    <Link href="/dashboard/profile" style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textDecoration: "none",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13,
                    }}>
                        {user?.firstName?.charAt(0) || "U"}
                    </Link>

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
    );
}
