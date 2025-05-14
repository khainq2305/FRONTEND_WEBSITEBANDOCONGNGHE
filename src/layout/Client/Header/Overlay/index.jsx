// src/components/Overlay.jsx
import React from 'react';

const Overlay = ({ isOpen, onClick }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-40 cursor-pointer" // Độ mờ và z-index thấp hơn panel
      onClick={onClick}
      aria-hidden="true" // Quan trọng cho accessibility
    />
  );
};

export default Overlay;