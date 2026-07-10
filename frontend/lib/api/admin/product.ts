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

export const getAllProducts = async (params: { page?: number; limit?: number; search?: string }) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.PRODUCTS.GET_ALL, { params });
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to fetch products"));
    }
};

export const getProductById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.PRODUCTS.GET_BY_ID(id));
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to fetch product"));
    }
};

export const createProduct = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(API.ADMIN.PRODUCTS.CREATE, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to create product"));
    }
};

export const createProductJson = async (data: Record<string, unknown>) => {
    try {
        const response = await axiosInstance.post(API.ADMIN.PRODUCTS.CREATE, data);
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to create product"));
    }
};

export const updateProduct = async (id: string, data: FormData) => {
    try {
        const response = await axiosInstance.put(API.ADMIN.PRODUCTS.UPDATE(id), data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to update product"));
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.PRODUCTS.DELETE(id));
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to delete product"));
    }
};
