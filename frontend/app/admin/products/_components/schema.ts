import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters long")
    .max(100, "Product name cannot exceed 100 characters"),
  price: z
    .union([
      z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
        message: "Price must be a positive number",
      }),
      z.number().min(0, "Price cannot be negative"),
    ])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val)),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long"),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type ProductFormData = z.infer<typeof productSchema>;
