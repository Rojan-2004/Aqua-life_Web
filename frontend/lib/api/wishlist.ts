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

export const toggleWishlist = async (productId: string) => {
    try {
        const response = await axiosInstance.post(API.WISHLIST.TOGGLE, {
            productId,
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            errorMessage(error, "Failed to update wishlist")
        );
    }
};

export const getWishlist = async () => {
    try {
        const response = await axiosInstance.get(API.WISHLIST.GET_ALL);
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            errorMessage(error, "Failed to load wishlist")
        );
    }
};
