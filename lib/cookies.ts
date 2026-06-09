"use server";
import { cookies } from "next/headers";

export async function setTokenCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });
}

export async function getTokenCookie() {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value;
}

export async function storeUserData(userData: unknown) {
    const cookieStore = await cookies();
    cookieStore.set({
        name: "user_data",
        value: JSON.stringify(userData),
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
    });
}

export async function getUserData() {
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get("user_data")?.value;
    if (!userDataCookie) return null;
    try {
        return JSON.parse(userDataCookie);
    } catch {
        return null;
    }
}

export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    cookieStore.delete("user_data");
}