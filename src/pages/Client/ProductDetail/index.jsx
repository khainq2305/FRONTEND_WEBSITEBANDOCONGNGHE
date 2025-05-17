import React, { useState, useEffect, useRef } from "react";
import ProductImageSection from "./ProductImageSection";
import ProductOptions from "./ProductOptions";
// import ProductList from "./ProductList"; // Không dùng ProductList nữa
import RelatedProductsSlider from './RelatedProductsSlider'; // Đảm bảo đường dẫn này chính xác
import ProductReviewSection from "./ProductReviewSection";
import TechnicalSpec from "./TechnicalSpec";
import ProductQA from "./ProductQA";
import ProductInfoBox from "./ProductInfoBox";
import ProductHighlights from "./ProductHighlights";

// --- Các component nhỏ ---
const HomeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
);

const highlightsDataExample = {
  title: "Đặc Điểm Nổi Bật Của iPhone 16 Pro Max",
  shortFeatures: [
    "Chip A18 Pro siêu mạnh mẽ, hiệu năng đồ họa vượt trội.",
    "Hệ thống camera Pro được nâng cấp, cảm biến lớn hơn, chụp ảnh thiếu sáng ấn tượng.",
    "Màn hình ProMotion XDR với độ sáng tối đa kỷ lục, viền mỏng hơn.",
    "Thời lượng pin cải thiện đáng kể, hỗ trợ sạc nhanh MagSafe.",
    "Khung viền Titan bền bỉ, trọng lượng nhẹ hơn.",
  ],
  tableOfContents: [
    "Chip A18 Pro: Đỉnh cao hiệu năng",
    "Camera Pro: Bắt trọn mọi khoảnh khắc",
    "Màn hình: Trải nghiệm thị giác đỉnh cao",
  ],
  detailedSections: [
    {
      title: "Chip A18 Pro: Đỉnh cao hiệu năng",
      content: "iPhone 16 Pro Max được trang bị chip A18 Pro sản xuất trên tiến trình 3nm thế hệ mới, mang lại hiệu năng CPU và GPU vượt trội so với các thế hệ trước. Điều này giúp xử lý mượt mà mọi tác vụ từ cơ bản đến nặng nhất như chơi game đồ họa cao, chỉnh sửa video 4K, hay chạy các ứng dụng AI phức tạp...\nCông nghệ Neural Engine cũng được cải tiến mạnh mẽ, tăng tốc các tác vụ học máy, mang đến những trải nghiệm thông minh và cá nhân hóa hơn.",
      image: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/1.png"
    },
    {
      title: "Hệ thống Camera Pro đột phá",
      content: "Hệ thống camera trên iPhone 16 Pro Max tiếp tục được Apple đầu tư mạnh mẽ. Cảm biến chính lớn hơn thu được nhiều ánh sáng hơn, cải thiện đáng kể khả năng chụp ảnh trong điều kiện thiếu sáng. Camera Ultra Wide và Telephoto cũng được nâng cấp, mang đến dải zoom quang học linh hoạt và chất lượng hình ảnh chi tiết, sắc nét hơn...\nCác tính năng như Photographic Styles, Cinematic mode, ProRes video tiếp tục được tối ưu hóa, đáp ứng nhu cầu sáng tạo nội dung chuyên nghiệp.",
      points: [
          "Cảm biến chính 48MP kích thước lớn hơn.",
          "Chế độ Cinematic hỗ trợ quay video 4K HDR ở 30 fps.",
          "Ống kính Telephoto zoom quang học 5x."
      ],
      image: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/3.png"
    },
  ],
};

