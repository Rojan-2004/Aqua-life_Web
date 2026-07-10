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

    // Form inputs
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"active" | "inactive">("active");
    const [category, setCategory] = useState<string>("Fish");
    const [stock, setStock] = useState("");
    const [isFeatured, setIsFeatured] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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
                <h2 className="text-3xl font-bold text-white mt-1">Create Product</h2>
                <p className="text-sm text-slate-400">Add a new aquatic item to the live store listing.</p>
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
                                Choose File
                            </button>
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={removeSelectedImage}
                                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 text-left cursor-pointer"
                                >
                                    Remove image
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

                {/* Category */}
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

                {/* Stock */}
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

                {/* Featured */}
                <div className="flex items-center gap-2">
                    <input
                        id="featured"
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="h-4 w-4 accent-cyan-500"
                    />
                    <label htmlFor="featured" className="text-sm text-slate-300">
                        Mark as Featured (shows in Shop spotlight)
                    </label>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 h-11 bg-cyan-500 text-sm font-bold uppercase tracking-[1.5px] text-white hover:bg-cyan-600 disabled:opacity-50 transition-colors cursor-pointer"
                >
                    {isPending ? "Creating..." : "Create Product"}
                </button>
            </div>
        </form>
    );
}
