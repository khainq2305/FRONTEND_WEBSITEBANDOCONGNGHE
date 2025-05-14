
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AiOutlineUp } from 'react-icons/ai';

const images = [
  {
    label: "Mặt trước",
    products: [
      "https://cdn.tgdd.vn/Products/Images/42/323543/compare/oppo-a60-truoc-org.jpg",
      "https://cdn.tgdd.vn/Products/Images/42/319466/compare/realme-12-truoc-org.jpg",
      "https://cdn.tgdd.vn/Products/Images/42/323543/compare/oppo-a60-truoc-org.jpg",
    ],
  },
  {
    label: "Mặt lưng",
    products: [
      "https://cdn.tgdd.vn/Products/Images/42/323543/compare/oppo-a60-sau-org.jpg",
      "https://cdn.tgdd.vn/Products/Images/42/319466/compare/realme-12-sau-org.jpg",
      "https://cdn.tgdd.vn/Products/Images/42/323543/compare/oppo-a60-sau-org.jpg",
    ],
  },
];

export default function CompareProductImages() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle previous image
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Handle next image
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mt-10 bg-white">
      {/* Tiêu đề */}
      <h2 className="text-gl font-bold text-gray-800 mb-2 text-left flex items-center gap-2 mt-10">
        <span className="p-1 rounded-full border border-gray-300">
          <AiOutlineUp size={15} className="text-gray-800" />
        </span>
        THIẾT KẾ SẢN PHẨM
      </h2>

      {/* Khối hiển thị ảnh sản phẩm */}
      <div className="relative border py-1 border border-t-3 border-t-gray-700">
        {/* Nút trái */}
        <button onClick={handlePrev} className="absolute left-[calc(300px+16px)] top-1/2 -translate-y-1/2 p-2 bg-white shadow rounded-full z-10">
          <ChevronLeft size={24} />
        </button>

        {/* Danh sách ảnh */}
        <div className="ml-[300px] flex justify-center gap-4">
          {images[currentIndex].products.map((img, idx) => (
            <div key={idx} className="w-[300px] flex flex-col items-center">
              <div className="h-[300px] flex items-center justify-center">
                <img src={img} alt={`Sản phẩm ${idx + 1}`} className="w-[120px] h-[280px] object-contain" />
              </div>

              {/* Hiển thị dưới ảnh giữa */}
              {idx === 1 && (
                <>
                  <p className="mt-2 text-sm text-gray-600 text-center">Đang xem: {images[currentIndex].label}</p>
                  <div className="flex justify-center mt-1 gap-2">
                    {images.map((_, index) => (
                      <span key={index} className={`text-3xl ${index === currentIndex ? "text-gray-800" : "text-gray-300"}`}>-</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Nút phải */}
        <button onClick={handleNext} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white shadow rounded-full z-10">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* PHẦN NÚT MUA HÀNG */}
      <div className="flex justify-center gap-4 border py-3">
        {/* Aside rỗng để căn chỉnh với ảnh */}
        <div className="w-[300px]"></div>

        {/* Nút mua cho từng sản phẩm */}
        {images[currentIndex].products.map((_, idx) => (
          <div key={idx} className="w-[300px] space-y-2 px-5">
            <button className="w-full bg-orange-500 text-white py-3 rounded font-semibold text-sm">MUA NGAY</button>
            <button className="w-full bg-blue-500 text-white py-2 rounded font-semibold text-sm">MUA TRẢ CHẬM 0%</button>
            <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold text-sm">TRẢ CHẬM QUA THẺ 0%</button>
          </div>
        ))}
      </div>
    </div>
  );
}
