"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Modal from "../../_components/Modal";
import { handleDeleteProduct } from "@/lib/actions/admin/product-action";
import { PRODUCT_PLACEHOLDER } from "@/lib/utils/placeholder";

export default function ProductTable({
    data,
    pagination,
    search,
}: {
    data: any[];
    pagination: any;
    search: string;
}) {
    const router = useRouter();
    const params = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [target, setTarget] = useState<any | null>(null); // product pending deletion

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const totalPages = pagination?.totalPages ?? 1;
    const total = pagination?.total ?? 0;

    const setQuery = (next: Record<string, string | number>) => {
        const q = new URLSearchParams(params.toString());
        Object.entries(next).forEach(([k, v]) => q.set(k, String(v)));
        router.push(`/admin/products?${q.toString()}`);
    };

    const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value = new FormData(e.currentTarget).get("search") as string;
        setQuery({ search: value ?? "", page: 1 });
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

    return (
        <div className="mx-auto w-full max-w-[1100px] py-6 font-sans">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <Link
                        href="/admin"
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-2 inline-flex items-center gap-1 no-underline"
                    >
                        ← Back to Admin Panel
                    </Link>
                    <h2 className="text-3xl font-bold text-white mt-1">Product Catalog</h2>
                    <p className="text-sm text-slate-400">{total} total products</p>
                </div>
                <Link
                    href="/admin/products/create"
                    className="flex h-10 items-center bg-cyan-500 px-4 text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-cyan-600 transition-colors"
                >
                    New Product
                </Link>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={onSearch} className="flex w-full max-w-sm gap-2">
                    <input
                        name="search"
                        defaultValue={search}
                        placeholder="Search products by name..."
                        className="h-10 w-full border border-slate-800 bg-slate-900 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button className="h-10 border border-slate-800 bg-slate-900 px-4 text-xs font-bold uppercase tracking-[1.5px] text-slate-300 hover:text-white transition-colors cursor-pointer">
                        Search
                    </button>
                </form>

                <label className="flex items-center gap-2 text-xs uppercase tracking-[1.5px] text-slate-400">
                    Rows
                    <select
                        value={limit}
                        onChange={(e) => setQuery({ limit: e.target.value, page: 1 })}
                        className="h-10 border border-slate-800 bg-slate-900 px-2 text-sm text-white outline-none focus:border-cyan-500 transition-colors"
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-900/30">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="border-b border-slate-800 bg-slate-900/50 text-xs uppercase tracking-[1px] text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">Image</th>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Price</th>
                            <th className="px-4 py-3 font-medium">Description</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                        {data?.length ? (
                            data.map((p) => {
                                const hasImage = p.image && p.image !== "default-product.png";
                                const imageUrl = hasImage ? `/item_photos/${p.image}` : PRODUCT_PLACEHOLDER;

                                return (
                                    <tr key={p.id || p._id} className="hover:bg-slate-900/50 transition-colors">
                                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                                            <div className="h-10 w-10 overflow-hidden rounded bg-slate-800 border border-slate-700 flex items-center justify-center">
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
                                        <td className="px-4 py-3 text-white font-medium">
                                            {p.name}
                                        </td>
                                        <td className="px-4 py-3 text-cyan-400 font-semibold">
                                            Rs. {p.price?.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-slate-300 max-w-[250px] truncate">
                                            {p.description}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[1px] ${
                                                    p.status === "active" || !p.status
                                                        ? "bg-emerald-500/20 text-emerald-400"
                                                        : "bg-rose-500/20 text-rose-400"
                                                }`}
                                            >
                                                {p.status || "active"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-3 text-xs font-medium uppercase tracking-[1px]">
                                                <Link href={`/admin/products/${p.id || p._id}`} className="text-slate-400 hover:text-white">
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/admin/products/${p.id || p._id}/edit`}
                                                    className="text-slate-400 hover:text-white"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => setTarget(p)}
                                                    className="text-slate-400 hover:text-rose-400 cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                                    No products found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                <span>
                    Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => setQuery({ page: page - 1 })}
                        className="h-9 border border-slate-800 px-3 text-xs uppercase tracking-[1px] text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                    >
                        Prev
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setQuery({ page: page + 1 })}
                        className="h-9 border border-slate-800 px-3 text-xs uppercase tracking-[1px] text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </div>

            <Modal open={!!target} onClose={() => setTarget(null)} title="Delete Product">
                <p className="mb-6 text-sm text-slate-300">
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-white">
                        {target?.name}
                    </span>
                    ? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setTarget(null)}
                        className="h-10 border border-slate-700 bg-slate-900 px-4 text-xs font-bold uppercase tracking-[1.5px] text-slate-300 hover:text-white cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isPending}
                        className="h-10 bg-rose-600 px-4 text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-rose-700 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
