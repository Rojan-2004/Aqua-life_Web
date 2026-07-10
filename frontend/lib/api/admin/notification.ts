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

export interface AdminNotification {
    id: string;
    type: string;
    message: string;
    orderId: string | null;
    isRead: boolean;
    createdAt: string;
}

export const getAdminNotifications = async () => {
    try {
        const response = await axiosInstance.get(API.ADMIN_NOTIFICATIONS.GET_ALL);
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to load notifications"));
    }
};

export const markNotificationsRead = async () => {
    try {
        const response = await axiosInstance.patch(API.ADMIN_NOTIFICATIONS.MARK_READ);
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to update notifications"));
    }
};
