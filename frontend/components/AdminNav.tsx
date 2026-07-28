"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
    { href: "/admin/products", label: "Products", icon: "📦" },
    { href: "/admin/orders", label: "Orders", icon: "🧾" },
    { href: "/admin/users", label: "Users", icon: "👥" },
];

function isActive(href: string, pathname: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
}

export default function AdminNav({ children, showBack = false, backHref = "/admin", title = "Admin Panel" }: { children: React.ReactNode; showBack?: boolean; backHref?: string; title?: string }) {
    const pathname = usePathname();

    return (
        <div style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh", display: "flex" }}>
            {/* Sidebar */}
            <aside style={{
                width: 240,
                background: "rgba(17, 24, 39, 0.95)",
                borderRight: "1px solid rgba(255, 255, 255, 0.06)",
                position: "fixed",
                inset: "0 auto 0 0",
                zIndex: 90,
                padding: "24px 0",
                display: "flex",
                flexDirection: "column",
            }}>
                <div style={{ padding: "0 24px 24px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>🌊 AquaLife</span>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 16px", flex: 1 }}>
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href, pathname, item.exact);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 14px",
                                    borderRadius: 12,
                                    background: active ? "rgba(77, 217, 232, 0.08)" : "transparent",
                                    border: `1px solid ${active ? "rgba(77,217,232,0.25)" : "rgba(255,255,255,0.06)"}`,
                                    color: active ? "#fff" : "rgba(255,255,255,0.6)",
                                    fontSize: 14,
                                    fontWeight: active ? 700 : 500,
                                    transition: "all 0.15s",
                                }}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: "16px 24px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: "10px 0", color: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600 }}>
                        ⬅ Customer Dashboard
                    </Link>
                </div>
            </aside>

            {/* Main area */}
            <div style={{ flex: 1, marginLeft: 240, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                {/* Top bar */}
                <header style={{
                    background: "rgba(10,14,26,0.95)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    padding: "18px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                        {showBack && (
                            <Link href={backHref} style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                                ← Back
                            </Link>
                        )}
                        <h1 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>{title}</h1>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ padding: "28px 32px 48px" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
