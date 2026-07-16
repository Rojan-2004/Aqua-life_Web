"use client";
import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Modal from "../../_components/Modal";
import SearchAutocomplete from "../../_components/SearchAutocomplete";
import { handleDeleteProduct } from "@/lib/actions/admin/product-action";
import { PRODUCT_PLACEHOLDER } from "@/lib/utils/placeholder";

interface ProductTableProps {
    data: any[];
    pagination: any;
    search: string;
    category?: string;
    status?: string;
    sortBy?: string;
}

export default function ProductTable({
    data,
    pagination,
    search,
    category = "All",
    status = "All",
    sortBy = "",
}: ProductTableProps) {
    const router = useRouter();
    const params = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [target, setTarget] = useState<any | null>(null);

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const totalPages = pagination?.totalPages ?? 1;
    const total = pagination?.total ?? 0;

    const setQuery = (next: Record<string, string | number>) => {
        const q = new URLSearchParams(params.toString());
        Object.entries(next).forEach(([k, v]) => {
            if (v === "" || v === "All") {
                q.delete(k);
            } else {
                q.set(k, String(v));
            }
        });
        router.push(`/admin/products?${q.toString()}`);
    };

    const onDelete = () => {
        if (!target) return;
        startTransition(async () => {
            const result = await handleDeleteProduct(target.id || target._id);
            if (result.success) {
                toast.success(result.message || "Product deleted successfully");
                setTarget(null);
            } else {
                toast.error(result.message || "Failed to delete product");
            }
        });
    };

    const categories = ["All", "Fish", "Food", "Equipment", "Plants", "Decoration"];
    const statuses = ["All", "active", "inactive"];
    const sortOptions = [
        { label: "Newest", value: "" },
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
        { label: "Stock: Low to High", value: "stock_asc" },
        { label: "Stock: High to Low", value: "stock_desc" },
        { label: "Name: A-Z", value: "name_asc" },
        { label: "Name: Z-A", value: "name_desc" },
    ];

    return (
        <div className="w-full font-sans max-w-7xl mx-auto px-6 py-4">
            {/* Page Header */}
            <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center border-b border-slate-800/60 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight md:text-4xl">
                        Product Catalogue
                    </h1>
                    <p className="mt-2 text-base text-slate-400">
                        Manage your store listings, track inventory levels, and update product details.
                    </p>
                </div>
                <Link
                    href="/admin/products/add"
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 px-6 text-sm font-bold uppercase tracking-[1px] text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:brightness-110"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    New Product
                </Link>
            </div>

            {/* Redesigned Responsive Toolbar */}
            <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/30 p-5 backdrop-blur-md">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left side: Search bar */}
                    <div className="flex-1 min-w-[280px]">
                        <SearchAutocomplete
                            key={search}
                            name="search"
                            defaultValue={search}
                            placeholder="Search products by name..."
                            items={data}
                            getLabel={(p: any) => p.name}
                            getKey={(p: any) => p.id || p._id}
                            onSubmit={(value) => setQuery({ search: value, page: 1 })}
                        />
                    </div>

                    {/* Right side: Filters & Limit Controls */}
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Category filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</span>
                            <select
                                value={category}
                                onChange={(e) => setQuery({ category: e.target.value, page: 1 })}
                                className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status filter */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</span>
                            <select
                                value={status}
                                onChange={(e) => setQuery({ status: e.target.value, page: 1 })}
                                className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            >
                                {statuses.map((stat) => (
                                    <option key={stat} value={stat}>{stat === "All" ? "All statuses" : stat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sort By selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sort</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setQuery({ sortBy: e.target.value, page: 1 })}
                                className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Limit rows selector */}
                        <div className="flex items-center gap-2 border-l border-slate-800 pl-4 ml-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rows</span>
                            <select
                                value={limit}
                                onChange={(e) => setQuery({ limit: e.target.value, page: 1 })}
                                className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-4 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                            >
                                {[5, 10, 20, 50].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Redesigned Table Card */}
            <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20 shadow-2xl shadow-black/30">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/60 text-xs uppercase tracking-[1.5px] text-slate-400">
                                <th style={{ padding: "14px 16px" }} className="font-bold">Image</th>
                                <th style={{ padding: "14px 16px" }} className="font-bold">Name</th>
                                <th style={{ padding: "14px 16px" }} className="font-bold">Price</th>
                                <th style={{ padding: "14px 16px" }} className="font-bold">Category</th>
                                <th style={{ padding: "14px 16px" }} className="font-bold">Stock</th>
                                <th style={{ padding: "14px 16px" }} className="font-bold">Status</th>
                                <th style={{ padding: "14px 16px" }} className="text-right font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {data?.length ? (
                                data.map((p) => {
                                    const hasImage = p.image && p.image !== "default-product.png";
                                    const imageUrl = hasImage ? `/item_photos/${p.image}` : PRODUCT_PLACEHOLDER;
                                    const stockStatus = p.stock <= 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock";
                                    const stockColor = p.stock <= 0 ? "text-rose-400 bg-rose-500/10 border-rose-500/25" : p.stock < 10 ? "text-amber-400 bg-amber-500/10 border-amber-500/25" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";

                                    return (
                                        <tr key={p.id || p._id} className="group transition-colors hover:bg-slate-800/20">
                                            <td style={{ padding: "14px 16px" }}>
                                                <div className="h-14 w-14 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 transition-transform group-hover:scale-105">
                                                    <img
                                                        src={imageUrl}
                                                        alt={p.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = PRODUCT_PLACEHOLDER;
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <span className="font-semibold text-white text-base group-hover:text-cyan-400 transition-colors">{p.name}</span>
                                            </td>
                                            <td style={{ padding: "14px 16px" }} className="font-bold text-cyan-400 text-base">
                                                Rs. {p.price?.toLocaleString()}
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <span className="text-xs uppercase tracking-wider font-bold bg-slate-900 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md">{p.category || "—"}</span>
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-sm font-semibold text-slate-200">{p.stock ?? 0}</span>
                                                    <span className={`inline-flex w-fit rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${stockColor}`}>
                                                        {stockStatus}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <span
                                                    className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider border ${
                                                        p.status === "active" || !p.status
                                                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                    }`}
                                                >
                                                    {p.status || "active"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <div className="flex items-center justify-end gap-2.5">
                                                    <button
                                                        onClick={() => router.push(`/admin/products/${p.id || p._id}`)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-955 text-slate-400 transition-all hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-slate-900"
                                                        title="View"
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => router.push(`/admin/products/${p.id || p._id}/edit`)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-955 text-slate-400 transition-all hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-slate-900"
                                                        title="Edit"
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setTarget(p)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-955 text-slate-400 transition-all hover:border-rose-500/30 hover:text-rose-400 hover:bg-slate-900"
                                                        title="Delete"
                                                    >
                                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800/40 text-4xl shadow-inner">📦</div>
                                            <div>
                                                <p className="text-slate-200 text-lg font-bold">No products found</p>
                                                <p className="text-slate-500 text-sm mt-1">Try resetting the search or category filters.</p>
                                            </div>
                                            <button 
                                                onClick={() => router.push("/admin/products")} 
                                                className="mt-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/20 border border-cyan-800/30 px-4 py-2 rounded-xl transition-all"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-850 bg-slate-900/40 px-6 py-4.5">
                        <span className="text-sm font-medium text-slate-400">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-3">
                            <button
                                disabled={page <= 1}
                                onClick={() => setQuery({ page: page - 1 })}
                                className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-5 text-xs font-bold uppercase tracking-[1px] text-slate-300 transition-all hover:border-cyan-500/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Prev
                            </button>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setQuery({ page: page + 1 })}
                                className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-5 text-xs font-bold uppercase tracking-[1px] text-slate-300 transition-all hover:border-cyan-500/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Modal open={!!target} onClose={() => setTarget(null)} title="Delete Product">
                <p className="mb-6 text-sm text-slate-300 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-white">
                        {target?.name}
                    </span>
                    ? This action will permanently remove the item from stock and catalogue, and cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setTarget(null)}
                        className="h-10 rounded-xl border border-slate-700 bg-slate-900 px-5 text-xs font-bold uppercase tracking-[1px] text-slate-300 hover:text-white cursor-pointer transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isPending}
                        className="h-10 rounded-xl bg-rose-600 px-5 text-xs font-bold uppercase tracking-[1px] text-white hover:bg-rose-700 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
