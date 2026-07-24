"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getProduct } from "@/lib/api/product";
import { toggleWishlist } from "@/lib/api/wishlist";
import { addToCart } from "@/lib/api/cart";
import { PRODUCT_PLACEHOLDER } from "@/lib/utils/placeholder";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";

interface Review {
    id: string;
    rating: number;
    comment?: string;
    user: { firstName?: string; lastName?: string } | null;
}

interface ProductDetail {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    stock?: number;
    isSoldOut?: boolean;
    specs?: Record<string, unknown>;
}

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const { user } = useAuth();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [wishlisted, setWishlisted] = useState(false);
    const [busy, setBusy] = useState(false);
    const [qty, setQty] = useState(1);
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const [mainImgFailed, setMainImgFailed] = useState(false);
    const [thumbFails, setThumbFails] = useState<Set<number>>(new Set());

    const handleAddToCart = async () => {
        if (!user) return;
        setAdding(true);
        try {
            await addToCart(params.id, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (e) {
            console.error("Add to cart failed", e);
        } finally {
            setAdding(false);
        }
    };

    useEffect(() => {
        let active = true;
        getProduct(params.id)
            .then((data) => {
                if (!active) return;
                setProduct(data.product ?? null);
                setReviews(data.reviews ?? []);
            })
            .catch((e) => {
                console.error("Failed to load product", e);
                if (active) setProduct(null);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, [params.id]);

    const handleWishlist = async () => {
        if (!user) return;
        setBusy(true);
        try {
            const res = await toggleWishlist(params.id);
            setWishlisted(!!res.wishlisted);
        } catch (e) {
            console.error("Wishlist toggle failed", e);
        } finally {
            setBusy(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    background: "#0a0e1a",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                }}
            >
                <p style={{ color: "#4dd9e8", fontSize: 18, fontWeight: 600 }}>
                    Loading product...
                </p>
            </div>
        );
    }

    if (!product) {
        return (
            <div
                style={{
                    background: "#0a0e1a",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                }}
            >
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>
                    Product not found.
                </p>
                <Link href="/catalogue" style={{ color: "#4dd9e8", fontWeight: 600 }}>
                    ← Back to catalogue
                </Link>
            </div>
        );
    }

    const images = product.images?.length ? product.images : [];

    const isOutOfStock = product.isSoldOut || (product.stock ?? 0) <= 0;

    return (
        <div
            style={{
                fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                background: "#0a0e1a",
                minHeight: "100vh",
            }}
        >
            <Header />

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 32px 0" }}>
                <Link href="/catalogue" style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                    ← Back to Catalogue
                </Link>
            </div>

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 40 }}>
                {/* Gallery */}
                <div>
                    <div
                        style={{
                            height: 360,
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: 14,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                    {images[activeImg] && !mainImgFailed ? (
                        <img
                            src={images[activeImg]}
                            alt={product.name}
                            onError={() => setMainImgFailed(true)}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <img src={PRODUCT_PLACEHOLDER} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                    </div>
                    {images.length > 1 && (
                        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setActiveImg(i); setMainImgFailed(false); }}
                                    style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 10,
                                        overflow: "hidden",
                                        border:
                                            i === activeImg && !thumbFails.has(i)
                                                ? "2px solid #4dd9e8"
                                                : "1px solid rgba(255,255,255,0.1)",
                                        cursor: "pointer",
                                        padding: 0,
                                        background: "rgba(255,255,255,0.03)",
                                    }}
                                >
                                    {thumbFails.has(i) ? (
                                        <img src={PRODUCT_PLACEHOLDER} alt={`thumb-${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <img
                                            src={img}
                                            alt={`thumb-${i}`}
                                            onError={() => setThumbFails(prev => new Set(prev).add(i))}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div>
                    <span
                        style={{
                            fontSize: 11,
                            color: "#4dd9e8",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                        }}
                    >
                        {product.category}
                    </span>
                    <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 700, margin: "6px 0 12px" }}>
                        {product.name}
                    </h1>
                    <p style={{ color: "#4dd9e8", fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
                        Rs. {product.price.toLocaleString()}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                        {product.description}
                    </p>

                    {/* Add to cart */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8, marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}>
                            <button
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                disabled={isOutOfStock}
                                style={{ width: 36, height: 44, background: "none", border: "none", color: "#fff", fontSize: 18, cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                            >
                                −
                            </button>
                            <span style={{ color: "#fff", fontWeight: 600, fontSize: 15, minWidth: 28, textAlign: "center" }}>{qty}</span>
                            <button
                                onClick={() => setQty((q) => Math.min(product.stock ?? 99, q + 1))}
                                disabled={isOutOfStock}
                                style={{ width: 36, height: 44, background: "none", border: "none", color: "#fff", fontSize: 18, cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                            >
                                +
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={adding || !user || isOutOfStock}
                            style={{
                                flex: 1,
                                height: 46,
                                background: isOutOfStock
                                    ? "rgba(255,255,255,0.05)"
                                    : added
                                    ? "rgba(74,222,128,0.15)"
                                    : "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                                border: isOutOfStock
                                    ? "1px solid rgba(255,255,255,0.1)"
                                    : added
                                    ? "1px solid #4ade80"
                                    : "none",
                                borderRadius: 12,
                                color: isOutOfStock ? "rgba(255,255,255,0.3)" : added ? "#4ade80" : "#fff",
                                fontSize: 14,
                                fontWeight: 700,
                                cursor: isOutOfStock ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                transition: "all 0.2s",
                                opacity: adding ? 0.7 : 1,
                            }}
                        >
                            {!user
                                ? "Login to Add"
                                : isOutOfStock
                                ? "Out of Stock"
                                : adding
                                ? "Adding..."
                                : added
                                ? "✓ Added to Cart"
                                : "Add to Cart"}
                        </button>
                    </div>

                    <p style={{
                        fontSize: 12,
                        color: (product.stock ?? 0) > 10 ? "#4ade80" : (product.stock ?? 0) > 0 ? "#fbbf24" : "#f87171",
                        marginBottom: 16,
                    }}>
                        {isOutOfStock
                            ? "✗ Out of Stock"
                            : (product.stock ?? 0) > 10
                            ? "✓ In Stock"
                            : `⚠ Only ${product.stock} left`}
                    </p>

                    {product.specs && Object.keys(product.specs).length > 0 && (
                        <div
                            style={{
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 12,
                                padding: 16,
                                marginBottom: 24,
                            }}
                        >
                            <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                                Specifications
                            </p>
                            {Object.entries(product.specs).map(([k, v]) => (
                                <div
                                    key={k}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: 13,
                                        padding: "4px 0",
                                        color: "rgba(255,255,255,0.6)",
                                    }}
                                >
                                    <span style={{ textTransform: "capitalize" }}>{k}</span>
                                    <span style={{ color: "#fff" }}>{String(v)}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        onClick={handleWishlist}
                        disabled={!user || busy}
                        style={{
                            background: wishlisted
                                ? "rgba(248,113,113,0.15)"
                                : "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                            border: "none",
                            borderRadius: 10,
                            padding: "12px 24px",
                            color: wishlisted ? "#f87171" : "#fff",
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: !user || busy ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            opacity: !user ? 0.6 : 1,
                        }}
                    >
                        {wishlisted ? "♥ In Wishlist" : "♡ Add to Wishlist"}
                    </button>
                </div>
            </div>

            {/* Reviews */}
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 60px" }}>
                <ReviewSection productId={product.id} />
            </div>

            <Footer />
        </div>
    );
}
