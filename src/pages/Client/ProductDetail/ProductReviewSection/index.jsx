// ProductReviewSection.js
import React, { useState } from "react"; 
import ReviewFormModal from '../ReviewFormModal'; // Đường dẫn này cần chính xác

const reviews = [
  {
    name: "Thân Quốc Thịnh",
    date: "6/5/2025 13:49",
    rating: 5,
    tags: ["Hiệu năng Mạnh mẽ", "Thời lượng pin Khủng", "Màn hình Rất sắc nét"],
    content: "Sản phẩm rất tốt, mượt",
  },
  {
    name: "Nguyễn Khánh",
    date: "24/4/2025 16:19",
    rating: 4,
    tags: ["Hiệu năng Mạnh mẽ", "Thời lượng pin Khủng", "Màn hình Rất sắc nét"],
    content: "Sản phẩm tốt nhưng chưa tối ưu",
  },
];

// Giả sử bạn truyền productName và các props khác từ ProductDetail
export default function ProductReviewSection({ 
  productName = "iPhone 16 Pro Max 1TB",
  // rating, // Nên lấy từ dữ liệu động hoặc tính toán
  // reviewCount // Nên lấy từ dữ liệu động hoặc tính toán
}) { 
  const [showReviewModal, setShowReviewModal] = useState(false);
  // TODO: Thêm state để quản lý filter đang active, ví dụ:
  // const [activeFilter, setActiveFilter] = useState('all'); 
  // const [activeStarFilter, setActiveStarFilter] = useState(null);

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleSubmitReview = (reviewData) => {
    console.log("Đánh giá đã gửi:", reviewData);
    // Xử lý logic gửi đánh giá lên server
    alert(`Cảm ơn bạn đã đánh giá ${reviewData.rating} sao cho sản phẩm! Nhận xét: "${reviewData.comment}"`);
    setShowReviewModal(false); 
  };

  // Tính toán rating tổng và số lượng đánh giá từ mảng reviews (ví dụ)
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviewsCount).toFixed(1) 
    : 0;

  // Style cho nút filter active và inactive
  const activeFilterClasses = "bg-primary text-white border-primary"; // Nền chủ đạo, chữ trắng
  const inactiveFilterClasses = "bg-white text-gray-600 border-gray-300 hover:bg-primary hover:text-white hover:border-primary focus:bg-primary focus:text-white focus:border-primary";

  return (
    <>
      <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200 shadow-sm text-sm"> {/* Bỏ !pb-2 nếu không cần thiết */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Đánh giá & nhận xét {productName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6"> {/* Thêm mb-6 */}
            <div className="flex flex-col items-center justify-center md:border-r md:border-gray-200 md:pr-4 py-4 md:py-0">
                <span className="text-3xl font-bold text-gray-800">{totalReviewsCount > 0 ? averageRating : 'Chưa có'}/5</span>
                {totalReviewsCount > 0 && (
                  <div className="text-yellow-400 flex text-xl my-1">
                      {'★'.repeat(Math.floor(averageRating))}
                      {averageRating % 1 !== 0 && averageRating > 0 ? <span className="text-yellow-400 opacity-70">★</span> : (5 - Math.floor(averageRating) > 0 && averageRating > 0 ? <span className="text-gray-300">☆</span> : '')} 
                      {'☆'.repeat(Math.max(0, 5 - Math.ceil(averageRating)))}
                  </div>
                )}
                <span 
                  className="text-primary underline cursor-pointer text-xs hover:text-blue-700"
                  onClick={() => document.getElementById('review-list-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {totalReviewsCount} đánh giá
                </span>
            </div>

            <div className="md:col-span-2 space-y-1 py-2">
            {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
                return (
                <div key={star} className="flex items-center gap-2">
                    <span className="w-5 text-xs text-gray-600 text-center">{star}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden"> {/* Tăng chiều cao thanh progress */}
                    <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                    />
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right"> {/* Tăng chiều rộng cho số lượng */}
                        {count}
                    </span>
                </div>
                );
            })}
            </div>
        </div>


        <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-semibold text-gray-800">Đánh giá theo trải nghiệm</h3>
          {["- Hiệu năng", "- Thời lượng pin", "- Màn hình"].map((text, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="text-gray-700">{text}</span>
              <div className="text-yellow-400 text-sm flex items-center">
                {'★'.repeat(5)} <span className="text-gray-600 ml-1 text-xs">({totalReviewsCount})</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-gray-700 mb-2">Bạn đánh giá sao về sản phẩm này?</p>
          <button 
            onClick={handleOpenReviewModal}
            className="bg-primary text-white px-6 py-2.5 rounded-md font-semibold hover:bg-opacity-80 transition-all text-sm" 
            // Thay class hover-primary bằng hover:bg-opacity-80 của màu primary hoặc một màu tối hơn
          >
            Đánh giá ngay
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-3">Lọc theo</h4> {/* Tăng mb */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Nút "Tất cả" - Giả sử active mặc định */}
            <span className={`px-3 py-1.5 border rounded-full text-xs cursor-pointer transition-colors duration-150 ${activeFilterClasses}`}>
              Tất cả
            </span>
            <span className={`px-3 py-1.5 border rounded-full text-xs cursor-pointer transition-colors duration-150 ${inactiveFilterClasses}`}>Có hình ảnh</span>
            <span className={`px-3 py-1.5 border rounded-full text-xs cursor-pointer transition-colors duration-150 ${inactiveFilterClasses}`}>Đã mua hàng</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <span key={star} className={`px-3 py-1.5 border rounded-full text-xs cursor-pointer transition-colors duration-150 ${inactiveFilterClasses}`}>
                {star} ★
              </span>
            ))}
          </div>
        </div>

        <div id="review-list-section" className="mt-6 pt-2 space-y-4">
          {reviews.length > 0 ? reviews.map((review, idx) => (
            <div key={idx} className={`py-4 ${idx > 0 ? 'border-t border-gray-200' : ''}`}>
              <div className="flex items-start gap-3 mb-1.5"> {/* Tăng gap, items-start */}
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {review.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2 flex items-center text-sm ml-12"> {/* Căn lề với tên */}
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs mb-2 ml-12"> {/* Căn lề */}
                {review.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 border border-gray-200 px-2 py-1 rounded text-gray-600">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed ml-12">{review.content}</p> {/* Căn lề */}
            </div>
          )) : (
            <p className="text-gray-500 text-center py-4">Chưa có đánh giá nào cho sản phẩm này.</p>
          )}
        </div>
      </div>

      <ReviewFormModal 
        productName={productName} 
        show={showReviewModal} 
        onClose={handleCloseReviewModal}
        onSubmitReview={handleSubmitReview}
      />
    </>
  );
}
