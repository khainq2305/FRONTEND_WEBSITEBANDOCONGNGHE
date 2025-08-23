import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { comboServiceClient } from '../../../../services/client/comboService';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import flashSaleImg from '@/assets/Client/images/flash-sale.png';

dayjs.extend(duration);

// ───────────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────────
const maskPrice = (price) => {
  const str = Number(price || 0).toLocaleString('vi-VN');
  return str.replace(/\d/g, (digit, index) => (index === 1 ? 'x' : digit));
};

// ───────────────────────────────────────────────────────────────────────────────
// Card cho từng combo
// ───────────────────────────────────────────────────────────────────────────────
const ComboCard = ({ combo }) => {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  // Thời gian
  const now = dayjs();
  const startAt = combo.startAt ? dayjs(combo.startAt) : null;
  const expiredAt = combo.expiredAt ? dayjs(combo.expiredAt) : null;
  const isComingSoon = startAt && startAt.isAfter(now);
  const isExpired = expiredAt && expiredAt.isBefore(now);

  // Suất marketing (quantity - sold)
  const total = Number(combo.quantity || 0);
  const sold = Number(combo.sold || 0);
  const marketingRemaining = Math.max(0, total - sold);

  // Sức chứa theo tồn SKU con (server đã trả; nếu không có thì xem như vô hạn)
  const cap = typeof combo.capacityByStock === 'number' ? Number(combo.capacityByStock) : Infinity;

  // availableForSale: còn bán được thực tế
  const availableForSale =
    typeof combo.availableForSale === 'number' ? Number(combo.availableForSale) : Math.max(0, Math.min(marketingRemaining, cap));

  // Cờ hết hàng
  const isOOSByFlags =
    combo?.isOutOfStock === true || combo?.inStock === false || (typeof combo.capacityByStock === 'number' && combo.capacityByStock <= 0);

  const isOutOfStock = isOOSByFlags || availableForSale === 0;

  // % cho progress bar (chỉ hiện khi chưa hết hàng)
  const remainingPercent = total === 0 ? 0 : Math.round((availableForSale / total) * 100);
  const showQuotaBar = total > 0 && !isOutOfStock;

  // % giảm giá
  const discountPercent =
    Number(combo.originalPrice) > 0
      ? Math.round(((Number(combo.originalPrice) - Number(combo.price)) / Number(combo.originalPrice)) * 100)
      : 0;
  useEffect(() => {
    const target = isComingSoon ? startAt : expiredAt;
    if (!target || isExpired) return;
    const tick = () => {
      const diff = target.diff(dayjs());
      if (diff <= 0) return setTimeLeft({ h: 0, m: 0, s: 0 });
      const d = dayjs.duration(diff);
      const totalHours = Math.floor(d.asHours()); // lấy tổng số giờ (bao gồm cả ngày quy ra giờ)
      setTimeLeft({ h: totalHours, m: d.minutes(), s: d.seconds() });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combo.expiredAt]);

  if (isExpired) return null;

  return (
    <div className="product-card-item w-full h-full flex flex-col bg-white relative transition-all duration-300 ease-in-out group/productCard border border-gray-100 hover:shadow-2xl rounded-lg overflow-hidden p-1.5 sm:p-2">
      {/* Header & Ảnh */}
      <div className="relative">
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-10">
            -{discountPercent}%
          </div>
        )}

        {/* Overlay hết hàng */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20 rounded-t-lg pointer-events-none">
            <span className="text-rose-600 font-bold text-base border-2 border-rose-500 rounded-lg px-4 py-2 transform -rotate-12 shadow-lg bg-white">
              Hết Hàng
            </span>
          </div>
        )}

        {/* Đồng hồ đếm ngược */}
        {(startAt || expiredAt) && !isExpired && (
          <div className="absolute top-2 right-2 bg-rose-600 text-white font-bold rounded-xl px-2 py-0.5 text-[10px] sm:text-xs z-10 shadow-md">
            {isComingSoon ? 'Bắt đầu sau:' : 'Kết thúc sau:'}{' '}
            {String(timeLeft.h || 0).padStart(2, '0')}:
            {String(timeLeft.m || 0).padStart(2, '0')}:
            {String(timeLeft.s || 0).padStart(2, '0')}
          </div>
        )}

        <Link
          to={`/combo/${combo.slug}`}
          className="block w-full h-[140px] xs:h-[160px] sm:h-[180px] md:h-[180px] mt-3 mb-1.5 sm:mt-4 sm:mb-2 flex items-center justify-center px-3 relative"
        >
          <img
            src={combo.thumbnail}
            alt={combo.name}
            className="max-h-full max-w-full object-contain group-hover/productCard:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Body */}
      <div className="px-1.5 sm:px-2 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
        <h3
          className="font-semibold text-xs sm:text-[13px] text-gray-800 leading-tight mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200 line-clamp-2 min-h-[30px]"
          title={combo.name}
        >
          <Link to={`/combo/${combo.slug}`} className="hover:underline">
            {combo.name}
          </Link>
        </h3>

        {/* Giá */}
        <div className="mt-auto">
          <div className="text-[13px] sm:text-sm mb-0.5">
            {isComingSoon ? (
              <span className="text-gray-400 font-bold">{maskPrice(combo.price)}</span>
            ) : (
              <>
                <span className="text-red-600 font-bold">{formatCurrencyVND(combo.price)}</span>
                {Number(combo.originalPrice) > Number(combo.price) && (
                  <span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">
                    {formatCurrencyVND(combo.originalPrice)}
                  </span>
                )}
              </>
            )}
          </div>

          {!isComingSoon && Number(combo.originalPrice) > Number(combo.price) && (
            <div className="text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5 min-h-[16px]" style={{ color: 'rgb(80, 171, 95)' }}>
              Tiết kiệm {formatCurrencyVND(Number(combo.originalPrice) - Number(combo.price))}
            </div>
          )}

          {/* 🔥 Thanh hiển thị suất (ẩn khi hết hàng) */}
          {showQuotaBar && (
            <div className="relative h-[28px] rounded-full overflow-hidden mb-1.5 sm:mb-2">
              <div className="absolute inset-0 bg-gray-200 rounded-full" />
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full z-10"
                style={{ width: `${Math.min(100, remainingPercent)}%` }}
              />
              <img
                src={flashSaleImg}
                alt="🔥"
                className="absolute -top-[2px] -left-[2px] h-[29px] w-[24px] select-none pointer-events-none z-20"
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-full border border-gray-300/60 pointer-events-none" />
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-orange-800 z-20">
                Còn {availableForSale}/{total} suất
              </span>
            </div>
          )}

          {/* Gợi ý nhỏ khi hết hàng nhưng combo vẫn còn thời hạn */}
          {isOutOfStock && expiredAt && !isExpired && (
            <div className="text-[10px] text-gray-500 italic">Combo có thể có hàng trở lại trước khi hết hạn</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────────────────
// Section danh sách combo
// ───────────────────────────────────────────────────────────────────────────────
const ComboList = () => {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    comboServiceClient.getAvailable().then((res) => {
    const arr = Array.isArray(res?.data) ? res.data : res?.data?.data || [];
    setCombos(arr);
  });
  }, []);

  // Ẩn combo đã hết hạn và combo đã bán hết "suất marketing"
  const now = dayjs();
  const filteredCombos = combos.filter((combo) => {
    const total = Number(combo.quantity || 0);
    const sold = Number(combo.sold || 0);
    const remainingSlots = total - sold;
    const isExpired = combo.expiredAt && dayjs(combo.expiredAt).isBefore(now);
    if (isExpired) return false;
    if (total > 0 && remainingSlots <= 0) return false; // bán hết suất → ẩn card
    return true;
  });

  return (
    <section className="p-2 rounded-lg shadow-md my-8 bg-white">
      <h2 className="flex items-center ml-2 text-2xl font-bold mt-2 mb-6 gap-2 text-gray-800 uppercase tracking-wide">
        ƯU ĐÃI COMBO
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {filteredCombos.map((combo) => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </div>
    </section>
  );
};

export default ComboList;
