"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleUpdateProduct } from "@/lib/actions/admin/product-action";
import { productSchema, CATEGORIES } from "./schema";

export default function ProductFormEdit({ product }: { product: any }) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPending, startTransition] = useTransition();

    const [name, setName] = useState(product?.name || "");
    const [price, setPrice] = useState(String(product?.price || ""));
    const [description, setDescription] = useState(product?.description || "");
    const [status, setStatus] = useState<"active" | "inactive">(product?.status || "active");
    const [category, setCategory] = useState<string>(product?.category || "Fish");
    const [stock, setStock] = useState(String(product?.stock ?? ""));
    const [isFeatured, setIsFeatured] = useState<boolean>(Boolean(product?.isFeatured));
    const [imageFile, setImageFile] = useState<File | null>(null);

    const currentImageName = product?.image || "default-product.png";
    const initialPreview = currentImageName !== "default-product.png" ? `/item_photos/${currentImageName}` : null;
    const [imagePreview, setImagePreview] = useState<string | null>(initialPreview);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, itemPhoto: "Image size must be less than 2MB" }));
            return;
        }

        if (!file.type.startsWith("image/")) {
            setErrors(prev => ({ ...prev, itemPhoto: "File must be a valid image" }));
            return;
        }

        setErrors(prev => {
            const copy = { ...prev };
            delete copy.itemPhoto;
            return copy;
        });

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const removeSelectedImage = () => {
        setImageFile(null);
        setImagePreview(initialPreview);
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
            const result = await handleUpdateProduct(product.id || product._id, formData);
            if (result.success) {
                setSuccessMessage("Product updated successfully! Redirecting...");
                setTimeout(() => {
                    router.push("/admin/products");
                }, 1500);
            } else {
                setServerError(result.message || "Failed to update product");
            }
        });
    };

    const fieldClass =
        "block w-full border border-slate-800 bg-slate-900 px-4 py-3 text-base text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition-colors";
    const labelClass =
        "block text-sm font-semibold text-slate-300 mb-2";
    const errClass = "mt-2 text-sm text-rose-400 font-medium";

    return (
        <form onSubmit={onSubmit} className="font-sans">
            <div className="mb-10">
                <Link
                    href="/admin/products"
                    className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 mb-3 inline-flex items-center gap-1 no-underline"
                >
                    ← Back to Catalog
                </Link>
                <h2 className="text-4xl font-bold text-white mt-2 mb-2">Edit Product</h2>
                <p className="text-base text-slate-400">Update live details for this catalog item.</p>
            </div>

            {serverError && (
                <div className="mb-8 border border-rose-900 bg-rose-950/30 p-4 text-base text-rose-400 font-medium rounded-lg">
                    {serverError}
                </div>
            )}
            {successMessage && (
                <div className="mb-8 border border-emerald-900 bg-emerald-950/30 p-4 text-base text-emerald-400 font-medium rounded-lg">
                    {successMessage}
                </div>
            )}

            <div className="space-y-10">
                {/* Image */}
                <section className="border border-slate-800 bg-slate-900/40 rounded-xl p-8">
                    <h3 className="text-base font-bold text-cyan-400 uppercase tracking-[1px] mb-8">Product Image</h3>
                    <div className="flex items-center gap-6">
                        <div
                            onClick={triggerFileSelect}
                            className="h-28 w-28 border-2 border-dashed border-slate-700 hover:border-cyan-500 bg-slate-900/50 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden relative transition-colors group"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-3xl text-slate-600 group-hover:text-cyan-400">+</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={triggerFileSelect}
                                className="h-11 border border-slate-700 bg-slate-900 px-5 text-sm font-bold uppercase tracking-[1px] text-white hover:border-slate-600 cursor-pointer"
                            >
                                Change Image
                            </button>
                            {imageFile && (
                                <button
                                    type="button"
                                    onClick={removeSelectedImage}
                                    className="text-sm font-semibold text-rose-400 hover:text-rose-300 text-left cursor-pointer"
                                >
                                    Revert image
                                </button>
                            )}
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                    {errors.itemPhoto && <p className={errClass}>{errors.itemPhoto}</p>}
                </section>

                {/* Name */}
                <section className="border border-slate-800 bg-slate-900/40 rounded-xl p-8">
                    <h3 className="text-base font-bold text-cyan-400 uppercase tracking-[1px] mb-8">General Information</h3>
                    <div className="space-y-7">
                        <div>
                            <label className={labelClass}>Product Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Neon Tetra Fish"
                                className={fieldClass}
                            />
                            {errors.name && <p className={errClass}>{errors.name}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={fieldClass}
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className={labelClass}>Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className={fieldClass}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && <p className={errClass}>{errors.status}</p>}
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section className="border border-slate-800 bg-slate-900/40 rounded-xl p-8">
                    <h3 className="text-base font-bold text-cyan-400 uppercase tracking-[1px] mb-8">Pricing & Inventory</h3>
                    <div className="space-y-7">
                        <div>
                            <label className={labelClass}>Price (Rs.)</label>
                            <input
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="e.g. 1500"
                                className={fieldClass}
                            />
                            {errors.price && <p className={errClass}>{errors.price}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Stock</label>
                            <input
                                type="number"
                                min={0}
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                placeholder="e.g. 50"
                                className={fieldClass}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                id="featured-edit"
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="h-5 w-5 accent-cyan-500 rounded"
                            />
                            <label htmlFor="featured-edit" className="text-base text-slate-300">
                                Mark as Featured (shows in Shop spotlight)
                            </label>
                        </div>
                    </div>
                </section>

                {/* Description */}
                <section className="border border-slate-800 bg-slate-900/40 rounded-xl p-8">
                    <h3 className="text-base font-bold text-cyan-400 uppercase tracking-[1px] mb-8">Description</h3>
                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the product details, specs, or care guides..."
                            rows={6}
                            className={fieldClass}
                        />
                        {errors.description && <p className={errClass}>{errors.description}</p>}
                    </div>
                </section>
            </div>

            {/* Actions */}
            <div className="mt-10 flex items-center justify-end gap-4">
                <Link
                    href="/admin/products"
                    className="h-12 border border-slate-700 bg-slate-900 px-8 text-sm font-bold uppercase tracking-[1.5px] text-slate-300 hover:text-white transition-colors inline-flex items-center no-underline"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isPending}
                    className="h-12 bg-cyan-500 px-8 text-base font-bold uppercase tracking-[1.5px] text-white hover:bg-cyan-600 disabled:opacity-50 transition-colors cursor-pointer"
                >
                    {isPending ? "Saving..." : "Save Product Details"}
                </button>
            </div>
        </form>
    );
}
