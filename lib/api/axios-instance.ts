import axios from "axios";

const isServer = typeof window === "undefined";
const BASE_URL = isServer
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000")
    : "";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default axiosInstance;