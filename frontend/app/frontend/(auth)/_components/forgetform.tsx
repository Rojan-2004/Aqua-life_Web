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
    const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
    const onSubmit = async (data: RequestPasswordResetDTO) => {
        try{
            const response = await handleRequestPasswordReset(data.email);
            if (response.success) {
                setSuccess(response.message || 'Password reset link sent to your email.');
                if ((response as any).devResetUrl) {
                    setDevResetUrl((response as any).devResetUrl);
                }
                toast.success('Password reset request submitted.');
            }else{
                toast.error(response.message || 'Failed to request password reset.');
            }
        }catch(error){
            toast.error((error as Error).message || 'Failed to request password reset.');
        }
    }
    return (
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "40px 0" }}>
            <h1 className="text-2xl font-bold mb-4">Request Password Reset</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md"
            >
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        {...register("email")}
                        className="w-full border border-gray-300 p-2 rounded"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={isSubmitting || !!success}
                >
                    {isSubmitting ? "Sending..." : success ? "Sent" : "Send Reset Link"}
                </button>
            </form>

            {success && (
                <div style={{ marginTop: 16, padding: 16, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10 }}>
                    <p style={{ color: "#6ee7b7", fontSize: 14 }}>{success}</p>
                    {devResetUrl && (
                        <p style={{ marginTop: 8, fontSize: 13, color: "#fff" }}>
                            Dev reset link: <a href={devResetUrl} style={{ color: "#4dd9e8" }}>{devResetUrl}</a>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}