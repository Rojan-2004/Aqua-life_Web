"use server";

import { deleteReview, updateReviewStatus } from "@/lib/api/admin/review";
import { revalidatePath } from "next/cache";

export async function handleDeleteReview(productId: string, reviewId: string) {
    try {
        const result = await deleteReview(reviewId);
        if (result.success) {
            revalidatePath(`/admin/products/${productId}`);
            revalidatePath("/admin/products");
            return { success: true, message: result.message || "Review deleted successfully" };
        }
        return { success: false, message: result.message || result.error || "Failed to delete review" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to delete review" };
    }
}

export async function handleUpdateReviewStatus(productId: string, reviewId: string, status: string) {
    try {
        const result = await updateReviewStatus(reviewId, status);
        if (result.success) {
            revalidatePath(`/admin/products/${productId}`);
            return { success: true, message: result.message || "Review status updated", review: result.review };
        }
        return { success: false, message: result.message || result.error || "Failed to update review status" };
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update review status" };
    }
}
