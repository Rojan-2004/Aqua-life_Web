"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCatalogue } from "@/lib/api/product";
import { addToCart } from "@/lib/api/cart";
import ProductCard, { ProductCardData } from "./_components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

const CATEGORIES = ["All", "Fish", "Food", "Equipment", "Plants", "Decoration"];

interface Product extends ProductCardData {
    stock?: number;
}

export default function CataloguePage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState<string | null>(null);

    const sortedProducts = React.useMemo(() => {
        const list = [...products];
        if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
        else if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
        else list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        return list;
    }, [products, sort]);

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

    const handleAddToCart = async (id: string) => {
        if (!user) return;
        setAddingId(id);
        try {
            await addToCart(id, 1);
        } catch (e) {
            console.error("Add to cart failed", e);
        } finally {
            setAddingId(null);
        }
    };

    return (
        <div
            style={{
                fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                background: "#0a0e1a",
                minHeight: "100vh",
            }}
        >
            <Header />

            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 48px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 40 }}>
                {/* Sidebar filters */}
                <aside>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Filter</p>

                    {/* Category filter */}
                    <div style={{ marginBottom: 28 }}>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Category</p>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setCategory(cat);
                                    setPage(1);
                                    setLoading(true);
                                }}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    textAlign: "left",
                                    background: category === cat ? "rgba(0,180,216,0.12)" : "none",
                                    border: "none",
                                    borderLeft: `2px solid ${category === cat ? "#4dd9e8" : "transparent"}`,
                                    color: category === cat ? "#4dd9e8" : "rgba(255,255,255,0.6)",
                                    fontSize: 14,
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    marginBottom: 2,
                                    borderRadius: "0 8px 8px 0",
                                    transition: "all 0.15s",
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Price range */}
                    <div>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Price Range</p>
                        <div style={{ display: "flex", gap: 8 }}>
                            <input
                                type="number"
                                placeholder="Min"
                                style={{ width: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 10px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }}
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                style={{ width: "50%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 10px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }}
                            />
                        </div>
                    </div>
                </aside>

                {/* Main grid */}
                <main>
                    {/* Top bar — results count + sort */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{total} products</p>
                        <select
                            value={sort}
                            onChange={(e) => {
                                setSort(e.target.value);
                                setPage(1);
                                setLoading(true);
                            }}
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "7px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit", outline: "none" }}
                        >
                            <option value="newest" style={{ background: "#0a0e1a" }}>Newest</option>
                            <option value="price_asc" style={{ background: "#0a0e1a" }}>Price: Low to High</option>
                            <option value="price_desc" style={{ background: "#0a0e1a" }}>Price: High to Low</option>
                        </select>
                    </div>

                    {loading ? (
                        <p style={{ color: "#4dd9e8", textAlign: "center", padding: 40 }}>Loading products...</p>
                    ) : products.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
                            <p style={{ fontSize: 36 }}>🐠</p>
                            <p style={{ marginTop: 8 }}>No products found.</p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                            {sortedProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    onAddToCart={user ? handleAddToCart : undefined}
                                />
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
                                        background: page === n ? "linear-gradient(135deg,#2d9cdb,#4dd9e8)" : "rgba(255,255,255,0.05)",
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
                </main>
            </div>

            <Footer />
        </div>
    );
}
