import { useEffect, useState } from 'react';
import { brandService } from '../../../../services/client/brandService';

export default function FilterBar({ categorySlug, filters, setFilters }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandService.getAll();
        setBrands(res.data || []);
      } catch (err) {
        console.error('❌ Lỗi khi load brand:', err);
      }
    };
    fetchBrands();
  }, [categorySlug]);

  const handleClick = (brandName) => {
    const updated = brandName ? [brandName] : [];
    setFilters((prev) => ({ ...prev, brand: updated }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4">
      <div className="overflow-x-auto scrollbar-thin">
        <div className="flex gap-2 sm:gap-3 justify-start w-max min-w-full py-1">
          <button
            onClick={() => handleClick(null)}
            className={`px-4 py-[6px] text-[13px] font-medium rounded-md border whitespace-nowrap transition-all
              ${filters.brand.length === 0
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
          >
            TẤT CẢ
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleClick(brand.name)}
              className={`px-4 py-[6px] text-[13px] font-medium rounded-md border whitespace-nowrap transition-all
                ${filters.brand.includes(brand.name)
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              {brand.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
