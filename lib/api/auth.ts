import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

export const register = async (data: any) => {
    try {
        const response =
            await axiosInstance.post(API.AUTH.REGISTER, data); // path, data
        return response.data; // reponse ko body
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message
            || 'Registration failed');
        // error?.response?.data -> response ko body
    }
}

export const login = async (data: any) => {
    try {
        const response =
            await axiosInstance.post(API.AUTH.LOGIN, data); // path, data
        return response.data; // reponse ko body
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message
            || 'Login failed');
    }
}

export const whoami = async () => {
    try {
        const response =
            await axiosInstance.get(API.AUTH.WHOAMI); // path, data
        return response.data; // reponse ko body
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message
            || 'Fetch user data failed');
    }
}

export const updateUser = async (data: any) => {
    try {
        const response = await axiosInstance
            .put(
                API.AUTH.UPDATE, 
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data", // multer api
                    },
                }
            );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Update user failed');
    }
}

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axiosInstance.post(
            API.AUTH.REQUEST_PASSWORD_RESET,
            { email }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Request password reset failed');
    }
}

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axiosInstance.post(
            API.AUTH.RESET_PASSWORD(token),
            { newPassword: newPassword }
        );
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error?.response?.data?.message || 'Reset password failed');
    }
}

export const updateUserProfile = async (data: any) => {
    try {
        const response = await axiosInstance.put(API.AUTH.PROFILE_UPDATE, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to update profile details");
    }
};

export const updateUserPassword = async (data: any) => {
    try {
        const response = await axiosInstance.put(API.AUTH.PASSWORD_UPDATE, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to change password");
    }
};

export const uploadProfilePicture = async (data: FormData) => {
    try {
        const response = await axiosInstance.post(API.AUTH.UPLOAD_PICTURE, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to upload image");
    }
};