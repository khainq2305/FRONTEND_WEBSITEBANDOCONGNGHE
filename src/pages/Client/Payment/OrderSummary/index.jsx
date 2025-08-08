import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../../../services/client/orderService';
import { paymentService } from '../../../../services/client/paymentService';
import { toast } from 'react-toastify';
import { FiInfo, FiChevronRight, FiChevronUp } from 'react-icons/fi';
import PinModal from '../PinModal';
import { walletService } from '../../../../services/client/walletService'; // đã có

import { useCartStore } from '@/stores/useCartStore';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { FaPercentage, FaQuestionCircle } from 'react-icons/fa';


import PromoModal, { CouponCard } from '../../Cart/PromoModal';
import { couponService } from '../../../../services/client/couponService';
import { Coins } from 'lucide-react';

const OrderSummary = ({
  totalAmount,
  discount,
  shippingFee,
   pointInfo, // ✅ TRUYỀN VÀO
  selectedShipMethod,
  selectedPaymentMethod,
  selectedCoupon: propCoupon,
  selectedAddress,
  selectedItems = [],
  usePoints,
  setUsePoints,
  onPlaceOrder
}) => {

  const navigate = useNavigate();
const [isPinModalOpen, setIsPinModalOpen] = useState(false);
const [pendingPin, setPendingPin] = useState(null); // để lưu pin đã nhập

  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isPlacing, setIsPlacing] = useState(false);
const [showDiscountDetails, setShowDiscountDetails] = useState(false);