const StarRating = ({ rating, totalStars = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <svg key={index} className={`w-4 h-4 ${index < rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.293c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Breadcrumb = ({ productName }) => {
  const [isDocked, setIsDocked] = useState(false);
  const breadcrumbRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      if (breadcrumbRef.current) {
        if (window.innerWidth >= 768) {
          const rect = breadcrumbRef.current.getBoundingClientRect();
          setIsDocked(rect.top <= 0);
        } else {
          setIsDocked(false);
        }
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      handleScroll(); 
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);
  return (
    <div ref={breadcrumbRef} className={`md:sticky md:top-0 md:z-20 transition-all duration-200 ease-in-out ${isDocked ? 'bg-white md:shadow-md max-w-screen-xl mx-auto' : 'bg-transparent'}`}>
      <div className={`flex items-center flex-wrap gap-x-1.5 gap-y-1 px-4 py-2 text-sm text-gray-500 ${isDocked ? 'md:py-3' : 'max-w-screen-xl mx-auto md:py-3'}`}>
        <a href="/" className="hover:text-blue-500 flex items-center">
          <HomeIcon className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>Trang chủ</span>
        </a>
        <span className="text-gray-400">/</span>
        <a href="/products" className="hover:text-blue-500">Sản phẩm</a>
        <span className="text-gray-400">/</span>
        <span className={`transition-colors duration-200 ${isDocked ? 'text-gray-700' : 'text-gray-700'} font-medium`}>{productName}</span>
      </div>
    </div>
  );
};

const ProductTitleHeader = ({ productName, rating, reviewCount }) => (
  <div className="px-4 md:px-0 pt-2 md:pt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-4 md:mb-6"> {/* <--- THAY ĐỔI Ở ĐÂY */}
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{productName}</h1>
    {typeof rating === 'number' && typeof reviewCount === 'number' && (
      <div className="flex items-center space-x-1 text-sm text-gray-600 flex-shrink-0">
        <StarRating rating={rating} />
        <span>({reviewCount} đánh giá)</span>
      </div>
    )}
  </div>
);

// --- Component ProductDetail chính ---
export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState("Kem");
  const [selectedOption, setSelectedOption] = useState("WIFI 12GB 256GB");
  const [showSpecModal, setShowSpecModal] = useState(false);

  const allProductImagesData = [
    { imageThumb: "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-3_1.png", imageFull: "https://cdn2.cellphones.com.vn/insecure/rs:fill:400:400/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-3_1.png", label: "Màu Kem (Пример)" },
    { imageThumb: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-tecno-camon-40-pro_6_.png", imageFull: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-tecno-camon-40-pro_6_.png", label: "Màu Hồng (Пример)"},
    { imageThumb: "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-gold.png", imageFull: "https://cdn2.cellphones.com.vn/insecure/rs:fill:400:400/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-gold.png", label: "Màu Vàng (Пример)" },
    { imageThumb: "https://cdn2.cellphones.com.vn/insecure/rs:fill:58:58/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-blue-titanium.png", imageFull: "https://cdn2.cellphones.com.vn/insecure/rs:fill:400:400/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-blue-titanium.png", label: "Xanh Titan (Пример)" }
  ];

  // Dữ liệu mẫu cho RelatedProductsSlider (bạn nên lấy dữ liệu này từ API hoặc props trong thực tế)
  const relatedProductsDataSample = [ 
    { id: "rp1", name: "Samsung Galaxy S24 Ultra 512GB", price: "31.990.000", oldPrice: "35.490.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/s/a/samsung-galaxy-s24-ultra-vang-1_1_1.png", discount: 10, rating: 4.9, inStock: true, soldCount: 500, isFavorite: false },
    { id: "rp2", name: "Xiaomi 14 12GB 256GB", price: "19.990.000", oldPrice: "22.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi-14-den_1_1.png", discount: 13, rating: 4.8, inStock: true, soldCount: 320, isFavorite: true },
    { id: "rp3", name: "OPPO Find N3 Flip 5G", price: "20.490.000", oldPrice: "24.990.000", image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/o/p/oppo-find-n3-flip-pink_1_1.png", discount: 18, rating: 4.7, inStock: false, soldCount: 150, isFavorite: false },
    // Thêm các sản phẩm tương tự khác nếu cần
  ];


  const [mainImage, setMainImage] = useState(allProductImagesData[0].imageFull);
  const [showAll, setShowAll] = useState(false); // State cho ProductQA

  const productName = "iPhone 16 Pro Max";
  const productRating = 5;
  const productReviewCount = 2;

  const productOptionsData = [
    { label: "5G 12GB 256GB", price: "19.990.000₫", originalPrice: "21.990.000₫", tradeInPrice: "17.990.000₫" },
    { label: "5G 8GB 128GB", price: "18.590.000₫", originalPrice: "20.990.000₫", tradeInPrice: "16.590.000₫" },
    { label: "WIFI 12GB 256GB", price: "15.490.000₫", originalPrice: "17.990.000₫", tradeInPrice: "13.490.000₫" },
    { label: "WIFI 8GB 128GB", price: "14.990.000₫", originalPrice: "16.990.000₫", tradeInPrice: "12.990.000₫" },
  ];
  const productColorsData = ["Kem", "Xám", "Xanh Dương", "Đen Titan"];

  const questions = [
    { user: "Nguyen Lam", time: "6 ngày trước", question: "nếu không lấy bao da thì có được giảm giá thêm không ạ?", adminReply: "CellphoneS xin chào anh Lam. Dạ hiện tại ưu đãi tặng kèm bao da bàn phím chỉ áp dụng cho học sinh sinh viên và sản phẩm quà tặng chưa hỗ trợ quy đổi." },
    { user: "Đặng Văn Việt", time: "1 tuần trước", question: "Trường hợp máy hao pin khi mới mua thì có được đổi máy mới lại không shop", adminReply: "CellphoneS xin chào anh Việt, dạ em xin gửi lại thông tin đến bộ phận liên quan kiểm tra và sẽ liên hệ lại anh trong vòng 60 phút." },
    { user: "Tuấn Phạm", time: "2 tuần trước", question: "phụ kiện đi kèm gồm những gì vậy shop. Có bao gồm bút và bao da không ạ", adminReply: "" },
  ];
  const visibleQuestions = showAll ? questions : questions.slice(0, 2);
  const stickyBreadcrumbHeightClass = "md:top-11";

  return (
    <div> 
      <Breadcrumb productName={productName} />

      <div className="max-w-screen-xl mx-auto py-3 md:pt-1 md:pb-6 text-sm text-gray-800"> {/* <--- THAY ĐỔI Ở ĐÂY */}
      <ProductTitleHeader
        productName={productName}
        rating={productRating}
        reviewCount={productReviewCount}
      />

        {/* Khối 1: Ảnh (trái) và Options (phải) */}
        <div className="md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">
          <ProductImageSection
            mainImage={mainImage}
            setMainImage={setMainImage}
            allImages={allProductImagesData}  
            productName={productName}
            stickyTopOffset={stickyBreadcrumbHeightClass}
          />
          <ProductOptions
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            productName={productName}
            productOptionsData={productOptionsData}
            productColorsData={productColorsData}
            stickyTopOffset={stickyBreadcrumbHeightClass}
          />
        </div>

        {/* Khối 2: Thông tin sản phẩm (toàn bộ chiều rộng) */}
        <div className="px-4 md:px-0 mb-6">
          <ProductInfoBox />
        </div>

        {/* Khối 3: Đặc điểm nổi bật (trái) và Thông số kỹ thuật (phải) */}
        <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start mb-6">
          <ProductHighlights data={highlightsDataExample} />
          {TechnicalSpec && (
            <div className={`md:sticky ${stickyBreadcrumbHeightClass} h-fit`}>
              <TechnicalSpec productName={productName} onShowModal={() => setShowSpecModal(true)} />
            </div>
          )}
        </div>

   
          <div className="px-4 md:px-0 mt-4 md:mt-6">
            
            <RelatedProductsSlider 
            />
          </div>
        
        
        {/* Khối 4: Đánh giá (trái) và Hỏi & Đáp (phải) */}
        <div className="px-4 md:px-0 mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 items-start">
          <div> 
            {ProductReviewSection && <ProductReviewSection productName={productName} rating={productRating} reviewCount={productReviewCount} />}
          </div>
          <div> 
            {ProductQA && <ProductQA 
              questions={visibleQuestions} 
              totalQuestions={questions.length}
              showAll={showAll}
              setShowAll={setShowAll}
            />}
          </div>
        </div>
      </div>
    </div>
  );
}
