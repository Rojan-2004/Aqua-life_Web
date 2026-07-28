// app/(auth)/_components/PasswordResetForm.tsx
"use client";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleResetPassword } from "@/lib/actions/auth-action";
import { toast } from "react-toastify"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ResetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ResetPasswordDTO = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordForm({
    token,
}: {
    token: string;
}) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordDTO>({
        resolver: zodResolver(ResetPasswordSchema)
    });
    const router = useRouter();
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <div style={{ maxWidth: 420, margin: "0 auto", padding: "32px 0", fontFamily: "'Outfit', sans-serif" }}>
                <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Reset password</h1>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 18 }}>
                    Invalid or expired reset link. Please request a new one.
                </p>
                <Link
                    href="/frontend/forget_password"
                    style={{
                        display: "inline-block",
                        padding: "12px 24px",
                        background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                        borderRadius: 12,
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        textDecoration: "none",
                    }}
                >
                    Request new reset link
                </Link>
            </div>
        );
    }

    const onSubmit = async (data: ResetPasswordDTO) => {
        try {
            const response = await handleResetPassword(token, data.password);
            if (response.success) {
                setSuccess(true);
                toast.success("Password reset successfully");
                router.replace("/frontend/login");
            } else {
                toast.error(response.message || "Failed to reset password");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "32px 0", fontFamily: "'Outfit', sans-serif" }}>
            <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Reset password</h1>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 18 }}>Enter a new password below.</p>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                    <label style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, display: "block" }}>NEW PASSWORD</label>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="••••••"
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
                    {errors.password && (
                        <p style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>{errors.password.message}</p>
                    )}
                </div>
                <div>
                    <label style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, marginBottom: 6, display: "block" }}>CONFIRM PASSWORD</label>
                    <input
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="••••••"
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
                    {(errors.confirmPassword || errors.root) && (
                        <p style={{ color: "#f87171", fontSize: 12, marginTop: 6 }}>
                            {errors.confirmPassword?.message || errors.root?.message}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || success}
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
                    {isSubmitting ? "Resetting..." : success ? "Reset" : "Reset Password"}
                </button>
            </form>
            <p style={{ marginTop: 14, color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
                Remember your password?{" "}
                <Link href="/frontend/login" style={{ color: "#4dd9e8", textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
            </p>
        </div>
    );
}
