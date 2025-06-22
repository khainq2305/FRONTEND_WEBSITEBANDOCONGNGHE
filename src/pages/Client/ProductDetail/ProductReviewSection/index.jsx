import React, { useEffect, useState } from 'react';
import ReviewFormModal from '../ReviewFormModal';
import { reviewService } from '@/services/client/reviewService';
import { toast } from 'react-toastify';
import Loader from '@/components/common/Loader';

import { FaStar, FaCamera, FaCheckCircle, FaUserCircle, FaPen, FaShieldAlt } from 'react-icons/fa';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm ${className}`}>{children}</div>
);

export default function ProductReviewSection({ productName, skuId }) {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [filters, setFilters] = useState({
    hasMedia: false,
    purchased: false,
    star: null
  });
  const filteredReviews = reviews.filter((review) => {
    if (filters.hasMedia && (!review.media || review.media.length === 0)) return false;
    if (filters.purchased && !review.orderItemId) return false;
    if (filters.star && review.rating !== filters.star) return false;
    return true;
  });

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getBySku(skuId, {
        hasMedia: filters.hasMedia,
        purchased: filters.purchased,
        star: filters.star !== null ? filters.star : undefined
      });
      setReviews(data);
    } catch (err) {
      console.error('Lỗi khi lấy đánh giá:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };
  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewModal(true);
  };

  const checkCanReview = async () => {
    try {
      const res = await reviewService.checkUserReview(skuId);
      setCanReview(res?.data?.canReview || false);
    } catch (err) {
      console.error('Lỗi kiểm tra quyền đánh giá:', err);
      setCanReview(false);
    }
  };

  useEffect(() => {
    if (skuId) {
      fetchReviews();
      checkCanReview();
    }
  }, [skuId, filters]);

  const handleOpenReviewModal = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!token || !user) {
      toast.warning('Vui lòng đăng nhập trước khi đánh giá!');
      return;
    }

    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => setShowReviewModal(false);

  const handleSubmitReview = async () => {
    try {
      await fetchReviews();
      await checkCanReview();
      setVisibleCount(5);
      setShowReviewModal(false);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error(err.response?.data?.message || 'Bạn chưa mua sản phẩm này!');
      } else {
        toast.error('Đã xảy ra lỗi khi gửi đánh giá!');
      }
    }
  };

  const handleShowMore = () => setVisibleCount((prev) => prev + 10);
  const handleCollapse = () => setVisibleCount(5);

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value
    }));
  };

  const toggleBooleanFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 ? (reviews.reduce((acc, r) => acc + Number(r.rating), 0) / totalReviewsCount).toFixed(1) : 0;

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (loading) return <Loader fullscreen />;
  return (
    <>
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Đánh giá & Nhận xét <span className="text-primary">{productName}</span>
        </h2>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6">
          <div className="flex-shrink-0 flex flex-col items-center md:items-start">
            {totalReviewsCount > 0 ? (
              <>
                <p className="text-sm text-gray-600">Điểm trung bình</p>
                <span className="text-4xl font-bold text-primary my-1">{averageRating}/5</span>
                <div className="text-yellow-400 flex text-lg">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < Math.round(averageRating) ? 'currentColor' : '#e0e0e0'} />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">({totalReviewsCount} đánh giá)</p>
              </>
            ) : (
              <div className="h-full flex items-center">
                <p className="text-gray-500">Chưa có đánh giá</p>
              </div>
            )}
          </div>

          <div className="flex-grow flex flex-col-reverse md:flex-row justify-between w-full">
            <div className="w-full md:w-3/5 space-y-1 mt-4 md:mt-0">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-sm">
                    <div className="flex items-center w-8">
                      <span>{star}</span>
                      <FaStar className="text-yellow-400 ml-1 text-xs" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-10 text-right">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* ✅ Chỉ hiện nếu được quyền đánh giá */}
            {canReview && (
              <div className="flex-shrink-0 text-center md:text-right">
                <button
                  onClick={handleOpenReviewModal}
                  className="bg-primary text-white px-5 py-2.5 rounded-lg font-semibold shadow hover:bg-opacity-90 transition-all text-sm inline-flex items-center gap-2"
                >
                  <FaPen />
                  Viết đánh giá
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700 mr-2">Lọc theo:</span>
            <button
              onClick={() => setFilters({ hasMedia: false, purchased: false, star: null })}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${!filters.hasMedia && !filters.purchased && filters.star === null ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-800 border-gray-100 hover:border-gray-300'}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => toggleBooleanFilter('hasMedia')}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all inline-flex items-center gap-1 ${filters.hasMedia ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-800 border-gray-100 hover:border-gray-300'}`}
            >
              <FaCamera /> Có ảnh
            </button>

            <div className="h-4 w-px bg-gray-300 mx-1"></div>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => toggleFilter('star', star)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all inline-flex items-center gap-1 ${filters.star === star ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-800 border-gray-100 hover:border-gray-300'}`}
              >
                {star} <FaStar className="text-yellow-400" />
              </button>
            ))}
          </div>
        </div>

        <div id="review-list-section" className="mt-6">
          <div className="space-y-6">
            {visibleReviews.map((review) => (
              <div key={review.id} className="pt-6 border-t border-gray-200 flex gap-4 flex-col md:flex-row">
                <div className="w-10 h-10 flex-shrink-0">
                  {review.user?.avatar ? (
                    <img src={review.user.avatar} alt={review.user.fullName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-full h-full text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{review.user?.fullName || 'Người dùng'}</p>
                      {/* ✅ Hiển thị biến thể nếu có */}
{review.sku.variantValues
  .map((vv) =>
    vv.variantValue?.variant?.name && vv.variantValue?.value
      ? `${vv.variantValue.variant.name}: ${vv.variantValue.value}`
      : 'Thuộc tính không xác định'
  )
  .join(', ')}


                      {review.orderItemId && (
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                          <FaCheckCircle /> Đã mua hàng
                        </p>
                      )}
                    </div>
                    <div className="text-yellow-400 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < review.rating ? 'currentColor' : '#e0e0e0'} />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap">{review.content}</p>

                  {review.media?.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {review.media.map((m) =>
                        m.type === 'video' ? (
                          <video key={m.id} src={m.url} controls className="w-24 h-24 object-cover rounded-lg border-2 border-gray-100" />
                        ) : (
                          <img
                            key={m.id}
                            src={m.url}
                            alt="Ảnh đánh giá"
                            className="w-24 h-24 object-cover rounded-lg border-2 border-gray-100"
                          />
                        )
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-3">{formatDateTime(review.createdAt)}</p>
                  {(() => {
                    const user = JSON.parse(localStorage.getItem('user') || '{}');
                    const isOwner = review.user?.id === user?.id;
                    const noReply = !review.replyContent;
                    const createdAt = new Date(review.createdAt);
                    const now = new Date();
                    const within7Days = (now - createdAt) / (1000 * 60 * 60 * 24) <= 7;

                    if (isOwner && noReply && within7Days) {
                      return (
                        <button
                          onClick={() => {
                            setEditingReview(review);
                            setShowReviewModal(true);
                          }}
                          className="mt-2 text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                        >
                          <FaPen className="w-4 h-4" />
                          Chỉnh sửa đánh giá
                        </button>
                      );
                    }
                    return null;
                  })()}

                  {/* ✅ Phản hồi từ admin nếu có */}
                  {review.replyContent && (
                    <div className="mt-4 ml-4 md:ml-8 pl-4 border-l-2 border-primary border-opacity-50">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-sm font-semibold text-primary">Phản hồi từ {review.repliedBy || 'Người bán'}</p>
                            {review.replyDate && <p className="text-xs text-gray-500">{formatDateTime(review.replyDate)}</p>}
                          </div>
                        </div>
                        <p
                          className="text-sm text-gray-700 whitespace-pre-wrap break-words max-w-full mt-3 pt-3 border-t border-gray-200"
                          style={{ overflowWrap: 'anywhere' }}
                        >
                          {review.replyContent}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === Nút Xem thêm / Thu gọn === */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
          {filteredReviews.length > visibleCount && (
            <button
              onClick={handleShowMore}
              className="bg-primary bg-opacity-10 border border-primary text-primary font-semibold px-6 py-2 rounded-full hover:bg-opacity-20 transition-all"
            >
              Xem thêm {filteredReviews.length - visibleCount} đánh giá
            </button>
          )}
          {visibleCount > 5 && (
            <button
              onClick={handleCollapse}
              className="bg-gray-100 text-gray-600 font-medium px-6 py-2 rounded-full hover:bg-gray-200 transition-all"
            >
              Thu gọn
            </button>
          )}
        </div>
      </div>

      <ReviewFormModal
        skuId={skuId}
        productName={productName}
        show={showReviewModal}
        onClose={handleCloseReviewModal}
        onSuccess={handleSubmitReview}
        editingReview={editingReview}
      />
    </>
  );
}
