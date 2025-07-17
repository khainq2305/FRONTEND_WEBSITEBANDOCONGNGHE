import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM để sử dụng Portal

const AddToCartSuccessToast = ({ closeToast, productName, productImage, productPrice, extraMessage }) => {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Giả định màn hình mobile/tablet là <= 1024px
      setIsMobileOrTablet(window.innerWidth <= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Nếu là mobile/tablet, render một modal đơn giản bằng Portal
  if (isMobileOrTablet) {
    // Sử dụng Portal để div này được render ngoài cây DOM chính,
    // cho phép nó nổi lên trên tất cả các phần tử khác như một modal.
    return ReactDOM.createPortal(
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[999999]"
        // Auto-close sẽ xử lý việc đóng, không cần click backdrop
      >
        <div className="bg-black/70 text-white rounded-md px-6 py-6 text-center pointer-events-auto">
          <p className="text-sm font-semibold whitespace-nowrap">Sản phẩm đã được thêm vào giỏ hàng của bạn.</p>
        </div>
      </div>,
      document.body // Portal vào thẳng body
    );
  }

  // Toast chi tiết cho desktop (giữ nguyên)
  return (
    <div className="max-w-xs w-full font-sans bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden">
      <div className="bg-primary py-1 px-2 flex items-center justify-between">
        <p className="text-white text-sm font-semibold">Đã thêm vào giỏ hàng thành công!</p>
        <button
          onClick={closeToast}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-2">
        <div className="flex items-center">
          <div className="w-12 h-12 flex-shrink-0 mr-2 border border-gray-200 rounded-md p-1 bg-white">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/100x100/f0f0f0/cccccc?text=L%E1%BB%97i';
              }}
            />
          </div>

          <div className="flex-grow">
            <p className="text-xs text-gray-800 leading-snug line-clamp-2">{productName}</p>
            <p className="text-red-600 font-semibold mt-1 text-sm">{productPrice}</p>
            {extraMessage && (
              <p className="text-[11px] text-orange-500 mt-1 font-medium leading-tight">{extraMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartSuccessToast;