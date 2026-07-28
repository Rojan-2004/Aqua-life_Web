"use client";

import React, { useState } from "react";
import Link from "next/link";

import { PRODUCT_PLACEHOLDER } from "@/lib/utils/placeholder";

export interface ProductCardData {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    createdAt?: string;
    stock?: number;
}

interface ProductCardProps {
    product: ProductCardData;
    onAddToCart?: (id: string) => void;
    onToggleWishlist?: (id: string) => void;
    isWishlisted?: boolean;
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted = false }: ProductCardProps) {
    const [imgFailed, setImgFailed] = useState(false);
    const [hovered, setHovered] = useState(false);
    const imageSrc = product.images?.[0];

    const isNew =
        product.createdAt &&
        Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

    const isSoldOut = (product.stock ?? 0) <= 0;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${hovered ? "rgba(0,180,216,0.3)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 16,
                overflow: "hidden",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.4)" : "none",
                transition: "all 0.2s ease",
                cursor: "pointer",
            }}
        >
            {/* Badges */}
            <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 6, zIndex: 2 }}>
                {isNew && (
                    <span style={{ background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>NEW</span>
                )}
                {isSoldOut && (
                    <span style={{ background: "rgba(248,113,113,0.9)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>SOLD OUT</span>
                )}
            </div>

            {/* Wishlist heart */}
            {onToggleWishlist && (
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                    style={{ position: "absolute", top: 10, right: 10, zIndex: 2, background: "rgba(10,14,26,0.7)", border: "none", borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}
                >
                    {isWishlisted ? "❤️" : "🤍"}
                </button>
            )}

            {/* Image */}
            <Link href={`/catalogue/${product.id}`} style={{ textDecoration: "none" }}>
                <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                    {imageSrc && !imgFailed ? (
                        <img
                            src={imageSrc}
                            alt={product.name}
                            onError={() => setImgFailed(true)}
                            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hovered ? "scale(1.05)" : "scale(1)" }}
                        />
                    ) : (
                        <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🐟</div>
                    )}
                </div>

                <div style={{ padding: 16 }}>
                    <span style={{ fontSize: 10, color: "#4dd9e8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{product.category}</span>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: "6px 0 4px", lineHeight: 1.3 }}>{product.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 10, lineHeight: 1.4 }}>{product.description?.slice(0, 55)}...</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ color: "#4dd9e8", fontSize: 16, fontWeight: 700 }}>Rs. {product.price?.toLocaleString()}</p>
                        {!isSoldOut && onAddToCart && (
                            <button
                                onClick={(e) => { e.preventDefault(); onAddToCart(product.id); }}
                                style={{ background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", border: "none", borderRadius: 20, padding: "6px 14px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                            >
                                + Cart
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
