// src/components/Client/PromoModal.jsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FiX, FiInfo, FiLoader } from 'react-icons/fi';
import { couponService } from '../../../../services/client/couponService';
import defaultShippingIcon from '../../../../assets/Client/images/image 12.png';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { FaTicketAlt, FaGift } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PromoModal = ({
  modalTitle = 'Hồng Ân Khuyến Mãi',
  onClose,
  onApplySuccess,
  skuId,
  orderTotal,
  appliedCode = ''
}) => {
  const [availablePromos, setAvailablePromos] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [inputPromoCode, setInputPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [applyError, setApplyError] = useState('');

  /* ─────────── EFFECTS ─────────── */

  useEffect(() => {
    if (appliedCode) setSelectedCode(appliedCode);
  }, [appliedCode]);

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true);
      try {
        const res = await couponService.getAvailable(skuId ? `?skuId=${skuId}` : '');
        const coupons = res.data?.data || [];
        setAvailablePromos(
          coupons.map((c) => ({
            id: c.code,
            code: c.code,
            type: c.discountType === 'shipping' ? 'shipping' : 'discount',
            title: c.title || c.code,
            description: `Cho đơn hàng từ ${formatCurrencyVND(c.minOrderAmount)}`,
            expiryDate: c.expiryDate
              ? new Date(c.expiryDate).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit'
                })
              : null,
            isApplicable: c.isApplicable
          }))
        );
      } catch (err) {
        console.error('Lỗi khi lấy coupons:', err);
        alert('Không thể tải danh sách khuyến mãi. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    document.body.style.overflow = 'hidden';
    fetchCoupons();
    return () => (document.body.style.overflow = 'unset');
  }, [skuId]);

  /* ─────────── HANDLERS ─────────── */

  const handleSelect = (promo) => {
    if (!promo.isApplicable) return;
    setInputPromoCode('');
    setApplyError('');
    setSelectedCode((prev) => (prev === promo.code ? '' : promo.code));
  };

  const _applyCode = async (codeToApply) => {
    const trimmed = String(codeToApply || '').trim();
    if (!trimmed) {
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
      const payload = { code: trimmed, orderTotal: Number(orderTotal) };
      if (skuId) payload.skuId = Number(skuId);

      const res = await couponService.applyCoupon(payload);
      toast.success('Áp dụng mã giảm giá thành công!');
      onApplySuccess(res.data.coupon);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Lỗi không xác định';
      toast.error(msg);
      setApplyError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedPromos = availablePromos.reduce((acc, p) => {
    const key = p.type === 'shipping' ? 'Mã Vận Chuyển' : 'Mã Giảm Giá';
    (acc[key] = acc[key] || []).push(p);
    return acc;
  }, {});

  /* ─────────── COUPON CARD ─────────── */

  const CouponCard = ({ promo, isSelected, onSelect }) => {
    const primaryBg = promo.type === 'shipping' ? 'bg-green-600' : 'bg-blue-600';
    const ring      = isSelected
      ? 'ring-2 ring-blue-500 ring-offset-2'
      : 'ring-2 ring-transparent ring-offset-2';
    const disabled  = promo.isApplicable ? '' : 'opacity-60 cursor-not-allowed';

    return (
      <div
        onClick={() => onSelect(promo)}
        className={`relative flex w-full h-24 bg-white rounded-md p-2 shadow-sm
                    transition-all duration-200 ${ring} ${disabled}`}
        /* quan trọng: cho lỗ bấm ló ra ngoài */
        style={{ overflow: 'visible' }}
      >
        {/* icon */}
        <div className={`relative w-24 flex-shrink-0 flex items-center justify-center p-2 ${primaryBg}`}>
          {promo.type === 'shipping' ? (
            <img src={defaultShippingIcon} alt="shipping" className="w-full h-full object-contain" />
          ) : (
            <FaGift className="text-white text-4xl" />
          )}
        </div>

        {/* separator + lỗ bấm */}
        <div className="relative w-0 flex-shrink-0">
          {/* nét đứt */}
          <div className="absolute top-4 bottom-4 left-1/2 border-l-2 border-dashed border-blue-500" />

          {/* lỗ trên */}
          <span className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-gray-100 border-2 border-blue-500" />
          {/* lỗ dưới */}
          <span className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-gray-100 border-2 border-blue-500" />
        </div>

        {/* nội dung */}
        <div className="flex-1 flex items-center justify-between pl-5 pr-3">
          <div>
            <p className="font-semibold text-sm text-gray-900">{promo.title}</p>
            <p className="text-xs text-gray-600">{promo.description}</p>
            {promo.expiryDate && (
              <p className="text-xs text-gray-500 mt-1">HSD: {promo.expiryDate}</p>
            )}
          </div>

          <div className="flex items-center space-x-2 pl-2">
            <FiInfo className="text-gray-400 flex-shrink-0" size={16} />

            {!promo.isApplicable ? (
              <div className="absolute top-1/2 right-4 -translate-y-1/2 -rotate-12">
                <div className="border-2 border-gray-400 rounded-md px-2 py-1">
                  <span className="text-xs font-bold text-gray-400">CHƯA THỎA ĐIỀU KIỆN</span>
                </div>
              </div>
            ) : isSelected ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(promo);
                }}
                className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-sm hover:opacity-90"
              >
                Bỏ chọn
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(promo);
                }}
                className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-sm hover:opacity-90"
              >
                Áp dụng
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ─────────── MODAL UI ─────────── */

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 rounded-lg shadow-xl flex flex-col w-full max-w-md"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative py-3 text-center border-b border-gray-200 flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-800">{modalTitle}</h3>
          <button
            onClick={onClose}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Nhập mã thủ công */}
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
                className={`w-full px-3 py-2 border ${
                  applyError ? 'border-red-500' : 'border-gray-300'
                } rounded-sm text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none`}
              />
              {applyError && <p className="text-xs text-red-500 mt-1">{applyError}</p>}
            </div>
            <button
              onClick={() => _applyCode(inputPromoCode.trim().toUpperCase())}
              disabled={!inputPromoCode.trim() || isLoading}
              className="flex-shrink-0 bg-blue-600 text-white font-semibold py-2 px-4 rounded-sm hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading && !selectedCode && inputPromoCode.trim() ? (
                <FiLoader className="animate-spin" />
              ) : (
                'Áp dụng'
              )}
            </button>
          </div>

          {/* Danh sách coupon */}
          {isLoading && availablePromos.length === 0 ? (
            <p className="text-center py-10">Đang tải...</p>
          ) : availablePromos.length > 0 ? (
            Object.entries(groupedPromos).map(([group, promos]) => (
              <div key={group}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-sm text-gray-800">{group}</h4>
                  <span className="text-xs text-gray-500">Áp dụng tối đa: 1</span>
                </div>
                <div className="space-y-3">
                  {promos.map((p) => (
                    <CouponCard
                      key={p.id}
                      promo={p}
                      isSelected={selectedCode === p.code}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            !isLoading && (
              <div className="text-center py-10 px-4">
                <FaTicketAlt className="mx-auto text-5xl text-gray-300" />
                <p className="mt-4 text-sm font-medium text-gray-600">
                  Rất tiếc, không có ưu đãi nào khả dụng.
                </p>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t flex-shrink-0">
          <button
            onClick={() => _applyCode(selectedCode)}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:opacity-90 disabled:bg-gray-400 flex items-center justify-center"
          >
            {isLoading && selectedCode ? <FiLoader className="animate-spin" /> : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );

  /* ─────────── PORTAL ─────────── */

  let root = document.getElementById('modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
  }

  return ReactDOM.createPortal(modalContent, root);
};

export default PromoModal;
