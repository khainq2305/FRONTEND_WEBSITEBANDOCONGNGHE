import React from "react";

export default function ProductOptions({
  productOptionsData = [],    // nhận từ cha, default [] cho chắc
  productColorsData = [],     // nhận từ cha
  selectedOption,
  setSelectedOption,
  selectedColor,
  setSelectedColor,
  onAddToCart,
  stickyTopOffset = "md:top-11",
}) {
  // nếu chưa có data thì show loading
  if (productOptionsData.length === 0) {
    return <div className="text-gray-500 text-sm">Đang tải biến thể sản phẩm…</div>;
  }

  // dùng luôn data từ API
  const options = productOptionsData;
  const current = options.find(o => o.label === selectedOption) || options[0];

  return (
    <div className={`bg-white p-4 rounded border border-gray-200 shadow-sm space-y-4 text-sm text-gray-800 md:sticky ${stickyTopOffset} h-fit`}>
      {/* Option buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map(opt => (
          <button
            key={opt.label}
            onClick={() => setSelectedOption(opt.label)}
            className={`border rounded p-2 text-center text-xs transition-colors duration-150 ${
              selectedOption === opt.label
                ? "bg-blue-50 border-primary ring-1 ring-primary"
                : "border-gray-200 hover:border-primary text-gray-700"
            }`}
          >
            <div className={`font-semibold ${selectedOption === opt.label ? 'text-primary' : 'text-gray-700'}`}>
              {opt.label}
            </div>
            <div className={`font-bold mt-0.5 ${selectedOption === opt.label ? 'text-primary' : 'text-red-600'}`}>
              {opt.price}
            </div>
          </button>
        ))}
      </div>

      {/* Color buttons */}
      <div>
        <p className="font-medium mb-1.5 text-gray-700">
          Chọn màu để xem giá và chi nhánh có hàng
        </p>
        <div className="flex gap-2 flex-wrap">
          {productColorsData.map(color => {
            let bg = "bg-gray-300";
            if (color === "Kem") bg = "bg-yellow-100";
            if (color === "Xám") bg = "bg-gray-500";
            if (color === "Xanh Dương") bg = "bg-primary";
            if (color === "Đen Titan") bg = "bg-gray-800";
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
                <div className={`w-4 h-4 rounded-full border border-gray-400 ${bg}`}></div>
                <span className="font-medium">{color}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price summary */}
      <div className="border border-gray-200 rounded p-3 space-y-1 bg-gray-50">
        <div className="flex justify-between items-baseline">
          <p className="text-primary font-bold text-2xl">{current.price}</p>
          {current.originalPrice && (
            <p className="text-sm line-through text-gray-500">{current.originalPrice}</p>
          )}
        </div>
        {current.tradeInPrice && (
          <div className="text-xs text-gray-600">
            Giá thu cũ lên đời chỉ từ <span className="font-semibold text-green-600">{current.tradeInPrice}</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="space-y-2">
        <button className="w-full bg-primary text-white py-2.5 rounded font-semibold text-sm transition-all duration-150 hover:opacity-80">
          MUA NGAY
        </button>
        <button
          onClick={() => onAddToCart(selectedOption)}
          className="w-full bg-white text-primary border border-primary py-2.5 rounded font-semibold text-sm"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}
