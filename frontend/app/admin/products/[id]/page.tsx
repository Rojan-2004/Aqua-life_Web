"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { handleGetProductById } from "@/lib/actions/admin/product-action";
import { handleDeleteProduct } from "@/lib/actions/admin/product-action";
import { handleDeleteReview, handleUpdateReviewStatus } from "@/lib/actions/admin/review-action";
import { PRODUCT_PLACEHOLDER } from "@/lib/utils/placeholder";
import { toast } from "react-toastify";

interface Review {
    id: string;
    userId: string;
    rating: number;
    comment: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

interface ProductData {
    _id: string;
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    status: string;
    isActive: boolean;
    isFeatured: boolean;
    isSoldOut: boolean;
    image: string;
    images: string[];
    specs: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span
                key={i}
                style={{
                    color: i <= rating ? "#fbbf24" : "#334155",
                    fontSize: size,
                    lineHeight: 1,
                }}
            >
                ★
            </span>
        );
    }
    return <span style={{ display: "inline-flex", gap: 2 }}>{stars}</span>;
};

const getAvatarColor = (name: string) => {
    const colors = [
        "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
        "linear-gradient(135deg,#f59e0b,#ef4444)",
        "linear-gradient(135deg,#10b981,#3b82f6)",
        "linear-gradient(135deg,#8b5cf6,#ec4899)",
        "linear-gradient(135deg,#f97316,#eab308)",
    ];
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const getInitials = (firstName: string, lastName: string) => {
    const first = (firstName || "").charAt(0);
    const last = (lastName || "").charAt(0);
    return (first + last).toUpperCase() || "U";
};

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    published: { bg: "rgba(74,222,128,0.15)", text: "#4ade80", label: "Published" },
    hidden: { bg: "rgba(148,163,184,0.15)", text: "#94a3b8", label: "Hidden" },
    reported: { bg: "rgba(248,113,113,0.15)", text: "#f87171", label: "Reported" },
};

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);
    const [deleting, setDeleting] = useState(false);
    const [reviewActions, setReviewActions] = useState<Record<string, boolean>>({});

    useEffect(() => {
        let active = true;
        const fetchProduct = async () => {
            if (!params.id) return;
            try {
                const result = await handleGetProductById(params.id);
                if (active && result.success && result.data) {
                    setProduct(result.data as ProductData);
                } else if (active) {
                    toast.error(result.message || "Failed to load product");
                }
            } catch {
                if (active) toast.error("Failed to load product");
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchProduct();
        return () => { active = false; };
    }, [params.id]);

    const handleDelete = async () => {
        if (!params.id || !confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
        setDeleting(true);
        try {
            const result = await handleDeleteProduct(params.id);
            if (result.success) {
                toast.success("Product deleted successfully");
                router.push("/admin/products");
            } else {
                toast.error(result.message || "Failed to delete product");
            }
        } catch {
            toast.error("Failed to load product");
        } finally {
            setDeleting(false);
        }
    };

    const handleReviewAction = async (reviewId: string, action: "delete" | "hide" | "unhide" | "report") => {
        setReviewActions(prev => ({ ...prev, [reviewId]: true }));
        try {
            if (action === "delete") {
                const result = await handleDeleteReview(params.id, reviewId);
                if (result.success) {
                    toast.success("Review deleted");
                    setProduct(prev => prev ? {
                        ...prev,
                        reviews: prev.reviews.filter(r => r.id !== reviewId),
                        totalReviews: prev.totalReviews - 1,
                    } : null);
                } else {
                    toast.error(result.message);
                }
            } else if (action === "hide") {
                const result = await handleUpdateReviewStatus(params.id, reviewId, "hidden");
                if (result.success) {
                    toast.success("Review hidden");
                    setProduct(prev => prev ? {
                        ...prev,
                        reviews: prev.reviews.map(r => r.id === reviewId ? { ...r, status: "hidden" } : r),
                    } : null);
                } else {
                    toast.error(result.message);
                }
            } else if (action === "unhide") {
                const result = await handleUpdateReviewStatus(params.id, reviewId, "published");
                if (result.success) {
                    toast.success("Review published");
                    setProduct(prev => prev ? {
                        ...prev,
                        reviews: prev.reviews.map(r => r.id === reviewId ? { ...r, status: "published" } : r),
                    } : null);
                } else {
                    toast.error(result.message);
                }
            } else if (action === "report") {
                const result = await handleUpdateReviewStatus(params.id, reviewId, "reported");
                if (result.success) {
                    toast.success("Review reported");
                    setProduct(prev => prev ? {
                        ...prev,
                        reviews: prev.reviews.map(r => r.id === reviewId ? { ...r, status: "reported" } : r),
                    } : null);
                } else {
                    toast.error(result.message);
                }
            }
        } catch {
            toast.error("Action failed");
        } finally {
            setReviewActions(prev => ({ ...prev, [reviewId]: false }));
        }
    };

    if (loading) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#4dd9e8", fontSize: 18, fontWeight: 600 }}>Loading product...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ background: "#0a0e1a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>Product not found.</p>
                <Link href="/admin/products" style={{ color: "#4dd9e8", fontWeight: 600, textDecoration: "none" }}>← Back to Catalog</Link>
            </div>
        );
    }

    const rawImages = product.images?.length ? product.images : (product.image && product.image !== "default-product.png" ? [product.image] : []);
    const allImages = rawImages.map((img) => {
        if (!img || img === "default-product.png") return null;
        if (String(img).startsWith("http")) return img;
        return `/item_photos/${img}`;
    }).filter(Boolean) as string[];
    const displayImage = allImages[activeImg] || PRODUCT_PLACEHOLDER;
    const isLocalImage = displayImage.startsWith("/item_photos/");
    const imageUrl = isLocalImage ? displayImage : (displayImage.startsWith("http") ? displayImage : PRODUCT_PLACEHOLDER);

    const cardStyle = {
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 24,
    };

    const labelStyle = {
        fontSize: 11,
        color: "rgba(255,255,255,0.4)",
        fontWeight: 600,
        textTransform: "uppercase" as const,
        letterSpacing: 1,
        marginBottom: 4,
    };

    const valueStyle = {
        color: "#fff",
        fontSize: 14,
        fontWeight: 500,
    };

    const isOutOfStock = product.isSoldOut || (product.stock ?? 0) <= 0;

    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh", fontFamily: "var(--font-outfit), 'Outfit', sans-serif" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px" }}>
                {/* Header */}
                <div style={{ marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <Link href="/admin/products" style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                            ← Back to Catalog
                        </Link>
                        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, margin: "8px 0 4px" }}>{product.name}</h1>
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Product Details & Reviews</p>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                        <Link
                            href={`/admin/products/${product.id || product._id}/edit`}
                            style={{ textDecoration: "none", padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                        >
                            Edit Product
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(248,113,113,0.3)", background: deleting ? "rgba(248,113,113,0.1)" : "rgba(248,113,113,0.05)", color: "#f87171", fontSize: 13, fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.6 : 1 }}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 24, marginBottom: 32 }}>
                    {/* Left: Image Gallery */}
                    <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                        <div style={{ height: 400, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img
                                src={imageUrl}
                                alt={product.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        {allImages.length > 1 && (
                            <div style={{ display: "flex", gap: 10, padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImg(i)}
                                        style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 10,
                                            overflow: "hidden",
                                            border: i === activeImg ? "2px solid #4dd9e8" : "1px solid rgba(255,255,255,0.1)",
                                            cursor: "pointer",
                                            padding: 0,
                                            background: "rgba(255,255,255,0.03)",
                                        }}
                                    >
                                        <img
                                            src={img}
                                            alt={`thumb-${i}`}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info Cards */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* General Information */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#4dd9e8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>General Information</h3>
                            <div style={{ display: "grid", gap: 14 }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ ...labelStyle, marginBottom: 0 }}>Product Name</span>
                                    <span style={{ ...valueStyle, textAlign: "right", maxWidth: "60%" }}>{product.name}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ ...labelStyle, marginBottom: 0 }}>Category</span>
                                    <span style={{ ...valueStyle, background: "rgba(77,217,232,0.1)", padding: "2px 10px", borderRadius: 6, fontSize: 12 }}>{product.category || "—"}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ ...labelStyle, marginBottom: 0 }}>Description</span>
                                </div>
                                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6, marginTop: -8, marginBottom: 0 }}>{product.description}</p>
                            </div>
                        </div>

                        {/* Pricing & Inventory */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#4dd9e8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Pricing & Inventory</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <span style={labelStyle}>Price</span>
                                    <p style={{ ...valueStyle, fontSize: 20, fontWeight: 700, color: "#4dd9e8" }}>Rs. {product.price?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <span style={labelStyle}>Stock Quantity</span>
                                    <p style={{ ...valueStyle, fontSize: 20, fontWeight: 700 }}>{product.stock ?? 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Product Status */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#4dd9e8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Product Status</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                <span style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "6px 12px",
                                    borderRadius: 8,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    background: (product.status === "active" || !product.status) ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)",
                                    color: (product.status === "active" || !product.status) ? "#4ade80" : "#f87171",
                                }}>
                                    {(product.status === "active" || !product.status) ? "● Active" : "● Inactive"}
                                </span>
                                {product.isFeatured && (
                                    <span style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        background: "rgba(251,191,36,0.15)",
                                        color: "#fbbf24",
                                    }}>
                                        ★ Featured
                                    </span>
                                )}
                                {isOutOfStock && (
                                    <span style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        background: "rgba(248,113,113,0.15)",
                                        color: "#f87171",
                                    }}>
                                        ⚠ Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Product Metadata */}
                        <div style={cardStyle}>
                            <h3 style={{ fontSize: 12, fontWeight: 700, color: "#4dd9e8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Product Metadata</h3>
                            <div style={{ display: "grid", gap: 12 }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={labelStyle}>Product ID</span>
                                    <span style={{ ...valueStyle, fontFamily: "monospace", fontSize: 12 }}>{product.id || product._id}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={labelStyle}>Category</span>
                                    <span style={{ ...valueStyle }}>{product.category || "—"}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={labelStyle}>Stock</span>
                                    <span style={{ ...valueStyle, color: product.stock && product.stock < 10 ? "#fbbf24" : "#fff" }}>{product.stock ?? 0} units</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={labelStyle}>Created</span>
                                    <span style={{ ...valueStyle, fontSize: 12 }}>{product.createdAt ? new Date(product.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={labelStyle}>Last Updated</span>
                                    <span style={{ ...valueStyle, fontSize: 12 }}>{product.updatedAt ? new Date(product.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Reviews Section */}
                <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Customer Reviews</h3>
                            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                                {product.totalReviews > 0 ? (
                                    <>Average rating: <span style={{ color: "#fbbf24", fontWeight: 600 }}>{product.averageRating}</span> ({product.totalReviews} review{product.totalReviews !== 1 ? "s" : ""})</>
                                ) : "No reviews yet"}
                            </p>
                        </div>
                        {product.totalReviews > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 28, fontWeight: 800, color: "#fbbf24" }}>{product.averageRating}</span>
                                <div>
                                    <StarRating rating={Math.round(product.averageRating)} size={18} />
                                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{product.totalReviews} reviews</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ padding: "16px 24px" }}>
                        {product.reviews.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.3)" }}>
                                <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>💬</span>
                                <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>No customer reviews have been submitted for this product yet.</p>
                                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>Reviews will appear here once customers start leaving feedback.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {product.reviews.map((review) => {
                                    const avatarColor = getAvatarColor(`${review.user.firstName} ${review.user.lastName}`);
                                    const initials = getInitials(review.user.firstName, review.user.lastName);
                                    const statusConf = statusConfig[review.status] || statusConfig.published;
                                    const isBusy = reviewActions[review.id];

                                    return (
                                        <div key={review.id} style={{ display: "flex", gap: 14, padding: "16px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12 }}>
                                            {/* Avatar */}
                                            <div style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: "50%",
                                                background: avatarColor,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff",
                                                fontSize: 14,
                                                fontWeight: 700,
                                                flexShrink: 0,
                                            }}>
                                                {initials}
                                            </div>

                                            {/* Review Content */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{review.user.firstName} {review.user.lastName}</span>
                                                        <StarRating rating={review.rating} size={14} />
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <span style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: 4,
                                                            padding: "3px 10px",
                                                            borderRadius: 6,
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                            background: statusConf.bg,
                                                            color: statusConf.text,
                                                        }}>
                                                            {statusConf.label}
                                                        </span>
                                                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                                                            {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                        </span>
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.6, margin: "0 0 10px 0" }}>{review.comment}</p>
                                                )}
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    {review.status === "published" ? (
                                                        <button
                                                            onClick={() => handleReviewAction(review.id, "hide")}
                                                            disabled={isBusy}
                                                            style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, cursor: isBusy ? "not-allowed" : "pointer", opacity: isBusy ? 0.5 : 1 }}
                                                        >
                                                            Hide
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleReviewAction(review.id, "unhide")}
                                                            disabled={isBusy}
                                                            style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid rgba(74,222,128,0.2)", background: "rgba(74,222,128,0.05)", color: "#4ade80", fontSize: 11, fontWeight: 600, cursor: isBusy ? "not-allowed" : "pointer", opacity: isBusy ? 0.5 : 1 }}
                                                        >
                                                            Publish
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleReviewAction(review.id, "report")}
                                                        disabled={isBusy || review.status === "reported"}
                                                        style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid rgba(251,191,36,0.2)", background: review.status === "reported" ? "rgba(251,191,36,0.1)" : "rgba(251,191,36,0.03)", color: review.status === "reported" ? "#fbbf24" : "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, cursor: isBusy || review.status === "reported" ? "not-allowed" : "pointer", opacity: isBusy ? 0.5 : 1 }}
                                                    >
                                                        {review.status === "reported" ? "Reported" : "Report"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReviewAction(review.id, "delete")}
                                                        disabled={isBusy}
                                                        style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.03)", color: "#f87171", fontSize: 11, fontWeight: 600, cursor: isBusy ? "not-allowed" : "pointer", opacity: isBusy ? 0.5 : 1 }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