const pointDiscountAmount = usePoints ? pointInfo.maxUsablePoints * 10 : 0;

  useEffect(() => {
    if (propCoupon) {
      setSelectedCoupon(propCoupon);
      return;
    }

    const stored =
      localStorage.getItem('selectedCoupon') || localStorage.getItem('appliedCoupon');
    if (stored) {
      try {
        setSelectedCoupon(JSON.parse(stored));
      } catch (e) {
        console.error('[OrderSummary] parse coupon error:', e);
      }
    }
  }, [propCoupon]);

  const handleApplyPromo = async (coupon) => {
    if (!coupon) {
      setSelectedCoupon(null);
      localStorage.removeItem('selectedCoupon');
      localStorage.removeItem('appliedCoupon');
      toast.success('Đã bỏ mã giảm giá.');
      setIsPromoModalOpen(false);
      return;
    }

    const code = typeof coupon === 'string' ? coupon : coupon.code;
    if (!code) return toast.error('Mã giảm giá không hợp lệ!');

    const currentSkuIds = selectedItems.map(item => item.skuId);
    if (currentSkuIds.length === 0) {
        toast.error('Vui lòng chọn sản phẩm để áp dụng mã giảm giá.');
        return;
    }

    try {
      const res = await couponService.applyCoupon({
        code: code.trim(),
        skuIds: currentSkuIds,
        orderTotal: Number(totalAmount),
      });
      const applied = res.data?.coupon;

      if (applied && res.data?.isValid) {
        setSelectedCoupon(applied);
        localStorage.setItem('selectedCoupon', JSON.stringify(applied));
        localStorage.setItem('appliedCoupon', JSON.stringify(applied));
        toast.success(`Áp dụng mã ${code} thành công!`);
      } else {
        if (res.data?.isOutOfUsage) {
          toast.warn(res.data.message || 'Mã giảm giá đã hết lượt sử dụng');
          return;
        }
        throw new Error(res.data?.message || 'Không thể áp dụng mã');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Lỗi khi áp mã giảm giá!');
      setSelectedCoupon(null);
      localStorage.removeItem('selectedCoupon');
      localStorage.removeItem('appliedCoupon');
    } finally {
      setIsPromoModalOpen(false);
    }
  };

  const prevRef = useRef({ skuIds: [], orderTotal: null });

  useEffect(() => {
    if (!selectedCoupon || selectedItems.length === 0) return;

    const currentSkuIds = selectedItems.map((i) => i.skuId).sort();
    const currentOrderTotal = Number(totalAmount || 0);

    const prev = prevRef.current;
    const skuChanged = JSON.stringify(prev.skuIds) !== JSON.stringify(currentSkuIds);
    const totalChanged = prev.orderTotal !== currentOrderTotal;

    if (!skuChanged && !totalChanged) return;

    const refreshCoupon = async () => {
      try {
        const res = await couponService.applyCoupon({
          code: selectedCoupon.code,
          orderTotal: currentOrderTotal,
          skuIds: currentSkuIds,
        });

        if (!res.data?.isValid) {
          const msg = res.data.message?.toLowerCase() || '';

          if (msg.includes('hết lượt') || msg.includes('hết hạn')) {
            toast.warn(res.data.message || 'Mã giảm giá không còn hiệu lực');
            return;
          }

          toast.warn(res.data.message || 'Mã giảm giá không còn hiệu lực');
          setSelectedCoupon(null);
          localStorage.removeItem('selectedCoupon');
          localStorage.removeItem('appliedCoupon');
          return;
        }

        if (!res.data?.coupon) {
          toast.warn('Mã giảm giá không hợp lệ hoặc không tồn tại');
          setSelectedCoupon(null);
          localStorage.removeItem('selectedCoupon');
          localStorage.removeItem('appliedCoupon');
          return;
        }

        const updatedCoupon = res.data.coupon;
        setSelectedCoupon(updatedCoupon);
        localStorage.setItem('selectedCoupon', JSON.stringify(updatedCoupon));
        localStorage.setItem('appliedCoupon', JSON.stringify(updatedCoupon));
      } catch (err) {
        console.error('Lỗi validate lại coupon:', err);
        setSelectedCoupon(null);
        localStorage.removeItem('selectedCoupon');
        localStorage.removeItem('appliedCoupon');
        toast.warn(err?.response?.data?.message || err.message || 'Không thể áp dụng mã giảm giá');
      }
    };

    refreshCoupon();
    prevRef.current = { skuIds: currentSkuIds, orderTotal: currentOrderTotal };
  }, [selectedItems, totalAmount, selectedCoupon]);

  const couponDiscount =
    selectedCoupon?.discountType !== 'shipping'
      ? Number(selectedCoupon?.discountAmount || 0)
      : 0;

  const shippingDiscount =
    selectedCoupon?.discountType === 'shipping'
      ? Math.min(shippingFee, selectedCoupon.discountValue || 0)
      : 0;

  const totalDiscountDisplay = discount + couponDiscount + shippingDiscount;

const finalAmount =
  totalAmount - discount - couponDiscount + shippingFee - shippingDiscount - pointDiscountAmount;

const handleSubmitPin = async (pin) => {
  try {
    // 🔒 Gọi API xác minh PIN
    const res = await walletService.verifyPin(pin);

    if (res.data?.success) {
      setIsPinModalOpen(false);
      handlePlaceOrder(pin); // Nếu đúng thì tiếp tục tạo đơn hàng
    } else {
      toast.error('Mã PIN không đúng!');
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Xác minh PIN thất bại!');
  }
};

 const handlePlaceOrder = async (pin = null) => {
    if (!selectedAddress || !selectedAddress.id) {
      toast.error('Vui lòng nhập địa chỉ giao hàng!');
      return;
    }
  if (!selectedPaymentMethod) {
    toast.error('Vui lòng chọn phương thức thanh toán!');
    return;
  }
  if (!selectedShipMethod || !selectedShipMethod.providerId) {
  toast.error('Vui lòng chọn phương thức vận chuyển trước khi đặt hàng!');
  return;
}

    const itemsToCheckout = JSON.parse(localStorage.getItem('selectedCartItems') || '[]');
    if (itemsToCheckout.length === 0) {
      toast.error('Không có sản phẩm được chọn!');
      return;
    }

    if (isPlacing) return;
    setIsPlacing(true);

    try {
      if (selectedCoupon) {
        const res = await couponService.applyCoupon({
          code: selectedCoupon.code,
          orderTotal: Number(totalAmount),
          skuIds: itemsToCheckout.map((i) => i.skuId),
        });

        if (!res.data?.isValid || !res.data?.coupon) {
          const msg = (res.data?.message || '').toLowerCase();

          if (msg.includes('hết lượt') || msg.includes('hết hạn')) {
            toast.error(res.data.message || 'Mã giảm giá không còn hiệu lực');
            return;
          }

          setSelectedCoupon(null);
          localStorage.removeItem('selectedCoupon');
          localStorage.removeItem('appliedCoupon');
          throw new Error(res.data?.message || 'Mã không còn hiệu lực');
        }

        const updatedCoupon = res.data?.coupon;
        if (!updatedCoupon) throw new Error('Mã giảm giá không còn hiệu lực.');

        setSelectedCoupon(updatedCoupon);
        localStorage.setItem('selectedCoupon', JSON.stringify(updatedCoupon));
        localStorage.setItem('appliedCoupon', JSON.stringify(updatedCoupon));
      }

      const payload = {
        addressId: selectedAddress.id,
        
        paymentMethodId: selectedPaymentMethod,
        usePoints: usePoints,
        pin: pin, // ✅ thêm dòng này để backend xử lý
  pointsToSpend: usePoints ? pointInfo.maxUsablePoints : 0, // ✅
        couponCode: selectedCoupon?.code || null,
        note: '',
        items: itemsToCheckout.map((i) => ({
          skuId: i.skuId,
          quantity: i.quantity,
          price: i.finalPrice,
          flashSaleId: i.flashSaleId || null,
        })),
        cartItemIds: itemsToCheckout.map((i) => i.id),

        shippingProviderId: selectedShipMethod?.providerId || null,
        shippingService: selectedShipMethod?.serviceId || selectedShipMethod?.serviceCode,
        shippingFee: selectedShipMethod?.fee || 0,
        shippingLeadTime: selectedShipMethod?.leadtime || null,
      };

      console.log('[PAYLOAD gửi createOrder]', payload);

      const res = await orderService.createOrder(payload);

      const orderId = res.data?.orderId || res.data?.data?.orderId;
      const orderCode = res.data?.orderCode || res.data?.data?.orderCode;
      if (!orderId || !orderCode) throw new Error('Không lấy được mã đơn hàng!');

      const isQR = selectedPaymentMethod === 2;
      const isVNPay = selectedPaymentMethod === 3;
      const isMoMo = selectedPaymentMethod === 4;
      const isZalo = selectedPaymentMethod === 5;
      const isViettel = selectedPaymentMethod === 6;
      const isStripe = selectedPaymentMethod === 7;
const isWallet = selectedPaymentMethod === 8; // hoặc kiểm tra theo code nếu cần
const isPayOS = selectedPaymentMethod === 9; // hoặc kiểm tra theo

      const fullCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const updatedCart = fullCart.filter(
        (c) => !itemsToCheckout.some((sel) => sel.skuId === c.skuId),
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      localStorage.removeItem('selectedCartItems');
      localStorage.removeItem('selectedCoupon');
      localStorage.removeItem('appliedCoupon');
      useCartStore.getState().clearCart();
      window.dispatchEvent(new Event('cartUpdated'));

      if (isQR) {
        const payableNow = finalAmount;

        const qrRes = await paymentService.vietqrPay({ // Use paymentService
          accountNumber: '2222555552005',
          accountName: 'NGUYEN QUOC KHAI',
          bankCode: 'MB',
          amount: payableNow,
          message: orderCode,
        });
        const qrImg = qrRes.data?.qrImage;
        navigate(
          `/vietqr-confirmation/${orderCode}?qr=${encodeURIComponent(qrImg||'')}`
        );
        return;
      }
      if (isStripe) {
        const stripeRes = await paymentService.stripePay({ orderId }); // Use paymentService

        const redirectUrl = stripeRes?.data?.url;
        if (!redirectUrl) throw new Error('Không nhận được URL thanh toán từ Stripe');

        window.location.href = redirectUrl;
        return;
      }

      if (isVNPay) {
        const url = (await paymentService.vnpay({ // Use paymentService
          orderId,
          bankCode: 'NCB',
        })).data?.payUrl;
        if (!url) throw new Error('Không nhận được link VNPay');
        window.location.href = url;
        return;
      }

      if (isMoMo) {
        const url = (await paymentService.momoPay({ orderId })).data?.payUrl; // Use paymentService
        if (!url) throw new Error('Không nhận được link MoMo');
        window.location.href = url;
        return;
      }

      if (isZalo) {
        const url = (await paymentService.zaloPay({ orderId })).data?.payUrl; // Use paymentService
        if (!url) throw new Error('Không nhận được link ZaloPay');
        window.location.href = url;
        return;
      }
      if (isViettel) {
        const url = (await paymentService.viettelMoney({ orderId })).data?.payUrl; // Use paymentService
        if (!url) throw new Error('Không nhận được link Viettel Money');
        window.location.href = url;
        return;
      }
if (isPayOS) {
 const url = (await paymentService.payosPay({ orderId })).data?.payUrl;

  if (!url) throw new Error('Không nhận được link PayOS');
  window.location.href = url;
  return;
}

      toast.success('Đặt hàng thành công!');
      navigate(`/order-confirmation?orderCode=${orderCode}`);
    } catch (err) {
      console.error('[Create Order]', err);
      toast.error(err?.response?.data?.message || 'Lỗi đặt hàng!');
    } finally {
      setIsPlacing(false);
    }
  };
const onClickPlaceOrder = () => {
  if (selectedPaymentMethod === 8) {
    setIsPinModalOpen(true); // 👉 mở modal nhập mã PIN
  } else {
    handlePlaceOrder(); // 👉 gọi luôn nếu không phải ví nội bộ
  }
};

return (
  <div className="relative">
    <aside className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm sticky top-6 h-fit">
      {/* Promotion section */}
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm text-gray-800">CYBERZONE khuyến mãi</h4>
        <div className="flex items-center text-xs text-gray-500">
          Có thể chọn&nbsp;1
          <FiInfo className="ml-1 text-gray-400" size={14} />
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {/* Coupon section */}
        <div className="border border-gray-200 rounded-md p-3">
          {selectedCoupon ? (
            <div className="flex flex-col gap-2">
              <CouponCard
                compact
                logoW={70}
                titleClassName="text-left ml-5"
                compactHeight={76}
                containerBg="white"
                promo={{
                  id: selectedCoupon.code,
                  code: selectedCoupon.code,
                  type: selectedCoupon.discountType === 'shipping' ? 'shipping' : 'discount',
                  title: selectedCoupon.title || selectedCoupon.code,
                  isApplicable: true,
                }}
                isSelected
                onSelect={() => handleApplyPromo(null)}
              />
              <button
                onClick={() => setIsPromoModalOpen(true)}
                className="text-primary text-sm font-medium inline-flex items-center self-start"
              >
                <FaPercentage className="mr-1.5" />
                Chọn hoặc nhập mã khác
                <FiChevronRight className="ml-0.5" />
              </button>
            </div>
          ) : (
            <div className="relative group">
              <div className="flex justify-between items-center w-full text-sm text-gray-800">
                <button
                  onClick={() => setIsPromoModalOpen(true)}
                  className="flex items-center font-medium flex-1 text-left"
                >
                  <FaPercentage className="mr-2 text-lg text-red-500" />
                  Chọn hoặc nhập ưu đãi
                </button>
                <FiChevronRight className="text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Point section */}
        <div className="flex items-center justify-between h-11 px-3 border border-gray-200 rounded-md">
<div className="flex items-center gap-2 text-sm text-gray-700">
  <img
    src="src/assets/Client/images/xudiem.png"
    alt="coin"
    className="w-6 h-6 object-contain"
  />
  <div className="flex items-baseline gap-1">
    <span>Đổi {pointInfo.maxUsablePoints.toLocaleString('vi-VN')} điểm</span>
    <span className="text-gray-400 text-xs">
      (~{formatCurrencyVND(pointInfo.maxUsablePoints * 10)})
    </span>
  </div>
</div>


          <div className="flex items-center gap-1 relative group ml-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={usePoints}
                onChange={() => setUsePoints((prev) => !prev)}
                className="sr-only peer"
                disabled={!pointInfo.canUsePoints}
              />
              <div className="w-9 h-5 rounded-full relative transition-colors bg-gray-200 peer-checked:bg-[var(--primary-color)]">
                <div
                  className="absolute top-[2px] w-4 h-4 bg-white rounded-full transition-transform duration-200"
                  style={{
                    left: usePoints ? 'calc(100% - 18px)' : '2px',
                  }}
                ></div>
              </div>
            </label>

            {!pointInfo.canUsePoints && (
              <>
                <FaQuestionCircle className="text-gray-400 text-sm cursor-pointer" />
                <div className="absolute z-10 top-full right-0 mt-1 w-max max-w-[220px] bg-black text-white border border-gray-700 shadow-md rounded-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-[12px]">
                  Không đủ điều kiện để sử dụng điểm
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Order summary */}
      <div className="text-sm text-gray-700 space-y-2 mt-4">
        <h3 className="font-semibold text-base text-gray-800">Thông tin đơn hàng</h3>
        <div className="flex justify-between">
          <span>Tổng tiền hàng</span>
          <span className="font-medium text-gray-800">{formatCurrencyVND(totalAmount)}</span>
        </div>

       {showDiscountDetails && (
  <>
    {discount > 0 && (
      <div className="flex justify-between text-xs text-gray-600 ml-2 relative">
        <span className="before:content-['•'] before:mr-1 before:text-gray-500">
          Giảm giá từ sản phẩm
        </span>
        <span>{formatCurrencyVND(discount)}</span>
      </div>
    )}

    {couponDiscount > 0 && (
      <div className="flex justify-between text-xs text-green-600 ml-2 relative">
        <span className="before:content-['•'] before:mr-1 before:text-green-600">
          Giảm giá từ coupon
        </span>
        <span>- {formatCurrencyVND(couponDiscount)}</span>
      </div>
    )}

    <div className="flex justify-between items-center">
      <span>Phí vận chuyển</span>
      <span className="flex flex-col items-end">
        {shippingDiscount > 0 ? (
          <>
            <span className="text-xs text-gray-400 line-through leading-none">
              {formatCurrencyVND(shippingFee)}
            </span>
            <span className="text-sm font-medium text-gray-800 leading-none">
              {formatCurrencyVND(shippingFee - shippingDiscount)}
            </span>
          </>
        ) : (
          <span className="font-medium text-gray-800">
            {shippingFee === 0 ? 'Miễn phí' : formatCurrencyVND(shippingFee)}
          </span>
        )}
      </span>
    </div>
  </>
)}

{!showDiscountDetails && (
  <div className="flex justify-between items-center">
    <span>Phí vận chuyển</span>
    <span className="flex flex-col items-end">
      {shippingDiscount > 0 ? (
        <>
          <span className="text-xs text-gray-400 line-through leading-none">
            {formatCurrencyVND(shippingFee)}
          </span>
          <span className="text-sm font-medium text-gray-800 leading-none">
            {formatCurrencyVND(shippingFee - shippingDiscount)}
          </span>
        </>
      ) : (
        <span className="font-medium text-gray-800">
          {shippingFee === 0 ? 'Miễn phí' : formatCurrencyVND(shippingFee)}
        </span>
      )}
    </span>
  </div>
)}



        <div className="flex justify-between">
          <span>Tổng khuyến mãi</span>
          <span className="font-medium text-gray-800">{formatCurrencyVND(totalDiscountDisplay)}</span>
        </div>

        <hr className="border-dashed" />

        <div className="flex justify-between text-gray-800 font-semibold">
          <span>Cần thanh toán</span>
          <span className="text-red-600">{formatCurrencyVND(finalAmount)}</span>
        </div>

        {finalAmount > 0 && (
          <div className="flex justify-between text-xs text-yellow-600 font-medium items-center">
            <span>Điểm thưởng</span>
            <span className="flex items-center gap-1">
 <img
                      src="src/assets/Client/images/xudiem.png"
                      alt="coin"
                      className="w-4 h-4 object-contain"
                    />

              {'+ ' + Math.floor(finalAmount / 4000).toLocaleString('vi-VN')} điểm
            </span>
          </div>
        )}
{totalDiscountDisplay > 0 && (
  <button
    className="text-blue-600 text-sm font-medium inline-flex items-center ml-auto"
    onClick={() => setShowDiscountDetails((prev) => !prev)}
  >
    {showDiscountDetails ? 'Thu gọn' : 'Xem chi tiết'}
    {showDiscountDetails ? (
      <FiChevronUp className="ml-1" />
    ) : (
      <FiChevronRight className="ml-1 transform rotate-90" />
    )}
  </button>
)}

        {totalDiscountDisplay > 0 && (
          <div className="text-sm text-green-600 mt-1 text-right">
            Tiết kiệm {formatCurrencyVND(totalDiscountDisplay)}
          </div>
        )}

        <p className="text-[11px] text-gray-400 text-right">(Đã bao gồm VAT nếu có)</p>
      </div>

      {/* Submit button */}
      <button
    onClick={onClickPlaceOrder}
        disabled={isPlacing}
        className="block text-center w-full font-semibold py-3 rounded-md transition-colors text-base mt-4 bg-primary text-white hover:opacity-90 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        {isPlacing ? 'Đang xử lý...' : 'Đặt hàng'}
      </button>

      <p className="text-[11px] text-gray-400 text-center mt-2">
        Bằng việc nhấn <strong>Đặt hàng</strong>, bạn đồng ý với{' '}
        <a href="#" className="text-blue-500 underline">
          Điều khoản dịch vụ
        </a>{' '}và{' '}
        <a href="#" className="text-blue-500 underline">
          Chính sách xử lý dữ liệu cá nhân
        </a>{' '}của PHT Shop
      </p>
    </aside>

    {isPromoModalOpen && (
      <PromoModal
        onClose={() => setIsPromoModalOpen(false)}
        onApplySuccess={handleApplyPromo}
        appliedCode={selectedCoupon?.code || ''}
        skuIds={selectedItems.map((item) => item.skuId)}
        orderTotal={+totalAmount || 0}
      />
    )}
<PinModal
  open={isPinModalOpen}
  onClose={() => setIsPinModalOpen(false)}
onSubmit={async (pin) => {
  try {
    const res = await walletService.verifyPinAndBalance({ pin });
    console.log('PIN verify response:', res);

    const balance = res?.data?.data?.balance; // ✅ Lấy đúng path

    if (balance !== undefined) {
      setIsPinModalOpen(false);
      handlePlaceOrder(pin);
    } else {
      toast.error('Mã PIN không chính xác!');
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Xác minh mã PIN thất bại!');
  }
}}

/>

  </div>
  
);

};

const Row = ({ label, value, bold, color, className, pl }) => (
  <div
    className={`flex justify-between mb-2 text-sm ${
      color || 'text-gray-800'
    } ${className || ''}`}
  >
    <span className={pl ? 'pl-2' : ''}>{label}</span>
    <span className={bold ? 'font-bold' : ''}>{value}</span>
  </div>
);

export default OrderSummary;