import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FiX, FiInfo } from 'react-icons/fi';
import { couponService } from '../../../../services/client/couponService'; 
import defaultShippingIcon from '../../../../assets/Client/images/image 12.png'; 
import defaultDiscountIcon from '../../../../assets/Client/images/pngtree-voucher-discount-png-image_4613299.png'; 

const PromoModal = ({
  modalTitle = "Có nhiêu tiền đó cũng nhập mã??",
  onClose,
  appliedCode = "", 
  onApply,
  skuId,
}) => {
  const [availablePromos, setAvailablePromos] = useState([]);
  const [selectedCode, setSelectedCode] = useState('');
  const [inputPromoCode, setInputPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

useEffect(() => {
  if (appliedCode && availablePromos.length > 0) {
    const match = availablePromos.find(c => c.code === appliedCode);
    if (match) {
      setSelectedCode(match.code); 
    }
  }
}, [appliedCode, availablePromos]); 

  useEffect(() => {
    const fetchCoupons = async () => {
      setIsLoading(true);
      try {
        const res = await couponService.getAvailable(skuId ? `?skuId=${skuId}` : '');
        const couponsFromApi = res.data?.data || [];
        const mapped = couponsFromApi.map((coupon) => {
          let iconSrc = null;
          if (coupon.bannerUrl) {
            iconSrc = coupon.bannerUrl;
          } 
          else {
            if (coupon.discountType === 'shipping') {
              iconSrc = defaultShippingIcon;
            } else { 
              iconSrc = defaultDiscountIcon;
            }
          }

          return {
            id: coupon.code,
            code: coupon.code,
            type: coupon.discountType,
            title: coupon.title || coupon.code,
            description: `Cho đơn hàng từ ${coupon.minOrderAmount?.toLocaleString()}đ`,
            expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' }) : null,
            isApplicable: coupon.isApplicable,
            iconSrc: iconSrc, 
          };
        });
        setAvailablePromos(mapped);
        localStorage.setItem("availableCoupons", JSON.stringify(mapped)); 
      } catch (err) {
        console.error("Lỗi khi lấy danh sách coupons:", err);
        alert('Không thể tải danh sách khuyến mãi. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };
    
    document.body.style.overflow = 'hidden';
    fetchCoupons();
    return () => { document.body.style.overflow = 'unset'; };
  }, [skuId]);

  const handleSelect = (promo) => {
    if (!promo.isApplicable) return;
    setInputPromoCode('');
    setSelectedCode(prev => prev === promo.code ? '' : promo.code);
  };

  const handleConfirm = () => {
    const codeToApply = inputPromoCode.trim().toUpperCase() || selectedCode;
    
    if (!codeToApply) {
        onApply(''); 
        onClose();
        return;
    }
    onApply(codeToApply);
    onClose();
  };

  const groupedPromos = availablePromos.reduce((acc, promo) => {
    const key = promo.type === 'shipping' ? 'Mã Vận Chuyển' : 'Mã Giảm Giá';
    acc[key] = acc[key] || [];
    acc[key].push(promo);
    return acc;
  }, {});

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-md flex flex-col" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="relative text-center py-3 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-800">{modalTitle}</h3>
          <button onClick={onClose} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800">
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <input
              value={inputPromoCode}
              onChange={(e) => {
                  setInputPromoCode(e.target.value.toUpperCase());
                  setSelectedCode('');
              }}
              placeholder="Nhập mã giảm giá tại đây"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />

          {isLoading ? <p className="text-center py-10">Đang tải...</p> : 
            Object.entries(groupedPromos).map(([groupName, promos]) => (
              <div key={groupName}>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">{groupName}</h4>
                    <span className="text-xs text-gray-500">Áp dụng tối đa: 1</span>
                </div>
                <div className="space-y-3">
                  {promos.map((promo) => {
                    const isSelected = selectedCode === promo.code;
                    return (
                      <div
                        key={promo.id}
                        onClick={() => handleSelect(promo)}
                        className={`relative w-full flex bg-white rounded-md shadow-sm overflow-hidden transition-all duration-200 ${promo.isApplicable ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'} ${isSelected ? 'border-2 border-blue-500' : 'border-2 border-transparent'}`}
                      >
                        <div className="w-24 flex-shrink-0 relative bg-white flex items-center justify-center p-2">
                          
                          <img 
                            src={promo.iconSrc} 
                            alt="promo icon" 
                            className="w-full h-full object-contain" 
                            onError={(e) => { e.target.onerror = null; e.target.src = defaultDiscountIcon; }} // Fallback cuối cùng nếu URL lỗi
                          />
                          <div className="absolute top-0 right-0 h-full w-px bg-[repeating-linear-gradient(to_bottom,#e5e7eb,#e5e7eb_4px,transparent_4px,transparent_8px)]"></div>
                        </div>
                        <div className="flex-1 p-3 flex justify-between items-center">
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
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 transform -rotate-12">
                                    <div className="border-2 border-gray-400 rounded-md px-2 py-1">
                                        <span className="text-xs text-center font-bold text-gray-400">CHƯA THOẢ ĐIỀU KIỆN</span>
                                    </div>
                                </div>
                            ) : isSelected ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleSelect(promo); }}
                                  className="bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-sm"
                                >
                                  Bỏ chọn
                                </button>
                            ) : (
                                <div className="w-5 h-5 border-2 border-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          }
        </div>

       
        <div className="p-4 bg-white border-t flex-shrink-0">
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Đang tải...' : 'Xác nhận'}
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