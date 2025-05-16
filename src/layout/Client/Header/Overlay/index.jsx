// src/components/Overlay.jsx
import React from 'react';

const Overlay = ({ isOpen, onClick }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
      onClick={onClick}
      aria-hidden="true" 
    />
  );
};

export default Overlay;