export default function Footer() {
    return (
        <footer className="flex items-center justify-between border-t border-slate-800 bg-slate-900/50 px-6 py-4">
            <p className="text-xs tracking-[0.5px] text-slate-400">
                © {new Date().getFullYear()} Aqua Life — Admin
            </p>
            <p className="text-xs tracking-[0.5px] text-slate-400">EN · Global</p>
        </footer>
    );
}
