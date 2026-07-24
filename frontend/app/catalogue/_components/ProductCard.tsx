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
}

export default function ProductCard({ product }: { product: ProductCardData }) {
    const [imgFailed, setImgFailed] = useState(false);
    const [hovered, setHovered] = useState(false);
    const imageSrc = product.images?.[0];

    const isNew =
        product.createdAt &&
        Date.now() - new Date(product.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;

    return (
        <Link
            key={product.id}
            href={`/catalogue/${product.id}`}
            style={{ textDecoration: "none" }}
        >
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                    position: "relative",
                    background: hovered ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${hovered ? "rgba(77,217,232,0.25)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 16,
                    overflow: "hidden",
                    transform: hovered ? "translateY(-3px)" : "translateY(0)",
                    boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(77,217,232,0.1)" : "none",
                    transition: "all 0.2s ease",
                }}
            >
                {isNew && (
                    <span
                        style={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            zIndex: 2,
                            background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                            color: "#fff",
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 20,
                        }}
                    >
                        NEW
                    </span>
                )}
                <div
                    style={{
                        height: 180,
                        background: "rgba(255,255,255,0.03)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                    }}
                >
                    {imageSrc && !imgFailed ? (
                        <img
                            src={imageSrc}
                            alt={product.name}
                            onError={() => setImgFailed(true)}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <img src={PRODUCT_PLACEHOLDER} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                </div>
                <div style={{ padding: 16 }}>
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
                    <p
                        style={{
                            color: "#fff",
                            fontSize: 15,
                            fontWeight: 600,
                            marginTop: 4,
                        }}
                    >
                        {product.name}
                    </p>
                    <p
                        style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 12,
                            marginTop: 4,
                            lineHeight: 1.4,
                        }}
                    >
                        {product.description?.slice(0, 60)}...
                    </p>
                    <p
                        style={{
                            color: "#4dd9e8",
                            fontSize: 17,
                            fontWeight: 700,
                            marginTop: 12,
                        }}
                    >
                        Rs. {product.price.toLocaleString()}
                    </p>
                </div>
            </div>
        </Link>
    );
}
