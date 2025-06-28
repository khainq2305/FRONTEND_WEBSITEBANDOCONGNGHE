import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FiX, FiInfo, FiLoader, FiChevronRight, FiChevronUp } from 'react-icons/fi';
import { FaGift, FaTicketAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { couponService } from '../../../../services/client/couponService';
import defaultShippingIcon from '../../../../assets/Client/images/image 12.png';
import notQualifiedStamp from '../../../../assets/Client/images/image 13.png';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';


export const CouponCard = ({
  promo,
  isSelected,
  onSelect,
  compact = false,
   titleClassName = ''    ,    
  logoW = 80,         
   containerBg = '#F4F4F5',     
  compactHeight = 64   
}) => {
  const HOLE = 20;
  const BLUE = '#1CA7EC';
  const CONTAINER_BG = '#F4F4F5';

 const isShip = String(promo.type ?? '')
                 .toLowerCase()
                .includes('ship');       

 const primaryBg = isShip ? 'bg-green-600' : 'bg-primary';
const cardBg    = isSelected
    ? (isShip ? 'bg-green-50' : 'bg-blue-50')
    : 'bg-white';
  const notAllowed = !promo.isApplicable;

 
  if (compact) {
  
    const PAD = 8;
    const GAP = 8;
    const LEFT_POS = PAD + logoW + GAP;

    return (
      <div
        onClick={() => !notAllowed && onSelect(promo)}
        className={`
          relative flex items-center w-full ${cardBg} rounded-lg p-2 shadow-sm border border-gray-200
          ${notAllowed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          ${isSelected ? 'ring-2 ring-[#1CA7EC]' : ''}
        `}
        style={{ height: compactHeight, paddingLeft: PAD }}
      >
        
        <div
          className={`flex items-center justify-center rounded-lg ${primaryBg}`}
          style={{ width: logoW, height: '100%' }}
        >
          {promo.type === 'shipping'
            ? <img src={defaultShippingIcon} alt="" className="w-full h-full object-contain" />
            : <FaGift className="text-white text-3xl" />}
        </div>

     
        <div className="absolute" style={{ top: 0, bottom: 0, left: LEFT_POS, width: 1 }}>
          <span
            style={{
              position: 'absolute',
              inset: 0,
              left: '50%',
              width: 1,
              transform: 'translateX(-0.5px)',
              background: `repeating-linear-gradient(${BLUE} 0 3px, transparent 3px 6px)`
            }}
          />
        </div>

    
        {['top', 'bottom'].map(pos => (
          <div
            key={pos}
            className="absolute"
            style={{
              [pos]: -HOLE / 2,
              left: LEFT_POS,
              width: HOLE,
              height: HOLE,
               
              borderRadius: '50%',
              transform: 'translateX(-50%)',
             backgroundColor: containerBg,
              ...(isSelected && {
                [pos === 'top' ? 'borderBottom' : 'borderTop']: `2px solid ${BLUE}`
              })
            }}
          />
        ))}

      
     <div
  className={`
   mx-2 flex-1 font-semibold text-sm text-gray-900 truncate
    ${titleClassName || 'text-center'}     /*  <-- thêm dòng này */
   `}
>
          {promo.title}
        </div>

        <FiInfo size={16} className="text-gray-400 flex-shrink-0 mr-2" />

        {promo.isApplicable && (
          <button
            onClick={e => { e.stopPropagation(); onSelect(promo); }}
            className="text-xs font-semibold px-3 py-1 rounded bg-primary text-white hover:opacity-90"
          >
            {isSelected ? 'Bỏ chọn' : 'Áp dụng'}
          </button>
        )}
      </div>
    );
  }

  
  const PAD = 12;
  const GAP = 10;
  const LEFT_POS = PAD + logoW + GAP;

  return (
    <div
      onClick={() => !notAllowed && onSelect(promo)}
      className={`
        relative flex h-24 w-full ${cardBg} rounded-lg p-2 shadow-sm border border-gray-200
        ${notAllowed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        ${isSelected ? 'ring-2 ring-[#1CA7EC]' : ''}
      `}
    >
      <div
        className={`flex items-center justify-center rounded-lg ${primaryBg}`}
        style={{ width: logoW }}
      >
        {promo.type === 'shipping'
          ? <img src={defaultShippingIcon} alt="" className="w-full h-full object-contain" />
          : <FaGift className="text-white text-4xl" />}
      </div>

      <div className="absolute" style={{ top: 0, bottom: 0, left: LEFT_POS, width: 1 }}>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            left: '50%',
            width: 1,
            transform: 'translateX(-0.5px)',
            background: `repeating-linear-gradient(${BLUE} 0 3px, transparent 3px 6px)`
          }}
        />
      </div>

      {['top', 'bottom'].map(pos => (
        <div
          key={pos}
          className="absolute"
          style={{
            [pos]: -HOLE / 2,
            left: LEFT_POS,
            width: HOLE,
            height: HOLE,
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: CONTAINER_BG,
            ...(isSelected && {
              [pos === 'top' ? 'borderBottom' : 'borderTop']: `2px solid ${BLUE}`
            })
          }}
        />
      ))}

      <div className="flex-1 flex flex-col justify-between pl-6">
        <div className="flex items-start justify-between">
        <p
   className={`
     font-semibold text-sm text-gray-900 truncate
    ${titleClassName}
  `}
>{promo.title}</p>
          <FiInfo size={16} className="text-gray-400 flex-shrink-0 ml-1" />
        </div>
        <p className="text-xs text-gray-600">{promo.description}</p>
        <div className="flex items-center justify-between">
          {promo.expiryDate && <p className="text-xs text-gray-500">HSD: {promo.expiryDate}</p>}
          {promo.isApplicable && (
            <button
              onClick={e => { e.stopPropagation(); onSelect(promo); }}
              className="text-xs font-semibold px-4 py-1.5 rounded bg-primary text-white hover:opacity-90"
            >
              {isSelected ? 'Bỏ chọn' : 'Áp dụng'}
            </button>
          )}
        </div>
      </div>

      {!promo.isApplicable && (
        <img
          src={notQualifiedStamp}
          alt="not-qualified"
          className="absolute right-4 bottom-3 w-[72px] select-none pointer-events-none"
        />
      )}
    </div>
  );
};

