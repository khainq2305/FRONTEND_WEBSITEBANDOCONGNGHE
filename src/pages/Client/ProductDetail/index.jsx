import { useState } from "react";
import ProductImageSection from "./ProductImageSection";
import ProductOptions from "./ProductOptions";
import ProductList from "./ProductList";
import ProductReviewSection from "./ProductReviewSection";
import TechnicalSpec from "./TechnicalSpec";
import ProductQA from "./ProductQA";

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState("Titan Sa Mạc");
  const [selectedOption, setSelectedOption] = useState("WIFI 12GB 256GB");
  const [showSpecModal, setShowSpecModal] = useState(false);

  const [mainImage, setMainImage] = useState(
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:400:400/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max-3_1.png"
  );
  const [showAll, setShowAll] = useState(false);

  const questions = [
    {
      user: "Nguyen Lam",
      time: "6 ngày trước",
      question: "nếu không lấy bao da thì có được giảm giá thêm không ạ?",
      adminReply:
        "CellphoneS xin chào anh Lam. Dạ hiện tại ưu đãi tặng kèm bao da bàn phím chỉ áp dụng cho học sinh sinh viên và sản phẩm quà tặng chưa hỗ trợ quy đổi.",
    },
    {
      user: "Đặng Văn Việt",
      time: "1 tuần trước",
      question:
        "Trường hợp máy hao pin khi mới mua thì có được đổi máy mới lại không shop",
      adminReply:
        "CellphoneS xin chào anh Việt, dạ em xin gửi lại thông tin đến bộ phận liên quan kiểm tra và sẽ liên hệ lại anh trong vòng 60 phút.",
    },
    {
      user: "Tuấn Phạm",
      time: "2 tuần trước",
      question:
        "phụ kiện đi kèm gồm những gì vậy shop. Có bao gồm bút và bao da không ạ",
      adminReply: "",
    },
  ];
  const visibleQuestions = showAll ? questions : questions.slice(0, 2);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 text-sm text-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-start">
        <ProductImageSection mainImage={mainImage} setMainImage={setMainImage} />
        <ProductOptions
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />
      </div>

      {/* SẢN PHẨM TƯƠNG TỰ */}

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Sản phẩm tương tự
        </h2>
        <ProductList />
      </div>

      {/* ĐÁNH GIÁ & THÔNG SỐ KỸ THUẬT - Cùng hàng */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        {/* Đánh giá & nhận xét */}
      <ProductReviewSection />

        {/* Thông số kỹ thuật */}
       <TechnicalSpec />

        {/* Hỏi và đáp - nằm bên trái, không đụng bên phải */}
        <ProductQA questions={questions} />

      </div>
    </div>
  );
}
