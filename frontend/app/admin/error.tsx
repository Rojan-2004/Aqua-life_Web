"use client";
import { useEffect } from "react";
import StatusScreen from "./_components/StatusScreen";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <StatusScreen
            title="Something went wrong"
            description={error.message || "An unexpected error occurred while loading this section."}
        >
            <button
                onClick={() => reset()}
                className="flex h-10 items-center bg-slate-100 text-slate-900 px-4 text-xs font-bold uppercase tracking-[1.5px] hover:opacity-90 cursor-pointer"
            >
                Try again
            </button>
        </StatusScreen>
    );
}
