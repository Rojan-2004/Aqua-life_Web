import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const getAllProducts = async (params: { page?: number; limit?: number; search?: string }) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.PRODUCTS.GET_ALL, { params });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch products");
    }
};

export const getProductById = async (id: string) => {
    try {
        const response = await axiosInstance.get(API.ADMIN.PRODUCTS.GET_BY_ID(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch product");
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
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to create product");
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
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to update product");
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.PRODUCTS.DELETE(id));
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to delete product");
    }
};
