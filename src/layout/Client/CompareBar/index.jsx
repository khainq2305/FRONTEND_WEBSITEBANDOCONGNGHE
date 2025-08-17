import React, { useEffect, useState } from 'react';
import { useCompareStore } from '@/stores/useCompareStore';
import ProductSearchModal from './ProductSearchModal'; 
import { useNavigate } from 'react-router-dom';
import MiddleToast from '@/components/common/MiddleToast';

const CompareBar = () => {
  const compareItems = useCompareStore((state) => state.compareItems);
  const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
  const clearCompare = useCompareStore((state) => state.clearCompare);
  const setCompareItems = useCompareStore((state) => state.setCompareItems);

  const openCompareBar = useCompareStore((state) => state.openCompareBar);
  const setOpenCompareBar = useCompareStore((state) => state.setOpenCompareBar);

  const isCompareBarCollapsed = useCompareStore((state) => state.isCompareBarCollapsed);
  const setIsCompareBarCollapsed = useCompareStore((state) => state.setIsCompareBarCollapsed);
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const [targetCategoryId, setTargetCategoryId] = useState(null); // Đây vẫn là category ID cấp con

  const filteredCompareItems = compareItems.filter(Boolean);

  useEffect(() => {
    if (openCompareBar && isCompareBarCollapsed) {
      setIsCompareBarCollapsed(false);
      setOpenCompareBar(false);
      console.log('CompareBar: openCompareBar detected, AUTO-EXPANDING the bar.');
    }
  }, [openCompareBar, isCompareBarCollapsed]);

  useEffect(() => {
    if (filteredCompareItems.length === 0 && !isCompareBarCollapsed) {
      setIsCompareBarCollapsed(true);
      console.log('CompareBar: No compare items, forcing collapsed state.');
    }
  }, [filteredCompareItems.length, isCompareBarCollapsed]);

  const handleCompareClick = () => {
    if (filteredCompareItems.length >= 2) {
      const firstProductTopLevelCategoryId = filteredCompareItems[0]?.category?.topLevelId;
      const allSameTopLevelCategory = filteredCompareItems.every((item) => item?.category?.topLevelId === firstProductTopLevelCategoryId);

      if (allSameTopLevelCategory) {
        navigate('/compare-products');
      } else {
        console.warn('Bạn chỉ có thể so sánh các sản phẩm cùng danh mục cấp 1.');
      }
    } else {
      const currentItemsCount = filteredCompareItems.length;
      let indexToOpen = compareItems.findIndex((item) => item === null);

      if (indexToOpen === -1 && currentItemsCount < 3) {
        indexToOpen = currentItemsCount;
      } else if (indexToOpen === -1 && currentItemsCount === 3) {
        console.warn('Danh sách so sánh đã đầy (3 sản phẩm).');
        return;
      }

      handleOpenModal(indexToOpen);
    }
  };

  const toggleCollapse = () => {
    const prev = useCompareStore.getState().isCompareBarCollapsed;
    const newState = !prev;
    setIsCompareBarCollapsed(newState);
  };

  const handleOpenModal = (index) => {
    setSelectedProductIndex(index);

    const firstCompareItem = filteredCompareItems[0];
    setTargetCategoryId(firstCompareItem?.category?.id || null);
    setIsModalOpen(true);
  };

  const handleSelectProduct = (product) => {
    resetModal();
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setSelectedProductIndex(null);
    setTargetCategoryId(null);
  };

  if (filteredCompareItems.length === 0 && isCompareBarCollapsed) return null;

  return (
    <>
      <ProductSearchModal
        isOpen={isModalOpen}
        onClose={resetModal}
        onSelectProduct={handleSelectProduct}
        targetCategoryId={targetCategoryId}
        onProductChange={() => {
          if (useCompareStore.getState().filteredCompareItems.length > 0) {
            useCompareStore.getState().setIsCompareBarCollapsed(false);
          }
        }}
        showToast={(msg) => setToastMessage(msg)}
      />

      {!isModalOpen && !isCompareBarCollapsed && (
        <div
          className="fixed bottom-0 left-0 right-0 max-w-[1200px] mx-auto bg-white border-t border-gray-200 shadow-lg z-[9999] p-0"
          style={{ display: 'flex', alignItems: 'stretch', height: '8rem', width: '100%' }}
        >
          <button
            className="absolute top-[-38px] right-0 bg-white border border-gray-200 shadow-md text-gray-700 hover:text-blue-600 flex items-center space-x-1 text-sm px-4 py-2 rounded-t-lg cursor-pointer z-[9999]"
            onClick={toggleCollapse}
          >
            <span>Thu gọn</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="relative flex-1 border-r border-gray-300 flex flex-col items-center justify-center p-2 text-center h-full"
            >
              {compareItems[index] ? (
                <>
                  <button
                    className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
                    onClick={() => removeFromCompare(compareItems[index].id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <img
                    src={compareItems[index].image}
                    alt={compareItems[index].name}
                    className="max-h-[70%] max-w-full object-contain mb-1"
                  />
                  <div className="text-xs px-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{compareItems[index].name}</div>
                </>
              ) : (
                <div className="text-gray-400 text-center cursor-pointer" onClick={() => handleOpenModal(index)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-xs mt-1">Thêm sản phẩm</span>
                </div>
              )}
            </div>
          ))}

          <div className="flex-1 flex flex-col items-center justify-center h-full space-y-2">
            <button
              className={`px-6 py-2 rounded text-white font-semibold w-full max-w-[150px] ${
                filteredCompareItems.length >= 2 ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={handleCompareClick}
              disabled={filteredCompareItems.length < 2}
            >
              So sánh ngay
            </button>
            <button className="text-blue-600 hover:underline text-sm" onClick={clearCompare}>
              Xoá tất cả sản phẩm
            </button>
          </div>
        </div>
      )}

      {isCompareBarCollapsed && filteredCompareItems.length > 0 && (
        <div className="fixed bottom-4 left-4 z-[9999]">
          <button
            className="bg-white text-[#007aff] border border-[#007aff] rounded-full px-3 py-1.5 shadow-md flex items-center space-x-1 text-sm font-medium hover:bg-[#f0f8ff] transition"
            onClick={toggleCollapse}
            style={{ touchAction: 'manipulation', cursor: 'pointer' }}
          >
            <i className="fa-solid fa-code-compare"></i>
            <span>So sánh ({filteredCompareItems.length})</span>
          </button>
        </div>
      )}
      {toastMessage && <MiddleToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </>
  );
};

export default CompareBar;
