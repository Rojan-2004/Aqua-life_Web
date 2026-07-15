"use server";

import { revalidatePath } from "next/cache";
import { getAdminOrders, getAdminOrderById, updateOrderStatus } from "@/lib/api/admin/order";

export const handleGetAdminOrders = async (params: { page?: number; limit?: number; search?: string; status?: string; sort?: string }) => {
    try {
        const result = await getAdminOrders(params);
        if (result.success) {
            return { success: true, data: result.data, pagination: result.pagination };
        }
        return { success: false, message: result.message || "Failed to fetch orders" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to fetch orders" };
    }
};

export const handleGetAdminOrderById = async (id: string) => {
    try {
        const result = await getAdminOrderById(id);
        if (result.success) {
            return { success: true, data: result.data };
        }
        return { success: false, message: result.message || "Failed to fetch order" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to fetch order" };
    }
};

export const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
        const result = await updateOrderStatus(id, status);
        if (result.success) {
            revalidatePath("/admin/orders");
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to update order status" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update order status" };
    }
};
