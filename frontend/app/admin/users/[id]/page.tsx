import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetUserById } from "@/lib/actions/admin/user-action";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await handleGetUserById(id);
    if (!result.success || !result.data) notFound();

    const user = result.data;
    const hasProfilePic = user.profilePicture && user.profilePicture !== "default-profile.png";
    const profilePicUrl = hasProfilePic ? `/profile_pictures/${user.profilePicture}` : null;

    const rows: [string, string][] = [
        ["First name", user.firstName || "—"],
        ["Last name", user.lastName || "—"],
        ["Email", user.email],
        ["Username", user.username],
        ["Role", user.role],
        ["Status", user.status || "active"],
        ["Created Date", user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"],
    ];

    return (
        <section className="mx-auto w-full max-w-[700px] py-6">
            <Link href="/admin/users" className="text-xs uppercase tracking-[1.5px] text-slate-400 hover:text-white">
                ← Back to users
            </Link>

            <div className="mt-4 mb-8 flex items-center gap-4">
                {profilePicUrl ? (
                    <img
                        src={profilePicUrl}
                        alt="Profile"
                        className="h-16 w-16 rounded-full object-cover border border-slate-700"
                    />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">
                        No Image
                    </div>
                )}
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-slate-400">{user.email}</p>
                </div>
                <Link
                    href={`/admin/users/${user.id}/edit`}
                    className="ml-auto flex h-10 items-center border border-slate-700 bg-slate-900 px-4 text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-slate-800 transition-colors"
                >
                    Edit
                </Link>
            </div>

            <dl className="divide-y divide-slate-850 border border-slate-800 rounded-lg overflow-hidden bg-slate-900/30">
                {rows.map(([label, value]) => (
                    <div key={label} className="flex justify-between px-6 py-4 hover:bg-slate-900/50 transition-colors">
                        <dt className="text-xs uppercase tracking-[1px] text-slate-400">{label}</dt>
                        <dd className="text-sm text-white font-medium">{value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
