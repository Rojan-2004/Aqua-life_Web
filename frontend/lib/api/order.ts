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

export interface ShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    province: string;
    district: string;
    city: string;
    street: string;
    postalCode: string;
    landmark?: string;
}

export const placeOrder = async (shippingAddress: ShippingAddress) => {
    try {
        const response = await axiosInstance.post(API.ORDERS.PLACE, {
            shippingAddress,
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to place order"));
    }
};
