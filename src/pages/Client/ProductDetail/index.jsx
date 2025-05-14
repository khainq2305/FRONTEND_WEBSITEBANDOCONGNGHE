import { useState } from "react";
// import "./index.css";
import ProductList from "./ProductList";
import FeatureSlider from "./FeatureSlider";
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
    // Thêm nhiều bình luận khác nếu muốn
  ];
  const visibleQuestions = showAll ? questions : questions.slice(0, 2);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 text-sm text-gray-800">
      <h1 className="text-lg md:text-xl font-bold mb-2">
        iPad Samsung Tab S9 WiFi 12GB 256GB | Chính hãng
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 items-start">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="w-full aspect-[4/2] border rounded overflow-hidden">
            <img
              src={mainImage}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
          <FeatureSlider onSelect={(img) => setMainImage(img)} />
        </div>

        {/* RIGHT */}
        <div className="bg-white p-4 rounded border shadow-sm space-y-4 text-sm text-gray-800 sticky top-4 h-fit">
          {/* Option */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: "5G 12GB 256GB", price: "19.990.000₫" },
              { label: "5G 8GB 128GB", price: "18.590.000₫" },
              { label: "WIFI 12GB 256GB", price: "15.490.000₫" },
              { label: "WIFI 8GB 128GB", price: "14.990.000₫" },
            ].map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(opt.label)}
                className={`border rounded p-2 text-center text-xs ${
                  selectedOption === opt.label
                    ? "border-red-500 bg-red-50"
                    : "hover:border-red-400"
                }`}
              >
                <div className="font-medium">{opt.label}</div>
                <div className="text-red-600 font-semibold">{opt.price}</div>
              </button>
            ))}
          </div>

          {/* Color */}
          <div>
            <p className="font-medium mb-1">
              Chọn màu để xem giá và chi nhánh có hàng
            </p>
            <div className="flex gap-2">
              {["Kem", "Xám"].map((color) => {
                const bgColor =
                  color === "Kem" ? "bg-yellow-100" : "bg-gray-500";
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`border rounded flex items-center gap-2 px-3 py-2 text-xs ${
                      selectedColor === color
                        ? "border-red-500 bg-red-50"
                        : "hover:border-red-400"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${bgColor}`}></div>
                    <span>{color}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border rounded p-3 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              <p>
                🔁 <span className="font-semibold">14.990.000₫</span>
              </p>
              <p className="text-xs text-gray-500">Khi thu cũ lên đời</p>
            </div>
            <div className="text-right">
              <p className="text-red-600 font-bold text-lg">15.490.000₫</p>
              <p className="text-xs line-through text-gray-400">21.990.000₫</p>
            </div>
          </div>

          {/* Buy Now */}
          <button className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 text-sm">
            MUA NGAY
          </button>
        </div>
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
        <div className="bg-white p-6 rounded border shadow-sm text-sm !pb-2">
          <h2 className="text-base font-bold mb-4">
            Đánh giá & nhận xét iPhone 16 Pro Max 1TB
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center md:border-r md:pr-6">
              <span className="text-2xl font-bold">4.5/5</span>
              <div className="text-yellow-400 flex text-lg mb-1">
                ★★★★<span className="text-gray-300">☆</span>
              </div>
              <span className="text-blue-600 underline cursor-pointer">
                2 đánh giá
              </span>
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
          <div className="border-t mt-4 pt-4 space-y-2">
            <h3 className="font-semibold">Đánh giá theo trải nghiệm</h3>
            {["Hiệu năng", "Thời lượng pin", "Màn hình"].map((text, i) => (
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
              <span className="px-3 py-1 border rounded-full bg-red-100 text-red-600">
                Tất cả
              </span>
              <span className="px-3 py-1 border rounded-full">Có hình ảnh</span>
              <span className="px-3 py-1 border rounded-full">Đã mua hàng</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <span
                  key={star}
                  className="px-2 py-1 border rounded-full text-sm"
                >
                  {star} ★
                </span>
              ))}
            </div>
          </div>

          {/* Danh sách đánh giá */}
          <div className="mt-6 space-y-4">
            {[
              {
                name: "Thân Quốc Thịnh",
                date: "6/5/2025 13:49",
                rating: 5,
                tags: [
                  "Hiệu năng Mạnh mẽ",
                  "Thời lượng pin Khủng",
                  "Màn hình Rất sắc nét",
                ],
                content: "Sản phẩm rất tốt, mượt",
              },
              {
                name: "Nguyễn Khánh",
                date: "24/4/2025 16:19",
                rating: 4,
                tags: [
                  "Hiệu năng Mạnh mẽ",
                  "Thời lượng pin Khủng",
                  "Màn hình Rất sắc nét",
                ],
                content: "Sản phẩm tốt nhưng chưa tối ưu",
              },
            ].map((review, idx) => (
              <div key={idx} className="border-t pt-4">
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
                    <span
                      key={i}
                      className="bg-gray-100 border px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700">{review.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Thông số kỹ thuật */}
        <div className="bg-white p-4 rounded border shadow-md text-sm md:sticky md:top-4 md:self-start">
          <h2 className="font-semibold text-base mb-3">Thông số kỹ thuật</h2>
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Màn hình", "6.9” Super Retina XDR"],
                ["Camera", "48MP + Tele + Ultra"],
                ["Camera trước", "12MP f/1.9"],
                ["Chipset", "Apple A18 Pro"],
                ["RAM", "12GB"],
                ["Bộ nhớ", "1TB"],
                ["SIM", "nano + eSIM"],
                ["OS", "iOS 18"],
                ["Tính năng", "120Hz, HDR, Dynamic Island"],
              ].map(([label, value], i) => (
                <tr key={i} className="align-top">
                  <td className="py-1 pr-2 text-gray-600 font-medium whitespace-nowrap">
                    {label}:
                  </td>
                  <td className="py-1 text-gray-800">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setShowSpecModal(true)}
            className="w-full mt-4 bg-gray-100 py-2 rounded hover:bg-gray-200 text-center text-sm text-red-600"
          >
            Xem chi tiết cấu hình
          </button>
        </div>
        {showSpecModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white max-w-2xl w-full rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
              {/* Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b sticky top-0 bg-white z-10">
                <h2 className="text-base font-semibold">
                  Thông số kỹ thuật chi tiết
                </h2>
                <button
                  className="text-xl font-bold text-gray-600 hover:text-red-600"
                  onClick={() => setShowSpecModal(false)}
                >
                  ×
                </button>
              </div>

              {/* Nội dung không chia khung, chỉ nền xem kẽ */}
              <div className="text-sm text-gray-800 space-y-6 p-4">
                {[
                  {
                    title: "Màn hình",
                    data: [
                      ["Kích thước màn hình", "6.9 inches"],
                      ["Công nghệ màn hình", "Super Retina XDR OLED"],
                      ["Độ phân giải", "2868 x 1320 pixels"],
                      ["Tần số quét", "120Hz"],
                      [
                        "Tính năng",
                        "Dynamic Island, HDR, True Tone, ProMotion 120Hz",
                      ],
                    ],
                  },
                  {
                    title: "Camera sau",
                    data: [
                      ["Thông số", "48MP + 12MP Tele + 12MP Siêu rộng"],
                      ["Quay video", "4K@24/60fps, 1080p@120fps"],
                      ["Tính năng", "Night mode, Deep Fusion, HDR 5"],
                    ],
                  },
                  {
                    title: "Camera trước",
                    data: [
                      ["Độ phân giải", "12MP, f/1.9"],
                      ["Quay video", "4K@60fps, 1080p@60fps"],
                    ],
                  },
                  {
                    title: "Hiệu năng",
                    data: [
                      ["Chipset", "Apple A18 Pro"],
                      ["GPU", "6 lõi"],
                      ["CPU", "6 lõi (2 hiệu năng + 4 tiết kiệm)"],
                    ],
                  },
                  {
                    title: "Bộ nhớ",
                    data: [
                      ["RAM", "12GB"],
                      ["Bộ nhớ trong", "256GB"],
                    ],
                  },
                  {
                    title: "Kết nối & Giao tiếp",
                    data: [
                      ["SIM", "2 SIM (nano + eSIM)"],
                      ["Wi-Fi", "Wi-Fi 7"],
                      ["Bluetooth", "5.3"],
                      ["GPS", "GPS, GLONASS, Galileo, BeiDou, NavIC"],
                      ["NFC", "Có"],
                    ],
                  },
                  {
                    title: "Pin & Sạc",
                    data: [
                      ["Công nghệ sạc", "MagSafe 25W, Qi2 15W"],
                      ["Cổng sạc", "USB Type-C"],
                    ],
                  },
                  {
                    title: "Thiết kế",
                    data: [
                      ["Chất liệu", "Mặt lưng kính, viền Titanium"],
                      ["Kích thước", "163 x 77.6 x 8.25 mm"],
                      ["Trọng lượng", "227g"],
                      ["Chuẩn kháng nước", "IP68"],
                    ],
                  },
                  {
                    title: "Tính năng khác",
                    data: [
                      ["Bảo mật", "Face ID"],
                      ["Tính năng đặc biệt", "5G, SOS, Apple Pay, AI Phone"],
                      ["Âm thanh", "Dolby Atmos, FLAC, MP3..."],
                    ],
                  },
                  {
                    title: "Thông tin khác",
                    data: [
                      ["Hệ điều hành", "iOS 18"],
                      ["Thời điểm ra mắt", "09/2024"],
                    ],
                  },
                ].map((section, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      {section.title}
                    </h3>
                    <div className="rounded overflow-hidden">
                      {section.data.map(([label, value], i) => (
                        <div
                          key={i}
                          className={`flex justify-between items-start gap-3 px-3 py-2 ${
                            i % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <span className="text-gray-600 w-1/2">{label}</span>
                          <span className="text-right w-1/2">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hỏi và đáp - nằm bên trái, không đụng bên phải */}
        <div className="bg-white p-6 rounded border shadow-sm text-sm col-span-full md:col-span-1">
          <h2 className="text-base font-bold mb-4">Hỏi và đáp</h2>
ddddd
          {/* Câu hỏi nhập */}
          <textarea
            className="w-full border rounded p-2 text-sm mb-2 resize-none"
            rows={3}
            placeholder="Mời bạn nhập câu hỏi..."
          />
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Gửi
          </button>

          {/* Danh sách hỏi đáp */}
          <div className="space-y-4 mt-6">
            {visibleQuestions.map((qna, i) => (
              <div key={i} className="bg-white border rounded p-4 shadow-sm">
                <p className="font-semibold text-gray-800">{qna.user}</p>
                <p className="text-xs text-gray-500 mb-2">{qna.time}</p>
                <p className="mb-2 text-gray-700">{qna.question}</p>

                {qna.adminReply && (
                  <div className="bg-gray-100 border-l-4 border-red-600 shadow-md p-4 rounded-lg text-gray-800 text-sm mt-2">
                    <p className="font-semibold mb-1 text-red-600">
                      Quản Trị Viên trả lời:
                    </p>
                    <p>{qna.adminReply}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Nút Xem thêm / Thu gọn */}
            {questions.length > 2 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center justify-center gap-1 text-xs text-gray-800 bg-white 
             border border-gray-300 rounded-full px-5 py-3 shadow-sm 
             transition-colors duration-200 ease-in-out 
             hover:text-red-600 hover:border-red-300 hover:bg-red-50"
                >
                  <span>
                    {showAll
                      ? "Thu gọn bình luận"
                      : `Xem thêm ${questions.length - 2} bình luận`}
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      showAll ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
