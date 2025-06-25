import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight
                size={16}
                className="w-4 h-4 text-gray-400 dark:text-gray-500 mx-1 relative top-[1px]"
              />
            )}
            {item.href ? (
              <a
                href={item.href}
                className={`inline-flex items-center text-sm ${
                  index === items.length - 1
                    ? 'text-gray-800 font-semibold dark:text-gray-100' // đậm hơn cho item cuối
                    : 'text-gray-600 font-medium hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ) : (
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
