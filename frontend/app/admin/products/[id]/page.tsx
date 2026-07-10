import { handleGetProductById } from "@/lib/actions/admin/product-action";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PRODUCT_PLACEHOLDER } from "@/lib/utils/placeholder";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await handleGetProductById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const p = result.data;
    const hasImage = p.image && p.image !== "default-product.png";
    const imageUrl = hasImage ? `/item_photos/${p.image}` : PRODUCT_PLACEHOLDER;

    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh", padding: "40px 20px" }} className="font-sans text-white">
            <div className="mx-auto w-full max-w-lg">
                <div className="mb-6">
                    <Link
                        href="/admin/products"
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-2 inline-flex items-center gap-1 no-underline"
                    >
                        ← Back to Catalog
                    </Link>
                    <h2 className="text-3xl font-bold text-white mt-1">Product Details</h2>
                    <p className="text-sm text-slate-400">Detailed product record sheet.</p>
                </div>

                <div className="border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden">
                    {/* Image Preview */}
                    <div className="h-64 w-full bg-slate-900 border-b border-slate-800 flex items-center justify-center overflow-hidden">
                        <img 
                            src={imageUrl} 
                            alt={p.name} 
                            className="h-full w-full object-cover" 
                        />
                    </div>

                    <div className="p-6 flex flex-col gap-4">
                        {/* Name */}
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">Name</span>
                            <h1 className="text-2xl font-bold text-white mt-0.5">{p.name}</h1>
                        </div>

                        {/* Price */}
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">Price</span>
                            <p className="text-xl font-bold text-cyan-400 mt-0.5">Rs. {p.price?.toLocaleString()}</p>
                        </div>

                        {/* Description */}
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">Description</span>
                            <p className="text-sm text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap">{p.description}</p>
                        </div>

                        {/* Status */}
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">Status</span>
                            <div className="mt-1">
                                <span
                                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[1px] ${
                                        p.status === "active" || !p.status
                                            ? "bg-emerald-500/20 text-emerald-400"
                                            : "bg-rose-500/20 text-rose-400"
                                    }`}
                                >
                                    {p.status || "active"}
                                </span>
                            </div>
                        </div>

                        {/* Quick Edit button */}
                        <div className="mt-4 flex gap-3 border-t border-slate-800/80 pt-5">
                            <Link
                                href={`/admin/products/${p.id || p._id}/edit`}
                                className="flex-1 h-10 flex items-center justify-center bg-cyan-500 text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-cyan-600 transition-colors no-underline"
                            >
                                Edit Product
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
