import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

function errorMessage(error: unknown, fallback: string): string {
    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
    ) {
        const res = (error as { response?: { data?: { message?: string; error?: string } } })
            .response;
        if (res?.data?.message) return res.data.message;
        if (res?.data?.error) return res.data.error;
    }
    if (error instanceof Error) return error.message;
    return fallback;
}

export const deleteReview = async (reviewId: string) => {
    try {
        const response = await axiosInstance.delete(API.ADMIN.REVIEWS.DELETE(reviewId));
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to delete review"));
    }
};

export const updateReviewStatus = async (reviewId: string, status: string) => {
    try {
        const response = await axiosInstance.patch(API.ADMIN.REVIEWS.UPDATE_STATUS(reviewId), { status });
        return response.data;
    } catch (error: unknown) {
        throw new Error(errorMessage(error, "Failed to update review status"));
    }
};
