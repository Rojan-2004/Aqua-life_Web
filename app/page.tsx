import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-cyan-400 mb-6">
          Aqua Life
        </h1>

        <div className="flex gap-4 justify-center">
          <Link
            href="/frontend/login"
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg text-white font-semibold"
          >
            Login
          </Link>

          <Link
            href="/frontend/register"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white font-semibold"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}