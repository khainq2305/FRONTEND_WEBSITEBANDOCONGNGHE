import React, { useState } from 'react';
import ProductCard from '../ProductCard';
import MUIPagination from '@/components/common/Pagination';
import MiddleToast from '@/components/common/MiddleToast'; // ⚠️ Đảm bảo import đúng path

export default function ProductList({
  products = [],
  categoryInfo = {},
  favorites = [],
  onToggleFavorite = () => {},
  loading = false,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 20,
  onPageChange = () => {},
  onOpenCompareBar
}) {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  return (
    <>
      {toastMessage && (
        <MiddleToast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Đang tải sản phẩm...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Không tìm thấy sản phẩm nào.</div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((item) => (
              <ProductCard
                key={item.id}
                {...item}
                categoryId={categoryInfo.id}
                categoryName={categoryInfo.name}
                isFavorite={favorites.includes(item.id)}
                onAddToFavorites={onToggleFavorite}
                onCompareAction={onOpenCompareBar}
                showToast={showToast} // ✅ THÊM DÒNG NÀY
              />
            ))}
          </div>

          {totalItems > itemsPerPage && (
            <div className="mt-8 flex justify-center">
              <MUIPagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
