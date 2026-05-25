"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, remember });
    alert("Login Successful");
    router.push("/");
  };

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* Main split layout */}
      <div style={{ flex: 1, display: "flex", maxWidth: 1000, margin: "0 auto", width: "100%", padding: 32 }}>

        {/* Left – hero image */}
        <div style={{ flex: 1, borderRadius: "20px 0 0 20px", overflow: "hidden", position: "relative", minHeight: 480 }}>
          <img
            src="https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80"
            alt="Coral reef"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(5,20,40,0.92) 100%)" }} />
          <div style={{ position: "absolute", bottom: 32, left: 28 }}>
            <p style={{ color: "#4dd9e8", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>🌊 AquaLife</p>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14 }}>Dive into your aquatic ecosystem</p>
          </div>
        </div>

        {/* Right – login form */}
        <div style={{ width: 340, background: "#111827", borderRadius: "0 20px 20px 0", padding: "44px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Welcome Back</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>Log in to manage your premium aquatics.</p>

          <form onSubmit={handleLogin}>
            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ display: "block", width: "100%", padding: "11px 14px", marginTop: 6, marginBottom: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }}
            />

            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: "block", width: "100%", padding: "11px 14px", marginTop: 6, marginBottom: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, fontSize: 13 }}>
              <label style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: "#4dd9e8" }} />
                Remember device
              </label>
              <a href="#" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Forgot?</a>
            </div>

            <button
              type="submit"
              style={{ width: "100%", padding: 12, background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", border: "none", borderRadius: 8, color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}
            >
              Sign in →
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
            {["Google", "Apple"].map((provider) => (
              <button
                key={provider}
                style={{ padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.7)", fontSize: 13, fontFamily: "inherit", cursor: "pointer" }}
              >
                {provider}
              </button>
            ))}
          </div>

          <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/frontend/register" style={{ color: "#4dd9e8", textDecoration: "none", fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#0d1424", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "36px 32px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.4fr", gap: 28, marginBottom: 24 }}>
          <div>
            <p style={{ color: "#4dd9e8", fontWeight: 700, marginBottom: 8 }}>AquaLife</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, lineHeight: 1.6 }}>The ultimate platform for premium aquarium management, AI identification, and high-end aquatic supplies.</p>
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Experience</p>
            {["Catalog", "AI Identifier", "Marine Ecosystems", "Freshwater Guides"].map((item) => (
              <p key={item} style={{ marginBottom: 8 }}><a href="#" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 13 }}>{item}</a></p>
            ))}
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Legal</p>
            {["Shipping Policy", "Return Policy", "Terms of Service", "Privacy Policy"].map((item) => (
              <p key={item} style={{ marginBottom: 8 }}><a href="#" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 13 }}>{item}</a></p>
            ))}
          </div>
          <div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Newsletter</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 10 }}>Get the latest updates on rare species and exclusive offers.</p>
            <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, overflow: "hidden" }}>
              <input type="email" placeholder="Your Email" style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.04)", border: "none", color: "#fff", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
              <button style={{ padding: "8px 13px", background: "#2d9cdb", border: "none", color: "#fff", cursor: "pointer", fontSize: 13 }}>▶</button>
            </div>
          </div>
        </div>
        <p style={{ maxWidth: 1000, margin: "0 auto", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: 11 }}>
          © 2026 AquaLife Premium Aquatics. All rights reserved.
        </p>
      </footer>
    </div>
  );
}