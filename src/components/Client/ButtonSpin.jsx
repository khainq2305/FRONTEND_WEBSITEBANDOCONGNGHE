// src/components/Client/ButtonSpin.jsx
import React from "react";

export default function QuayButton({ text = "Quay", className = "", style = {}, ...props }) {
  return (
    <button
      className={`relative z-[50] flex items-center justify-center rounded-full border-4 border-pink-400 bg-gradient-to-br from-yellow-300 via-pink-300 to-orange-400 text-white text-xl font-extrabold shadow-[0_0_30px_rgba(251,146,60,0.8)] hover:scale-110 transition-transform duration-300 ${className}`}
      style={style}
      {...props}
    >
      {text}
      {/* Mũi tên chỉ lên */}
      <div className="absolute -top-4 left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-[12px] border-r-[12px] border-b-[14px] border-l-transparent border-r-transparent border-b-orange-600 shadow-md" />
    </button>
  );
}