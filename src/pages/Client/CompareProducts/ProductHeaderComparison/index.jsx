import React from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

const ProductHeaderComparison = ({
  products = [],
  onRemoveProduct,
  sidebarWidthClass,
  productColumnClasses,
}) => {
  const columnsToRender = [...products];
  while (columnsToRender.length < 3) {
    columnsToRender.push(null); // Thêm slot trống
  }

  return (
    <div className="flex border-b border-gray-300">
      {/* Sidebar cột nhãn */}
      <div
        className={`${sidebarWidthClass} flex-shrink-0 border-r border-gray-300 bg-white p-2 flex items-center`}
      >
        <span className="font-semibold text-xs text-gray-700 uppercase">
          So sánh sản phẩm
        </span>
      </div>

      {/* Danh sách sản phẩm + slot trống */}
      <div className="flex-grow grid grid-cols-3 bg-white">
        {columnsToRender.map((product, index) => (
          <div
            key={product?.id || `empty-${index}`}
            className={`${productColumnClasses} relative border-r border-gray-300 p-2 flex flex-col items-center justify-center`}
          >
            {product ? (
              <>
                {/* Nút X xoá */}
                {products.length > 1 && (
                  <button
                    onClick={() => onRemoveProduct(product.id)}
                    className="absolute top-1 right-1 text-gray-400 hover:text-red-600"
                    title="Xoá khỏi so sánh"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}

                <div className="text-[13px] font-medium text-gray-800 mt-5 text-center">
                  {product.name || "-"}
                </div>
                <div className="my-2 w-full flex justify-center">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="max-h-28 object-contain"
                  />
                </div>
              </>
            ) : (
              // Slot thêm mới
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <PlusIcon className="w-6 h-6 mb-1" />
                <p className="text-xs text-center">Thêm sản phẩm</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductHeaderComparison;