const PromoModal = ({ modalTitle = 'Hồng Ân Khuyến Mãi', onClose, onApplySuccess, skuIds = [], orderTotal, appliedCode = '' }) => {
  const [availablePromos, setAvailablePromos] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [inputPromoCode, setInputPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    if (appliedCode) {
      setSelectedCode(appliedCode);
    }
  }, [appliedCode]);

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (skuIds.length) {
          params.set('skuIds', skuIds.join(','));
        }
        if (orderTotal) {
          params.set('orderTotal', orderTotal);
        }

        const res = await couponService.getAvailable(`?${params.toString()}`);
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
        toast.error('Không thể tải khuyến mãi, thử lại sau!');
      } finally {
        setIsLoading(false);
      }
    };

    document.body.style.overflow = 'hidden';
    fetchCoupons();
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [skuIds, orderTotal]);

  const groupedPromos = availablePromos.reduce((acc, p) => {
    const key = p.type === 'shipping' ? 'Mã Vận Chuyển' : 'Mã Giảm Giá';
    (acc[key] = acc[key] || []).push(p);
    return acc;
  }, {});

  const toggleGroup = (g) => setExpandedGroups((s) => ({ ...s, [g]: !s[g] }));

  const handleSelect = (promo) => {
    if (!promo.isApplicable) return;
    setInputPromoCode('');
    setApplyError('');
    setSelectedCode((prev) => (prev === promo.code ? '' : promo.code));
  };

  const applyCode = async (rawCode) => {
    const trimmed = String(rawCode || '').trim();
    if (!trimmed) {
      onApplySuccess(null);
      onClose();
      return;
    }

    setIsLoading(true);
    setApplyError('');
    try {
      const res = await couponService.applyCoupon({
        code: trimmed,
        orderTotal: Number(orderTotal),
        skuIds
      });

      const coupon = res.data?.coupon;
      
      onApplySuccess(coupon);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Mã không hợp lệ';
      toast.error(msg);
      setApplyError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-100 rounded-lg shadow-xl flex flex-col w-full max-w-sm"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative py-3 text-center border-b border-gray-200 flex-shrink-0">
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
                  if (applyError) {
                    setApplyError('');
                  }
                }}
                placeholder="Nhập mã giảm giá"
                className={`w-full px-3 py-2 border ${applyError ? 'border-red-500' : 'border-gray-300'} rounded-sm text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none`}
              />
              {applyError && <p className="text-xs text-red-500 mt-1">{applyError}</p>}
            </div>
            <button
              onClick={() => applyCode(inputPromoCode.trim().toUpperCase())}
              disabled={!inputPromoCode.trim() || isLoading}
              className="flex-shrink-0 bg-primary text-white font-semibold py-2 px-4 rounded-sm hover:opacity-90 disabled:bg-gray-400"
            >
              {isLoading && !selectedCode && inputPromoCode.trim() ? <FiLoader className="animate-spin" /> : 'Áp dụng'}
            </button>
          </div>

          {/* Danh sách coupon */}
          {isLoading && availablePromos.length === 0 ? (
            <p className="text-center py-10">Đang tải...</p>
          ) : availablePromos.length > 0 ? (
            Object.entries(groupedPromos).map(([group, promos]) => {
              const isOpen = expandedGroups[group];
              const visibleList = isOpen ? promos : promos.slice(0, 2);
              const hiddenCount = promos.length - visibleList.length;

              return (
                <div key={group} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm text-gray-800">{group}</h4>
                    <span className="text-xs text-gray-500">Áp dụng tối đa: 1</span>
                  </div>
                  <div className="space-y-3">
                    {visibleList.map((p) => (
                      <CouponCard key={p.id} promo={p} isSelected={selectedCode === p.code} onSelect={handleSelect} />
                    ))}
                  </div>

                  {promos.length > 2 && (
                    <button onClick={() => toggleGroup(group)} className="mt-2 mx-auto flex items-center text-primary text-sm font-medium">
                      {isOpen ? (
                        <>
                          Thu gọn <FiChevronUp className="ml-1" />
                        </>
                      ) : (
                        <>
                          Xem thêm ({hiddenCount}) <FiChevronRight className="ml-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 px-4">
              <FaTicketAlt className="mx-auto text-5xl text-gray-300" />
              <p className="mt-4 text-sm font-medium text-gray-600">Rất tiếc, không có ưu đãi nào khả dụng.</p>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="p-4 bg-white border-t flex-shrink-0">
          <button
            onClick={() => applyCode(selectedCode)}
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:opacity-90 disabled:bg-gray-400 flex items-center justify-center"
          >
            {isLoading && selectedCode ? <FiLoader className="animate-spin" /> : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );

  let root = document.getElementById('modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
  }

  return ReactDOM.createPortal(modalContent, root);
};

export default PromoModal;