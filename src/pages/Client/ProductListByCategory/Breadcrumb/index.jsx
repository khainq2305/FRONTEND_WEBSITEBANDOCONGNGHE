// Breadcrumb.js
import React, { useState, useEffect, useRef } from 'react';
import { HomeIcon } from '@heroicons/react/24/solid'; 

export default function Breadcrumb() {
  const [isSticky, setIsSticky] = useState(false);
  const breadcrumbRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (breadcrumbRef.current) {
        if (window.scrollY > 10) { 
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={breadcrumbRef}
      className={`sticky top-0 z-10 transition-all duration-200 ease-in-out 
        ${isSticky ? "bg-white border-b border-gray-200 shadow-sm" : "bg-transparent border-b border-transparent"}`}
    >
      <div className="max-w-[1280px] mx-auto px-4 text-sm text-gray-600 py-2 flex items-center">
   
        <HomeIcon 
          className={`w-4 h-4 mr-1.5 ${isSticky ? 'text-gray-500' : 'text-gray-500'}`} 
        />
        <span className={`${isSticky ? 'text-gray-500' : 'text-gray-500'} hover:text-blue-600 cursor-pointer`}>Trang chủ</span> 
        <span className="mx-1.5">/</span>
        <span className={`${isSticky ? 'text-gray-800' : 'text-gray-700'} font-medium`}>Điện thoại</span>
      </div>
    </div>
  );
}