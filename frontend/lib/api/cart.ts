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

export interface CartProduct {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    images: string[];
}

export interface CartItemData {
    id: string;
    quantity: number;
    product: CartProduct | null;
}

export const getCart = async () => {
    try {
        const response = await axiosInstance.get(API.CART.GET_ALL);
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to load cart"));
    }
};

export const addToCart = async (productId: string, quantity = 1) => {
    try {
        const response = await axiosInstance.post(API.CART.ADD, {
            productId,
            quantity,
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to add to cart"));
    }
};

export const removeCartItem = async (cartItemId: string) => {
    try {
        const response = await axiosInstance.delete(API.CART.REMOVE, {
            data: { cartItemId },
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to remove item"));
    }
};
