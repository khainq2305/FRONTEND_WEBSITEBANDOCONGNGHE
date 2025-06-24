// src/components/common/Breadcrumb.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react'; // Icon mũi tên phải

const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) {
    return null; // Không hiển thị gì nếu không có item nào
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight size={16} className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-1 md:mx-2" />
            )}
            {item.href ? (
              <a
                href={item.href}
                className={`inline-flex items-center text-sm font-medium ${
                  index === items.length - 1
                    ? 'text-gray-700 dark:text-gray-300' // Màu cho item cuối (active)
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ) : (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;