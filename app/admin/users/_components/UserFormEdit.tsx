"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { editUserSchema } from "./schema";
import { handleUpdateUser } from "@/lib/actions/admin/user-action";

const fieldClass =
    "h-12 w-full border border-slate-800 bg-slate-900 px-4 text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-500";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-[1.5px] text-slate-400";
const errClass = "mt-1 block text-sm text-rose-500";

export default function UserFormEdit({ user }: { user?: any }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            username: user?.username || "",
            role: user?.role || "user",
            status: user?.status || "active",
            password: "",
        },
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = (data: any) => {
        setError("");
        startTransition(async () => {
            try {
                const formdata = new FormData();
                formdata.append("firstName", data.firstName || "");
                formdata.append("lastName", data.lastName || "");
                formdata.append("email", data.email || "");
                formdata.append("username", data.username || "");
                formdata.append("role", data.role || "user");
                formdata.append("status", data.status || "active");
                if (data.password && data.password.trim() !== "") {
                    formdata.append("password", data.password);
                }
                if (data.image) {
                    formdata.append("profilePicture", data.image); // matches backend upload field name
                }
                
                let result = await handleUpdateUser(user.id || user._id, formdata);

                if (!result.success) throw new Error(result.message);
                toast.success("User updated successfully");
                router.push("/admin/users");
                router.refresh();
            } catch (err: any) {
                toast.error(err?.message);
                setError(err?.message || "Something went wrong");
            }
        });
    };

    const hasProfilePic = user?.profilePicture && user?.profilePicture !== "default-profile.png";
    const profilePicUrl = hasProfilePic ? `/profile_pictures/${user?.profilePicture}` : null;

    return (
        <div className="w-full max-w-md font-sans">
            <form onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="mb-6 border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">{error}</div>
                )}

                <div className="mb-5">
                    <label className={labelClass}>Profile Image</label>
                    <div className="mb-3 flex items-center gap-4">
                        {previewImage ? (
                            <div className="relative h-20 w-20">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="h-20 w-20 rounded-full object-cover border border-slate-700"
                                />
                                <Controller
                                    name="image"
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <button
                                            type="button"
                                            onClick={() => handleDismissImage(onChange)}
                                            className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs text-white border border-slate-900 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    )}
                                />
                            </div>
                        ) : profilePicUrl ? (
                            <img
                                src={profilePicUrl}
                                alt="Profile"
                                className="h-20 w-20 rounded-full object-cover border border-slate-700"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-500 border border-slate-700">
                                No Image
                            </div>
                        )}

                        <div className="flex-1">
                            <Controller
                                name="image"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                        accept=".jpg,.jpeg,.png,.webp"
                                        className="text-xs text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 file:cursor-pointer"
                                    />
                                )}
                            />
                            {errors.image && <span className={errClass}>{errors.image.message as string}</span>}
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <label className={labelClass}>Email Address</label>
                    <input type="email" {...register("email")} placeholder="you@example.com" className={fieldClass} />
                    {errors.email && <span className={errClass}>{errors.email.message as string}</span>}
                </div>

                <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label className={labelClass}>First Name</label>
                        <input type="text" {...register("firstName")} placeholder="Jane" className={fieldClass} />
                        {errors.firstName && <span className={errClass}>{errors.firstName.message as string}</span>}
                    </div>
                    <div>
                        <label className={labelClass}>Last Name</label>
                        <input type="text" {...register("lastName")} placeholder="Doe" className={fieldClass} />
                        {errors.lastName && <span className={errClass}>{errors.lastName.message as string}</span>}
                    </div>
                </div>

                <div className="mb-5">
                    <label className={labelClass}>Username</label>
                    <input type="text" {...register("username")} placeholder="janedoe" className={fieldClass} />
                    {errors.username && <span className={errClass}>{errors.username.message as string}</span>}
                </div>

                <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label className={labelClass}>Role</label>
                        <select {...register("role")} className={fieldClass}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <span className={errClass}>{errors.role.message as string}</span>}
                    </div>
                    <div>
                        <label className={labelClass}>Status</label>
                        <select {...register("status")} className={fieldClass}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        {errors.status && <span className={errClass}>{errors.status.message as string}</span>}
                    </div>
                </div>

                <div className="mb-5">
                    <label className={labelClass}>New Password (Optional)</label>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="Leave blank to keep current"
                        className={fieldClass}
                    />
                    {errors.password && <span className={errClass}>{errors.password.message as string}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className="flex h-12 w-full items-center justify-center bg-cyan-500 text-xs font-bold uppercase tracking-[1.5px] text-white hover:bg-cyan-600 transition-opacity disabled:opacity-50 cursor-pointer"
                >
                    {isPending ? "Saving..." : "Save changes"}
                </button>
            </form>
        </div>
    );
}
