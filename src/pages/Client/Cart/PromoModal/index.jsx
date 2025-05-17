// src/components/Client/PromoModal.jsx
import React, { useState, useEffect } from 'react'; // Thêm useEffect
import ReactDOM from 'react-dom'; // THÊM IMPORT NÀY
import { FiX } from 'react-icons/fi';

const sampleAvailablePromos = [
  { id: 'SALE10', name: 'Giảm 10% đơn hàng', description: 'Áp dụng cho tất cả sản phẩm.' },
  { id: 'FREESHIP', name: 'Miễn phí vận chuyển', description: 'Cho đơn hàng từ 200.000đ.' },
  { id: 'NEWUSER', name: 'Ưu đãi người mới', description: 'Giảm 50.000đ cho đơn đầu tiên.' },
];

const PromoModal = ({ onClose, onApply, availablePromos = sampleAvailablePromos }) => {
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [inputPromoCode, setInputPromoCode] = useState('');

  // Ngăn cuộn trang nền khi modal mở
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleApplyClick = () => {
    if (selectedPromo) {
      onApply(selectedPromo.id);
    } else if (inputPromoCode.trim() !== '') {
      onApply(inputPromoCode.trim());
    } else {
      alert('Vui lòng chọn hoặc nhập mã ưu đãi.');
    }
  };

  // Nội dung JSX của modal
  const modalContent = (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] px-4 py-6 sm:p-0 " // Giữ z-index cao
      onClick={onClose} // Đóng khi click ra ngoài
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full sm:max-w-lg mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Ngăn đóng khi click vào modal
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Chọn hoặc nhập mã ưu đãi</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={22} />
          </button>
        </div>

        {/* Content Modal */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[calc(100vh-180px)] sm:max-h-[500px] overflow-y-auto">
          {availablePromos && availablePromos.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-600">Ưu đãi có sẵn cho bạn:</h4>
              {availablePromos.map((promo) => (
                <label
                  key={promo.id}
                  htmlFor={`promo-${promo.id}`}
                  className={`block p-3 border rounded-md cursor-pointer transition-all ${
                    selectedPromo?.id === promo.id
                      ? 'border-primary ring-1 ring-primary bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start sm:items-center">
                    <input
                      type="radio"
                      id={`promo-${promo.id}`}
                      name="promoOption"
                      value={promo.id}
                      checked={selectedPromo?.id === promo.id}
                      onChange={() => {
                        setSelectedPromo(promo);
                        setInputPromoCode('');
                      }}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 mr-3 mt-1 sm:mt-0"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{promo.name}</p>
                      <p className="text-xs text-gray-500">{promo.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div className="relative pt-3 pb-1">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-xs sm:text-sm text-gray-500">Hoặc</span>
            </div>
          </div>

          <div>
            <label htmlFor="promoCodeInput" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Nhập mã ưu đãi khác
            </label>
            <input
              type="text"
              id="promoCodeInput"
              value={inputPromoCode}
              onChange={(e) => {
                setInputPromoCode(e.target.value);
                setSelectedPromo(null);
              }}
              placeholder="Nhập mã tại đây"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
            />
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-4 sm:px-5 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={handleApplyClick}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-5 sm:px-6 rounded-md transition-colors text-sm"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  );

  // Sử dụng ReactDOM.createPortal để render modal vào #modal-root
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById('modal-root')
  );
};

export default PromoModal;