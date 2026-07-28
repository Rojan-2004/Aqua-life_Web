"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getMyReviews, UserReviewItem } from "@/lib/api/review";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function DashboardReviewsPage() {
    const { user } = useAuth();
    const [reviews, setReviews] = useState<UserReviewItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const data = await getMyReviews();
                setReviews(data.reviews ?? []);
            } catch (e) {
                console.error("Failed to load reviews", e);
                toast.error("Failed to load your reviews");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    const imageSrc = (item: UserReviewItem) => {
        const img = item.productImages?.[0];
        return img || "";
    };

    return (
        <div style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh" }}>
            <Header />

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 60px" }}>
                <div style={{ marginBottom: 24 }}>
                    <Link href="/dashboard" style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                        ← Back to Dashboard
                    </Link>
                    <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: "8px 0 4px" }}>My Reviews</h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                        {reviews.length} review{reviews.length === 1 ? "" : "s"}
                    </p>
                </div>

                {loading ? (
                    <p style={{ color: "#4dd9e8", textAlign: "center", padding: 40 }}>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
                        <p style={{ fontSize: 40 }}>⭐</p>
                        <p style={{ marginTop: 8 }}>You haven’t written any reviews yet.</p>
                        <Link href="/catalogue" style={{ color: "#4dd9e8", fontWeight: 600, textDecoration: "none", marginTop: 12, display: "inline-block" }}>
                            Browse Catalogue
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {reviews.map((r) => (
                            <div key={r.id} style={{ display: "flex", gap: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 16 }}>
                                <div style={{ width: 90, height: 90, borderRadius: 12, overflow: "hidden", background: "rgba(255,255,255,0.03)", flexShrink: 0 }}>
                                    {imageSrc(r) ? (
                                        <img src={imageSrc(r)} alt={r.productName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>🐟</div>
                                    )}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
                                        <div>
                                            <Link href={`/catalogue/${r.productId}`} style={{ color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none" }}>
                                                {r.productName}
                                            </Link>
                                            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>
                                                {r.productCategory} · Rs. {r.productPrice.toLocaleString()}
                                            </p>
                                        </div>
                                        <span style={{ color: "#fbbf24", fontSize: 14, fontWeight: 700 }}>{r.rating}/5</span>
                                    </div>
                                    {r.comment && (
                                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6, marginBottom: 8 }}>{r.comment}</p>
                                    )}
                                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>
                                        {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
