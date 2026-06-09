"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleRegisterUser } from "@/lib/actions/auth-action";
import { RegisterFormData, registerSchema } from "../_components/schema";

type RegisterApiData = Omit<RegisterFormData, "confirmPassword">;

export default function RegisterPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setError('');
        setIsSubmitting(true);
        try {
            const submitData: RegisterApiData = {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                password: data.password
            };
            const result = await handleRegisterUser(submitData);
            if (result.success) {
                router.push("/frontend/login");
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (error: any) {
            setError(error?.message || 'Registration failed');
        } finally {
            setIsSubmitting(false);
        }
    }

    const inputStyle = {
        display: "block", width: "100%", padding: "11px 14px",
        marginTop: 6, marginBottom: 16,
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit",
    };

    const labelStyle = {
        color: "rgba(255,255,255,0.5)", fontSize: 11,
        textTransform: "uppercase" as const, letterSpacing: 1,
    };

    return (
        <div style={{ fontFamily: "'Outfit', sans-serif", background: "#0a0e1a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap" rel="stylesheet" />

            <div style={{ flex: 1, display: "flex", maxWidth: 1000, margin: "0 auto", width: "100%", padding: 32 }}>
                <div style={{ flex: 1, borderRadius: "20px 0 0 20px", overflow: "hidden", position: "relative", minHeight: 500 }}>
                    <img
                        src="https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=800&q=80"
                        alt="Underwater coral"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(5,15,35,0.5) 0%, rgba(5,15,30,0.9) 100%)" }} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 36px" }}>
                        <h2 style={{ color: "#fff", fontSize: 42, fontWeight: 800, lineHeight: 1.1, marginBottom: 16, letterSpacing: -1 }}>
                            Dive Into<br /><span style={{ color: "#f4a93a" }}>Excellence.</span>
                        </h2>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.6, marginBottom: 28, maxWidth: 280 }}>
                            Join the premier community for aquatic enthusiasts. Manage your tank, explore rare species, and order premium supplies fast.
                        </p>
                        <div style={{ display: "flex", gap: 16 }}>
                            {[["🐠", "Curated Species"], ["🚀", "Express Shipping"]].map(([icon, label]) => (
                                <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
                                    {label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ width: 360, background: "#111827", borderRadius: "0 20px 20px 0", padding: "44px 38px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Create Account</h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>Start your aquatic journey today.</p>

                    {error && <div style={{ marginBottom: 16, padding: "10px 12px", background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", borderRadius: 6, color: "#ff6b6b", fontSize: 13 }}>{error}</div>}

                    <form onSubmit={handleSubmit(onSubmit)}>
<label style={labelStyle}>Full Name</label>
                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                             <input
                                 type="text"
                                 placeholder="First name"
                                 {...register("firstName")}
                                 required
                                 style={{ ...inputStyle, marginBottom: 0 }}
                             />
                             <input
                                 type="text"
                                 placeholder="Last name"
                                 {...register("lastName")}
                                 required
                                 style={{ ...inputStyle, marginBottom: 0 }}
                             />
                         </div>
                         {errors.firstName && <span style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 8 }}>{errors.firstName.message}</span>}
                         {errors.lastName && <span style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 8 }}>{errors.lastName.message}</span>}

                        <label style={labelStyle}>Email</label>
                        <input
                            type="email"
                            placeholder="you@email.com"
                            {...register("email")}
                            required
                            style={inputStyle}
                        />
                        {errors.email && <span style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 8 }}>{errors.email.message}</span>}

                        <label style={labelStyle}>Username</label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            {...register("username")}
                            required
                            style={inputStyle}
                        />
                        {errors.username && <span style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 8 }}>{errors.username.message}</span>}

                        <label style={labelStyle}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register("password")}
                            required
                            style={inputStyle}
                        />
                        {errors.password && <span style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 8 }}>{errors.password.message}</span>}

                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            {...register("confirmPassword")}
                            required
                            style={inputStyle}
                        />
                        {errors.confirmPassword && <span style={{ color: "#ff6b6b", fontSize: 12, marginBottom: 8 }}>{errors.confirmPassword.message}</span>}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{ width: "100%", padding: 12, background: "linear-gradient(135deg, #2d9cdb, #4dd9e8)", border: "none", borderRadius: 8, color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: isSubmitting ? "not-allowed" : "pointer", marginBottom: 18, opacity: isSubmitting ? 0.7 : 1 }}
                        >
                            {isSubmitting ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>or continue with</span>
                        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
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
                        Already have an account?{" "}
                        <Link href="/frontend/login" style={{ color: "#4dd9e8", textDecoration: "none", fontWeight: 600 }}>Log in</Link>
                    </p>
                </div>
            </div>

            <footer style={{ background: "#0d1424", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "36px 32px 20px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.4fr", gap: 28, marginBottom: 24 }}>
                    <div>
                        <p style={{ color: "#4dd9e8", fontWeight: 700, marginBottom: 8 }}>AquaLife</p>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, lineHeight: 1.6 }}>Premium aquatics and life support systems for the modern aquarist. Specializing in rare species and tech-forward reef management.</p>
                    </div>
                    <div>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Navigation</p>
                        {["About Us", "Contact", "Shipping Policy"].map((item) => (
                            <p key={item} style={{ marginBottom: 8 }}><a href="#" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 13 }}>{item}</a></p>
                        ))}
                    </div>
                    <div>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Support</p>
                        {["Return Policy", "Terms of Service", "Privacy Policy"].map((item) => (
                            <p key={item} style={{ marginBottom: 8 }}><a href="#" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: 13 }}>{item}</a></p>
                        ))}
                    </div>
                    <div>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Newsletter</p>
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 10 }}>Stay updated on new arrivals and seasonal offers.</p>
                        <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, overflow: "hidden" }}>
                            <input type="email" placeholder="Your Email" style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.04)", border: "none", color: "#fff", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
                            <button style={{ padding: "8px 14px", background: "#2d9cdb", border: "none", color: "#fff", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>JOIN</button>
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