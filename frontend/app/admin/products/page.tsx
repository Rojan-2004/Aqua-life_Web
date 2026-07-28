import { handleGetAllProducts } from "@/lib/actions/admin/product-action";
import ProductTable from "./_components/ProductTable";
import Link from "next/link";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const query = await searchParams;
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
    const search = query.search ? (query.search as string) : "";
    const category = query.category ? (query.category as string) : "";
    const status = query.status ? (query.status as string) : "";
    const sortBy = query.sortBy ? (query.sortBy as string) : "";
    
    const result = await handleGetAllProducts({ page, limit, search, category, status, sortBy });

    if (!result.success) {
        throw new Error(result.message || "Failed to load products");
    }

    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px", boxSizing: "border-box" }}>
                <Link href="/admin" style={{ color: "#4dd9e8", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                    ← Back to Dashboard
                </Link>
                <ProductTable 
                    data={result.data || []} 
                    pagination={result.pagination} 
                    search={search} 
                    category={category}
                    status={status}
                    sortBy={sortBy}
                />
            </div>
        </div>
    );
}
