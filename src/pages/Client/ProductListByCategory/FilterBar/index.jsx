import { useState } from 'react';

export default function FilterBar() {
  const brands = ["Apple", "Samsung", "Oppo", "Xiaomi", "Realme"];
  const [selectedBrand, setSelectedBrand] = useState("Apple");

  return (
<div className="bg-white rounded-lg shadow-sm p-4 mb-4">
  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
    <div className="flex gap-2 sm:gap-3 justify-start w-max min-w-full">
      {brands.map((brand, i) => (
        <button
          key={i}
          onClick={() => setSelectedBrand(brand)}
          className={`px-4 py-[6px] text-[13px] font-medium rounded border whitespace-nowrap transition
            ${
              selectedBrand === brand
                ? "bg-yellow-200 border-yellow-400 text-black"
                : "bg-white border-gray-300 hover:bg-yellow-100 hover:border-yellow-400"
            }`}
        >
          {brand.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
</div>

  );
}
