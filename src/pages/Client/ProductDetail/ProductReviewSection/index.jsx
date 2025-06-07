import React, { useEffect, useState } from 'react';
import ReviewFormModal from '../ReviewFormModal';
import { reviewService } from '@/services/client/reviewService';
import { toast } from 'react-toastify';

export default function ProductReviewSection({ productName, skuId }) {
  const [reviews, setReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [filters, setFilters] = useState({
    hasMedia: false,
    purchased: false,
    star: null // null = tất cả
  });

  const filteredReviews = reviews.filter((review) => {
    if (filters.hasMedia && (!review.media || review.media.length === 0)) return false;
    if (filters.purchased && !review.orderItemId) return false; // chỉ đánh giá từ đơn đã mua
    if (filters.star && review.rating !== filters.star) return false;
    return true;
  });

  const visibleReviews = filteredReviews.slice(0, visibleCount);

  const fetchReviews = async () => {
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
    }
  };

  useEffect(() => {
    if (skuId) {
      fetchReviews();
    }
  }, [skuId, filters]);

  const handleOpenReviewModal = () => setShowReviewModal(true);
  const handleCloseReviewModal = () => setShowReviewModal(false);

  const handleSubmitReview = async () => {
    try {
      await fetchReviews();
      setVisibleCount(5); // reset lại khi gửi đánh giá mới
      setShowReviewModal(false);
      toast.success('Đánh giá thành công!');
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error(err.response?.data?.message || 'Bạn chưa mua sản phẩm này!');
      } else {
        toast.error('Đã xảy ra lỗi khi gửi đánh giá!');
      }
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const handleCollapse = () => {
    setVisibleCount(5);
  };

  const toggleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value
    }));
  };

  const toggleBooleanFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 ? (reviews.reduce((acc, r) => acc + Number(r.rating), 0) / totalReviewsCount).toFixed(1) : 0;

  const activeFilterClasses = 'bg-primary text-white border-primary';
  const inactiveFilterClasses = 'bg-white text-gray-600 border-gray-300 hover:bg-primary hover:text-white';

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN');
  };

  return (
    <>
      <div className="bg-white p-5 md:p-8 rounded-xl border border-gray-200 shadow text-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Đánh giá & nhận xét <span className="text-primary">{productName}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col items-center justify-center md:border-r md:border-gray-200 pr-6">
            <span className="text-4xl font-extrabold text-gray-900">{totalReviewsCount > 0 ? averageRating : 'Chưa có'}/5</span>
            {totalReviewsCount > 0 && (
              <div className="text-yellow-400 flex text-2xl my-2">
                {'★'.repeat(Math.floor(averageRating))}
                {'☆'.repeat(5 - Math.floor(averageRating))}
              </div>
            )}
            <span
              className="text-primary text-xs underline cursor-pointer hover:text-blue-600 transition"
              onClick={() => document.getElementById('review-list-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {totalReviewsCount} đánh giá
            </span>
          </div>

          <div className="md:col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-6 text-sm text-gray-700 font-medium text-center">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-400 h-full rounded-full transition-all" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-600 w-10 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-700 mb-2 font-medium">Bạn đánh giá sao về sản phẩm này?</p>
          <button
            onClick={handleOpenReviewModal}
            className="bg-primary text-white px-6 py-2.5 rounded-md font-semibold shadow hover:bg-opacity-90 transition-all text-sm"
          >
            Đánh giá ngay
          </button>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-4">Lọc theo</h4>

          {/* Bộ lọc kiểu boolean */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              onClick={() => setFilters({ hasMedia: false, purchased: false, star: null })}
              className={`px-3 py-1.5 border rounded-full text-xs cursor-pointer text-gray-600 border-gray-300`}
              style={{
                backgroundColor: !filters.hasMedia && !filters.purchased && filters.star === null ? 'var(--primary-color)' : 'white',
                color: !filters.hasMedia && !filters.purchased && filters.star === null ? 'white' : 'var(--primary-color)',
                borderColor: !filters.hasMedia && !filters.purchased && filters.star === null ? 'var(--primary-color)' : '',
                transition: 'none'
              }}
            >
              Tất cả
            </span>

            <span
              onClick={() => toggleBooleanFilter('hasMedia')}
              className="px-3 py-1.5 border rounded-full text-xs cursor-pointer text-gray-600 border-gray-300"
              style={{
                backgroundColor: filters.hasMedia ? 'var(--primary-color)' : 'white',
                color: filters.hasMedia ? 'white' : 'var(--primary-color)',
                borderColor: filters.hasMedia ? 'var(--primary-color)' : '',
                transition: 'none'
              }}
            >
              Có hình ảnh
            </span>

            <span
              onClick={() => toggleBooleanFilter('purchased')}
              className="px-3 py-1.5 border rounded-full text-xs cursor-pointer text-gray-600 border-gray-300"
              style={{
                backgroundColor: filters.purchased ? 'var(--primary-color)' : 'white',
                color: filters.purchased ? 'white' : 'var(--primary-color)',
                borderColor: filters.purchased ? 'var(--primary-color)' : '',
                transition: 'none'
              }}
            >
              Đã mua hàng
            </span>
          </div>

          {/* Bộ lọc theo số sao */}
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <span
                key={star}
                onClick={() => toggleFilter('star', star)}
                className="px-3 py-1.5 border rounded-full text-xs cursor-pointer text-gray-600 border-gray-300"
                style={{
                  backgroundColor: filters.star === star ? 'var(--primary-color)' : 'white',
                  color: filters.star === star ? 'white' : 'var(--primary-color)',
                  borderColor: filters.star === star ? 'var(--primary-color)' : '',
                  transition: 'none'
                }}
              >
                {star} ★
              </span>
            ))}
          </div>
        </div>

        <div id="review-list-section" className="mt-8 space-y-6">
          {visibleReviews.length > 0 ? (
            visibleReviews.map((review, idx) => (
              <div key={idx} className={`pb-6 ${idx > 0 ? 'border-t border-gray-200 pt-6' : ''}`}>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-indigo-500 text-white flex items-center justify-center rounded-full font-bold text-sm shadow">
                    {review.user?.fullName?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800">{review.user?.fullName || 'Người dùng'}</p>
                      <div className="text-yellow-400 text-sm flex items-center">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{review.content}</p>
                    {review.media?.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {review.media.map((m) =>
                          m.type === 'video' ? (
                            <video key={m.id} src={m.url} controls className="w-20 h-20 object-cover rounded border" />
                          ) : (
                            <img key={m.id} src={m.url} alt="Ảnh đánh giá" className="w-20 h-20 object-cover rounded border" />
                          )
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Đánh giá đã đăng vào {formatDateTime(review.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-6">Chưa có đánh giá nào cho sản phẩm này.</p>
          )}
        </div>

        {/* Xem thêm / Thu gọn */}
        {totalReviewsCount > visibleCount && (
          <div className="text-center mt-6">
            <button
              onClick={handleShowMore}
              className="inline-block bg-white border border-blue-500 text-blue-500 font-semibold px-6 py-2 rounded-full shadow hover:bg-blue-500 hover:text-white transition-all duration-200"
            >
              Xem thêm đánh giá
            </button>
          </div>
        )}

        {visibleCount > 5 && (
          <div className="text-center mt-4">
            <button
              onClick={handleCollapse}
              className="inline-block bg-gray-100 border border-gray-300 text-gray-700 font-medium px-5 py-2 rounded-full shadow hover:bg-gray-200 hover:text-black transition-all duration-200"
            >
              Thu gọn
            </button>
          </div>
        )}
      </div>

      <ReviewFormModal
        skuId={skuId}
        productName={productName}
        show={showReviewModal}
        onClose={handleCloseReviewModal}
        onSuccess={handleSubmitReview}
      />
    </>
  );
}
