"use client";
import { useEffect, useMemo, useRef, useState } from "react";

interface SearchAutocompleteProps<T> {
    name: string;
    defaultValue?: string;
    placeholder?: string;
    items: T[];
    getLabel: (item: T) => string;
    getKey: (item: T) => string | number;
    onSubmit: (value: string) => void;
}

export default function SearchAutocomplete<T>({
    name,
    defaultValue = "",
    placeholder = "Search...",
    items,
    getLabel,
    getKey,
    onSubmit,
}: SearchAutocompleteProps<T>) {
    const [value, setValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);

    const suggestions = useMemo(() => {
        const q = value.trim().toLowerCase();
        if (!q) return [];
        return items
            .filter((item) => getLabel(item).toLowerCase().includes(q))
            .slice(0, 8);
    }, [value, items, getLabel]);

    const showDropdown = open && suggestions.length > 0;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (label: string) => {
        setValue(label);
        setOpen(false);
        onSubmit(label);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setOpen(false);
        onSubmit(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === "Enter" && activeIndex >= 0) {
            e.preventDefault();
            handleSelect(getLabel(suggestions[activeIndex]));
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
            <div ref={containerRef}>
                <div className="relative">
                    <svg 
                        style={{
                            pointerEvents: "none",
                            position: "absolute",
                            left: 14,
                            top: "50%",
                            transform: "translateY(-50%)",
                            height: 16,
                            width: 16,
                            color: "rgba(255, 255, 255, 0.4)",
                        }}
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.3-4.3"/>
                    </svg>
                    <input
                        name={name}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setOpen(true);
                            setActiveIndex(-1);
                        }}
                        onFocus={() => setOpen(true)}
                        onBlur={() => setOpen(false)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        autoComplete="off"
                        style={{
                            height: 40,
                            width: "100%",
                            borderRadius: 10,
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            background: "rgba(255, 255, 255, 0.05)",
                            paddingLeft: 42,
                            paddingRight: 16,
                            color: "#fff",
                            fontSize: 14,
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                {showDropdown && (
                    <ul className="mt-2 max-h-72 overflow-auto rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl shadow-black/40">
                        {suggestions.map((item, i) => (
                            <li
                                key={getKey(item)}
                                onMouseEnter={() => setActiveIndex(i)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(getLabel(item));
                                }}
                                className={`flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-slate-200 ${
                                    i === activeIndex ? "bg-slate-800" : "hover:bg-slate-800/60"
                                }`}
                            >
                                {getLabel(item)}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </form>
    );
}
