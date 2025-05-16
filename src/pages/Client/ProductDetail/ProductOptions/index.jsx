import React from "react";

export default function ProductOptions({
  selectedOption,
  setSelectedOption,
  selectedColor,
  setSelectedColor,
}) {
  return (
    <div className="bg-white p-4 rounded border border-gray-200 shadow-sm space-y-4 text-sm text-gray-800 sticky top-4 h-fit">
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
            className={`border border-gray-200 rounded p-2 text-center text-xs ${
              selectedOption === opt.label
                ? "bg-red-50"
                : "hover:border-gray-300"
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
            const bgColor = color === "Kem" ? "bg-yellow-100" : "bg-gray-500";
            return (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`border border-gray-200 rounded flex items-center gap-2 px-3 py-2 text-xs ${
                  selectedColor === color
                    ? "bg-red-50"
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
      <div className="border border-gray-200 rounded p-3 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          <p>
            <span className="font-semibold">14.990.000₫</span>
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
  );
}
