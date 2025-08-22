import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrencyVND } from '@/utils/formatCurrency';
import CountdownTimer from '../../Home/TwoRowMarketSlider/CountdownTimer';
import flashSaleImg from '@/assets/Client/images/flash-sale.png';
import dayjs from 'dayjs';
export default function ComboActionBox({ combo }) {
  const navigate = useNavigate();

  // ====== TÍNH TRẠNG THÁI HÀNG HÓA ======
  const total = Number(combo?.quantity || 0);
  const sold = Number(combo?.sold || 0);
  const marketingRemaining = Math.max(0, total - sold);
// ====== TÍNH TRẠNG THÁI HÀNG HÓA ======
  // Thời gian
  const now = dayjs();
  const startAt = combo?.startAt ? dayjs(combo.startAt) : null;
  const expiredAt = combo?.expiredAt ? dayjs(combo.expiredAt) : null;
  const isComingSoon = !!startAt && startAt.isAfter(now);   // chưa mở bán
  const isExpired    = !!expiredAt && expiredAt.isBefore(now); // đã hết hạn
  const cap = (typeof combo?.capacityByStock === 'number')
    ? Number(combo.capacityByStock)
    : Infinity;

  const availableForSale = (typeof combo?.availableForSale === 'number')
    ? Number(combo.availableForSale)
    : Math.max(0, Math.min(marketingRemaining, cap));

  const isOOSByFlags =
    combo?.isOutOfStock === true ||
    combo?.inStock === false ||
    (typeof combo?.capacityByStock === 'number' && Number(combo.capacityByStock) <= 0);

  // const isOutOfStock = isOOSByFlags || availableForSale === 0;
  const isOutOfStock = isOOSByFlags || availableForSale === 0;
  const notBuyable   = isOutOfStock || isComingSoon || isExpired;
  // ======================================

  // ====== MUA NGAY: giữ flow checkout combo ======
  const handleBuyNow = () => {
     if (notBuyable) return; // chặn an toàn
    const qty = 1;
    const comboSummary = {
      id: combo.id,
      name: combo.name,
      price: Number(combo.price),
      originalPrice: Number(combo.originalPrice || 0),
      thumbnail: combo.thumbnail || combo.image || ''
    };
    // ✅ Combo đi thẳng qua state; dọn cart-items lẻ để không “dính” lần trước
 localStorage.setItem('selectedCartItems', '[]');

    navigate('/checkout', {
      state: {
     buyNow: true,
     mode: 'combo',
     combos: [{
       comboId: combo.id,
       name: combo.name,
       price: Number(combo.price || 0),
       quantity: qty,
       thumbnail: combo.thumbnail || combo.image || '',
       // gửi kèm items để hiển thị/backup payload nếu cần
       items: (combo.comboSkus || []).map(cs => ({
         skuId: cs.skuId, quantity: cs.quantity
       }))
    }]
  }
    });
  };

  // ====== THÊM VÀO GIỎ HÀNG (combo = 1 item duy nhất) ======
  const handleAddToCart = () => {
    if (notBuyable) return; // chặn an toàn
    const LS_KEY = 'comboCartItems:v1';
    const read = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };
    const write = (it) => localStorage.setItem(LS_KEY, JSON.stringify(it));

    const children = (combo?.comboSkus || []).map(cs => ({
      name: cs.productName,
      image: cs.thumbnail,
      quantity: cs.quantity
    }));

    const cur = read();
    const idx = cur.findIndex(x => x.comboId === combo.id);
    if (idx >= 0) cur[idx].quantity += 1;
    else cur.push({
      id: `combo-${combo.id}`,
      comboId: combo.id,
      name: combo.name,
      price: Number(combo.price || 0),
      thumbnail: combo.thumbnail || combo.image || '',
      items: children,
      quantity: 1
    });
    write(cur);

    navigate('/cart'); // dùng ngay trang giỏ hiện có
  };

  // ====== Hiển thị giá/khuyến mãi (giữ UI hiện có) ======
  return (
    <div
      className="p-2 rounded-lg border border-gray-200 shadow-sm space-y-4 text-gray-800 md:sticky md:top-4 h-fit"
      style={{ background: 'linear-gradient(180deg, rgb(255,89,0), rgb(255,226,129), rgb(255,255,255))' }}
    >
      <div className="p-4 rounded-lg border border-gray-200 shadow-sm space-y-4 text-gray-800 md:sticky md:top-4 h-fit bg-white">
        <h1 className="text-2xl font-bold leading-tight">{combo.name}</h1>

        <div className="rounded-md bg-gradient-to-r from-yellow-300 to-yellow-400 p-4 flex justify-between items-center shadow-inner">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-base mb-1 uppercase">
              <img src={flashSaleImg} alt="🔥" className="h-6 w-6" />
              <span className="text-white text-[16px] md:text-[18px]">COMBO SALE</span>
            </div>
            {/* <div className="text-red-700 font-extrabold text-3xl">{formatCurrencyVND(combo.price)}</div>
            {combo.originalPrice > combo.price && ( */}
            {/* Nếu chưa mở bán thì ẩn giá thật cho chắc */}
            <div className="text-red-700 font-extrabold text-3xl">
              {isComingSoon ? 'Liên hệ' : formatCurrencyVND(combo.price)}
            </div>
            {!isComingSoon && combo.originalPrice > combo.price && (
              <div className="text-sm line-through text-white/90">{formatCurrencyVND(combo.originalPrice)}</div>
            )}
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs font-medium text-white">Ưu đãi kết thúc sau</p>
            {/* <CountdownTimer expiryTimestamp={combo.expiredAt} /> */}
            {!isExpired && <CountdownTimer expiryTimestamp={combo.expiredAt} />}
            <p className="text-xs text-white/90">Số lượng có hạn</p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {/* Hết hàng → chỉ 1 nút LIÊN HỆ màu xám */}
           {notBuyable ? (
            <a
              href="tel:19008922"
              className="w-full block text-center bg-gray-400 text-white py-3 rounded-lg font-semibold text-base cursor-pointer"
            >
              {isComingSoon ? 'SẮP BÁN' : 'LIÊN HỆ'}
              <div className="text-xs font-normal mt-0.5 opacity-90">
                {isComingSoon ? 'Đợi mở bán hoặc liên hệ tư vấn'
                               : (isExpired ? 'Đã hết hạn ưu đãi — vui lòng liên hệ'
                                            : 'Để biết thông tin về hàng về')}
              </div>
            </a>
          ) : (
            <>
              <button
                onClick={handleBuyNow}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold text-base transition-all duration-150"
              >
                MUA NGAY
                <div className="text-xs font-normal mt-0.5 opacity-90">Giao hàng tận nơi</div>
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg font-semibold text-base transition-all duration-150"
              >
                Thêm vào giỏ hàng
                <div className="text-xs font-normal mt-0.5 opacity-90">Xem lại và thanh toán sau</div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
