import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetUserById } from "@/lib/actions/admin/user-action";
import UserFormEdit from "../../_components/UserFormEdit";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await handleGetUserById(id);
    if (!result.success || !result.data) notFound();

    return (
        <section className="mx-auto w-full max-w-[700px] py-6">
            <Link href="/admin/users" className="text-xs uppercase tracking-[1.5px] text-slate-400 hover:text-white">
                ← Back to users
            </Link>
            <h2 className="mb-8 mt-4 text-3xl font-bold text-white">Edit user</h2>
            <UserFormEdit user={result.data} />
        </section>
    );
}
