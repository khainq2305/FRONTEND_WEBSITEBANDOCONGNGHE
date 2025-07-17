import React, { useState, useEffect, useRef } from 'react';
import { FaPercentage, FaQuestionCircle } from 'react-icons/fa';
import { FiChevronUp, FiInfo, FiChevronRight } from 'react-icons/fi';
import PromoModal, { CouponCard } from '../PromoModal';
import { couponService } from '../../../../services/client/couponService';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { toast } from 'react-toastify';

import defaultShippingIcon from '../../../../assets/Client/images/image 12.png';
const CartSummary = ({ hasSelectedItems, selectedItems, orderTotals, appliedCoupon, setAppliedCoupon, onCheckout }) => {
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  const openPromoModal = () => {
    if (!hasSelectedItems) {
      alert('Vui lòng chọn sản phẩm trước khi áp dụng ưu đãi.');
      return;
    }
    setIsPromoModalOpen(true);
  };
  const closePromoModal = () => setIsPromoModalOpen(false);

const handleApplySuccess = async (couponObject) => {
  if (!couponObject) {
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
    localStorage.removeItem('selectedCoupon');
    toast.success('Đã bỏ mã giảm giá.');
    return;
  }

  const code = typeof couponObject === 'string' ? couponObject : couponObject.code;
  if (!code) {
    toast.error('Mã giảm giá không hợp lệ!');
    return;
  }

  try {
    const res = await couponService.applyCoupon({
      code: code.trim(),
      skuIds: selectedItems.map((i) => i.skuId),
      orderTotal: Number(orderTotals?.payablePrice || 0),
    });

    const applied = res.data?.coupon;

    if (applied && res.data?.isValid) {
      setAppliedCoupon(applied);
      localStorage.setItem('appliedCoupon', JSON.stringify(applied));
      localStorage.setItem('selectedCoupon', JSON.stringify(applied));
      toast.success(`Áp dụng mã ${code} thành công!`);
    } else {
      // Dùng flag isOutOfUsage để chỉ cảnh báo mà KHÔNG bỏ mã
      if (res.data?.isOutOfUsage) {
        toast.warn(res.data.message || 'Mã giảm giá đã hết lượt sử dụng');
        return;
      }

      // Các lỗi khác mới bỏ mã
      throw new Error(res.data?.message || 'Không thể áp dụng mã');
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message || 'Lỗi khi áp mã giảm giá!');
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
    localStorage.removeItem('selectedCoupon');
  }
};


const prevRef = useRef({ skuIds: [], orderTotal: null });

useEffect(() => {
  if (!appliedCoupon || !selectedItems.length) return;

  const skuIds = selectedItems.map((i) => i.skuId).sort();
  const orderTotal = Number(orderTotals?.payablePrice || 0);

  const prev = prevRef.current;
  const skuChanged = JSON.stringify(prev.skuIds) !== JSON.stringify(skuIds);
  const totalChanged = prev.orderTotal !== orderTotal;

  if (!skuChanged && !totalChanged) return;

const refreshCoupon = async () => {
  try {
    const res = await couponService.applyCoupon({
      code: appliedCoupon.code,
      orderTotal,
      skuIds,
    });

    if (!res.data?.isValid) {
      // Phân biệt lỗi
      const msg = res.data.message?.toLowerCase() || '';

      if (msg.includes('hết lượt') || msg.includes('hết hạn')) {
        // Thông báo lỗi nhưng KHÔNG bỏ mã
        toast.warn(res.data.message || 'Mã giảm giá không còn hiệu lực');
        // Có thể set trạng thái nào đó để disable nút thanh toán, hoặc để người dùng bỏ mã thủ công
        return;
      }

      // Các lỗi khác: bỏ mã luôn
      toast.warn(res.data.message || 'Mã giảm giá không còn hiệu lực');
      setAppliedCoupon(null);
      localStorage.removeItem('appliedCoupon');
      return;
    }

    if (!res.data?.coupon) {
      toast.warn('Mã giảm giá không hợp lệ hoặc không tồn tại');
      setAppliedCoupon(null);
      localStorage.removeItem('appliedCoupon');
      return;
    }

    // Coupon hợp lệ
    const updatedCoupon = res.data.coupon;
    setAppliedCoupon(updatedCoupon);
    localStorage.setItem('appliedCoupon', JSON.stringify(updatedCoupon));
  } catch (err) {
    console.error('Lỗi validate lại coupon:', err);
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
    toast.warn(err?.response?.data?.message || err.message || 'Không thể áp dụng mã giảm giá');
  }
};



  refreshCoupon();

  // ✅ Lưu lại để so sánh lần sau
  prevRef.current = { skuIds, orderTotal };
}, [selectedItems, orderTotals]);

const discountAmount =
  appliedCoupon?.discountType !== 'shipping' && appliedCoupon?.discountAmount
    ? Number(appliedCoupon.discountAmount)
    : 0;

  const payableBeforeDiscount = Number(orderTotals?.payablePrice || 0);

  const payableAfterDiscount = Math.max(0, payableBeforeDiscount - discountAmount);
  const payableAfterDiscountFormatted = formatCurrencyVND(payableAfterDiscount > 0 ? payableAfterDiscount : 0);

  const totals = orderTotals || {
    totalPrice: '0 đ',
    totalDiscount: '0 đ',
    payablePrice: '0 đ',
    rewardPoints: '+0'
  };

const handleCheckout = async () => {
  try {
    if (appliedCoupon) {
      const res = await couponService.applyCoupon({
        code: appliedCoupon.code,
        orderTotal: Number(orderTotals?.payablePrice || 0),
        skuIds: selectedItems.map((i) => i.skuId),
      });

      if (!res.data?.isValid || !res.data?.coupon) {
        const msg = (res.data?.message || '').toLowerCase();

        if (msg.includes('hết lượt') || msg.includes('hết hạn')) {
          toast.error(res.data.message || 'Mã giảm giá không còn hiệu lực');
          return; // Dừng checkout, không xóa mã
        }

        setAppliedCoupon(null);
        localStorage.removeItem('appliedCoupon');
        throw new Error(res.data?.message || 'Mã không còn hiệu lực');
      }

      const updatedCoupon = res.data?.coupon;
      if (!updatedCoupon) throw new Error('Mã giảm giá không còn hiệu lực.');

      setAppliedCoupon(updatedCoupon);
      localStorage.setItem('appliedCoupon', JSON.stringify(updatedCoupon));
    }

    onCheckout();
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message || 'Lỗi áp dụng mã giảm giá');
  }
};



  return (
    <>
      <aside className="bg-white rounded-md p-3 sm:p-4 border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-sm text-gray-800">HomePower khuyến mãi</h4>
          <div className="flex items-center text-xs text-gray-500">
            Có thể chọn&nbsp;1
            <FiInfo className="ml-1 text-gray-400" size={14} />
          </div>
        </div>

        <div className="border border-gray-200 rounded-md p-3">
          {appliedCoupon ? (
            <div className="flex flex-col gap-2">
              <CouponCard
                compact
                logoW={70}
                titleClassName="text-left ml-5"
                compactHeight={76}
                 containerBg="white"  
                promo={{
                  id: appliedCoupon.code,
                  code: appliedCoupon.code,
                  type: appliedCoupon.type === 'shipping' ? 'shipping' : 'discount',
                  type: appliedCoupon.discountType || appliedCoupon.type || '',
                  title: appliedCoupon.title || appliedCoupon.code,
                  isApplicable: true
                }}
                isSelected
                onSelect={() => handleApplySuccess(null)}
              />

              <button onClick={openPromoModal} className="text-primary text-sm font-medium inline-flex items-center self-start">
                <FaPercentage className="mr-1.5" />
                Chọn hoặc nhập mã khác
                <FiChevronRight className="ml-0.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openPromoModal}
              disabled={!hasSelectedItems}
              className="flex justify-between items-center w-full text-sm text-gray-800 disabled:text-gray-400"
            >
              <span className="flex items-center font-medium">
                <FaPercentage className={`mr-2 text-lg ${hasSelectedItems ? 'text-red-500' : 'text-gray-400'}`} />
                Chọn hoặc nhập ưu đãi
              </span>
              <FiChevronRight className="text-gray-400" />
            </button>
          )}
        </div>

        <div className="text-sm text-gray-700 space-y-2">
          <h3 className="font-semibold text-base text-gray-800">Thông tin đơn hàng</h3>
          <div className="flex justify-between">
            <span>Tổng tiền hàng</span>
            <span className="font-medium text-gray-800">{formatCurrencyVND(totals.totalPrice)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Giảm giá từ sản phẩm</span>
            <span>{formatCurrencyVND(Number(totals.totalDiscount))}</span>
          </div>

          {appliedCoupon && discountAmount > 0 && (
            <div className="flex justify-between text-xs text-green-600">
              <span>Giảm giá từ coupon</span>
              <span>- {formatCurrencyVND(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Tổng khuyến mãi</span>
            <span className="font-medium text-gray-800">{formatCurrencyVND(totals.totalDiscount + discountAmount)}</span>
          </div>

          <hr className="border-dashed" />
          <div className="flex justify-between text-gray-800 font-semibold">
            <span>Cần thanh toán</span>
            <span className="text-red-600">{formatCurrencyVND(payableAfterDiscount)}</span>
          </div>

          <div className="text-sm text-green-600 mt-1 text-right">Tiết kiệm {formatCurrencyVND(totals.totalDiscount + discountAmount)}</div>
          <p className="text-[11px] text-gray-400 text-right">(Đã bao gồm VAT nếu có)</p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={!hasSelectedItems}
          className={`block text-center w-full font-semibold py-3 rounded-md transition-colors text-base ${
            hasSelectedItems ? 'bg-primary text-white hover:opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Xác nhận đơn
        </button>
      </aside>
<style jsx global>{`
  /* Chỉ tác động tới thẻ div.mx-2 của CouponCard khi nằm trong .tight-title */
  .tight-title .mx-2 {
    margin-left: 0.25rem;   /* 4 px thay vì 0.5rem (8px) gốc */
  }
`}</style>
      {isPromoModalOpen && (
        <PromoModal
          onClose={closePromoModal}
          onApplySuccess={handleApplySuccess}
          skuIds={selectedItems.map((i) => i.skuId)}
          orderTotal={Number(orderTotals?.payablePrice || 0)}

          appliedCode={appliedCoupon?.code || ''}
        />
      )}
    </>
  );
};

export default CartSummary;
