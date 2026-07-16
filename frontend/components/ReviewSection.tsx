"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/api/axios-instance";

interface UserInfo {
    firstName: string;
    lastName: string;
}

interface ReviewItem {
    id: string;
    userId: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: UserInfo;
}

interface ReviewsResponse {
    reviews: ReviewItem[];
    averageRating: number;
    total: number;
}

const StarRow = ({ value, onChange, interactive = false, size = 20 }: { value: number; onChange?: (val: number) => void; interactive?: boolean; size?: number }) => (
  <div style={{ display: "flex", gap: 4 }}>
    {[1, 2, 3, 4, 5].map(n => (
      <span
        key={n}
        onClick={() => interactive && onChange && onChange(n)}
        style={{
          fontSize:   size,
          cursor:     interactive ? "pointer" : "default",
          color:      n <= value ? "#fbbf24" : "rgba(255,255,255,0.15)",
          transition: "color 0.1s",
          userSelect: "none",
        }}
      >
        ★
      </span>
    ))}
  </div>
);

export default function ReviewSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const isAdmin  = user?.role === "admin";

  const [data, setData]       = useState<ReviewsResponse>({ reviews: [], averageRating: 0, total: 0 });
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover]     = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const fetchReviews = () => {
    axiosInstance.get(`/api/v1/reviews?productId=${productId}`)
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch reviews", err);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const hasReviewed = user
    ? data.reviews.some(r => r.userId === user.id)
    : false;

  const submit = async () => {
    if (!rating) { setError("Please select a star rating."); return; }
    setSubmitting(true); setError("");
    try {
      const res = await axiosInstance.post("/api/v1/reviews", {
        productId,
        rating,
        comment
      });
      setSubmitting(false);
      setSuccess(true);
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (err: any) {
      setSubmitting(false);
      setError(err?.response?.data?.error || err?.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.07)" }}>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
          Reviews ({data.total})
        </h2>
        {data.total > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StarRow value={Math.round(data.averageRating)} size={16} />
            <span style={{ color: "#fbbf24", fontWeight: 700, fontSize: 15 }}>{data.averageRating}</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>/ 5</span>
          </div>
        )}
      </div>

      {/* Write a review — only for logged-in non-admin users who haven't reviewed yet */}
      {user && !isAdmin && !hasReviewed && !success && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <p style={{ color: "#fff", fontWeight: 600, fontSize: 15, marginBottom: 16 }}>Write a Review</p>

          {/* Star picker */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 8 }}>YOUR RATING</p>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  style={{
                    fontSize:   28,
                    cursor:     "pointer",
                    color:      n <= (hover || rating) ? "#fbbf24" : "rgba(255,255,255,0.15)",
                    transition: "color 0.1s",
                    userSelect: "none",
                  }}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 8 }}>YOUR COMMENT (optional)</p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              style={{
                width:        "100%",
                background:   "rgba(255,255,255,0.05)",
                border:       "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding:      "12px 14px",
                color:        "#fff",
                fontSize:     14,
                fontFamily:   "inherit",
                outline:      "none",
                resize:       "vertical",
                boxSizing:    "border-box",
              }}
              onFocus={e => (e.target as HTMLElement).style.borderColor = "rgba(77,217,232,0.4)"}
              onBlur={e  => (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"}
            />
          </div>

          {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>⚠ {error}</p>}

          <button
            onClick={submit}
            disabled={submitting || rating === 0}
            style={{
              background:   rating === 0 ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
              border:       "none",
              borderRadius: 10,
              padding:      "11px 28px",
              color:        "#fff",
              fontSize:     14,
              fontWeight:   700,
              cursor:       rating === 0 ? "not-allowed" : "pointer",
              fontFamily:   "inherit",
              opacity:      submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 28 }}>
          <p style={{ color: "#4ade80", fontSize: 14, fontWeight: 600 }}>✓ Thanks for your review!</p>
        </div>
      )}

      {/* Already reviewed */}
      {hasReviewed && !success && (
        <div style={{ background: "rgba(77,217,232,0.06)", border: "1px solid rgba(77,217,232,0.15)", borderRadius: 12, padding: "12px 16px", marginBottom: 24 }}>
          <p style={{ color: "#4dd9e8", fontSize: 13 }}>✓ You have already reviewed this product.</p>
        </div>
      )}

      {/* Not logged in */}
      {!user && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 18px", marginBottom: 24 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            <a href="/frontend/login" style={{ color: "#4dd9e8" }}>Log in</a> to leave a review.
          </p>
        </div>
      )}

      {/* Reviews list */}
      {data.reviews.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No reviews yet. Be the first to review this product.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {data.reviews.map(r => (
            <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>
                    {r.user?.firstName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                      {r.user?.firstName} {r.user?.lastName}
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                      {new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <StarRow value={r.rating} size={16} />
              </div>
              {r.comment && (
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6, marginTop: 6 }}>
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
