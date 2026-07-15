import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

function errorMessage(error: unknown, fallback: string): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {
        const res = (error as { response?: { data?: { message?: string } } })
            .response;
        if (res?.data?.message) return res.data.message;
    }
    if (error instanceof Error) return error.message;
    return fallback;
}

export const getAdminOrders = async (params: { page?: number; limit?: number; search?: string; status?: string; sort?: string }) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.ORDERS.GET_ALL, { params });
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to fetch orders"));
    }
};

export const getAdminOrderById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.ORDERS.GET_BY_ID(id));
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to fetch order"));
    }
};

export const updateOrderStatus = async (id: string, status: string) => {
    try {
        const response = await axiosInstance.patch(API.ADMIN.ORDERS.UPDATE_STATUS(id), { status });
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to update order status"));
    }
};
