"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/users", label: "Users" },
];

export default function AdminHeader() {
    const pathname = usePathname();

    return (
        <header
            style={{
                background: "rgba(10,14,26,0.95)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "0 48px",
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                }}
            >
                <Link
                    href="/admin"
                    style={{
                        textDecoration: "none",
                        flexShrink: 0,
                    }}
                >
                    <span
                        style={{
                            fontSize: 22,
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        AquaLife
                    </span>
                </Link>

                <nav
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginLeft: 8,
                    }}
                >
                    {NAV_ITEMS.map((item) => {
                        const active =
                            pathname === item.href ||
                            (item.href !== "/admin" &&
                                pathname.startsWith(item.href + "/"));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    textDecoration: "none",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 14px",
                                    borderRadius: 10,
                                    background: active
                                        ? "rgba(77,217,232,0.1)"
                                        : "transparent",
                                    border: active
                                        ? "1px solid rgba(77,217,232,0.25)"
                                        : "1px solid transparent",
                                    color: active
                                        ? "#fff"
                                        : "rgba(255,255,255,0.65)",
                                    fontSize: 13,
                                    fontWeight: active ? 700 : 500,
                                    transition: "all 0.15s",
                                }}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
