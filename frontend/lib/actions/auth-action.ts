"use server"; // server side api call
import { register, login, whoami, updateUser, requestPasswordReset, resetPassword, updateUserProfile, updateUserPassword, uploadProfilePicture } from "@/lib/api/auth";
import { LoginFormData, RegisterFormData } from "@/app/frontend/(auth)/_components/schema";
import { setTokenCookie, storeUserData } from "@/lib/cookies";
import { revalidatePath } from "next/cache";

export const handleRegisterUser = async (data: any) => {
    try{
        // how to handle data from component and how to send to component
        const result = await register(data);
        if(result.success){
            return { success: true, message: result.message, data: result.data }; 
        }else{
            return { success: false, message: result.message || 'Registration failed' };    
        }
    }catch (error: Error | any){
        return { success: false, message: error?.message || 'Registration failed' };    
    }
}
export const handleLoginUser = async (data: LoginFormData) => {
    try{
        // how to handle data from component and how to send to component
        const result = await login(data);
        // set cookie
        const user = result.data;
        const token = result.token;
        await setTokenCookie(token);
        await storeUserData(user);

        if(result.success){
            return { success: true, message: result.message, data: result.data }; 
        }else{
            return { success: false, message: result.message || 'Login failed' };    
        }
    }catch (error: Error | any){
        return { success: false, message: error?.message || 'Login failed' };    
    }
}

export const handleWhoami = async () => {  
    try{
        const result = await whoami();
        if(result.success){
            return { success: true, message: result.message, data: result.data }; 
        }else{
            return { success: false, message: result.message || 'Fetch user data failed' };    
        }
    }catch (error: Error | any){
        return { success: false, message: error?.message || 'Fetch user data failed' };
    }
}

export const handleUpdateUser = async (data: FormData) => {
    try{
        const result = await updateUser(data);
        if(result.success){
            revalidatePath("/dashboard/profile"); // refresh profile page data
            return { success: true, message: result.message, data: result.data }; 
        }else{
            return { success: false, message: result.message || 'Update user failed' };    
        }
    }catch (error: Error | any){
        return { success: false, message: error?.message || 'Update user failed' };
    }
}

export const handleRequestPasswordReset = async (email: string) => {
    try{
        const result = await requestPasswordReset(email);
        if(result.success){
            return { success: true, message: result.message };
        }else{
            return { success: false, message: result.message || 'Request password reset failed' };    
        }
    }catch (error: Error | any){
        return { success: false, message: error?.message || 'Request password reset failed' };
    }
}

export const handleResetPassword = async (token: string, newPassword: string) => {
    try{
        const result = await resetPassword(token, newPassword);
        if(result.success){
            return { success: true, message: result.message };
        }else{
            return { success: false, message: result.message || 'Reset password failed' };    
        }
    }catch (error: Error | any){
        return { success: false, message: error?.message || 'Reset password failed' };
    }
}

export const handleUpdateUserProfile = async (data: any) => {
    try {
        const result = await updateUserProfile(data);
        if (result.success) {
            // update stored user cookie
            await storeUserData(result.data);
            revalidatePath("/dashboard/profile");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Failed to update profile" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update profile" };
    }
};

export const handleUpdateUserPassword = async (data: any) => {
    try {
        const result = await updateUserPassword(data);
        if (result.success) {
            return { success: true, message: result.message };
        }
        return { success: false, message: result.message || "Failed to change password" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to change password" };
    }
};

export const handleUploadProfilePicture = async (data: FormData) => {
    try {
        const result = await uploadProfilePicture(data);
        if (result.success) {
            // update stored user cookie
            await storeUserData(result.data);
            revalidatePath("/dashboard/profile");
            return { success: true, message: result.message, data: result.data };
        }
        return { success: false, message: result.message || "Failed to upload image" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to upload image" };
    }
};