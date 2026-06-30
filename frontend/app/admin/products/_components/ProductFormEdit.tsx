"use client";
import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { handleUpdateProduct } from "@/lib/actions/admin/product-action";
import { productSchema } from "./schema";

export default function ProductFormEdit({ product }: { product: any }) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isPending, startTransition] = useTransition();

    // Form inputs loaded from product props
    const [name, setName] = useState(product?.name || "");
    const [price, setPrice] = useState(String(product?.price || ""));
    const [description, setDescription] = useState(product?.description || "");
    const [status, setStatus] = useState<"active" | "inactive">(product?.status || "active");
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Initial image state
    const currentImageName = product?.image || "default-product.png";
    const initialPreview = currentImageName !== "default-product.png" ? `/item_photos/${currentImageName}` : null;
    const [imagePreview, setImagePreview] = useState<string | null>(initialPreview);

    // Validation/Submit Status
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Size check
        if (file.size > 2 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, itemPhoto: "Image size must be less than 2MB" }));
            return;
        }

        // Type check
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

        // Client side validation via Zod
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

        // Submit via FormData
        const formData = new FormData();
        formData.append("name", name);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("status", status);
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
        "block w-full border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition-colors";
    const labelClass =
        "mb-1 block text-xs font-bold uppercase tracking-[1px] text-slate-400";
    const errClass = "mt-1 text-xs text-rose-500 font-semibold";

    return (
        <form onSubmit={onSubmit} className="mx-auto w-full max-w-lg py-6 font-sans">
            <div className="mb-6">
                <Link
                    href="/admin/products"
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-2 inline-flex items-center gap-1 no-underline"
                >
                    ← Back to Catalog
                </Link>
                <h2 className="text-3xl font-bold text-white mt-1">Edit Product</h2>
                <p className="text-sm text-slate-400">Update live details for this catalog item.</p>
            </div>

            {serverError && (
                <div className="mb-6 border border-rose-900 bg-rose-950/30 p-3 text-sm text-rose-400 font-medium">
                    {serverError}
                </div>
            )}
            {successMessage && (
                <div className="mb-6 border border-emerald-900 bg-emerald-950/30 p-3 text-sm text-emerald-400 font-medium">
                    {successMessage}
                </div>
            )}

            <div className="flex flex-col gap-5">
                {/* Image Upload card */}
                <div>
                    <span className={labelClass}>Product Image</span>
                    <div className="mt-2 flex items-center gap-4">
                        <div 
                            onClick={triggerFileSelect}
                            className="h-24 w-24 border-2 border-dashed border-slate-800 hover:border-cyan-500 bg-slate-900/50 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative transition-colors group"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-2xl text-slate-600 group-hover:text-cyan-400">+</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <button
                                type="button"
                                onClick={triggerFileSelect}
                                className="h-9 border border-slate-800 bg-slate-900 px-4 text-xs font-bold uppercase tracking-[1px] text-white hover:border-slate-700 cursor-pointer"
                            >
                                Change Image
                            </button>
                            {imageFile && (
                                <button
                                    type="button"
                                    onClick={removeSelectedImage}
                                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 text-left cursor-pointer"
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
                </div>

                {/* Name */}
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

                {/* Price */}
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

                {/* Description */}
                <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the product details, specs, or care guides..."
                        rows={5}
                        className={fieldClass}
                    />
                    {errors.description && <p className={errClass}>{errors.description}</p>}
                </div>

                {/* Status */}
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

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 h-11 bg-cyan-500 text-sm font-bold uppercase tracking-[1.5px] text-white hover:bg-cyan-600 disabled:opacity-50 transition-colors cursor-pointer"
                >
                    {isPending ? "Saving..." : "Save Product Details"}
                </button>
            </div>
        </form>
    );
}
