import React from 'react';
import ProductFilters from '../ProductFilters'; // Đảm bảo đúng đường dẫn
import SortOptions from '../SortOptions'; // Đảm bảo đúng đường dẫn

export default function SortBar({ sticky, currentFilters, onApplyFilters, currentSortOption, onApplySort, brandOptions = [] }) {
    // Biến để kiểm tra xem có bất kỳ bộ lọc nào đang được áp dụng không
    const hasActiveFilters = currentFilters.stock || currentFilters.price || currentFilters.brand.length > 0;

    return (
        <div
            className={`bg-white ${sticky ? 'sticky top-0 z-20 shadow-md' : 'shadow-sm'} p-2 sm:p-3 md:p-4 rounded-lg mb-4 transition-shadow duration-200 flex flex-col gap-y-3`}
        >
            <ProductFilters
                currentFilters={currentFilters}
                onApplyFilters={onApplyFilters}
                brandOptions={brandOptions}
            />

            {hasActiveFilters && (
                <div className="w-full pt-3 border-t border-gray-200 mt-2"></div>
            )}

            <SortOptions
                currentSortOption={currentSortOption}
                onApplySort={onApplySort}
            />
        </div>
    );
}