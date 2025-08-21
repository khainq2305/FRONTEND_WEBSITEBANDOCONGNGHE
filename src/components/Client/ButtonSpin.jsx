import React from "react";

export default function QuayButton({ text = "Quay", className = "", style = {}, ...props }) {
  return (
    <button
      className={`relative z-[50] flex items-center justify-center rounded-full border-4 border-yellow-300 bg-white text-black text-2xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.7)] ${className}`}
      style={style}
      {...props}
    >
      {text}
      {/* Mũi tên trắng chỉ lên */}
      <div className="absolute -top-4 left-1/2 h-0 w-0 -translate-x-1/2 transform border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-yellow-300" />
    </button>
  );
}
