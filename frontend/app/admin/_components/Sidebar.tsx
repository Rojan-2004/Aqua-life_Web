"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { href: "/admin", label: "Overview", exact: true },
    { href: "/admin/users", label: "Users" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

    return (
        <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900 md:flex">
            <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
                <span className="h-5 w-1 rounded-full bg-cyan-400" />
                <span className="text-sm font-bold uppercase tracking-[1.5px] text-white">
                    🌊 Aqua Admin
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Admin sections">
                {NAV.map(({ href, label, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                active
                                    ? "bg-slate-800 text-cyan-400"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-slate-800 p-4">
                <Link
                    href="/dashboard"
                    className="text-xs font-medium tracking-[0.5px] text-slate-400 transition-colors hover:text-white"
                >
                    ← Back to app
                </Link>
            </div>
        </aside>
    );
}
