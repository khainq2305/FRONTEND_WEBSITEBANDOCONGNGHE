import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function ProductCard({
  name,
  price,
  oldPrice,
  discount,
  image,
  rating,
  status,
  badge,
  couponBanner,
}) {
  const renderStars = (rate) => {
    const stars = [];
    const numRating = parseFloat(rate);
    for (let i = 1; i <= 5; i++) {
      if (numRating >= i)
        stars.push(
          <FaStar key={`star-${i}`} className="text-yellow-400 text-xs" />
        );
      else if (numRating >= i - 0.5)
        stars.push(
          <FaStarHalfAlt
            key={`half-${i}`}
            className="text-yellow-400 text-xs"
          />
        );
      else
        stars.push(
          <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-xs" />
        );
    }
    return stars;
  };

  let badgeClasses = "text-white bg-gray-500";
  let badgeIcon = "🏷️";
  if (badge) {
    const lower = badge.toLowerCase().trim();
    if (lower.includes("giao nhanh")) {
      badgeClasses = "text-white bg-[#00A651]";
      badgeIcon = "🚀";
    } else if (lower.includes("đặt trước")) {
      badgeClasses = "text-white bg-[#D70018]";
      badgeIcon = "⏳";
    } else if (lower.includes("best price")) {
      badgeClasses = "text-black bg-[#FFEB00]";
      badgeIcon = "🔥";
    }
  }

  return (
  <div className="w-full h-full flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white p-2.5 sm:p-3 relative transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1.5 group">
      {discount && (
        <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-md z-20">
          -{discount}%
        </div>
      )}

<div className="relative w-full h-[160px] sm:h-[200px] mb-2 flex items-center justify-center">
  <img
    src={image}
    alt={name}
    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 z-0"
  />
</div>


      {badge && (
        <div
          className={`text-[10px] sm:text-[11px] font-bold inline-flex items-center gap-1 px-2 py-1 rounded-full mb-2 w-fit ${badgeClasses}`}
        >
          <span className="text-xs sm:text-sm">{badgeIcon}</span>
          <span className="whitespace-nowrap">
            {badge.trim().toUpperCase()}
          </span>
        </div>
      )}

      <h3 className="font-medium text-xs sm:text-[13px] line-clamp-2 min-h-[32px] sm:min-h-[40px] leading-snug sm:leading-5 mb-1 group-hover:text-yellow-600 transition-colors duration-200">
        {name}
      </h3>

      <div className="text-sm sm:text-[15px] mb-1">
        <span className="text-red-600 font-bold">{price}₫</span>
        {oldPrice && (
          <span className="text-gray-400 text-[10px] sm:text-xs line-through ml-1.5 sm:ml-2">
            {oldPrice}₫
          </span>
        )}
      </div>

      {oldPrice &&
        parseFloat(oldPrice.replaceAll(".", "")) >
          parseFloat(price.replaceAll(".", "")) && (
          <div className="text-green-600 text-[10px] sm:text-xs font-medium mb-1 sm:mb-2">
            Tiết kiệm{" "}
            {(
              parseFloat(oldPrice.replaceAll(".", "")) -
              parseFloat(price.replaceAll(".", ""))
            ).toLocaleString("vi-VN")}
            ₫
          </div>
        )}
<div className="flex justify-between items-center mt-0 text-[10px] sm:text-xs">
        {rating && (
          <div className="flex items-center gap-px sm:gap-[2px] text-yellow-400">
            {renderStars(rating)}
          </div>
        )}
        {status && (
          <div className="text-green-700 font-medium flex items-center gap-0.5 sm:gap-1 whitespace-nowrap">
            {status}
            <img
              src="https://dienthoaigiakho.vn/_next/image?url=%2Ficons%2Fcommon%2Ficon-deli.png&w=48&q=75"
              alt="check"
              className="w-3 h-3 sm:w-4 sm:h-4"
            />
          </div>
        )}
      </div>
    </div>
  );
}
