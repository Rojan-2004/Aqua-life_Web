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
            <div className="mx-auto max-w-3xl px-8 lg:px-10 py-10 font-sans">
                <ProductFormEdit product={result.data} />
            </div>
        </div>
    );
}
