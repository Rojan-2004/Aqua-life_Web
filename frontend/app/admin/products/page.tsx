import { handleGetAllProducts } from "@/lib/actions/admin/product-action";
import ProductTable from "./_components/ProductTable";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const query = await searchParams;
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
    const search = query.search ? (query.search as string) : "";
    
    const result = await handleGetAllProducts({ page, limit, search });

    if (!result.success) {
        throw new Error(result.message || "Failed to load products");
    }

    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh", padding: "40px 20px" }}>
            <ProductTable data={result.data || []} pagination={result.pagination} search={search} />
        </div>
    );
}
