import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Pencil, Trash2, AlertCircle, User } from 'lucide-react';
import reviewService from '../../services/review.service';
import useAuth from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';

// ─── Component hiển thị sao (chỉ đọc) ───────────────────────────────────────
const StarDisplay = ({ rating, size = 16 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        className={`transition-colors ${
          star <= rating
            ? 'text-amber-400 fill-amber-400'
            : 'text-zinc-700'
        }`}
      />
    ))}
  </div>
);

// ─── Component chọn sao (tương tác) ──────────────────────────────────────────
const StarRating = ({ rating, onRate }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-125 active:scale-95 focus:outline-none"
        >
          <Star
            size={28}
            className={`transition-all duration-150 ${
              star <= (hovered || rating)
                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]'
                : 'text-zinc-600 hover:text-zinc-500'
            }`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm font-black text-amber-400">
          {rating}/5
        </span>
      )}
    </div>
  );
};

// ─── Component tạo avatar mặc định từ username ──────────────────────────────
const UserAvatar = ({ user }) => {
  const avatarUrl = user?.avatar;
  const username = user?.username || 'User';
  const initial = username.charAt(0).toUpperCase();

  // Tạo màu ngẫu nhiên dựa trên username
  const colors = [
    'from-brand to-red-700',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-purple-500 to-violet-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
  ];
  const colorIndex = username.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className="w-10 h-10 rounded-full object-cover border-2 border-white/10 shadow-md"
      />
    );
  }

  return (
    <div
      className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-black text-sm border-2 border-white/10 shadow-md`}
    >
      {initial}
    </div>
  );
};

// ─── Component một review card ───────────────────────────────────────────────
const ReviewCard = ({ review, currentUser, onEdit, onDelete, t }) => {
  const isOwner = currentUser && currentUser._id === review.user?._id;
  const createdDate = new Date(review.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group relative bg-dark-card/60 backdrop-blur-sm border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300">
      {/* Header: Avatar + Username + Stars */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar user={review.user} />
          <div>
            <h4 className="text-sm font-bold text-zinc-200">
              {review.user?.username || 'Ẩn danh'}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <StarDisplay rating={review.rating} size={13} />
              <span className="text-[10px] text-zinc-600 font-semibold">{createdDate}</span>
            </div>
          </div>
        </div>

        {/* Nút sửa/xóa cho chủ sở hữu */}
        {isOwner && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(review)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-amber-400 hover:bg-amber-400/10 transition-all"
              title={t('review.edit')}
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onDelete(review._id)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              title={t('review.delete')}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Comment */}
      <p className="mt-3 text-sm text-zinc-300 leading-relaxed font-medium">
        {review.comment}
      </p>
    </div>
  );
};

// ─── MAIN: ReviewSection ──────────────────────────────────────────────────────
const ReviewSection = ({ movieId }) => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formComment, setFormComment] = useState('');
  const [editingReview, setEditingReview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Tải danh sách đánh giá
  const fetchReviews = async () => {
    try {
      const result = await reviewService.getReviewsByMovie(movieId);
      setReviews(result.data || []);
      setAverageRating(result.averageRating || 0);
      setTotalCount(result.count || 0);
    } catch (err) {
      console.error('Lỗi khi tải đánh giá:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  // Kiểm tra user đã đánh giá chưa
  const userReview = reviews.find((r) => r.user?._id === user?._id);
  const isUser = user?.role === 'user';

  // Submit đánh giá (tạo mới hoặc cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formRating === 0) {
      setError(t('review.errorNoRating'));
      return;
    }
    if (!formComment.trim()) {
      setError(t('review.errorNoComment'));
      return;
    }

    setSubmitting(true);
    try {
      if (editingReview) {
        await reviewService.updateReview(editingReview._id, formRating, formComment.trim());
      } else {
        await reviewService.createReview(movieId, formRating, formComment.trim());
      }

      // Reset form & reload
      setFormRating(0);
      setFormComment('');
      setEditingReview(null);
      setShowForm(false);
      await fetchReviews();
    } catch (err) {
      setError(err.message || t('review.errorGeneral'));
    } finally {
      setSubmitting(false);
    }
  };

  // Bắt đầu chỉnh sửa
  const handleEdit = (review) => {
    setEditingReview(review);
    setFormRating(review.rating);
    setFormComment(review.comment);
    setShowForm(true);
    setError('');
  };

  // Xóa đánh giá
  const handleDelete = async (reviewId) => {
    if (!window.confirm(t('review.confirmDelete'))) return;
    try {
      await reviewService.deleteReview(reviewId);
      await fetchReviews();
    } catch (err) {
      alert(err.message);
    }
  };

  // Hủy form
  const handleCancel = () => {
    setShowForm(false);
    setEditingReview(null);
    setFormRating(0);
    setFormComment('');
    setError('');
  };

  // Phân phối số sao
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: totalCount > 0 ? (reviews.filter((r) => r.rating === star).length / totalCount) * 100 : 0,
  }));

  return (
    <div className="space-y-6 bg-dark-card/60 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] mt-12 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6 relative z-10">
        <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          <span className="bg-amber-500/20 p-2 rounded-xl text-amber-400">
            <MessageSquare size={24} />
          </span>
          {t('review.title')}
        </h2>

        {/* Nút viết đánh giá */}
        {isAuthenticated && isUser && !userReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Pencil size={16} />
            {t('review.writeReview')}
          </button>
        )}
      </div>

      {/* Stats Overview */}
      {totalCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          {/* Điểm trung bình */}
          <div className="md:col-span-4 flex flex-col items-center justify-center bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-2">
            <span className="text-5xl font-black text-white">
              {averageRating}
            </span>
            <StarDisplay rating={Math.round(averageRating)} size={20} />
            <span className="text-xs text-zinc-500 font-semibold">
              {totalCount} {t('review.reviews')}
            </span>
          </div>

          {/* Biểu đồ phân phối sao */}
          <div className="md:col-span-8 space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs font-bold text-zinc-400 w-6 text-right">{star}</span>
                <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-[11px] text-zinc-500 font-semibold w-8 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form viết / chỉnh sửa đánh giá */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="relative z-10 bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5 animate-in slide-in-from-top-2 duration-300"
        >
          <h3 className="text-lg font-bold text-white">
            {editingReview ? t('review.editTitle') : t('review.writeTitle')}
          </h3>

          {/* Star rating input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {t('review.yourRating')}
            </label>
            <StarRating rating={formRating} onRate={setFormRating} />
          </div>

          {/* Comment input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {t('review.yourComment')}
            </label>
            <textarea
              value={formComment}
              onChange={(e) => setFormComment(e.target.value)}
              placeholder={t('review.commentPlaceholder')}
              maxLength={500}
              rows={4}
              className="w-full bg-dark-deep border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none resize-none transition-all"
            />
            <div className="text-right text-[10px] text-zinc-600 font-semibold">
              {formComment.length}/500
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-500/10 border border-red-500/20 px-4 py-2.5 rounded-xl">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {editingReview ? t('review.updateBtn') : t('review.submitBtn')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-zinc-400 hover:text-white font-bold text-sm px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
            >
              {t('review.cancelBtn')}
            </button>
          </div>
        </form>
      )}

      {/* Thông báo cho người chưa đăng nhập */}
      {!isAuthenticated && (
        <div className="relative z-10 text-center py-6 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
          <User size={24} className="text-zinc-600 mx-auto mb-2" />
          <p className="text-zinc-500 text-sm font-semibold">
            {t('review.loginPrompt')}
          </p>
        </div>
      )}

      {/* Thông báo cho admin */}
      {isAuthenticated && !isUser && !showForm && (
        <div className="relative z-10 text-center py-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
          <p className="text-amber-500/80 text-xs font-semibold">
            {t('review.adminNotice')}
          </p>
        </div>
      )}

      {/* Danh sách reviews */}
      <div className="relative z-10 space-y-3">
        {loading ? (
          <div className="py-12 flex justify-center items-center gap-3 text-zinc-400 font-semibold">
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            {t('review.loading')}
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 font-medium bg-black/20 rounded-2xl border border-white/5">
            <MessageSquare size={32} className="text-zinc-700 mx-auto mb-3" />
            <p>{t('review.noReviews')}</p>
          </div>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUser={user}
              onEdit={handleEdit}
              onDelete={handleDelete}
              t={t}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
