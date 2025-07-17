import React from 'react';
import { FaArrowUp, FaArrowDown, FaFire } from 'react-icons/fa';

export default function SortOptions({ currentSortOption, onApplySort }) {
    const buttonBaseClass = 'border-gray-300 text-gray-700 hover-primary';
    const buttonSelectedClass = 'bg-primary border-primary text-white font-semibold shadow-sm';

    const handleSortChange = (value) => {
        onApplySort(value);
    };

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 w-full">
            <span className="font-semibold text-sm sm:text-[15px] mr-1 text-gray-800 flex items-center py-2 leading-none flex-shrink-0">Sắp xếp theo:</span>
            {[
                { key: 'popular', label: 'Phổ biến', icon: <FaFire className="text-[1em]" /> },
                { key: 'asc', label: 'Giá tăng dần', icon: <FaArrowUp className="text-[1em]" /> },
                { key: 'desc', label: 'Giá giảm dần', icon: <FaArrowDown className="text-[1em]" /> },
            ].map((option) => (
                <div key={option.key} className="flex-shrink-0">
                    <button
                        className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md flex items-center gap-1.5 transition-all duration-200 ease-in-out border leading-none ${
                            currentSortOption === option.key ? buttonSelectedClass : buttonBaseClass
                        }`}
                        onClick={() => handleSortChange(option.key)}
                    >
                        {option.label} {option.icon}
                    </button>
                </div>
            ))}
        </div>
    );
}