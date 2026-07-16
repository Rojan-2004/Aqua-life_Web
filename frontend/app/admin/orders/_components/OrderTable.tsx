"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import OrderDetailModal from "./OrderDetailModal";
import SearchAutocomplete from "../../_components/SearchAutocomplete";
import { handleUpdateOrderStatus } from "@/lib/actions/admin/order-action";

const FILTER_STATUSES = [
    { value: "All", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "packed", label: "Packed" },
    { value: "shipped", label: "Shipped" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    delivered: { bg: "rgba(74,222,128,0.15)", text: "#4ade80", label: "Delivered" },
    shipped: { bg: "rgba(77,217,232,0.15)", text: "#4dd9e8", label: "Shipped" },
    out_for_delivery: { bg: "rgba(129,140,248,0.15)", text: "#818cf8", label: "Out for Delivery" },
    packed: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24", label: "Packed" },
    processing: { bg: "rgba(96,165,250,0.15)", text: "#60a5fa", label: "Processing" },
    pending: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24", label: "Pending" },
    cancelled: { bg: "rgba(248,113,113,0.15)", text: "#f87171", label: "Cancelled" },
};

const getStatusDetails = (status?: string) => {
    const s = (status || "pending").toLowerCase();
    return statusColors[s] || { bg: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.6)", label: status || "Pending" };
};

const STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "packed", label: "Packed" },
    { value: "shipped", label: "Shipped" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
];

export default function OrderTable({ data, pagination, search, statusFilter, sortFilter }: {
    data: any[];
    pagination: any;
    search: string;
    statusFilter?: string;
    sortFilter?: string;
}) {
    const router = useRouter();
    const params = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const totalPages = pagination?.totalPages ?? 1;
    const total = pagination?.total ?? 0;

    const setQuery = (next: Record<string, string | number>) => {
        const q = new URLSearchParams(params.toString());
        Object.entries(next).forEach(([k, v]) => q.set(k, String(v)));
        router.push(`/admin/orders?${q.toString()}`);
    };

    const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === "All") {
            setQuery({ status: "", page: 1 });
        } else {
            setQuery({ status: val, page: 1 });
        }
    };

    const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setQuery({ sort: e.target.value, page: 1 });
    };

    const onUpdateStatus = (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        startTransition(async () => {
            const result = await handleUpdateOrderStatus(orderId, newStatus);
            if (result.success) {
                toast.success(`Order status updated to ${newStatus}`);
                router.refresh();
            } else {
                toast.error(result.message || "Failed to update status");
            }
            setUpdatingId(null);
        });
    };

    const currentStatus = statusFilter || "All";
    const currentSort = sortFilter || "newest";

    return (
        <div className="w-full font-sans">
            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Orders</h2>
                    <p className="mt-1 text-sm text-slate-400">{total} total orders</p>
                </div>
            </div>

            {/* Search & Filters Card */}
            <div className="mb-8 flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchAutocomplete
                    key={search}
                    name="search"
                    defaultValue={search}
                    placeholder="Search by name, email, phone, order ID..."
                    items={data}
                    getLabel={(o: any) => `${o.customerName || o.customer || "Order"} · #${(o.id || o._id || "").toString().slice(-6)}`}
                    getKey={(o: any) => o.id || o._id}
                    onSubmit={(value) => setQuery({ search: value, page: 1 })}
                />
                    <div className="flex gap-3">
                        <select
                            value={currentStatus}
                            onChange={onStatusChange}
                            className="h-10 rounded-lg border border-slate-800 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                        >
                            {FILTER_STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                        </select>
                        <select
                            value={currentSort}
                            onChange={onSortChange}
                            className="h-10 rounded-lg border border-slate-800 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="highest">Highest Total</option>
                            <option value="lowest">Lowest Total</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 shadow-xl shadow-black/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/60 text-xs uppercase tracking-[1px] text-slate-400">
                                <th style={{ padding: "14px 16px" }} className="font-semibold">Order ID</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold">Customer</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold">Email</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold">Phone</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold text-center">Items</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold text-right">Subtotal</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold text-right">Delivery</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold text-right">Total</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold">Status</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold">Date</th>
                                <th style={{ padding: "14px 16px" }} className="text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {data?.length ? (
                                data.map((o) => (
                                    <tr key={o.id || o._id} className="group transition-colors hover:bg-slate-800/30">
                                        <td style={{ padding: "14px 16px" }} className="font-mono text-xs text-slate-400">
                                            #{(o.id || o._id || "").substring(0, 8)}
                                        </td>
                                        <td style={{ padding: "14px 16px" }} className="font-medium text-white">
                                            {o.customerName || o.customer || "—"}
                                        </td>
                                        <td style={{ padding: "14px 16px" }} className="text-slate-300 text-xs">{o.email || "—"}</td>
                                        <td style={{ padding: "14px 16px" }} className="text-slate-300 text-xs">{o.phone || "—"}</td>
                                        <td style={{ padding: "14px 16px" }} className="text-center text-slate-300">
                                            {o.items?.length || o.itemCount || 0}
                                        </td>
                                        <td style={{ padding: "14px 16px" }} className="text-right text-slate-300">
                                            Rs. {(o.subtotal || 0)?.toLocaleString()}
                                        </td>
                                        <td style={{ padding: "14px 16px" }} className="text-right text-slate-300">
                                            Rs. {(o.deliveryFee || 0)?.toLocaleString()}
                                        </td>
                                        <td style={{ padding: "14px 16px" }} className="text-right font-semibold text-cyan-400">
                                            Rs. {(o.total || o.grandTotal || 0)?.toLocaleString()}
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span
                                                className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[1px]"
                                                style={{
                                                    background: getStatusDetails(o.status).bg,
                                                    color: getStatusDetails(o.status).text,
                                                }}
                                            >
                                                {getStatusDetails(o.status).label}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px" }} className="text-slate-400 text-xs">
                                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(o)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-cyan-500/40 hover:text-cyan-400"
                                                    title="View Details"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                                </button>
                                                <select
                                                    value={(o.status || "pending").toLowerCase()}
                                                    onChange={(e) => {
                                                        if (e.target.value) onUpdateStatus(o.id || o._id, e.target.value);
                                                    }}
                                                    disabled={isPending && updatingId === o.id}
                                                    className="h-8 rounded-lg border border-slate-800 bg-slate-900 px-2 text-xs text-white outline-none focus:border-cyan-500 transition-colors cursor-pointer disabled:opacity-50"
                                                >
                                                    {STATUS_OPTIONS.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={11} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 text-3xl">📦</div>
                                            <p className="text-slate-400 font-medium">No Orders Found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
                        <span className="text-sm text-slate-400">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setQuery({ page: page - 1 })}
                                className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[1px] text-slate-300 transition-all hover:border-cyan-500/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Prev
                            </button>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setQuery({ page: page + 1 })}
                                className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[1px] text-slate-300 transition-all hover:border-cyan-500/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <OrderDetailModal
                open={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />
        </div>
    );
}
