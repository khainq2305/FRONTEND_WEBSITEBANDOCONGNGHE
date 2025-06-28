// src/pages/Checkout/OrderSummary.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../../../services/client/orderService';
import { toast } from 'react-toastify';
import { FiChevronUp,FiInfo, FiChevronRight } from 'react-icons/fi';

import { formatCurrencyVND } from '../../../../utils/formatCurrency';

import { FaPercentage } from 'react-icons/fa';

import PromoModal, { CouponCard } from '../../Cart/PromoModal';   // 👈 thêm CouponCard
import { couponService } from '../../../../services/client/couponService';

/**
 * OrderSummary
 * -------------------------------------------------------------------
 * - Hiển thị tóm tắt đơn hàng + mã giảm giá
 * - Chỉ cho phép “Đặt hàng” khi đã có selectedAddress (truyền từ CheckoutPage)
 * - Nếu thiếu địa chỉ, hiện 1 toast: “Vui lòng nhập địa chỉ giao hàng!” và dừng
 */
const OrderSummary = ({
  totalAmount,
  discount,
  shippingFee,
  selectedPaymentMethod,
  selectedCoupon: propCoupon,
  selectedAddress, // 👈 prop mới: địa chỉ hiện tại đã chọn
}) => {
  const navigate = useNavigate();

  /* ====================== STATE ======================= */
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isPlacing, setIsPlacing] = useState(false);

  // Lấy SKU đầu tiên để gửi check coupon
  const cartSelection = JSON.parse(localStorage.getItem('selectedCartItems') || '[]');
  const firstSkuId = cartSelection[0]?.skuId || null;

  /* ===== Lấy coupon từ prop hoặc localStorage ===== */
  useEffect(() => {
    if (propCoupon) return setSelectedCoupon(propCoupon);

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

  /* ================ Áp / Bỏ mã khuyến mãi ================ */
  const handleApplyPromo = async (coupon) => {
    if (!coupon) {
      setSelectedCoupon(null);
      localStorage.removeItem('selectedCoupon');
      toast.success('Đã bỏ mã giảm giá.');
      setIsPromoModalOpen(false);
      return;
    }

    const code = typeof coupon === 'string' ? coupon : coupon.code;
    if (!code) return toast.error('Mã giảm giá không hợp lệ!');

    try {
      const res = await couponService.applyCoupon({
        code: code.trim(),
       skuIds    : [Number(firstSkuId)],   // ✅ mảng
        orderTotal: Number(totalAmount),
      });
      const applied = res.data?.coupon;
      if (applied) {
        setSelectedCoupon(applied);
        localStorage.setItem('selectedCoupon', JSON.stringify(applied));
        toast.success(`Áp dụng mã ${code} thành công!`);
      } else {
        toast.error(`Không tìm thấy mã "${code}"`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lỗi khi áp mã giảm giá!');
    } finally {
      setIsPromoModalOpen(false);
    }
  };

  /* ===================== TÍNH TOÁN TIỀN ===================== */
/* ===== TÍNH TOÁN TIỀN ===== */
/* ==== TÍNH TOÁN ==== */
const couponDiscount =
  selectedCoupon?.discountType !== 'shipping'
    ? Number(selectedCoupon?.discountAmount || 0)
    : 0;

const shippingDiscount =
  selectedCoupon?.discountType === 'shipping'
    ? Math.min(shippingFee, selectedCoupon.discountValue || 0)
    : 0;

/* ➜ Tổng ưu đãi để hiển thị */
const totalDiscountDisplay = discount + couponDiscount + shippingDiscount;

/* ➜ Tiền phải trả thực tế */
const finalAmount =
  totalAmount - discount - couponDiscount + shippingFee - shippingDiscount;
//  hoặc:  const finalAmount = totalAmount + shippingFee - totalDiscountDisplay;

  /* ======================== ĐẶT HÀNG ========================= */
  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedAddress.id) {
      toast.error('Vui lòng nhập địa chỉ giao hàng!');
      return;
    }

    if (cartSelection.length === 0) {
      toast.error('Không có sản phẩm được chọn!');
      return;
    }

    if (isPlacing) return;
    setIsPlacing(true);

    try {
      const payload = {
        addressId: selectedAddress.id,
        paymentMethodId: selectedPaymentMethod,
        couponCode: selectedCoupon?.code || null,
        note: '',
        items: cartSelection.map((i) => ({
          skuId: i.skuId,
          quantity: i.quantity,
          price: i.finalPrice,
          flashSaleId: i.flashSaleId || null,
        })),
        cartItemIds: cartSelection.map((i) => i.id),
      };

      const res = await orderService.createOrder(payload);
      const orderId = res.data?.orderId || res.data?.data?.orderId;
      const orderCode = res.data?.orderCode || res.data?.data?.orderCode;
      if (!orderId || !orderCode) throw new Error('Không lấy được mã đơn hàng!');

      /** Xử lý thanh toán online */
      const isQR = selectedPaymentMethod === 2;
      const isVNPay = selectedPaymentMethod === 3;
      const isMoMo = selectedPaymentMethod === 4;
      const isZalo = selectedPaymentMethod === 5;
const isViettel = selectedPaymentMethod === 6;   // 👈 THÊM
      // Clear cart localStorage
      const fullCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const updatedCart = fullCart.filter(
        (c) => !cartSelection.some((sel) => sel.skuId === c.skuId),
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      localStorage.removeItem('selectedCartItems');
      localStorage.removeItem('selectedCoupon');

      if (isQR) {
                 const payableNow =
   totalAmount - totalDiscount + (shippingFee - shippingDiscount); // tính “tức thì”

        const qrRes = await orderService.vietqrPay({
 
          accountNumber: '2222555552005',
          accountName: 'NGUYEN QUOC KHAI',
          bankCode: 'MB',
          amount       : payableNow,    // ✅ số vừa tính
          message: orderCode,
        });
        const qrImg = qrRes.data?.qrImage;
        navigate(
          `/order-confirmation?orderCode=${orderCode}&qr=${encodeURIComponent(qrImg || '')}`,
        );
        return;
      }

      if (isVNPay) {
       const url = (await orderService.vnpay({
 orderId,
  bankCode: 'NCB',      // ✅ ATM test; 'VISA' cho thẻ quốc tế
 })).data?.payUrl;
        if (!url) throw new Error('Không nhận được link VNPay');
        window.location.href = url;
        return;
      }

      if (isMoMo) {
        const url = (await orderService.momoPay({ orderId })).data?.payUrl;
        if (!url) throw new Error('Không nhận được link MoMo');
        window.location.href = url;
        return;
      }

      if (isZalo) {
        const url = (await orderService.zaloPay({ orderId })).data?.payUrl;
        if (!url) throw new Error('Không nhận được link ZaloPay');
        window.location.href = url;
        return;
      }
if (isViettel) {
  const url = (await orderService.viettelMoney({ orderId })).data?.payUrl;
  if (!url) throw new Error('Không nhận được link Viettel Money');
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

  /* ========================= UI ========================= */
  return (
    <div className="relative">
      <aside className="bg-white rounded-md p-3 sm:p-4 border border-gray-200 shadow-sm sticky top-6 h-fit">
          <div className="flex justify-between items-center pb-4">
            <h4 className="font-semibold text-sm text-gray-800">
              HomePower khuyến mãi
            </h4>
            <div className="flex items-center text-xs text-gray-500">
              Có thể chọn&nbsp;1
              <FiInfo className="ml-1 text-gray-400" size={14} />
            </div>
          </div>
       <div className="border border-gray-200 rounded-md p-3 mb-3">
          {selectedCoupon ? (
            /* Đã có coupon – hiện pill + link đổi mã */
            <div className="flex flex-col gap-2">
              <CouponCard
                compact
                logoW={70}
                 titleClassName="text-left ml-5"
                compactHeight={76}
                 containerBg="white"  
                promo={{
                  id:   selectedCoupon.code,
                  code: selectedCoupon.code,
                  type:
                    selectedCoupon.discountType === 'shipping'
                      ? 'shipping'
                      : 'discount',
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
            /* Chưa có coupon – nút chọn mã */
            <button
              onClick={() => setIsPromoModalOpen(true)}
              className="flex justify-between items-center w-full text-sm text-gray-800"
            >
              <span className="flex items-center font-medium">
                <FaPercentage className="mr-2 text-lg text-gray-400" />
                Chọn hoặc nhập ưu đãi
              </span>
              <FiChevronRight className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Thông tin tiền */}
      {/* ================= Thông tin tiền ================= */}
<div className="text-xs sm:text-sm text-gray-600 mb-4">
  <h3 className="font-semibold mb-2 text-gray-800">Thông tin đơn hàng</h3>

  {/* 1. Tiền hàng + giảm giá SP / coupon */}
  <Row label="Tổng tiền hàng" value={formatCurrencyVND(totalAmount)} bold />
  <Row className="text-xs" label="Giảm giá từ sản phẩm" value={formatCurrencyVND(discount)} />
  {couponDiscount > 0 && (
    <Row
      label="Giảm giá từ coupon"
      value={`- ${formatCurrencyVND(couponDiscount)}`}
      color="text-green-600"
      className="text-xs"
    />
  )}

  {/* 2. Phí vận chuyển */}
{/* 2. Phí vận chuyển */}
{shippingDiscount > 0 ? (
  <>
    {/* phí gốc – KHÔNG gạch nữa */}
    <Row
      label="Phí vận chuyển"
      value={formatCurrencyVND(shippingFee)}
    />

    {/* phần được giảm */}
    <Row
      label="Giảm phí vận chuyển"
      value={`- ${formatCurrencyVND(shippingDiscount)}`}
      color="text-green-600"
      className="text-xs"

    />
  </>
) : (
  <Row
    label="Phí vận chuyển"
    value={shippingFee === 0 ? 'Miễn phí' : formatCurrencyVND(shippingFee)}
  />
)}

  {/* 3. Tổng khuyến mãi (hiển thị sau phí ship) */}
<Row label="Tổng khuyến mãi" value={formatCurrencyVND(totalDiscountDisplay)} />

  {/* 4. Tổng cần thanh toán */}
  <div className="pt-2">
    <div className="border-t border-dashed border-gray-300 mb-2" />
   <Row
  label="Cần thanh toán"
  value={formatCurrencyVND(finalAmount)}
  bold
  color="text-red-600"
/>
<p className="text-sm text-green-600 mt-1 text-right">
  Tiết kiệm {formatCurrencyVND(totalDiscountDisplay)}
</p>
    <p className="text-[11px] text-gray-400 text-right">
      (Đã bao gồm VAT nếu có)
    </p>
  </div>
</div>


        {/* BTN */}
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacing}
          className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:opacity-90 disabled:opacity-60 transition"
        >
          {isPlacing ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>

        <p className="text-[11px] text-gray-400 text-center mt-2">
          Bằng việc nhấn <strong>Đặt hàng</strong>, bạn đồng ý với{' '}
          <a href="#" className="text-blue-500 underline">
            Điều khoản dịch vụ
          </a>{' '}
          và{' '}
          <a href="#" className="text-blue-500 underline">
            Chính sách xử lý dữ liệu cá nhân
          </a>{' '}
          của PHT Shop
        </p>
      </aside>

      {/* Modal Coupon */}
      {isPromoModalOpen && (
        <PromoModal
          onClose={() => setIsPromoModalOpen(false)}
          onApplySuccess={handleApplyPromo}
          appliedCode={selectedCoupon?.code || ''}
           skuIds={[firstSkuId]}               // ✅ phải là mảng
          orderTotal={+totalAmount || 0}
        />
      )}
    </div>
  );
};

/* ==== Component nhỏ hiển thị từng dòng tiền ==== */
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
