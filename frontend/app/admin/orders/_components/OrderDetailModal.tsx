"use client";
import { useEffect } from "react";

const STATUS_FLOW = ["pending", "processing", "packed", "shipped", "out_for_delivery", "delivered"];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    delivered: { bg: "rgba(74,222,128,0.15)", text: "#4ade80", label: "Delivered" },
    shipped: { bg: "rgba(77,217,232,0.15)", text: "#4dd9e8", label: "Shipped" },
    out_for_delivery: { bg: "rgba(129,140,248,0.15)", text: "#818cf8", label: "Out for Delivery" },
    packed: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24", label: "Packed" },
    processing: { bg: "rgba(96,165,250,0.15)", text: "#60a5fa", label: "Processing" },
    pending: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24", label: "Pending" },
    cancelled: { bg: "rgba(248,113,113,0.15)", text: "#f87171", label: "Cancelled" },
};

const statusLabels: Record<string, string> = {
    pending: "Pending",
    processing: "Processing",
    packed: "Packed",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled"
};

export default function OrderDetailModal({ open, onClose, order }: { open: boolean; onClose: () => void; order: any }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open || !order) return null;

    const sa = order.shippingAddress || {};
    const customerName = order.customerName || order.customer || [order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") || "—";
    const customerEmail = order.email || sa.email || order.user?.email || "—";
    const customerPhone = order.phone || sa.phone || order.user?.phoneNumber || "—";
    const currentStatus = (order.status || "pending").toLowerCase();
    const currentStatusIndex = STATUS_FLOW.indexOf(currentStatus);

    const sectionStyle = {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
    };

    const labelStyle = {
        color: "rgba(255,255,255,0.4)",
        fontSize: 11,
        textTransform: "uppercase" as const,
        letterSpacing: 1,
        marginBottom: 4,
        fontWeight: 600,
    };

    const valueStyle = {
        color: "#fff",
        fontSize: 14,
        fontWeight: 500,
    };

    const getProductImage = (item: any) => {
        if (item.image) return `/item_photos/${item.image}`;
        if (item.product?.image) return `/item_photos/${item.product.image}`;
        if (item.product?.images?.[0]) return item.product.images[0];
        return null;
    };

    const getProductName = (item: any) => item.name || item.product?.name || "Product";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">Order Details</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-xl leading-none cursor-pointer bg-transparent border-none"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {currentStatus && (
                        <div className="flex items-center gap-3">
                            <span
                                className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[1px]"
                                style={{
                                    background: statusColors[currentStatus]?.bg || "rgba(255,255,255,0.1)",
                                    color: statusColors[currentStatus]?.text || "rgba(255,255,255,0.6)",
                                }}
                            >
                                {statusLabels[currentStatus] || currentStatus}
                            </span>
                            <span className="text-xs text-slate-500">Order #{order.id?.substring(0, 8)}</span>
                        </div>
                    )}

                    {/* Customer Information */}
                    <div style={sectionStyle}>
                        <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-[1px] mb-3">Customer Information</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p style={labelStyle}>Full Name</p>
                                <p style={valueStyle}>{customerName}</p>
                            </div>
                            <div>
                                <p style={labelStyle}>Email</p>
                                <p style={valueStyle}>{customerEmail}</p>
                            </div>
                            <div>
                                <p style={labelStyle}>Phone</p>
                                <p style={valueStyle}>{customerPhone}</p>
                            </div>
                            <div>
                                <p style={labelStyle}>User ID</p>
                                <p style={valueStyle}>{(order.user?._id || order.userId || order.customerId || "—")?.substring(0, 8)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {(sa.province || sa.district || sa.city || sa.street) && (
                        <div style={sectionStyle}>
                            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-[1px] mb-3">Shipping Address</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {sa.province && (
                                    <div><p style={labelStyle}>Province</p><p style={valueStyle}>{sa.province}</p></div>
                                )}
                                {sa.district && (
                                    <div><p style={labelStyle}>District</p><p style={valueStyle}>{sa.district}</p></div>
                                )}
                                {sa.city && (
                                    <div><p style={labelStyle}>City</p><p style={valueStyle}>{sa.city}</p></div>
                                )}
                                {sa.street && (
                                    <div><p style={labelStyle}>Street</p><p style={valueStyle}>{sa.street}</p></div>
                                )}
                                {sa.postalCode && (
                                    <div><p style={labelStyle}>Postal Code</p><p style={valueStyle}>{sa.postalCode}</p></div>
                                )}
                                {sa.landmark && (
                                    <div><p style={labelStyle}>Landmark</p><p style={valueStyle}>{sa.landmark}</p></div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Ordered Products */}
                    {order.items && order.items.length > 0 && (
                        <div style={sectionStyle}>
                            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-[1px] mb-3">Ordered Products</h4>
                            <div className="space-y-3">
                                {order.items.map((item: any, idx: number) => {
                                    const imageSrc = getProductImage(item);
                                    const itemName = getProductName(item);
                                    const itemPrice = item.price || item.product?.price || 0;
                                    const itemQty = item.quantity || 1;
                                    return (
                                        <div key={idx} className="flex items-center gap-3 border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                                            <div className="h-12 w-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {imageSrc ? (
                                                    <img src={imageSrc} alt={itemName} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-lg">🐟</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-semibold truncate">{itemName}</p>
                                                <p className="text-slate-400 text-xs">Qty: {itemQty} × Rs. {itemPrice?.toLocaleString()}</p>
                                            </div>
                                            <p className="text-cyan-400 text-sm font-bold flex-shrink-0">Rs. {(itemPrice * itemQty).toLocaleString()}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Billing Summary */}
                    <div style={sectionStyle}>
                        <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-[1px] mb-3">Billing Summary</h4>
                        <div className="space-y-2">
                            {order.subtotal !== undefined && (
                                <div className="flex justify-between text-sm">
                                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Subtotal</span>
                                    <span style={{ color: "rgba(255,255,255,0.7)" }}>Rs. {order.subtotal?.toLocaleString()}</span>
                                </div>
                            )}
                            {order.deliveryFee !== undefined && (
                                <div className="flex justify-between text-sm">
                                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Delivery Fee</span>
                                    <span style={{ color: "rgba(255,255,255,0.7)" }}>Rs. {order.deliveryFee?.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm border-t border-slate-800 pt-2 mt-2">
                                <span className="text-white font-bold">Grand Total</span>
                                <span className="text-cyan-400 font-bold">Rs. {order.total?.toLocaleString() || order.grandTotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs mt-1">
                                <span style={{ color: "rgba(255,255,255,0.4)" }}>Payment Method</span>
                                <span style={{ color: "rgba(255,255,255,0.6)" }}>{order.paymentMethod || "Cash on Delivery"}</span>
                            </div>
                            {order.createdAt && (
                                <div className="flex justify-between text-xs">
                                    <span style={{ color: "rgba(255,255,255,0.4)" }}>Order Date</span>
                                    <span style={{ color: "rgba(255,255,255,0.6)" }}>{new Date(order.createdAt).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Timeline */}
                    {currentStatus && (
                        <div style={sectionStyle}>
                            <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-[1px] mb-4">Order Timeline</h4>
                            <div className="flex items-center justify-between">
                                {STATUS_FLOW.map((step, i) => {
                                    const isCompleted = i <= currentStatusIndex && currentStatus !== "Cancelled";
                                    const isCurrent = i === currentStatusIndex;
                                    return (
                                        <div key={step} className="flex flex-col items-center flex-1">
                                            <div
                                                className="h-3 w-3 rounded-full mb-2"
                                                style={{
                                                    background: isCompleted ? (isCurrent ? "#4dd9e8" : "#4ade80") : "rgba(255,255,255,0.15)",
                                                    boxShadow: isCurrent ? "0 0 8px rgba(77,217,232,0.5)" : "none",
                                                }}
                                            />
                                            <span
                                                className="text-[10px] text-center leading-tight"
                                                style={{
                                                    color: isCurrent ? "#fff" : isCompleted ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)",
                                                    fontWeight: isCurrent ? 700 : 400,
                                                }}
                                            >
                                                {statusLabels[step] || step}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
