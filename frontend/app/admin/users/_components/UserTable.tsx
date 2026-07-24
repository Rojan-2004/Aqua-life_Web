"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Modal from "../../_components/Modal";
import SearchAutocomplete from "../../_components/SearchAutocomplete";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";

const avatarColors = [
    "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
    "linear-gradient(135deg,#f59e0b,#ef4444)",
    "linear-gradient(135deg,#10b981,#3b82f6)",
    "linear-gradient(135deg,#8b5cf6,#ec4899)",
    "linear-gradient(135deg,#f97316,#eab308)",
];

function getAvatarColor(name: string) {
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default function UserTable({
    data,
    pagination,
    search,
}: {
    data: any[];
    pagination: any;
    search: string;
}) {
    const router = useRouter();
    const params = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [target, setTarget] = useState<any | null>(null);

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const totalPages = pagination?.totalPages ?? 1;
    const total = pagination?.total ?? 0;

    const setQuery = (next: Record<string, string | number>) => {
        const q = new URLSearchParams(params.toString());
        Object.entries(next).forEach(([k, v]) => q.set(k, String(v)));
        router.push(`/admin/users?${q.toString()}`);
    };

    const onDelete = () => {
        if (!target) return;
        startTransition(async () => {
            const result = await handleDeleteUser(target.id || target._id);
            if (result.success) {
                toast.success(result.message || "User deleted successfully");
                setTarget(null);
            } else {
                toast.error(result.message || "Failed to delete user");
            }
        });
    };

    const getInitials = (u: any) => {
        const first = (u.firstName || u.firstName || "").charAt(0);
        const last = (u.lastName || u.lastName || "").charAt(0);
        return (first + last).toUpperCase() || "U";
    };

    const getFullName = (u: any) => {
        return `${u.firstName || ""} ${u.lastName || ""}`.trim() || "User";
    };

    return (
        <div className="w-full font-sans">
            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Users</h2>
                    <p className="mt-1 text-sm text-slate-400">Manage all registered users in the system.</p>
                </div>
            </div>

            {/* Search Card */}
            <div className="mb-8 flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchAutocomplete
                    key={search}
                    name="search"
                    defaultValue={search}
                    placeholder="Search users by name or email..."
                    items={data}
                    getLabel={(u: any) => getFullName(u)}
                    getKey={(u: any) => u.id || u._id}
                    onSubmit={(value) => setQuery({ search: value, page: 1 })}
                />
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[1px] text-slate-400">
                        <span className="hidden sm:inline">Rows</span>
                        <select
                            value={limit}
                            onChange={(e) => setQuery({ limit: e.target.value, page: 1 })}
                            className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-3 text-sm text-white outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                        >
                            {[10, 20, 50].map((n) => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            {/* Table Card */}
            <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 shadow-xl shadow-black/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-900/60 text-xs uppercase tracking-[1px] text-slate-400">
                                <th style={{ padding: "14px 16px" }} className="font-semibold">User</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold">Email</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold">Role</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold">Status</th>
                                <th style={{ padding: "14px 16px" }} className="font-semibold">Created</th>
                                <th style={{ padding: "14px 16px" }} className="text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {data?.length ? (
                                data.map((u) => (
                                    <tr key={u.id || u._id} className="group transition-colors hover:bg-slate-800/30">
                                        <td style={{ padding: "14px 16px" }}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800">
                                                    {u.profilePicture && u.profilePicture !== "default-profile.png" ? (
                                                        <img src={`/profile_photos/${u.profilePicture}`} alt={getFullName(u)} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <span className="text-sm font-bold text-white">{getInitials(u)}</span>
                                                    )}
                                                </div>
                                                <span className="font-medium text-white">{getFullName(u)}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 16px" }} className="text-slate-300">{u.email}</td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[1px] ${
                                                    u.role === "admin"
                                                        ? "bg-cyan-500/15 text-cyan-400"
                                                        : "bg-slate-800 text-slate-400"
                                                }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[1px] ${
                                                    u.status === "active" || !u.status
                                                        ? "bg-emerald-500/15 text-emerald-400"
                                                        : u.status === "inactive"
                                                        ? "bg-slate-700 text-slate-400"
                                                        : "bg-rose-500/15 text-rose-400"
                                                }`}
                                            >
                                                {u.status || "active"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px" }} className="text-slate-400">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/users/${u.id || u._id}`)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-cyan-500/40 hover:text-cyan-400"
                                                    title="View"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/admin/users/${u.id || u._id}/edit`)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-cyan-500/40 hover:text-cyan-400"
                                                    title="Edit"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                                                </button>
                                                <button
                                                    onClick={() => setTarget(u)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 transition-all hover:border-rose-500/40 hover:text-rose-400"
                                                    title="Delete"
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/50 text-3xl">👤</div>
                                            <p className="text-slate-400 font-medium">No users found</p>
                                            <Link href="/admin/users/create" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                                                Create User
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
                        <span className="text-sm text-slate-400">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setQuery({ page: page - 1 })}
                                className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[1px] text-slate-300 transition-all hover:border-cyan-500/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Prev
                            </button>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setQuery({ page: page + 1 })}
                                className="h-9 rounded-lg border border-slate-800 bg-slate-900 px-4 text-xs font-semibold uppercase tracking-[1px] text-slate-300 transition-all hover:border-cyan-500/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Modal open={!!target} onClose={() => setTarget(null)} title="Delete User">
                <p className="mb-6 text-sm text-slate-300">
                    Are you sure you want to delete{" "}
                    <span className="font-bold text-white">
                        {target?.firstName} {target?.lastName}
                    </span>
                    ? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setTarget(null)}
                        className="h-10 rounded-lg border border-slate-700 bg-slate-900 px-4 text-xs font-bold uppercase tracking-[1.5px] text-slate-300 hover:text-white cursor-pointer transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isPending}
                        className="h-10 rounded-lg bg-rose-600 px-4 text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-rose-700 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
