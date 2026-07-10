"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createProductJson } from "@/lib/api/admin/product";

const CATEGORIES = ["Fish", "Food", "Equipment", "Plants", "Decoration"];

export default function AddProductPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "Fish",
        stock: "",
        images: "",
        isFeatured: false,
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    if (user && user.role !== "admin") {
        router.push("/dashboard");
        return null;
    }

    const set = (k: keyof typeof form, v: string | boolean) =>
        setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async () => {
        if (!form.name || !form.price || !form.category) {
            setError("Name, price and category are required.");
            return;
        }
        setSaving(true);
        setError("");
        try {
            const res = await createProductJson({
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                category: form.category,
                stock: parseInt(form.stock || "0", 10),
                images: form.images
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                isFeatured: form.isFeatured,
            });
            if (res?.success) {
                router.push("/admin/products");
            } else {
                setError(res?.message || "Failed to save.");
            }
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to save.");
        } finally {
            setSaving(false);
        }
    };

    const field = (
        label: string,
        key: keyof typeof form,
        type = "text",
        placeholder = ""
    ) => (
        <div style={{ marginBottom: 20 }}>
            <label
                style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 12,
                    display: "block",
                    marginBottom: 6,
                }}
            >
                {label}
            </label>
            {key === "description" ? (
                <textarea
                    value={form[key] as string}
                    onChange={(e) => set(key, e.target.value)}
                    rows={4}
                    style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        color: "#fff",
                        fontSize: 14,
                        fontFamily: "inherit",
                        resize: "vertical",
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                />
            ) : (
                <input
                    type={type}
                    value={form[key] as string}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={placeholder}
                    style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 10,
                        padding: "10px 14px",
                        color: "#fff",
                        fontSize: 14,
                        fontFamily: "inherit",
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                />
            )}
        </div>
    );

    return (
        <div
            style={{
                fontFamily: "var(--font-outfit), 'Outfit', sans-serif",
                background: "#0a0e1a",
                minHeight: "100vh",
                padding: "48px 32px",
            }}
        >
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <Link
                    href="/admin/products"
                    style={{
                        color: "#4dd9e8",
                        fontSize: 13,
                        fontWeight: 600,
                        textDecoration: "none",
                    }}
                >
                    ← Back to Products
                </Link>
                <p
                    style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        margin: "16px 0 8px",
                    }}
                >
                    Admin · Products
                </p>
                <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 32 }}>
                    Add New Product
                </h1>

                {field("Product Name", "name", "text", "e.g. Neon Tetra Bundle")}
                {field("Description", "description")}
                {field("Price (Rs.)", "price", "number", "e.g. 1299")}
                {field("Stock", "stock", "number", "e.g. 50")}
                {field("Image URLs (comma separated)", "images", "text", "https://...")}

                <div style={{ marginBottom: 20 }}>
                    <label
                        style={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: 12,
                            display: "block",
                            marginBottom: 6,
                        }}
                    >
                        Category
                    </label>
                    <select
                        value={form.category}
                        onChange={(e) => set("category", e.target.value)}
                        style={{
                            width: "100%",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 10,
                            padding: "10px 14px",
                            color: "#fff",
                            fontSize: 14,
                            fontFamily: "inherit",
                            outline: "none",
                        }}
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c} style={{ background: "#0a0e1a" }}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                    <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => set("isFeatured", e.target.checked)}
                        id="featured"
                    />
                    <label
                        htmlFor="featured"
                        style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}
                    >
                        Mark as Featured (shows in Weekly Spotlight)
                    </label>
                </div>

                {error && (
                    <p style={{ color: "#f87171", fontSize: 13, marginBottom: 16 }}>
                        {error}
                    </p>
                )}

                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        style={{
                            flex: 1,
                            background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                            border: "none",
                            borderRadius: 10,
                            padding: "13px 0",
                            color: "#fff",
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: saving ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            opacity: saving ? 0.7 : 1,
                        }}
                    >
                        {saving ? "Saving..." : "Add Product"}
                    </button>
                    <button
                        onClick={() => router.back()}
                        style={{
                            padding: "13px 20px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 10,
                            color: "rgba(255,255,255,0.6)",
                            fontSize: 15,
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
