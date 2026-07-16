"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleCreateProduct } from "@/lib/actions/admin/product-action";
import { productSchema, CATEGORIES } from "./schema";

export default function ProductForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPending, startTransition] = useTransition();

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"active" | "inactive">("active");
    const [category, setCategory] = useState<string>("Fish");
    const [stock, setStock] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Drag and drop states
    const [dragActive, setDragActive] = useState(false);

    const validateFile = (file: File): boolean => {
        if (file.size > 2 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, itemPhoto: "Image size must be less than 2MB" }));
            return false;
        }

        if (!file.type.startsWith("image/")) {
            setErrors(prev => ({ ...prev, itemPhoto: "File must be a valid image" }));
            return false;
        }

        setErrors(prev => {
            const copy = { ...prev };
            delete copy.itemPhoto;
            return copy;
        });
        return true;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (validateFile(file)) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const removeSelectedImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setServerError("");
        setSuccessMessage("");

        const validation = productSchema.safeParse({
            name,
            price,
            description,
            status,
        });

        if (!validation.success) {
            const zodErrors: Record<string, string> = {};
            validation.error.issues.forEach((err) => {
                const path = err.path[0] as string;
                zodErrors[path] = err.message;
            });
            setErrors(zodErrors);
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("status", status);
        formData.append("category", category);
        formData.append("stock", stock);
        formData.append("isFeatured", String(isFeatured));
        if (imageFile) {
            formData.append("itemPhoto", imageFile);
        }

        startTransition(async () => {
            const result = await handleCreateProduct(formData);
            if (result.success) {
                setSuccessMessage("Product created successfully! Redirecting...");
                setTimeout(() => {
                    router.push("/admin/products");
                }, 1500);
            } else {
                setServerError(result.message || "Failed to create product");
            }
        });
    };

    const inputWrapperClass = "relative mt-1";
    const baseFieldStyle = {
        width: "100%",
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "12px 16px",
        color: "#fff",
        fontSize: "14px",
        fontFamily: "inherit",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxSizing: "border-box" as const,
    };

    const getFieldStyle = (errorKey: string) => {
        return {
            ...baseFieldStyle,
            borderColor: errors[errorKey] ? "#f87171" : "rgba(255, 255, 255, 0.08)",
            boxShadow: errors[errorKey] ? "0 0 0 2px rgba(248, 113, 113, 0.1)" : "none",
        };
    };

    const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2";
    const cardClass = "border border-slate-800/80 bg-slate-900/20 rounded-2xl p-6 backdrop-blur-md";
    const errClass = "mt-2 text-xs font-semibold text-rose-400 flex items-center gap-1";

    return (
        <form onSubmit={onSubmit} className="font-sans">
            {/* Header section */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800/60 pb-6">
                <div>
                    <Link
                        href="/admin/products"
                        className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 no-underline"
                    >
                        ← Back to Catalog
                    </Link>
                    <h2 className="text-3xl font-extrabold text-white mt-3">Add New Product</h2>
                    <p className="text-sm text-slate-400 mt-1">Configure details, pricing, stock levels, and upload images.</p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                    <Link
                        href="/admin/products"
                        className="h-11 border border-slate-800 bg-slate-950 px-6 text-sm font-bold uppercase tracking-[1px] text-slate-300 hover:text-white transition-all rounded-xl inline-flex items-center no-underline"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="h-11 bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 text-sm font-bold uppercase tracking-[1px] text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/35 hover:brightness-110 rounded-xl cursor-pointer"
                    >
                        {isPending ? "Creating..." : "Save Product"}
                    </button>
                </div>
            </div>

            {/* Error notifications */}
            {serverError && (
                <div className="mb-8 border border-rose-950 bg-rose-500/10 p-4 text-sm text-rose-400 font-semibold rounded-xl flex items-center gap-2">
                    <span>⚠</span> {serverError}
                </div>
            )}
            {successMessage && (
                <div className="mb-8 border border-emerald-950 bg-emerald-500/10 p-4 text-sm text-emerald-400 font-semibold rounded-xl flex items-center gap-2 animate-pulse">
                    <span>✓</span> {successMessage}
                </div>
            )}

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Form (2 Columns Span) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* General Information Card */}
                    <div className={cardClass}>
                        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <span>📝</span> General Details
                        </h3>
                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>Product Name</label>
                                <div className={inputWrapperClass}>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Premium Marine Salt Mix"
                                        style={getFieldStyle("name")}
                                        onFocus={(e) => e.target.style.borderColor = "rgba(77,217,232,0.5)"}
                                        onBlur={(e) => e.target.style.borderColor = errors.name ? "#f87171" : "rgba(255, 255, 255, 0.08)"}
                                    />
                                </div>
                                {errors.name && (
                                    <p className={errClass}>
                                        <span>⚠</span> {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Category</label>
                                    <div className={inputWrapperClass}>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            style={getFieldStyle("category")}
                                            className="cursor-pointer"
                                        >
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c} className="bg-slate-950">
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Status</label>
                                    <div className={inputWrapperClass}>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value as any)}
                                            style={getFieldStyle("status")}
                                            className="cursor-pointer"
                                        >
                                            <option value="active" className="bg-slate-950">Active / Visible</option>
                                            <option value="inactive" className="bg-slate-950">Inactive / Hidden</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className={cardClass}>
                        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <span>📄</span> Description
                        </h3>
                        <div>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Write a professional description including features, guidelines, and benefits..."
                                rows={5}
                                style={getFieldStyle("description")}
                                onFocus={(e) => e.target.style.borderColor = "rgba(77,217,232,0.5)"}
                                onBlur={(e) => e.target.style.borderColor = errors.description ? "#f87171" : "rgba(255, 255, 255, 0.08)"}
                            />
                            {errors.description && (
                                <p className={errClass}>
                                    <span>⚠</span> {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Pricing & Stock Card */}
                    <div className={cardClass}>
                        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <span>💸</span> Pricing & Inventory
                        </h3>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Price (Rs.)</label>
                                    <div className={inputWrapperClass}>
                                        <input
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="e.g. 2499"
                                            style={getFieldStyle("price")}
                                            onFocus={(e) => e.target.style.borderColor = "rgba(77,217,232,0.5)"}
                                            onBlur={(e) => e.target.style.borderColor = errors.price ? "#f87171" : "rgba(255, 255, 255, 0.08)"}
                                        />
                                    </div>
                                    {errors.price && (
                                        <p className={errClass}>
                                            <span>⚠</span> {errors.price}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className={labelClass}>Stock Quantity</label>
                                    <div className={inputWrapperClass}>
                                        <input
                                            type="number"
                                            min={0}
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            placeholder="e.g. 35"
                                            style={getFieldStyle("stock")}
                                            onFocus={(e) => e.target.style.borderColor = "rgba(77,217,232,0.5)"}
                                            onBlur={(e) => e.target.style.borderColor = errors.stock ? "#f87171" : "rgba(255, 255, 255, 0.08)"}
                                        />
                                    </div>
                                    {errors.stock && (
                                        <p className={errClass}>
                                            <span>⚠</span> {errors.stock}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-slate-950/20 border border-slate-800/40 p-4 rounded-xl">
                                <input
                                    id="featured"
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                    className="h-5 w-5 accent-cyan-400 rounded cursor-pointer"
                                />
                                <label htmlFor="featured" className="text-sm font-semibold text-slate-300 cursor-pointer">
                                    Promote as Featured listing
                                    <span className="block text-xs font-normal text-slate-500 mt-0.5">This product will be shown prominently on spotlight carousels.</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Drag-and-drop Image Uploader */}
                    <div className={cardClass}>
                        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <span>🖼</span> Product Image
                        </h3>
                        
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={triggerFileSelect}
                            style={{
                                border: dragActive ? "2px dashed #4dd9e8" : "2px dashed rgba(255, 255, 255, 0.12)",
                                background: dragActive ? "rgba(77,217,232,0.04)" : "rgba(255, 255, 255, 0.01)",
                                minHeight: 180,
                            }}
                            className="rounded-2xl flex flex-col items-center justify-center cursor-pointer p-6 transition-all hover:border-cyan-400/50 hover:bg-slate-900/40 group relative"
                        >
                            {imagePreview ? (
                                <div className="relative w-full max-w-[200px] h-36 rounded-xl overflow-hidden border border-slate-800">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeSelectedImage();
                                        }}
                                        style={{ background: "rgba(239, 68, 68, 0.9)" }}
                                        className="absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow hover:bg-red-600 transition-colors"
                                        title="Remove image"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="text-3xl mb-3 text-slate-500 group-hover:text-cyan-400 transition-colors">📤</div>
                                    <p className="text-sm font-semibold text-slate-300">Drag and drop your image here</p>
                                    <p className="text-xs text-slate-500 mt-1">or click to browse files (JPEG, PNG, WEBP up to 2MB)</p>
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        {errors.itemPhoto && (
                            <p className={errClass}>
                                <span>⚠</span> {errors.itemPhoto}
                            </p>
                        )}
                    </div>

                </div>

                {/* Right Column: Live Product Preview (1 Column Span) */}
                <div className="lg:col-span-1 lg:sticky lg:top-[90px]">
                    <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "18px", padding: 24 }}>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Live Preview</h3>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">Visualizer</span>
                        </div>

                        {/* Interactive mockup product card */}
                        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl transition-all">
                            {/* Card gallery image */}
                            <div className="h-56 bg-slate-900 flex items-center justify-center overflow-hidden relative">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Mockup" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-slate-600">
                                        <span className="text-5xl block mb-2">🐠</span>
                                        <span className="text-xs">No image uploaded</span>
                                    </div>
                                )}
                                {isFeatured && (
                                    <span style={{ background: "linear-gradient(135deg,#f2994a,#f2c94c)" }} className="absolute top-3 right-3 text-[10px] font-bold text-slate-950 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                        Featured
                                    </span>
                                )}
                            </div>

                            {/* Card Content details */}
                            <div className="p-5 space-y-3">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-850 px-2 py-0.5 rounded">
                                        {category}
                                    </span>
                                    <h4 className="text-white text-lg font-bold mt-2 truncate">
                                        {name.trim() || "Product Title Placeholder"}
                                    </h4>
                                </div>

                                <p className="text-cyan-400 text-xl font-bold">
                                    Rs. {price ? parseFloat(price).toLocaleString() : "0"}
                                </p>

                                <div className="border-t border-slate-900 pt-3 flex items-center justify-between">
                                    <span className={`text-[11px] font-bold uppercase tracking-wider rounded-lg px-2.5 py-0.5 border ${
                                        status === "active" 
                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    }`}>
                                        {status}
                                    </span>
                                    <span className="text-xs text-slate-500 font-semibold">
                                        Stock: {stock || "0"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tips card */}
                        <div className="mt-5 bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 flex gap-3">
                            <span className="text-base text-cyan-400">💡</span>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Provide accurate specs, descriptions, and pictures to ensure customer transparency and increase conversion rates.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </form>
    );
}
