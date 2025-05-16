import React from "react";

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

export default function ProductReviewSection() {
  return (
    <div className="bg-white p-6 rounded border border-gray-200 shadow-sm text-sm !pb-2">
      <h2 className="text-base font-bold mb-4">
        Đánh giá & nhận xét iPhone 16 Pro Max 1TB
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center md:border-r md:border border-gray-200 md:pr-6">
          <span className="text-2xl font-bold">4.5/5</span>
          <div className="text-yellow-400 flex text-lg mb-1">
            ★★★★<span className="text-gray-300">☆</span>
          </div>
          <span className="text-blue-600 underline cursor-pointer">2 đánh giá</span>
        </div>

        <div className="md:col-span-2 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="w-6">{star} ★</span>
              <div className="flex-1 bg-gray-200 rounded h-2 overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: star === 5 || star === 4 ? "50%" : "0%" }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {star <= 4 ? "1 đánh giá" : "0 đánh giá"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Theo trải nghiệm */}
      <div className="mt-4 pt-4 space-y-2">
        <h3 className="font-semibold">Đánh giá theo trải nghiệm</h3>
        {["- Hiệu năng", "- Thời lượng pin", "- Màn hình"].map((text, i) => (
          <div key={i} className="flex justify-between items-center">
            <span>{text}</span>
            <div className="text-yellow-400 text-sm">
              ★★★★★ <span className="text-black ml-1">(2)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gợi ý đánh giá */}
      <div className="text-center mt-6">
        <p>Bạn đánh giá sao về sản phẩm này?</p>
        <button className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Đánh giá ngay
        </button>
      </div>

      {/* Lọc */}
      <div className="mt-6">
        <h4 className="font-semibold mb-2">Lọc theo</h4>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-3 py-1 border border-gray-200 rounded-full bg-red-100 text-red-600">
            Tất cả
          </span>
          <span className="px-3 py-1 border border-gray-200 rounded-full">Có hình ảnh</span>
          <span className="px-3 py-1 border border-gray-200 rounded-full">Đã mua hàng</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <span key={star} className="px-2 py-1 border border-gray-200 rounded-full text-sm">
              {star} ★
            </span>
          ))}
        </div>
      </div>

      {/* Danh sách đánh giá */}
      <div className="mt-6 space-y-4">
        {reviews.map((review, idx) => (
          <div key={idx} className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                {review.name[0]}
              </div>
              <div>
                <p className="font-semibold">{review.name}</p>
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            </div>
            <div className="text-yellow-400 mb-2">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>
            <div className="flex flex-wrap gap-2 text-xs mb-2">
              {review.tags.map((tag, i) => (
                <span key={i} className="bg-gray-100 border border-gray-200 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-700">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
