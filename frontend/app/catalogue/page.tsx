"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCatalogue } from "@/lib/api/product";
import ProductCard from "./_components/ProductCard";

const CATEGORIES = ["All", "Fish", "Food", "Equipment", "Plants", "Decoration"];

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
}

export default function CataloguePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        getCatalogue({ page, category, search })
            .then((data) => {
                if (!active) return;
                setProducts(data.products ?? []);
                setTotal(data.total ?? 0);
                setPages(data.pages ?? 1);
            })
            .catch((e) => {
                console.error("Failed to load catalogue", e);
                if (active) setProducts([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [page, category, search]);

    return (
        <div
            style={{
                fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                background: "#0a0e1a",
                minHeight: "100vh",
            }}
        >
            {/* Header */}
            <header
                style={{
                    background: "rgba(17,24,39,0.8)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                }}
            >
                <div
                    style={{
                        maxWidth: 1440,
                        margin: "0 auto",
                        padding: "16px 32px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <Link
                        href="/dashboard"
                        style={{
                            fontSize: 22,
                            fontWeight: 800,
                            background:
                                "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textDecoration: "none",
                        }}
                    >
                        🌊 AquaLife
                    </Link>
                    <input
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                            setLoading(true);
                        }}
                        style={{
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 30,
                            padding: "8px 18px",
                            color: "#fff",
                            fontSize: 13,
                            fontFamily: "inherit",
                            width: 260,
                            outline: "none",
                        }}
                    />
                </div>
            </header>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
                <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                    Premium Aquatic Catalog
                </h1>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>
                    {total} products available
                </p>

                {/* Category filters */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
                    {CATEGORIES.map((c) => (
                        <button
                            key={c}
                            onClick={() => {
                                setCategory(c);
                                setPage(1);
                                setLoading(true);
                            }}
                            style={{
                                background:
                                    category === c
                                        ? "linear-gradient(135deg,#2d9cdb,#4dd9e8)"
                                        : "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#fff",
                                padding: "7px 18px",
                                borderRadius: 30,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Product grid */}
                {loading ? (
                    <p style={{ color: "#4dd9e8", textAlign: "center", padding: 40 }}>
                        Loading products...
                    </p>
                ) : products.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "60px 0",
                            color: "rgba(255,255,255,0.3)",
                        }}
                    >
                        <p style={{ fontSize: 36 }}>🐠</p>
                        <p style={{ marginTop: 8 }}>No products found.</p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                            gap: 20,
                        }}
                    >
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
                        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                onClick={() => { setPage(n); setLoading(true); }}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    background:
                                        page === n
                                            ? "linear-gradient(135deg,#2d9cdb,#4dd9e8)"
                                            : "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "#fff",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                }}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
