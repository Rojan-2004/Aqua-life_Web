import Link from "next/link";
import StatusScreen from "./_components/StatusScreen";

export default function NotFound() {
    return (
        <StatusScreen
            code="404"
            title="Page not found"
            description="The page you’re looking for doesn’t exist or may have been moved."
        >
            <Link
                href="/admin"
                className="flex h-10 items-center bg-slate-100 text-slate-900 px-4 text-xs font-bold uppercase tracking-[1.5px] hover:opacity-90"
            >
                Back to admin
            </Link>
        </StatusScreen>
    );
}
