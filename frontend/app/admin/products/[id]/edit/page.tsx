import { handleGetProductById } from "@/lib/actions/admin/product-action";
import { notFound } from "next/navigation";
import ProductFormEdit from "../../_components/ProductFormEdit";
import AdminHeader from "@/components/AdminHeader";
import Link from "next/link";

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

    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh" }}>
            <AdminHeader />
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px", boxSizing: "border-box" }}>
                <Link href="/admin/products" style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                    ← Back to Products
                </Link>
                <ProductFormEdit product={result.data} />
            </div>
        </div>
    );
}
