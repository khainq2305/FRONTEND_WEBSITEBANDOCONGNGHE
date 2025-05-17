import React from "react";

export default function ProductOptions({
  selectedOption,
  setSelectedOption,
  selectedColor,
  setSelectedColor,
  productOptionsData = [ 
    { label: "5G 12GB 256GB", price: "19.990.000₫", originalPrice: "21.990.000₫", tradeInPrice: "17.990.000₫" },
    { label: "5G 8GB 128GB", price: "18.590.000₫", originalPrice: "20.990.000₫", tradeInPrice: "16.590.000₫" },
    { label: "WIFI 12GB 256GB", price: "15.490.000₫", originalPrice: "17.990.000₫", tradeInPrice: "13.490.000₫" },
    { label: "WIFI 8GB 128GB", price: "14.990.000₫", originalPrice: "16.990.000₫", tradeInPrice: "12.990.000₫" },
  ],
  productColorsData = ["Kem", "Xám", "Xanh Dương", "Đen Titan"],
  // stickyTopOffset = "md:top-11", // Đảm bảo prop này được truyền từ ProductDetail
}) {

  const currentSelectedOptionData = productOptionsData.find(opt => opt.label === selectedOption) || productOptionsData[0];

  return (
    <div className={`bg-white p-4 rounded border border-gray-200 shadow-sm space-y-4 text-sm text-gray-800 md:sticky md:top-11 h-fit`}> {/* Cập nhật stickyTopOffset ở đây hoặc truyền qua props */}
      {/* Option */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {productOptionsData.map((opt) => (
          <button
            key={opt.label}
            onClick={() => setSelectedOption(opt.label)}
            className={`border rounded p-2 text-center text-xs transition-colors duration-150 group ${
              selectedOption === opt.label
                ? "bg-blue-50 border-primary ring-1 ring-primary" 
                : "border-gray-200 hover:border-primary text-gray-700"
            }`}
          >
            <div className={`font-semibold ${selectedOption === opt.label ? 'text-primary' : 'text-gray-700'}`}>{opt.label}</div>
            <div className={`font-bold mt-0.5 ${selectedOption === opt.label ? 'text-primary' : 'text-red-600'}`}>{opt.price}</div>
          </button>
        ))}
      </div>

      {/* Color */}
      <div>
        <p className="font-medium mb-1.5 text-gray-700">
          Chọn màu để xem giá và chi nhánh có hàng
        </p>
        <div className="flex gap-2 flex-wrap">
          {productColorsData.map((color) => {
            let bgColorClass = "bg-gray-300";
            if (color === "Kem") bgColorClass = "bg-yellow-100";
            if (color === "Xám") bgColorClass = "bg-gray-500";
            if (color === "Xanh Dương") bgColorClass = "bg-primary"; // Sử dụng màu primary nếu "Xanh Dương" là màu chủ đạo
            if (color === "Đen Titan") bgColorClass = "bg-gray-800";
            
            return (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`border rounded flex items-center gap-2 px-3 py-1.5 text-xs transition-colors duration-150 ${
                  selectedColor === color
                    ? "bg-blue-50 border-primary ring-1 ring-primary text-primary"
                    : "border-gray-200 hover:border-primary text-gray-700"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border border-gray-400 ${bgColorClass}`}></div>
                <span className="font-medium">{color}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Summary */}
      <div className="border border-gray-200 rounded p-3 space-y-1 bg-gray-50">
        <div className="flex justify-between items-baseline">
            <p className="text-primary font-bold text-2xl">{currentSelectedOptionData.price}</p>
            {currentSelectedOptionData.originalPrice && (
              <p className="text-sm line-through text-gray-500">{currentSelectedOptionData.originalPrice}</p>
            )}
        </div>
        {currentSelectedOptionData.tradeInPrice && (
          <div className="text-xs text-gray-600">
              Giá thu cũ lên đời chỉ từ <span className="font-semibold text-green-600">{currentSelectedOptionData.tradeInPrice}</span>
          </div>
        )}
      </div>

      {/* Buy Now & Add to cart buttons */}
      <div className="space-y-2">
        <button 
          className="w-full bg-primary text-white py-2.5 rounded font-semibold text-sm transition-all duration-150 opacity-100 hover:opacity-80 focus:opacity-100" // THAY ĐỔI Ở ĐÂY
          // Nếu class hover-primary của bạn chỉ đổi màu nền và không ảnh hưởng opacity:
          // className="w-full bg-primary text-white py-2.5 rounded font-semibold hover-primary text-sm transition-all duration-150 opacity-90 hover:opacity-100"
        >
          MUA NGAY
        </button>
        <button 
          className="w-full bg-white text-primary border border-primary py-2.5 rounded font-semibold text-sm transition-colors duration-150 hover-primary hover:text-white focus:bg-primary focus:text-white" // THAY ĐỔI Ở ĐÂY
          // Hoặc nếu bạn muốn nền nhạt hơn khi hover:
          // className="w-full bg-white text-primary border border-primary py-2.5 rounded font-semibold text-sm transition-colors duration-150 hover:bg-blue-50 hover:text-primary focus:bg-blue-50 focus:text-primary"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}