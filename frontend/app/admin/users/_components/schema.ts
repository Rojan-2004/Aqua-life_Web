import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const base = {
    firstName: z.string().min(2, { message: "Minimum 2 characters required" }),
    lastName: z.string().min(2, { message: "Minimum 2 characters required" }),
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string().min(3, { message: "Minimum 3 characters required" }),
    role: z.enum(["user", "admin"]),
    status: z.enum(["active", "inactive"]),
};

// create user - password is required
export const createUserSchema = z.object({
    ...base,
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});
export type CreateUserFormData = z.infer<typeof createUserSchema>;

// edit user - password and image are optional
export const editUserSchema = z.object({
    ...base,
    password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional().or(z.literal("")),
    image: z
        .any()
        .optional()
        .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE), { message: "Max file size is 5MB" })
        .refine((file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)), {
            message: "Only .jpg, .jpeg, .png and .webp formats are supported",
        }),
});
export type EditUserFormData = z.infer<typeof editUserSchema>;
