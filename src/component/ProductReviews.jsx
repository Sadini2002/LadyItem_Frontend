import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  User,
  Sparkles,
  Filter,
} from "lucide-react";

export default function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [helpfulCount, setHelpfulCount] = useState({});

  // New review form state
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const baseUrl = (
        import.meta.env.VITE_BACKEND_URL  ).replace(/\/+$/, "");

      let fetchedData = [];
      try {
        const res = await axios.get(`${baseUrl}/api/reviews/product/${productId}`);
        fetchedData = res.data || [];
      } catch (err) {
        // Fallback demo reviews if API endpoint is not yet connected
        fetchedData = getFallbackReviews(productId, productName);
      }

      if (!fetchedData || fetchedData.length === 0) {
        fetchedData = getFallbackReviews(productId, productName);
      }

      setReviews(fetchedData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews(getFallbackReviews(productId, productName));
    } finally {
      setLoading(false);
    }
  };

 

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim() || !title.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const baseUrl = (
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
      ).replace(/\/+$/, "");

      const newReviewPayload = {
        productId,
        productName: productName || "Product",
        reviewerName,
        reviewerEmail,
        rating,
        title,
        comment,
        date: new Date().toISOString(),
        status: "Approved", // Auto-approve for demo
        isVerified: true,
      };

      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.post(`${baseUrl}/api/reviews`, newReviewPayload, { headers });
        if (res.data) {
          setReviews((prev) => [res.data, ...prev]);
        }
      } catch (err) {
        // Fallback local addition if API endpoint is unavailable
        const localReview = {
          _id: `rev-${Date.now()}`,
          ...newReviewPayload,
          likes: 0,
        };
        setReviews((prev) => [localReview, ...prev]);
      }

      toast.success("Thank you! Your review has been submitted.");
      setTitle("");
      setComment("");
      setReviewerName("");
      setReviewerEmail("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpfulClick = (reviewId) => {
    setHelpfulCount((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    toast.success("Thank you for your feedback!");
  };

  // Calculate Rating Statistics
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / totalReviews).toFixed(1)
      : "5.0";

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
  });

  return (
    <div className="mt-16 border-t border-white/10 pt-12 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-[#FF8A75] font-semibold text-xs tracking-wider uppercase mb-1">
            <Sparkles size={14} />
            <span>Customer Opinions</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Ratings & Reviews
          </h2>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B1A24] hover:bg-[#A61F2C] text-white font-bold transition shadow-lg hover:shadow-[#8B1A24]/40"
        >
          <MessageSquare size={18} />
          {showForm ? "Close Review Form" : "Write a Review"}
        </button>
      </div>

      {/* Review Submission Form Modal / Drawer */}
      {showForm && (
        <form
          onSubmit={handleSubmitReview}
          className="mb-12 p-6 md:p-8 rounded-3xl bg-white/5 border border-[#FF8A75]/30 backdrop-blur-xl space-y-6 shadow-2xl animate-fadeIn"
        >
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            Write a Review for {productName || "Product"}
          </h3>

          {/* Rating Star Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Your Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    size={28}
                    className={`${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-bold text-[#FF8A75]">
                {hoverRating || rating} out of 5 Stars
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reviewer Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kasun Fernando"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A75] text-sm"
              />
            </div>

            {/* Reviewer Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. kasun@example.com"
                value={reviewerEmail}
                onChange={(e) => setReviewerEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A75] text-sm"
              />
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Review Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Amazing product, high quality finish!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A75] text-sm"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Detailed Review *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Share details of your experience with this item..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A75] text-sm resize-none"
            />
          </div>

          {/* Form Submit Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-semibold text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B1A24] hover:bg-[#A61F2C] text-white font-bold text-sm transition shadow-lg disabled:opacity-50"
            >
              <Send size={16} />
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* Ratings Summary Card & Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-md">
        {/* Left Stats Score */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r border-white/10 pr-0 md:pr-6">
          <span className="text-5xl md:text-6xl font-black text-[#FF8A75] mb-2">
            {avgRating}
          </span>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={`${
                  star <= Math.round(Number(avgRating))
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            Based on {totalReviews} verified reviews
          </span>
        </div>

        {/* Right Star Bars */}
        <div className="md:col-span-8 space-y-2.5 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((num) => {
            const count = ratingCounts[num] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={num} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-gray-300 font-semibold flex items-center gap-1">
                  {num} <Star size={12} className="text-yellow-400 fill-yellow-400 inline" />
                </span>
                <div className="flex-1 h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8B1A24] to-[#FF8A75] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <span className="w-12 text-right text-gray-400 font-mono">
                  {count} ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">
          <div className="w-8 h-8 border-4 border-[#8B1A24] border-t-[#FF8A75] rounded-full animate-spin mx-auto mb-3"></div>
          Loading customer reviews...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/10 p-8">
          <MessageSquare size={40} className="mx-auto text-gray-500 mb-3" />
          <h4 className="text-lg font-bold text-gray-300">No Reviews Yet</h4>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Be the first customer to leave a review for this product!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-full bg-[#8B1A24] text-white text-xs font-bold hover:bg-[#A61F2C] transition"
          >
            Write the First Review
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((rev) => {
            const addedLikes = helpfulCount[rev._id] || 0;
            const displayLikes = (rev.likes || 0) + addedLikes;
            return (
              <div
                key={rev._id}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 hover:border-[#FF8A75]/30 transition duration-300"
              >
                {/* Reviewer Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B1A24] to-[#FF8A75] flex items-center justify-center font-bold text-white shadow-md">
                      {rev.reviewerName ? rev.reviewerName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">
                          {rev.reviewerName || "Anonymous Customer"}
                        </h4>
                        {rev.isVerified !== false && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-semibold">
                            <CheckCircle2 size={10} /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400">
                        {rev.date ? new Date(rev.date).toLocaleDateString() : "Recently"}
                      </span>
                    </div>
                  </div>

                  {/* Star Rating Badge */}
                  <div className="flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={`${
                          s <= (rev.rating || 5)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Title & Content */}
                <div>
                  <h5 className="font-bold text-white text-base mb-1.5">
                    {rev.title}
                  </h5>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                {/* Admin Reply Box if present */}
                {rev.adminReply && (
                  <div className="mt-3 p-4 rounded-2xl bg-[#8B1A24]/20 border border-[#8B1A24]/40 space-y-1">
                    <span className="text-xs font-bold text-[#FF8A75] block uppercase tracking-wider">
                      Response from Seller
                    </span>
                    <p className="text-xs text-gray-200 leading-relaxed">
                      {rev.adminReply}
                    </p>
                  </div>
                )}

                {/* Helpful Button */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <span>Was this review helpful?</span>
                  <button
                    onClick={() => handleHelpfulClick(rev._id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition"
                  >
                    <ThumbsUp size={13} className="text-[#FF8A75]" />
                    <span>Helpful ({displayLikes})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
