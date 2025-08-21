// components/common/MiddleToast.jsx
import React, { useEffect } from 'react';

const MiddleToast = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className="fixed top-1/2 left-1/2 z-[99999] -translate-x-1/2 -translate-y-1/2
                 bg-black bg-opacity-80 text-white text-sm px-4 py-2 rounded shadow-lg
                 animate-toastFade"
    >
      {message}
    </div>
  );
};

export default MiddleToast;
