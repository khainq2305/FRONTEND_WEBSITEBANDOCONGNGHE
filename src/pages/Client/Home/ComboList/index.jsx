import { useEffect, useState } from 'react';
import { comboServiceClient } from '../../../../services/client/comboService';
import { LinearProgress } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Link } from 'react-router-dom';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';

dayjs.extend(duration);

const maskPrice = (price) => {
  const str = price.toLocaleString('vi-VN');
  return str.replace(/\d/g, (digit, index) => (index === 1 ? 'x' : digit));
};

const ComboCard = ({ combo }) => {
  const [timeLeft, setTimeLeft] = useState({});

  const now = dayjs();
  const startAt = combo.startAt ? dayjs(combo.startAt) : null;
  const expiredAt = combo.expiredAt ? dayjs(combo.expiredAt) : null;

  const isComingSoon = startAt && startAt.isAfter(now);
  const isExpired = expiredAt && expiredAt.isBefore(now);

  const total = combo.quantity || 0;
  const sold = combo.sold || 0;
  const remaining = total - sold;
  const isOutOfStock = remaining <= 0;

  const percent = total === 0 ? 0 : Math.round((sold / total) * 100);
  const discountPercent = combo.originalPrice > 0 ? Math.round(((combo.originalPrice - combo.price) / combo.originalPrice) * 100) : 0;

  useEffect(() => {
    if (isComingSoon || isExpired) return;

    const interval = setInterval(() => {
      const now = dayjs();
      const end = dayjs(combo.expiredAt);
      const diff = end.diff(now);

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      const dur = dayjs.duration(diff);
      setTimeLeft({
        hours: dur.hours(),
        minutes: dur.minutes(),
        seconds: dur.seconds()
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [combo.expiredAt, isComingSoon, isExpired]);

  if (isExpired) return null;

  return (
    <div
      className="product-card-item w-full h-full flex flex-col bg-white relative transition-all duration-300 ease-in-out group/productCard border border-gray-100 hover:shadow-2xl hover:z-20 rounded-lg overflow-hidden p-1.5 sm:p-2"
      style={{ opacity: isOutOfStock ? 0.6 : 1 }}
    >
      <div className="relative">
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-25">
            -{discountPercent}%
          </div>
        )}

        {isComingSoon && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded z-25">
            Sắp mở bán
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20 rounded-t-lg pointer-events-none">
            <span className="text-rose-600 font-bold text-base border-2 border-rose-500 rounded-lg px-4 py-2 transform -rotate-12 shadow-lg bg-white">
              Hết Hàng
            </span>
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

      <div className="px-1.5 sm:px-2 pt-1 pb-2 sm:pb-2.5 flex flex-col flex-grow overflow-hidden">
        <h3
          className="font-semibold text-xs sm:text-[13px] text-gray-800 leading-tight mb-1 group-hover/productCard:text-blue-600 transition-colors duration-200 line-clamp-2 min-h-[30px]"
          title={combo.name}
        >
          <Link to={`/combo/${combo.slug}`} className="hover:underline">
            {combo.name}
          </Link>
        </h3>

        <div className="mt-auto">
          <div className="text-[13px] sm:text-sm mb-0.5">
            {isComingSoon ? (
              <span className="text-gray-400 font-bold">{maskPrice(combo.price)}</span>
            ) : (
              <>
                <span className="text-red-600 font-bold">{formatCurrencyVND(combo.price)}</span>
                {combo.originalPrice > combo.price && (
                  <span className="text-gray-400 text-[10px] sm:text-[11px] line-through ml-1.5 sm:ml-2">
                    {formatCurrencyVND(combo.originalPrice)}
                  </span>
                )}
              </>
            )}
          </div>

          {!isComingSoon && combo.originalPrice > combo.price && (
            <div className="text-[10px] sm:text-[10.5px] font-medium mb-1 sm:mb-1.5 min-h-[16px]" style={{ color: 'rgb(80, 171, 95)' }}>
              Tiết kiệm {formatCurrencyVND(combo.originalPrice - combo.price)}
            </div>
          )}

          {/* 🔥 PROGRESS BAR INLINE TEXT 🔥 */}
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-1.5 sm:mb-2">
            <div
              className="absolute top-0 left-0 h-full bg-red-500 transition-all duration-300 ease-in-out"
              style={{
                width: `${percent}%`,
                borderRadius: '9999px'
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-white z-10">
              Đã bán {sold}/{total}
            </div>
          </div>
        </div>
      </div>

      {!isComingSoon && !isExpired && (
        <div className="absolute top-2 left-2 bg-rose-600 text-white font-bold rounded-xl px-2 py-0.5 text-[10px] sm:text-xs z-[50] shadow-md">
          Kết thúc sau: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      )}
    </div>
  );
};

const ComboList = () => {
  const [combos, setCombos] = useState([]);

  useEffect(() => {
    comboServiceClient.getAll().then((res) => {
      setCombos(res.data);
    });
  }, []);

  const now = dayjs();
  const filteredCombos = combos.filter((combo) => {
    const expired = combo.expiredAt && dayjs(combo.expiredAt).isBefore(now);
    return !expired;
  });

  return (
    <section className="p-2 rounded-lg shadow-md my-8 bg-white">
      <h2 className="flex items-center text-2xl font-bold mb-4 gap-2 text-gray-800">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 1080 1080" fill="none">
          <path
            d="M515.09 725.824L472.006 824.503C455.444 862.434 402.954 862.434 386.393 824.503L343.308 725.824C304.966 638.006 235.953 568.104 149.868 529.892L31.2779 477.251C-6.42601 460.515 -6.42594 405.665 31.2779 388.929L146.164 337.932C234.463 298.737 304.714 226.244 342.401 135.431L386.044 30.2693C402.239 -8.75637 456.159 -8.75646 472.355 30.2692L515.998 135.432C553.685 226.244 623.935 298.737 712.234 337.932L827.121 388.929C864.825 405.665 864.825 460.515 827.121 477.251L708.53 529.892C622.446 568.104 553.433 638.006 515.09 725.824Z"
            fill="#1BA1E3"
          ></path>
        </svg>
        Ưu đãi Combo
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
