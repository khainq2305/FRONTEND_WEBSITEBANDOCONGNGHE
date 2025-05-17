// FilterBar.js
import React, { useState } from 'react';
// Ensure your CSS is imported if it's specific to this component and not global
// import './FilterBar.css'; 

export default function FilterBar() {
  const brands = ["Apple", "Samsung", "Oppo", "Xiaomi", "Realme", "Vivo", "Google", "Nothing", "OnePlus", "Asus"]; 
  const [selectedBrand, setSelectedBrand] = useState("Apple");

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4"> 
     
      <div className="overflow-x-auto scrollbar-thin"> 
        <div className="flex gap-2 sm:gap-3 justify-start w-max min-w-full py-1"> 
          {brands.map((brand, i) => (
            <button
              key={i}
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-[6px] text-[13px] font-medium rounded-md border whitespace-nowrap transition-all duration-200 ease-in-out
                ${
                  selectedBrand === brand
                    ? "bg-primary border-primary text-text-primary shadow-md"
                    : "bg-white border-gray-300 text-gray-700 hover-primary" 
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
