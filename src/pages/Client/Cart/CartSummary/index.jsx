import React, { useState, useEffect } from 'react';
import { FaPercentage, FaQuestionCircle } from 'react-icons/fa';
import { FiChevronUp, FiChevronRight } from 'react-icons/fi';
import PromoModal from '../PromoModal';
import { couponService } from '../../../../services/client/couponService';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';

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

  const handleApplySuccess = (couponObject) => {
    if (couponObject) {
      setAppliedCoupon(couponObject);
      localStorage.setItem('appliedCoupon', JSON.stringify(couponObject));
      localStorage.setItem('selectedCoupon', JSON.stringify(couponObject));
    } else {
      setAppliedCoupon(null);
      localStorage.removeItem('appliedCoupon');
    }
  };

  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount) : 0;

  const rawPayable = Number(orderTotals.payablePrice);
  const payableAfterDiscount = Math.max(0, rawPayable - discountAmount);

  const payableAfterDiscountFormatted = formatCurrencyVND(payableAfterDiscount > 0 ? payableAfterDiscount : 0);

  const totals = orderTotals || {
    totalPrice: '0 đ',
    totalDiscount: '0 đ',
    payablePrice: '0 đ',
    rewardPoints: '+0'
  };

  const handleCheckout = () => {
    localStorage.removeItem('appliedCoupon');
    onCheckout();
  };

  return (
    <>
      <aside className="bg-white rounded-md p-3 sm:p-4 border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="border border-gray-200 rounded-md p-3">
          <button
            onClick={openPromoModal}
            disabled={!hasSelectedItems}
            className="flex justify-between items-center w-full text-sm text-gray-800 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <span className="flex items-center font-medium">
              <span className={`mr-2 text-lg ${hasSelectedItems ? 'text-red-500' : 'text-gray-400'}`}>
                <FaPercentage />
              </span>
              {appliedCoupon ? `Đã áp dụng: ${appliedCoupon.code}` : 'Chọn hoặc nhập ưu đãi'}
            </span>
            <FiChevronRight className="text-gray-400" />
          </button>
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

      {isPromoModalOpen && (
        <PromoModal
          onClose={closePromoModal}
          onApplySuccess={handleApplySuccess}
          skuId={selectedItems[0]?.skuId || null}
          orderTotal={rawPayable}
          appliedCode={appliedCoupon?.code || ''}
        />
      )}
    </>
  );
};

export default CartSummary;
