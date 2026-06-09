"use server";
import { register, login } from "@/lib/api/auth";
import { LoginFormData, RegisterFormData } from "@/app/frontend/(auth)/_components/schema";
import { setTokenCookie, storeUserData } from "@/lib/cookies";

type RegisterApiData = Omit<RegisterFormData, "confirmPassword">;

export const handleRegisterUser = async (data: RegisterApiData) => {
    try {
        const result = await register(data);
        if (result.success) {
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
        if (result.success && result.data) {
            const user = result.data.user;
            const token = result.data.token;
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