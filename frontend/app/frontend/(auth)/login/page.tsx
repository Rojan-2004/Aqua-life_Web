"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleLoginUser, handleGoogleLogin } from "@/lib/actions/auth-action";
import { LoginFormData, loginSchema } from "../_components/schema";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { toast } from "react-toastify";
import { useGoogleSignIn } from "@/lib/hooks/useGoogleSignIn";

export default function LoginPage() {
    const router = useRouter();
    const { user, loading, login } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const { ready, error: googleError, signIn, retry } = useGoogleSignIn(
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        async (credential) => {
            try {
                const result = await handleGoogleLogin(credential);
                if (result.success && result.data) {
                    login(result.data);
                    router.push("/dashboard");
                    toast.success("Welcome! Logged in with Google.");
                } else {
                    toast.error(result.message || "Google Sign-In failed");
                }
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Google Sign-In failed");
            }
        }
    );

    useEffect(() => {
        if (googleError) {
            toast.error(googleError);
        }
    }, [googleError]);

    const onSubmit = async (data: LoginFormData) => {
        setError("");
        setIsSubmitting(true);
        try {
            const result = await handleLoginUser(data);
            if (result.success) {
                if (result.data) {
                    login(result.data);
                }
                router.push("/dashboard");
            } else {
                setError(result.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            fontFamily:     "'Outfit', sans-serif",
            background:     "#0a0e1a",
            minHeight:      "100vh",
            display:        "flex",
            alignItems:     "stretch",
            justifyContent: "center",
            position:       "relative",
            overflow:       "hidden",
            padding:        "16px",
        }}>
            {/* Left visual */}
            <div style={{
                flex: "1 1 42%",
                position: "relative",
                borderRadius: 24,
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
                padding: 32,
                minHeight: 580,
            }}>
                <Image
                    src="/assets/image/sign_img.png"
                    alt="Sign in illustration"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,14,26,0) 0%, rgba(10,14,26,0.75) 100%)" }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>AquaLife</p>
                    <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 700, lineHeight: 1.2, maxWidth: 520 }}>Explore the underwater world</h2>
                </div>
            </div>

            {/* Right form panel */}
            <div style={{
                width: "100%",
                maxWidth: 460,
                margin: "0 auto",
                background:     "rgba(255,255,255,0.04)",
                border:         "1px solid rgba(255,255,255,0.09)",
                borderRadius:   24,
                padding:        "44px 40px",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow:      "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
                alignSelf:      "center",
            }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Image
                        src="/assets/logo/Aqua_life_logo.png"
                        alt="AquaLife Logo"
                        width={140}
                        height={42}
                        style={{ objectFit: "contain", marginBottom: 12 }}
                        priority
                    />
                    <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Welcome back</h1>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                    {/* Email */}
                    <div>
                        <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500, marginBottom: 7, letterSpacing: 0.5 }}>
                            EMAIL ADDRESS
                        </label>
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="you@example.com"
                            style={{
                                width:        "100%",
                                background:   "rgba(255,255,255,0.05)",
                                border:       "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 12,
                                padding:      "13px 16px",
                                color:        "#fff",
                                fontSize:     14,
                                fontFamily:   "inherit",
                                outline:      "none",
                                boxSizing:    "border-box",
                                transition:   "border-color 0.2s",
                            }}
                            onFocus={e => e.target.style.borderColor = "rgba(77,217,232,0.5)"}
                            onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                        />
                        {errors.email && <span style={{ color: "#f87171", fontSize: 12, marginTop: 4, display: "block" }}>{errors.email.message}</span>}
                    </div>

                    {/* Password */}
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                            <label style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 500, letterSpacing: 0.5 }}>PASSWORD</label>
                            <Link href="/frontend/forget_password" style={{ color: "#4dd9e8", fontSize: 12, textDecoration: "none" }}>Forgot password?</Link>
                        </div>
                        <div style={{ position: "relative" }}>
                            <input
                                type="password"
                                {...register("password")}
                                placeholder="••••••••••"
                                style={{
                                    width:        "100%",
                                    background:   "rgba(255,255,255,0.05)",
                                    border:       "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 12,
                                    padding:      "13px 44px 13px 16px",
                                    color:        "#fff",
                                    fontSize:     14,
                                    fontFamily:   "inherit",
                                    outline:      "none",
                                    boxSizing:    "border-box",
                                    transition:   "border-color 0.2s",
                                }}
                                onFocus={e => e.target.style.borderColor = "rgba(77,217,232,0.5)"}
                                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                            />
                            {errors.password && <span style={{ color: "#f87171", fontSize: 12, marginTop: 4, display: "block" }}>{errors.password.message}</span>}
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 10, padding: "10px 14px" }}>
                            <p style={{ color: "#f87171", fontSize: 13 }}>⚠ {error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            width:        "100%",
                            background:   isSubmitting ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                            border:       "none",
                            borderRadius: 12,
                            padding:      "14px 0",
                            color:        "#fff",
                            fontSize:     15,
                            fontWeight:   700,
                            cursor:       isSubmitting ? "not-allowed" : "pointer",
                            fontFamily:   "inherit",
                            marginTop:    4,
                            transition:   "opacity 0.15s",
                            opacity:      isSubmitting ? 0.6 : 1,
                        }}
                    >
                        {isSubmitting ? "Signing in..." : "Sign In →"}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                    <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 12 }}>or</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
                </div>

                {/* Google Sign-In */}
                <button
                    type="button"
                    onClick={signIn}
                    disabled={!ready}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 12,
                        padding: "12px 0",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: "inherit",
                        cursor: ready ? "pointer" : "not-allowed",
                        marginBottom: 8,
                        transition: "opacity 0.15s",
                        opacity: ready ? 1 : 0.6,
                    }}
               >
                    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.82-.07-1.61-.2-2.37H12v4.49h5.92a5.44 5.44 0 0 1-2.36 3.58v2.97h3.83c2.24-2.07 3.54-5.12 3.54-8.67z" fill="#4285F4" />
                        <path d="M12 23c3.02 0 5.55-1 7.38-2.69l-3.83-2.97c-1 .67-2.28 1.06-3.55 1.06-2.73 0-5.04-1.84-5.87-4.32H2.16v3.07C3.94 20.52 7.69 23 12 23z" fill="#34A853" />
                        <path d="M6.13 14.09a6.92 6.92 0 0 1 0-5.18V6.84H2.16A10.94 10.94 0 0 0 1 12c0 1.78.43 3.48 1.16 5.07l3.97-3.08z" fill="#FBBC05" />
                        <path d="M12 4.58c1.54 0 2.93.53 4.02 1.58l3.01-3.01C17.52 1.04 15.01 0 12 0 7.69 0 3.94 2.48 2.16 6.93l3.97 3.07c.83-2.48 3.14-4.42 5.87-4.42z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                </button>

                {googleError && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12, padding: "10px 14px", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 10 }}>
                        <span style={{ color: "#f87171", fontSize: 13 }}>⚠ {googleError}</span>
                        <button type="button" onClick={retry} style={{ whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.35)", background: "rgba(248,113,113,0.12)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Retry</button>
                    </div>
                )}

                {/* Sign up link */}
                <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                    Don&apos;t have an account?{" "}
                    <Link href="/frontend/register" style={{ color: "#4dd9e8", fontWeight: 600, textDecoration: "none" }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}