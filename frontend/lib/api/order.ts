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

export interface ShippingInfo {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    landmark?: string;
}

export const placeOrder = async (shippingInfo: ShippingInfo) => {
    try {
        const response = await axiosInstance.post(API.ORDERS.PLACE, {
            shippingInfo,
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to place order"));
    }
};
