import { handleGetProductById } from "@/lib/actions/admin/product-action";
import { notFound } from "next/navigation";
import ProductFormEdit from "../../_components/ProductFormEdit";

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
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 40px", boxSizing: "border-box" }}>
                <ProductFormEdit product={result.data} />
            </div>
        </div>
    );
}
