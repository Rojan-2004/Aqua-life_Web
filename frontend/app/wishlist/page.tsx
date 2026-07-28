"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getWishlist, toggleWishlist } from "@/lib/api/wishlist";
import ProductCard, { ProductCardData } from "@/app/catalogue/_components/ProductCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

interface WishlistItem {
    id: string;
    product: {
        id: string;
        name: string;
        price: number;
        category: string;
        images: string[];
    };
}

export default function WishlistPage() {
    const { user } = useAuth();
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const loadWishlist = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getWishlist();
            setItems(data.data ?? []);
        } catch (e) {
            console.error("Failed to load wishlist", e);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, [user]);

    const handleRemove = async (itemId: string, productId: string) => {
        if (!user) return;
        setRemovingId(itemId);
        try {
            await toggleWishlist(productId);
            setItems((prev) => prev.filter((i) => i.id !== itemId));
            toast.success("Removed from wishlist");
        } catch (e) {
            console.error("Failed to remove from wishlist", e);
            toast.error("Failed to update wishlist");
        } finally {
            setRemovingId(null);
        }
    };

    const productCards: ProductCardData[] = items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        description: "",
        price: i.product.price,
        category: i.product.category,
        images: i.product.images || [],
        stock: 0,
    }));

    return (
        <div style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh" }}>
            <Header />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 32px 60px" }}>
                <div style={{ marginBottom: 24 }}>
                    <Link href="/catalogue" style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                        ← Back to Catalogue
                    </Link>
                    <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: "8px 0 4px" }}>My Wishlist</h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                        {items.length} item{items.length === 1 ? "" : "s"} saved
                    </p>
                </div>

                {loading ? (
                    <p style={{ color: "#4dd9e8", textAlign: "center", padding: 40 }}>Loading wishlist...</p>
                ) : productCards.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
                        <p style={{ fontSize: 36 }}>🤍</p>
                        <p style={{ marginTop: 8 }}>No wishlist items yet.</p>
                        <Link href="/catalogue" style={{ color: "#4dd9e8", fontWeight: 600, textDecoration: "none", marginTop: 12, display: "inline-block" }}>
                            Browse Catalogue
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
                        {productCards.map((p) => (
                            <div key={p.id} style={{ position: "relative" }}>
                                <ProductCard
                                    product={p}
                                    onToggleWishlist={user ? async () => {
                                        const item = items.find((i) => i.product.id === p.id);
                                        if (item) await handleRemove(item.id, p.id);
                                    } : undefined}
                                    isWishlisted
                                />
                                {removingId && (
                                    <div style={{ position: "absolute", inset: 0, background: "rgba(10,14,26,0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>
                                        Removing...
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
