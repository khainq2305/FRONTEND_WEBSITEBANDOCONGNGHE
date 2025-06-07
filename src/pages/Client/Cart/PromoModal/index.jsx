import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FiX, FiInfo, FiTag, FiTruck } from 'react-icons/fi';
import { couponService } from "../../../../services/client/couponService";

const PromoModal = ({ modalTitle = "Hồng Ân Khuyến Mãi", onClose, onApply }) => {
  const [availablePromos, setAvailablePromos] = useState([]);
  const [selectedCode, setSelectedCode] = useState(null);
  const [inputPromoCode, setInputPromoCode] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    couponService.getAvailable()
      .then((res) => {
        const list = res.data?.data || [];
        const mapped = list.map(coupon => ({
          id: coupon.code,
          type: coupon.discountType === 'shipping' ? 'shipping' : 'discount',
          iconType: coupon.discountType === 'shipping' ? 'truck' : 'tag',
          title: coupon.title || coupon.code,
          description: `Cho đơn từ ${coupon.minOrderAmount?.toLocaleString()}₫`,
          expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('vi-VN') : null,
          isApplicable: coupon.isApplicable
        }));
        setAvailablePromos(mapped);
      })
      .catch(err => {
        console.error("❌ Lỗi khi tải mã giảm giá:", err);
      });

    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSelect = (promo) => {
    if (!promo.isApplicable) return;
    setInputPromoCode('');
    setSelectedCode(prev => (prev === promo.id ? null : promo.id));
  };

  const handleApply = () => {
    const codeToApply = inputPromoCode.trim().toUpperCase() || selectedCode;
    if (codeToApply) return onApply(codeToApply);
    alert('Vui lòng chọn hoặc nhập mã ưu đãi.');
  };

  const groupedPromos = availablePromos.reduce((acc, promo) => {
    const key = promo.type === 'shipping' ? 'Miễn Phí Vận Chuyển' : 'Mã Giảm Giá';
    acc[key] = acc[key] || [];
    acc[key].push(promo);
    return acc;
  }, {});

  const PromoIcon = ({ type, className }) =>
    type === 'truck' ? <FiTruck className={className} /> : <FiTag className={className} />;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center px-4 py-6" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{modalTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={22} />
          </button>
        </div>

        {/* Nhập mã */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-2">
            <input
              value={inputPromoCode}
              onChange={(e) => {
                setInputPromoCode(e.target.value.toUpperCase());
                setSelectedCode(null);
              }}
              placeholder="Nhập mã ưu đãi"
              className="w-full px-3 py-2 border rounded text-sm focus:ring-primary focus:outline-none"
            />
            <button
              onClick={handleApply}
              className="bg-gray-100 hover:bg-gray-200 text-sm font-semibold px-4 rounded"
            >
              Áp dụng
            </button>
          </div>
        </div>

        {/* Danh sách mã */}
        <div className="p-4 space-y-6 max-h-[400px] overflow-y-auto">
          {Object.entries(groupedPromos).map(([groupName, promos]) => (
            <div key={groupName} className="space-y-3">
              <h4 className="font-semibold text-gray-700">{groupName}</h4>
              {promos.map((promo) => {
                const isSelected = selectedCode === promo.id;
                return (
                  <div
                    key={promo.id}
                    onClick={() => handleSelect(promo)}
                    className={`flex items-stretch border rounded-md overflow-hidden cursor-pointer transition-all 
                      ${isSelected ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'} 
                      ${!promo.isApplicable && 'bg-gray-100 opacity-60 cursor-not-allowed'}
                    `}
                  >
                    {/* Icon trái */}
                    <div
                      className={`w-20 flex-shrink-0 flex items-center justify-center p-2 
                        ${promo.type === 'shipping' ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      <PromoIcon type={promo.iconType} className="text-white h-8 w-8" />
                    </div>

                    {/* Nội dung */}
                    <div className="flex-1 p-3 pr-2">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-sm text-gray-800">{promo.title}</p>
                        <FiInfo className="text-gray-400" size={14} />
                      </div>
                      <p className="text-xs text-gray-500">{promo.description}</p>
                      {promo.expiryDate && (
                        <p className="text-xs text-gray-400 mt-1">HSD: {promo.expiryDate}</p>
                      )}
                    </div>

                    {/* Bên phải */}
                    <div className="w-24 flex items-center justify-center p-2 border-l">
                      {!promo.isApplicable ? (
                        <span className="text-[10px] text-gray-500 px-1 py-0.5 rounded bg-gray-200 transform -rotate-12 font-bold text-center leading-tight">
                          CHƯA THOẢ <br /> ĐIỀU KIỆN
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(promo);
                          }}
                          className={`w-full text-xs font-medium py-1.5 rounded 
                            ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                        >
                          {isSelected ? 'Bỏ chọn' : 'Áp dụng'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 text-right">
          <button
            onClick={handleApply}
            className="bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2 rounded text-sm"
          >
            Áp dụng
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
