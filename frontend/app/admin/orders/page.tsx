import { handleGetAdminOrders } from "@/lib/actions/admin/order-action";
import OrderTable from "./_components/OrderTable";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const query = await searchParams;
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const limit = query.limit ? parseInt(query.limit as string, 10) : 10;
    const search = query.search ? (query.search as string) : "";
    const status = query.status ? (query.status as string) : "";
    const sort = query.sort ? (query.sort as string) : "newest";

    const result = await handleGetAdminOrders({ page, limit, search, status, sort });

    if (!result.success) {
        throw new Error(result.message || "Failed to load orders");
    }

    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 40px", boxSizing: "border-box" }}>
                <OrderTable
                    data={result.data || []}
                    pagination={result.pagination}
                    search={search}
                    statusFilter={status}
                    sortFilter={sort}
                />
            </div>
        </div>
    );
}
