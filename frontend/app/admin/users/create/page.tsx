import Link from "next/link";
import UserForm from "../_components/UserForm";

export default function Page() {
    return (
        <section className="mx-auto w-full max-w-[700px] py-6">
            <Link href="/admin/users" className="text-xs uppercase tracking-[1.5px] text-slate-400 hover:text-white">
                ← Back to users
            </Link>
            <h2 className="mb-8 mt-4 text-3xl font-bold text-white">New user</h2>
            <UserForm />
        </section>
    );
}
