"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import Modal from "../../_components/Modal";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";

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
    const [target, setTarget] = useState<any | null>(null); // user pending deletion

    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const totalPages = pagination?.totalPages ?? 1;
    const total = pagination?.total ?? 0;

    const setQuery = (next: Record<string, string | number>) => {
        const q = new URLSearchParams(params.toString());
        Object.entries(next).forEach(([k, v]) => q.set(k, String(v)));
        router.push(`/admin/users?${q.toString()}`);
    };

    const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value = new FormData(e.currentTarget).get("search") as string;
        setQuery({ search: value ?? "", page: 1 });
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

    return (
        <div className="mx-auto w-full max-w-[1100px] py-6 font-sans">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <Link
                        href="/admin"
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-2 inline-flex items-center gap-1 no-underline"
                    >
                        ← Back to Admin Panel
                    </Link>
                    <h2 className="text-3xl font-bold text-white mt-1">Users</h2>
                    <p className="text-sm text-slate-400">{total} total users</p>
                </div>
                <Link
                    href="/admin/users/create"
                    className="flex h-10 items-center bg-cyan-500 px-4 text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-cyan-600 transition-colors"
                >
                    New user
                </Link>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={onSearch} className="flex w-full max-w-sm gap-2">
                    <input
                        name="search"
                        defaultValue={search}
                        placeholder="Search users by name or email..."
                        className="h-10 w-full border border-slate-800 bg-slate-900 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 transition-colors"
                    />
                    <button className="h-10 border border-slate-800 bg-slate-900 px-4 text-xs font-bold uppercase tracking-[1.5px] text-slate-300 hover:text-white transition-colors cursor-pointer">
                        Search
                    </button>
                </form>

                <label className="flex items-center gap-2 text-xs uppercase tracking-[1.5px] text-slate-400">
                    Rows
                    <select
                        value={limit}
                        onChange={(e) => setQuery({ limit: e.target.value, page: 1 })}
                        className="h-10 border border-slate-800 bg-slate-900 px-2 text-sm text-white outline-none focus:border-cyan-500 transition-colors"
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-900/30">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="border-b border-slate-800 bg-slate-900/50 text-xs uppercase tracking-[1px] text-slate-400">
                        <tr>
                            <th className="px-4 py-3 font-medium">ID</th>
                            <th className="px-4 py-3 font-medium">Name</th>
                            <th className="px-4 py-3 font-medium">Email</th>
                            <th className="px-4 py-3 font-medium">Role</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Created Date</th>
                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                        {data?.length ? (
                            data.map((u) => (
                                <tr key={u.id || u._id} className="hover:bg-slate-900/50 transition-colors">
                                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                                        {(u.id || u._id || "").substring(0, 8)}...
                                    </td>
                                    <td className="px-4 py-3 text-white font-medium">
                                        {u.firstName || ""} {u.lastName || ""}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[1px] ${
                                                u.role === "admin"
                                                    ? "bg-cyan-500/20 text-cyan-400"
                                                    : "bg-slate-800 text-slate-400"
                                            }`}
                                        >
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[1px] ${
                                                u.status === "active" || !u.status
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-rose-500/20 text-rose-400"
                                            }`}
                                        >
                                            {u.status || "active"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-400">
                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-3 text-xs font-medium uppercase tracking-[1px]">
                                            <Link href={`/admin/users/${u.id || u._id}`} className="text-slate-400 hover:text-white">
                                                View
                                            </Link>
                                            <Link
                                                href={`/admin/users/${u.id || u._id}/edit`}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => setTarget(u)}
                                                className="text-slate-400 hover:text-rose-400 cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                <span>
                    Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => setQuery({ page: page - 1 })}
                        className="h-9 border border-slate-800 px-3 text-xs uppercase tracking-[1px] text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                    >
                        Prev
                    </button>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setQuery({ page: page + 1 })}
                        className="h-9 border border-slate-800 px-3 text-xs uppercase tracking-[1px] text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
                    >
                        Next
                    </button>
                </div>
            </div>

            <Modal open={!!target} onClose={() => setTarget(null)} title="Delete user">
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
                        className="h-10 border border-slate-700 bg-slate-900 px-4 text-xs font-bold uppercase tracking-[1.5px] text-slate-300 hover:text-white cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDelete}
                        disabled={isPending}
                        className="h-10 bg-rose-600 px-4 text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-rose-700 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
