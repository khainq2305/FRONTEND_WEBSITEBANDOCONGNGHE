import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FiX, FiInfo, FiLoader } from 'react-icons/fi';
import { couponService } from '../../../../services/client/couponService';
import defaultShippingIcon from '../../../../assets/Client/images/image 12.png';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { FaTicketAlt, FaGift } from 'react-icons/fa';

import { toast } from 'react-toastify';

const PromoModal = ({ modalTitle = 'Hồng Ân Khuyến Mãi', onClose, onApplySuccess, skuId, orderTotal, appliedCode = '' }) => {
  const [availablePromos, setAvailablePromos] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [inputPromoCode, setInputPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    if (appliedCode) {
      setSelectedCode(appliedCode);
    }
  }, [appliedCode]);

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true);
      try {
        const res = await couponService.getAvailable(skuId ? `?skuId=${skuId}` : '');
        const couponsFromApi = res.data?.data || [];
        const mapped = couponsFromApi.map((coupon) => ({
          id: coupon.code,
          code: coupon.code,
          type: coupon.discountType === 'shipping' ? 'shipping' : 'discount',
          title: coupon.title || coupon.code,
          description: `Cho đơn hàng từ ${formatCurrencyVND(coupon.minOrderAmount)}`,
          expiryDate: coupon.expiryDate
            ? new Date(coupon.expiryDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' })
            : null,
          isApplicable: coupon.isApplicable
        }));
        setAvailablePromos(mapped);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách coupons:', err);
        alert('Không thể tải danh sách khuyến mãi. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    document.body.style.overflow = 'hidden';
    fetchCoupons();
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [skuId]);

  const handleSelect = (promo) => {
    if (!promo.isApplicable) return;
    setInputPromoCode('');
    setApplyError('');
    setSelectedCode((prev) => (prev === promo.code ? '' : promo.code));
  };

  const _applyCode = async (codeToApply) => {
    const trimmedCode = String(codeToApply || '').trim();

    if (!trimmedCode) {
      onApplySuccess(null);
      setSelectedCode('');
      setInputPromoCode('');
      setApplyError('');
      onClose();
      return;
    }
    setIsLoading(true);
    setApplyError('');

    try {
      const payload = {
        code: trimmedCode,
        orderTotal: Number(orderTotal)
      };
      if (skuId) payload.skuId = Number(skuId);

      const response = await couponService.applyCoupon(payload);
      const { coupon } = response.data;
      toast.success('Áp dụng mã giảm giá thành công!');
      onApplySuccess(coupon);
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.message || error.message || 'Lỗi không xác định';
      toast.error(msg);
      setApplyError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyInputCode = () => {
    _applyCode(inputPromoCode.trim().toUpperCase());
  };

  const handleConfirmSelection = () => {
    _applyCode(selectedCode);
  };

  const groupedPromos = availablePromos.reduce((acc, promo) => {
    const key = promo.type === 'shipping' ? 'Mã Vận Chuyển' : 'Mã Giảm Giá';
    acc[key] = acc[key] || [];
    acc[key].push(promo);
    return acc;
  }, {});

  // Custom Coupon Card component to encapsulate styling
  const CouponCard = ({ promo, isSelected, onSelect }) => {
    const primaryBgColor = promo.type === 'shipping' ? 'bg-green-600' : 'bg-blue-600'; // Green for shipping, blue for discount
    // Use ring-offset-2 for the selected effect to avoid cutting into the coupon
    const borderColorClass = isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'ring-2 ring-transparent ring-offset-2';
    const opacityClass = promo.isApplicable ? '' : 'opacity-60 cursor-not-allowed';

    return (
      <div
        key={promo.id}
        onClick={() => onSelect(promo)}
        className={`
      relative w-full flex p-2 bg-white rounded-md shadow-sm
      overflow-hidden transition-all duration-200 h-24
      ${borderColorClass} ${opacityClass}
    `}
      >
        {/* Icon section */}
        <div className={`relative w-24 flex-shrink-0 flex items-center justify-center p-2 ${primaryBgColor}`}>
          {promo.type === 'shipping' ? (
            <img src={defaultShippingIcon} alt="shipping icon" className="w-full h-full object-contain" />
          ) : (
            <FaGift className="text-white text-4xl" />
          )}
        </div>

        {/* Vertical dashed separator */}
        <div className="absolute inset-y-0 right-0 w-px border-r-2 border-dashed border-gray-200" />

        {/* Content section */}
        <div className="flex-1 p-3 flex justify-between items-center">
          <div>
            <p className="font-semibold text-sm text-gray-900">{promo.title}</p>
            <p className="text-xs text-gray-600">{promo.description}</p>
            {promo.expiryDate && <p className="text-xs text-gray-500 mt-1">HSD: {promo.expiryDate}</p>}
          </div>
          <div className="flex items-center space-x-2 pl-2">
            <FiInfo className="text-gray-400 flex-shrink-0" size={16} />

            {!promo.isApplicable ? (
              <div className="absolute top-1/2 right-4 -translate-y-1/2 transform -rotate-12">
                <div className="border-2 border-gray-400 rounded-md px-2 py-1">
                  <span className="text-xs text-center font-bold text-gray-400">CHƯA THOẢ ĐIỀU KIỆN</span>
                </div>
              </div>
            ) : isSelected ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(promo);
                }}
                className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-sm hover:opacity-90 transition-colors"
              >
                Bỏ chọn
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(promo);
                }}
                className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-sm hover:opacity-90 transition-colors"
              >
                Áp dụng
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-100 rounded-lg shadow-xl w-full max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh' }}
      >
        <div className="relative text-center py-3 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-800">{modalTitle}</h3>
          <button onClick={onClose} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-start gap-2">
            <div className="flex-grow">
              <input
                value={inputPromoCode}
                onChange={(e) => {
                  setInputPromoCode(e.target.value.toUpperCase());
                  setSelectedCode('');
                  if (applyError) setApplyError('');
                }}
                placeholder="Nhập mã giảm giá"
                className={`w-full px-3 py-2 border ${applyError ? 'border-red-500' : 'border-gray-300'} rounded-sm text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none`}
              />
              {applyError && <p className="text-xs text-red-500 mt-1">{applyError}</p>}
            </div>
            <button
              onClick={handleApplyInputCode}
              disabled={!inputPromoCode.trim() || isLoading}
              className="flex-shrink-0 bg-blue-600 text-white font-semibold py-2 px-4 rounded-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading && !selectedCode && inputPromoCode.trim() ? <FiLoader className="animate-spin" /> : 'Áp dụng'}
            </button>
          </div>

          {isLoading && availablePromos.length === 0 ? (
            <p className="text-center py-10">Đang tải...</p>
          ) : availablePromos.length > 0 ? (
            Object.entries(groupedPromos).map(([groupName, promos]) => (
              <div key={groupName}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm">{groupName}</h4>
                  <span className="text-xs text-gray-500">Áp dụng tối đa: 1</span>
                </div>
                <div className="space-y-3">
                  {promos.map((promo) => (
                    <CouponCard key={promo.id} promo={promo} isSelected={selectedCode === promo.code} onSelect={handleSelect} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            !isLoading && (
              <div className="text-center py-10 px-4">
                <FaTicketAlt className="mx-auto text-5xl text-gray-300" />
                <p className="mt-4 text-sm font-medium text-gray-600">Rất tiếc, không có ưu đãi nào khả dụng.</p>
              </div>
            )
          )}
        </div>

        <div className="p-4 bg-white border-t flex-shrink-0">
          <button
            onClick={handleConfirmSelection}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading && selectedCode ? <FiLoader className="animate-spin" /> : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );

  let modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = 'modal-root';
    document.body.appendChild(modalRoot);
  }

  return ReactDOM.createPortal(modalContent, modalRoot);
};

export default PromoModal;
