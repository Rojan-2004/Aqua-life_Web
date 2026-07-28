"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleRequestPasswordReset } from "@/lib/actions/auth-action";
import { toast } from "react-toastify";
import { useState } from "react";

export const RequestPasswordResetSchema = z.object({
    email: z.email(),
});

export type RequestPasswordResetDTO = z.infer<typeof RequestPasswordResetSchema>;
export default function ForgetForm() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RequestPasswordResetDTO>({
        resolver: zodResolver(RequestPasswordResetSchema)
    });
    const [success, setSuccess] = useState<string | null>(null);
    const [resetToken, setResetToken] = useState<string | null>(null);
    const onSubmit = async (data: RequestPasswordResetDTO) => {
        try {
            const response = await handleRequestPasswordReset(data.email);
            if (response.success) {
                setSuccess(response.message || 'Password reset request submitted.');
                setResetToken((response as any).devResetUrl || null);
                toast.success('Password reset request submitted.');
            } else {
                toast.error(response.message || 'Failed to request password reset.');
            }
        } catch (error) {
            toast.error((error as Error).message || 'Failed to request password reset.');
        }
    };
    return (
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "32px 0", fontFamily: "'Outfit', sans-serif" }}>
            <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Forgot password?</h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 18 }}>Enter your account email and we will send you a reset link.</p>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                    <label style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, display: "block" }}>EMAIL ADDRESS</label>
                    <input
                        type="email"
                        {...register("email")}
                        placeholder="you@example.com"
                        style={{
                            width: "100%",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 12,
                            padding: "12px 14px",
                            color: "#fff",
                            fontSize: 14,
                            fontFamily: "inherit",
                            outline: "none",
                        }}
                    />
                    {errors.email && (
                        <p style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>{errors.email.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || !!success}
                    style={{
                        width: "100%",
                        padding: "12px 0",
                        background: success ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                        border: "none",
                        borderRadius: 12,
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        fontFamily: "inherit",
                        cursor: isSubmitting || success ? "not-allowed" : "pointer",
                        opacity: isSubmitting || success ? 0.7 : 1,
                    }}
                >
                    {isSubmitting ? "Sending..." : success ? "Sent" : "Send Reset Link"}
                </button>
            </form>

            {success && (
                <div style={{ marginTop: 14, padding: 14, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 12, color: "#fff", fontSize: 13, lineHeight: 1.5 }}>
                    {success}
                    {resetToken && (
                        <div style={{ marginTop: 10 }}>
                            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, marginBottom: 4 }}>Dev reset link:</p>
                            <a href={resetToken} style={{ color: "#4dd9e8", wordBreak: "break-all" }}>{resetToken}</a>
                        </div>
                    )}
                </div>
            )}

            <p style={{ marginTop: 14, color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                Remember your password?{" "}
                <a href="/frontend/login" style={{ color: "#4dd9e8", textDecoration: "none", fontWeight: 600 }}>Sign in</a>
            </p>
        </div>
    );
}