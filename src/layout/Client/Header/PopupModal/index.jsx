import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ANIMATION_DURATION_MS = 300;

const PopupModal = ({ isOpen, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);

      const fadeInTimer = setTimeout(() => {
        setIsAnimatingIn(true);
      }, 20);
      return () => clearTimeout(fadeInTimer);
    } else {
      setIsAnimatingIn(false);

      const fadeOutTimer = setTimeout(() => {
        setIsRendered(false);
      }, ANIMATION_DURATION_MS);
      return () => clearTimeout(fadeOutTimer);
    }
  }, [isOpen]);

  const handleOverlayClickClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  if (!isRendered) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50
                  transition-opacity bg-black/50  ${''}
                  ${isAnimatingIn && isOpen ? 'opacity-100 ease-out' : 'opacity-0 ease-in'}
                  duration-300`}
      onClick={handleOverlayClickClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-modal-title"
    >
      <div
        className={`bg-white rounded-xl p-6 sm:p-8 w-[90vw] max-w-[400px] text-center relative shadow-2xl 
                    transition-all duration-300  ${''}
                    ${
                      isAnimatingIn && isOpen
                        ? 'opacity-100 transform scale-100 translate-y-0 ease-out'
                        : 'opacity-0 transform scale-95 translate-y-10 ease-in'
                    }`}
        onClick={handleContentClick}
      >
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors duration-150"
          onClick={onClose}
          aria-label="Đóng modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <img
          src="src/assets/Client/images/Logo/snapedit_1749613755235 1 (2).png"
          alt="Smember"
          className="w-100 h-45 mx-auto mb-4 object-cover"
        />

        <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
          Vui lòng đăng nhập tài khoản để
          <br />
          xem ưu đãi và thanh toán dễ dàng hơn.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            className="w-full px-4 py-2.5 border-2 border-primary text-primary font-medium rounded-lg 
               hover:bg-primary hover:text-white hover:border-primary 
               focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
               transition-all duration-200 transform active:scale-95"
            onClick={() => {
              if (onClose) onClose();
              navigate('/dang-ky');
            }}
          >
            Đăng ký
          </button>

          <button
            className="w-full px-4 py-2.5 bg-primary text-white font-medium rounded-lg 
               hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50
               shadow-md hover:shadow-lg
               transition-all duration-200 transform active:scale-95"
            onClick={() => {
              if (onClose) onClose();
              navigate('/dang-nhap');
            }}
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
