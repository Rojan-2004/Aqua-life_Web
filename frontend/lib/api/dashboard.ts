import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

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

export const getAdminStats = async () => {
    try {
        const response = await axiosInstance.get(API.DASHBOARD.ADMIN_STATS);
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to load admin stats"));
    }
};

export const getRecentOrders = async () => {
    try {
        const response = await axiosInstance.get(
            API.DASHBOARD.ADMIN_RECENT_ORDERS
        );
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to load recent orders"));
    }
};

export const getUserDashboard = async () => {
    try {
        const response = await axiosInstance.get(API.DASHBOARD.USER_DASHBOARD);
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            errorMessage(error, "Failed to load your dashboard data")
        );
    }
};
