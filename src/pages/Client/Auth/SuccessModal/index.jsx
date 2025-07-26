import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

const SuccessModal = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div
        className="relative bg-white p-6 sm:p-8 rounded-xl shadow-xl text-center w-full max-w-xs sm:max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dấu X nằm ngoài box */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
        >
          <X size={18} className="text-gray-500" />
        </button>

        <CheckCircle className="w-14 h-14 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
        <p className="text-base sm:text-lg font-medium text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal;
