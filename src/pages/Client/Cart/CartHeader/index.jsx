import React, { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import Loader from "@/components/common/Loader";
const CartHeader = ({
  isAllChecked,
  onToggleAll,
  totalItems,
  onDeleteSelected,
  hasSelectedItems,
}) => {
  const [isSelectingAll, setIsSelectingAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

   const handleToggleAll = async () => {
    if (isSelectingAll) return;
    try {
      setIsSelectingAll(true);
      await onToggleAll?.();
    } finally {
      setIsSelectingAll(false);
    }
  };

  const handleDeleteSelected = async () => {
  if (!hasSelectedItems || isDeleting) return;
  try {
    setIsDeleting(true);
    await onDeleteSelected?.();
  } finally {
    setIsDeleting(false);
  }
};
  return (
    <>
   {isSelectingAll && <Loader fullscreen />}

      {/* Mobile */}
      <div className="flex items-center justify-between h-12 border-b border-gray-200 text-sm text-gray-500 px-4 sm:hidden">
        <div onClick={handleToggleAll} className="flex items-center gap-2 cursor-pointer">
          <div
            className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-colors flex-shrink-0 ${
              isAllChecked ? 'bg-primary border-primary' : 'border-gray-400 bg-white'
            }`}
          >
            {isAllChecked && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <span className="min-w-0 truncate font-semibold text-gray-800">
            Tất cả ({totalItems} sản phẩm)
          </span>
        </div>

        <button
          onClick={handleDeleteSelected}
          className={`h-full px-2 transition-colors flex-shrink-0 flex items-center justify-center ${
            hasSelectedItems && !isDeleting
              ? 'text-gray-500 hover:text-red-600'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Xóa các mục đã chọn"
          disabled={!hasSelectedItems || isDeleting}
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiTrash2 size={20} />
          )}
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden sm:grid grid-cols-[40px_minmax(0,1fr)_140px_100px_140px_40px] items-center h-12 border-b border-gray-200 text-sm text-gray-500 px-4">
        <div className="flex items-center justify-start h-full col-start-1 col-end-2">
          <div
            className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-colors flex-shrink-0 ${
              isAllChecked ? 'bg-primary border-primary' : 'border-gray-400 bg-white'
            } cursor-pointer`}
            onClick={handleToggleAll}
          >
            {isAllChecked && <span className="text-white text-xs font-bold">✓</span>}
          </div>
        </div>

        <div className="flex items-center h-full col-start-2 col-end-3 pl-2">
          <span
            onClick={handleToggleAll}
            className="min-w-0 truncate font-semibold text-gray-800 cursor-pointer"
          >
            Tất cả ({totalItems} sản phẩm)
          </span>
        </div>

        <span className="text-center font-medium col-start-3 col-end-4">Đơn giá</span>
        <span className="text-center font-medium col-start-4 col-end-5">Số lượng</span>
        <span className="text-center font-medium col-start-5 col-end-6">Thành tiền</span>

        <button
          onClick={handleDeleteSelected}
          className={`w-full h-full px-2 transition-colors flex-shrink-0 flex items-center justify-center col-start-6 col-end-7 ${
            hasSelectedItems && !isDeleting
              ? 'text-gray-500 hover:text-red-600'
              : 'text-gray-300 cursor-not-allowed'
          }`}
          title="Xóa các mục đã chọn"
          disabled={!hasSelectedItems || isDeleting}
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FiTrash2 size={20} />
          )}
        </button>
      </div>
    </>
  );
};

export default CartHeader;
