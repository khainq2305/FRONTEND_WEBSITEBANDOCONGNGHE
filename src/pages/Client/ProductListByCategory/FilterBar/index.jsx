import { useRef, useState } from "react";

export default function FilterBar({ categorySlug, filters, setFilters, brands = [] }) {
  const scrollRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // tốc độ kéo
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleClick = (brandName) => {
    const updated = brandName ? [brandName] : [];
    setFilters((prev) => ({ ...prev, brand: updated }));
  };

  return (
    <div className="bg-white mt-2 rounded-lg shadow-sm p-3 sm:p-4 mb-2">
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-hide cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex gap-2 sm:gap-3 justify-start w-max min-w-full py-1">
          <button
            onClick={() => handleClick(null)}
            className={`px-4 py-[4px] text-[13px] font-medium rounded-md border whitespace-nowrap transition-all
              ${filters.brand.length === 0
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}`}
          >
            TẤT CẢ
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleClick(brand.name)}
              className={`px-4 py-[6px] text-[13px] font-medium rounded-md border whitespace-nowrap transition-all
                ${filters.brand.includes(brand.name)
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              {brand.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
