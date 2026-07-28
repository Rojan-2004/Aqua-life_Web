import Link from "next/link";
import UserForm from "../_components/UserForm";
import AdminHeader from "@/components/AdminHeader";

export default function Page() {
    return (
        <div style={{ background: "#0a0e1a", minHeight: "100vh" }}>
            <AdminHeader />
            <section className="mx-auto w-full max-w-[700px] py-6">
                <Link href="/admin/users" className="text-xs uppercase tracking-[1.5px] text-slate-400 hover:text-white">
                    ← Back to users
                </Link>
                <h2 className="mb-8 mt-4 text-3xl font-bold text-white">New user</h2>
                <UserForm />
            </section>
        </div>
    );
}
