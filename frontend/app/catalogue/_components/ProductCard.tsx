"use client";

import React, { useState } from "react";
import Link from "next/link";

export interface ProductCardData {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
}

export default function ProductCard({ product }: { product: ProductCardData }) {
    const [imgFailed, setImgFailed] = useState(false);
    const imageSrc = product.images?.[0];

    return (
        <Link key={product.id} href={`/catalogue/${product.id}`} style={{ textDecoration: "none" }}>
            <div
                style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    overflow: "hidden",
                    transition: "0.2s",
                }}
            >
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
                        <span style={{ fontSize: 40 }}>🐟</span>
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
