// Shared centered state block for admin boundaries (loading / error / empty).

export function Spinner({ className = "" }: { className?: string }) {
    return (
        <span
            className={`inline-block animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400 h-8 w-8 ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
}

export default function StatusScreen({
    code,
    title,
    description,
    children,
}: {
    code?: string;
    title: string;
    description?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
            <span className="mb-6 h-1 w-16 rounded-full bg-cyan-400" />
            {code && (
                <p className="mb-2 font-mono text-5xl font-bold tracking-tight text-white">{code}</p>
            )}
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {description && <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>}
            {children && <div className="mt-6 flex items-center gap-3">{children}</div>}
        </div>
    );
}
