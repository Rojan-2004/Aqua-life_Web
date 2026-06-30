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
        <div style={{ background: "#0a0e1a", minHeight: "100vh", padding: "40px 20px" }}>
            <ProductFormEdit product={result.data} />
        </div>
    );
}
