import ProductForm from "../_components/ProductForm";
import Link from "next/link";

export default function Page() {
    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px", boxSizing: "border-box" }}>
                <Link href="/admin/products" style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                    ← Back to Products
                </Link>
                <ProductForm />
            </div>
        </div>
    );
}
