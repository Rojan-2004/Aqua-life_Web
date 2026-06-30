"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const TITLES: Record<string, string> = {
    admin: "Overview",
    users: "Users",
    blogs: "Blogs",
    create: "Create",
    edit: "Edit",
};

export default function Header() {
    const { logout, user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "admin";
    const title = TITLES[last] ?? last;

    const handleLogout = async () => {
        await logout();
        router.push("/frontend/login");
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900 px-6">
            <div>
                <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-slate-400">
                    {segments.join(" / ")}
                </p>
                <h1 className="text-lg font-bold leading-none text-white">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
                <span className="hidden text-sm text-slate-400 sm:inline">
                    {user?.username || user?.email || "Admin User"}
                </span>
                <button
                    onClick={handleLogout}
                    className="rounded-md border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:border-slate-500 hover:text-white cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
