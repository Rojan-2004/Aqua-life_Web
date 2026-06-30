"use server";

import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "@/lib/api/admin/product";
import { revalidatePath } from "next/cache";

export const handleGetAllProducts = async (params: { page?: number; limit?: number; search?: string }) => {
    try {
        const result = await getAllProducts(params);
        if (result.success) {
            return { success: true, data: result.data, pagination: result.pagination };
        }
        return { success: false, message: result.message || "Failed to fetch products" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to fetch products" };
    }
};

export const handleGetProductById = async (id: string) => {
    try {
        const result = await getProductById(id);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch product" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to fetch product" };
    }
};

export const handleCreateProduct = async (formData: FormData) => {
    try {
        const result = await createProduct(formData);
        if (result.success) {
            revalidatePath("/admin/products");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Failed to create product" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to create product" };
    }
};

export const handleUpdateProduct = async (id: string, formData: FormData) => {
    try {
        const result = await updateProduct(id, formData);
        if (result.success) {
            revalidatePath("/admin/products");
            revalidatePath(`/admin/products/${id}`);
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Failed to update product" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update product" };
    }
};

export const handleDeleteProduct = async (id: string) => {
    try {
        const result = await deleteProduct(id);
        if (result.success) {
            revalidatePath("/admin/products");
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to delete product" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to delete product" };
    }
};
