"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });

    alert("Login Successful");

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-white block mb-2">Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none border border-slate-600 focus:border-cyan-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-white block mb-2">Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-slate-700 text-white outline-none border border-slate-600 focus:border-cyan-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-slate-300 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/frontend/register"
            className="text-cyan-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}