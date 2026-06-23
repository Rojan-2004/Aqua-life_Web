import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.REGISTER, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Registration failed');
    }
}

export const login = async (data: any) => {
    try {
        const response = await axiosInstance.post(API.AUTH.LOGIN, data);
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Login failed');
    }
}

export const getProfile = async (token?: string) => {
    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await axiosInstance.get(API.AUTH.PROFILE, { headers });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Failed to fetch profile');
    }
}

export const updateUserProfile = async (data: any, token?: string) => {
    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await axiosInstance.put(API.AUTH.PROFILE, data, { headers });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Failed to update profile');
    }
}

export const updateUserPassword = async (data: any, token?: string) => {
    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await axiosInstance.put(API.AUTH.PASSWORD, data, { headers });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Failed to update password');
    }
}

export const uploadProfilePicture = async (formData: FormData, token?: string) => {
    try {
        const headers: Record<string, string> = {};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const response = await axiosInstance.post(API.AUTH.UPLOAD_PICTURE, formData, {
            headers: {
                ...headers,
                "Content-Type": "multipart/form-data",
            }
        });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Failed to upload profile picture');
    }
}