// Breadcrumb.js
import React, { useState, useEffect, useRef } from 'react';
import { HomeIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

export default function Breadcrumb({ categoryName = 'Danh mục', categorySlug = '' }) {
  const [isSticky, setIsSticky] = useState(false);
  const breadcrumbRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={breadcrumbRef}
      className={`sticky top-0 z-10 transition-all duration-200 ease-in-out 
        ${isSticky ? 'bg-white border-b border-gray-200 shadow-sm' : 'bg-transparent border-b border-transparent'}`}
    >
      <div className="max-w-[1280px] mx-auto px-4 text-sm text-gray-600 py-2 flex items-center">
        <HomeIcon
          className="w-4 h-4 mr-1.5 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <span
          className="hover:text-blue-600 cursor-pointer"
          onClick={() => navigate('/')}
        >
          Trang chủ
        </span>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-gray-800">
          {categoryName}
        </span>
      </div>
    </div>
  );
}
