import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../../../services/client/orderService';
import { paymentService } from '../../../../services/client/paymentService';
import { toast } from 'react-toastify';
import { FiInfo, FiChevronRight } from 'react-icons/fi';
import { useCartStore } from '@/stores/useCartStore';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';

import { FaPercentage } from 'react-icons/fa';

import PromoModal, { CouponCard } from '../../Cart/PromoModal';
import { couponService } from '../../../../services/client/couponService';
import { Coins } from 'lucide-react';

const OrderSummary = ({
  totalAmount,
  discount,
  shippingFee,
  selectedShipMethod,
  selectedPaymentMethod,
  selectedCoupon: propCoupon,
  selectedAddress,
  selectedItems = [],
}) => {
  const navigate = useNavigate();

  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isPlacing, setIsPlacing] = useState(false);

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
    totalAmount - discount - couponDiscount + shippingFee - shippingDiscount;

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedAddress.id) {
      toast.error('Vui lòng nhập địa chỉ giao hàng!');
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

      toast.success('Đặt hàng thành công!');
      navigate(`/order-confirmation?orderCode=${orderCode}`);
    } catch (err) {
      console.error('[Create Order]', err);
      toast.error(err?.response?.data?.message || 'Lỗi đặt hàng!');
    } finally {
      setIsPlacing(false);
    }
  };

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

        <div className="text-xs sm:text-sm text-gray-600 mb-4">
          <h3 className="font-semibold mb-2 text-gray-800">Thông tin đơn hàng</h3>

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

          {shippingDiscount > 0 ? (
            <>
              <Row
                label="Phí vận chuyển"
                value={formatCurrencyVND(shippingFee)}
              />

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

          <Row label="Tổng khuyến mãi" value={formatCurrencyVND(totalDiscountDisplay)} />

          <div className="pt-2">
            <div className="border-t border-dashed border-gray-300 mb-2" />
            <Row
              label="Cần thanh toán"
              value={formatCurrencyVND(finalAmount)}
              bold
              color="text-red-600"
            />
                        {finalAmount > 0 && (
  <div className="flex justify-between text-xs text-yellow-600 font-medium items-center mt-1">
    <span>Điểm thưởng</span>
    <span className="flex items-center gap-1">
      <Coins size={14} className="text-yellow-500" />
      {'+ ' + Math.floor(finalAmount / 4000).toLocaleString('vi-VN')} điểm
    </span>
  </div>
)}
            <p className="text-sm text-green-600 mt-1 text-right">
              Tiết kiệm {formatCurrencyVND(totalDiscountDisplay)}
            </p>


            <p className="text-[11px] text-gray-400 text-right">
              (Đã bao gồm VAT nếu có)
            </p>
          </div>
        </div>

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

      {isPromoModalOpen && (
        <PromoModal
          onClose={() => setIsPromoModalOpen(false)}
          onApplySuccess={handleApplyPromo}
          appliedCode={selectedCoupon?.code || ''}
          skuIds={selectedItems.map(item => item.skuId)}
          orderTotal={+totalAmount || 0}
        />
      )}
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