"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessInner() {
    const params = useSearchParams();
    const orderId = params.get("orderId");

    return (
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🐠</div>
            <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 700 }}>Order Placed!</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
                Your order <span style={{ color: "#4dd9e8", fontWeight: 600 }}>#{orderId?.slice(0, 8)}</span> has been received.
                We&apos;ll get it packed and shipped to you soon.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32 }}>
                <Link href="/dashboard" style={{ background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", border: "none", borderRadius: 10, padding: "12px 28px", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                    Go to Dashboard
                </Link>
                <Link href="/catalogue" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 28px", color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none" }}>
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div style={{ fontFamily: "var(--font-outfit), 'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Suspense fallback={<p style={{ color: "#4dd9e8" }}>Loading...</p>}>
                <SuccessInner />
            </Suspense>
        </div>
    );
}
