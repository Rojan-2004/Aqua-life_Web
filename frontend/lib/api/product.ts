import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const getCatalogue = async (params: {
    page?: number;
    category?: string;
    search?: string;
    limit?: number;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
}) => {
    try {
        const response = await axiosInstance.get(API.PRODUCT.GET_ALL, { params });
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            errorMessage(error, "Failed to load products")
        );
    }
};

export const getProduct = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.PRODUCT.GET_BY_ID(id));
        return response.data;
    } catch (error: unknown) {
        throw new Error(
            errorMessage(error, "Failed to load product")
        );
    }
};

export interface CategoryCountResponse {
    success: boolean;
    counts: Record<string, number>;
}

export const getCategoryCounts = async (): Promise<CategoryCountResponse> => {
    try {
        const response = await axiosInstance.get(API.PRODUCT.GET_CATEGORY_COUNTS);
        return response.data as CategoryCountResponse;
    } catch (error: unknown) {
        throw new Error(
            errorMessage(error, "Failed to load category counts")
        );
    }
};

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
