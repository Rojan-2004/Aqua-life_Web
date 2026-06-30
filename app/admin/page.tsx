import Link from "next/link";

const CARDS = [
    { href: "/admin/users", label: "Users", desc: "Manage accounts, roles, status, and permissions." },
];

export default function Page() {
    return (
        <section className="mx-auto w-full max-w-[1100px] py-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[1.5px] text-cyan-400">
                Admin
            </p>
            <h2 className="mb-8 text-3xl font-bold text-white">Overview</h2>

            <div className="grid gap-6 sm:grid-cols-2">
                {CARDS.map(({ href, label, desc }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group rounded-lg border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-cyan-500 hover:bg-slate-900"
                    >
                        <h3 className="mb-1 text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{label}</h3>
                        <p className="text-sm text-slate-400">{desc}</p>
                        <span className="mt-4 inline-block text-xs font-medium tracking-[0.5px] text-cyan-300 opacity-0 transition-opacity group-hover:opacity-100">
                            Manage →
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
