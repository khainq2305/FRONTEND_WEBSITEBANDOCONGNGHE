// src/components/common/SimpleMobileModal.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const SimpleMobileModal = ({ isOpen, message, onClose, autoCloseDelay = 2000 }) => {
  if (!isOpen) return null;

  useEffect(() => {
    // Ngăn cuộn trang khi modal mở
    document.body.style.overflow = 'hidden';

    let timer;
    if (autoCloseDelay > 0) {
      timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
    }

    return () => {
      document.body.style.overflow = 'unset'; // Cho phép cuộn lại khi modal đóng
      clearTimeout(timer);
    };
  }, [isOpen, onClose, autoCloseDelay]);

  // Sử dụng ReactDOM.createPortal để render modal ngoài cây DOM chính
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-[999999]"
      // Có thể thêm onClick={onClose} ở đây nếu muốn đóng khi click ra ngoài
      // Nhưng thường với toast/thông báo nhỏ thì không cần thiết
    >
      <div className="bg-black/70 text-white rounded-md px-6 py-3 text-center pointer-events-auto">
        <p className="text-sm font-semibold whitespace-nowrap">{message}</p>
        {/* Không có nút đóng vì nó sẽ tự đóng sau một khoảng thời gian */}
      </div>
    </div>,
    document.body // Portal vào thẳng body
  );
};

export default SimpleMobileModal;