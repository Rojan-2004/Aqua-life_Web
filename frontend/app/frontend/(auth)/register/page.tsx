"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleRegisterUser, handleGoogleLogin } from "@/lib/actions/auth-action";
import { RegisterFormData, registerSchema } from "../_components/schema";
import { useAuth } from "@/context/AuthContext";
import { useGoogleSignIn } from "@/lib/hooks/useGoogleSignIn";
import { toast } from "react-toastify";

type RegisterApiData = Omit<RegisterFormData, "confirmPassword">;

export default function RegisterPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

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

    const { ready, error: googleError, signIn, retry } = useGoogleSignIn(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        async (credential) => {
            try {
                const result = await handleGoogleLogin(credential);
                if (result.success && result.data) {
                    toast.success("Welcome! Signed up with Google.");
                    router.push("/dashboard");
                } else {
                    toast.error(result.message || "Google Sign-In failed");
                }
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Google Sign-In failed");
            }
        }
    );

    console.log("[Google Auth Diagnostics] NEXT_PUBLIC_GOOGLE_CLIENT_ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
    console.log("[Google Auth Diagnostics] Current origin:", typeof window !== "undefined" ? window.location.origin : "server");

    useEffect(() => {
        if (googleError) {
            toast.error(googleError);
        }
    }, [googleError]);

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

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
                        <button
                            type="button"
                            onClick={signIn}
                            disabled={!ready}
                            style={{ padding: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 13, fontFamily: "inherit", cursor: ready ? "pointer" : "not-allowed", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: ready ? 1 : 0.6 }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.82-.07-1.61-.2-2.37H12v4.49h5.92a5.44 5.44 0 0 1-2.36 3.58v2.97h3.83c2.24-2.07 3.54-5.12 3.54-8.67z" fill="#4285F4" />
                                <path d="M12 23c3.02 0 5.55-1 7.38-2.69l-3.83-2.97c-1 .67-2.28 1.06-3.55 1.06-2.73 0-5.04-1.84-5.87-4.32H2.16v3.07C3.94 20.52 7.69 23 12 23z" fill="#34A853" />
                                <path d="M6.13 14.09a6.92 6.92 0 0 1 0-5.18V6.84H2.16A10.94 10.94 0 0 0 1 12c0 1.78.43 3.48 1.16 5.07l3.97-3.08z" fill="#FBBC05" />
                                <path d="M12 4.58c1.54 0 2.93.53 4.02 1.58l3.01-3.01C17.52 1.04 15.01 0 12 0 7.69 0 3.94 2.48 2.16 6.93l3.97 3.07c.83-2.48 3.14-4.42 5.87-4.42z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button
                            disabled
                            style={{ padding: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, color: "rgba(255,255,255,0.35)", fontSize: 13, fontFamily: "inherit", cursor: "not-allowed", opacity: 0.6 }}
                        >
                            Apple
                        </button>
                    </div>

                    {googleError && (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, padding: "10px 14px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 10 }}>
                            <span style={{ color: "#f87171", fontSize: 13 }}>⚠ {googleError}</span>
                            <button type="button" onClick={retry} style={{ whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.35)", background: "rgba(248,113,113,0.12)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Retry</button>
                        </div>
                    )}

                    <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                        Already have an account?{" "}
                        <Link href="/frontend/login" style={{ color: "#4dd9e8", textDecoration: "none", fontWeight: 600 }}>Log in</Link>
                    </p>
                </div>
            </div>

            <footer style={{ background: "#0d1424", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "36px 32px 20px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 28, marginBottom: 24 }}>
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
                </div>
                <p style={{ maxWidth: 1000, margin: "0 auto", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "rgba(255,255,255,0.18)", fontSize: 11 }}>
                    © 2026 AquaLife Premium Aquatics. All rights reserved.
                </p>
            </footer>
        </div>
    );
}