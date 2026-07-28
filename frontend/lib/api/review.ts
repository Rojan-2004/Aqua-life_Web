import axiosInstance from "./axios-instance";
import { API } from "./endpoints";

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

export interface UserReviewItem {
    id: string;
    productId: string | null;
    productName: string;
    productPrice: number;
    productCategory: string;
    productImages: string[];
    rating: number;
    comment: string | null;
    createdAt: string;
    status: string;
}

export interface UserReviewsResponse {
    success: boolean;
    reviews: UserReviewItem[];
    total: number;
}

export const getMyReviews = async (): Promise<UserReviewsResponse> => {
    try {
        const response = await axiosInstance.get(API.ADMIN.REVIEWS.MY);
        return response.data as UserReviewsResponse;
    } catch (error: unknown) {
        throw new Error(
            errorMessage(error, "Failed to load your reviews")
        );
    }
};
