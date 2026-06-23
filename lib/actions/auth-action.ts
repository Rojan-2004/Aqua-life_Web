"use server";
import { register, login, updateUserProfile, updateUserPassword, uploadProfilePicture } from "@/lib/api/auth";
import { LoginFormData, RegisterFormData } from "@/app/frontend/(auth)/_components/schema";
import { setTokenCookie, storeUserData, getTokenCookie } from "@/lib/cookies";


type RegisterApiData = Omit<RegisterFormData, "confirmPassword">;

export const handleRegisterUser = async (data: RegisterApiData) => {
    try {
        const result = await register(data);
        if (result.success) {
            const user = result.data;
            const token = result.token;
            if (token && user) {
                await setTokenCookie(token);
                await storeUserData(user);
            }
            return { success: true, message: result.message, data: result.data };
        } else {
            return { success: false, message: result.message || 'Registration failed' };
        }
    } catch (error: Error | unknown) {
        const err = error as Error & { response?: { data?: { message?: string } } };
        return { success: false, message: err?.response?.data?.message || err?.message || 'Registration failed' };
    }
}

export const handleLoginUser = async (data: LoginFormData) => {
    try {
        const result = await login(data);
        if (result.success) {
            const user = result.data;
            const token = result.token;
            if (token && user) {
                await setTokenCookie(token);
                await storeUserData(user);
            }
            return { success: true, message: result.message, data: result.data };
        } else {
            return { success: false, message: result.message || 'Login failed' };
        }
    } catch (error: Error | unknown) {
        const err = error as Error & { response?: { data?: { message?: string } } };
        return { success: false, message: err?.response?.data?.message || err?.message || 'Login failed' };
    }
}

export const handleUpdateUserProfile = async (data: any) => {
    try {
        const token = await getTokenCookie();
        const result = await updateUserProfile(data, token);
        if (result.success && result.data) {
            await storeUserData(result.data);
            return { success: true, message: result.message, data: result.data };
        } else {
            return { success: false, message: result.message || 'Update failed' };
        }
    } catch (error: Error | unknown) {
        const err = error as Error & { response?: { data?: { message?: string } } };
        return { success: false, message: err?.response?.data?.message || err?.message || 'Update failed' };
    }
}

export const handleUpdateUserPassword = async (data: any) => {
    try {
        const token = await getTokenCookie();
        const result = await updateUserPassword(data, token);
        if (result.success) {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.message || 'Password update failed' };
        }
    } catch (error: Error | unknown) {
        const err = error as Error & { response?: { data?: { message?: string } } };
        return { success: false, message: err?.response?.data?.message || err?.message || 'Password update failed' };
    }
}

export const handleUploadProfilePicture = async (formData: FormData) => {
    try {
        const token = await getTokenCookie();
        const result = await uploadProfilePicture(formData, token);
        if (result.success && result.data) {
            await storeUserData(result.data);
            return { success: true, message: result.message, data: result.data };
        } else {
            return { success: false, message: result.message || 'Image upload failed' };
        }
    } catch (error: Error | unknown) {
        const err = error as Error & { response?: { data?: { message?: string } } };
        return { success: false, message: err?.response?.data?.message || err?.message || 'Image upload failed' };
    }
}