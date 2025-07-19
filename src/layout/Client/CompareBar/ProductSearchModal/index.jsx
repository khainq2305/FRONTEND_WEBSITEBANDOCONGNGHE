import React, { useEffect, useState } from 'react';
import { productViewService } from '../../../../services/client/productViewService';
import { useCompareStore } from '@/stores/useCompareStore';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline';

const ProductSearchModal = ({
  isOpen,
  onClose,
  targetCategoryId,
  onProductChange,
  showToast, // ✅ THÊM DÒNG NÀY
}) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [recentlyViewedProduct, setRecentlyViewedProduct] = useState(null);
    const [isRecentlyViewedLoading, setIsRecentlyViewedLoading] = useState(false);

    // State cho thông báo hiển thị trên modal
   
    // State cho modal xác nhận khi đổi danh mục
    const [showConfirmReplaceModal, setShowConfirmReplaceModal] = useState(false);
    const [productToConfirmReplace, setProductToConfirmReplace] = useState(null);

    const compareItems = useCompareStore((state) => state.compareItems);
    const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
    const addToCompare = useCompareStore((state) => state.addToCompare);
    const clearCompare = useCompareStore((state) => state.clearCompare);
    const setCompareItems = useCompareStore((state) => state.setCompareItems); // Thêm setCompareItems

    // Hàm hiển thị thông báo tùy chỉnh
   const showCustomMessage = (messageText) => {
  if (typeof showToast === 'function') {
    showToast(messageText);
  }
};


    // Hàm chuẩn hóa cấu trúc sản phẩm để đảm bảo có topLevelId và topLevelName
    const normalizeProductData = (product) => {
        if (!product) return null;

        // Đảm bảo thuộc tính 'image' luôn tồn tại và có giá trị ưu tiên từ thumbnail, imageUrl, hoặc image gốc
        const imageUrl = product.thumbnail || product.imageUrl || product.image || 'https://placehold.co/64x64/e2e8f0/94a3b8?text=No+Image';

        // Chuẩn hóa category object
        const category = {
            id: product.category?.id || null,
            name: product.category?.name || 'Unknown Category',
            // Ưu tiên topLevelId từ API, nếu không có, dùng id của category hoặc null
            topLevelId: product.category?.topLevelId || product.category?.id || null, 
            topLevelName: product.category?.topLevelName || product.category?.name || 'Unknown Top Level',
        };

        return {
            ...product,
            image: imageUrl,
            category: category
        };
    };

    useEffect(() => {
        if (isOpen && targetCategoryId) {
            setIsRecentlyViewedLoading(true);
            console.log("Modal useEffect: Fetching recently viewed product for categoryId:", targetCategoryId); // DEBUG
            productViewService.getRecentlyViewedByCategoryLevel1(targetCategoryId)
                .then((response) => {
                    console.log("Modal useEffect: Raw response for recently viewed:", response); // DEBUG
                    const product = response?.data?.product;
                    const normalizedProduct = normalizeProductData(product); // Chuẩn hóa dữ liệu
                    setRecentlyViewedProduct(normalizedProduct);
                    console.log("Modal useEffect: recentlyViewedProduct state set to:", normalizedProduct); // DEBUG
                })
                .catch((error) => {
                    console.error('❌ Lỗi khi lấy sản phẩm đã xem gần nhất:', error);
                    setRecentlyViewedProduct(null);
                })
                .finally(() => {
                    setIsRecentlyViewedLoading(false);
                });
       } else if (!isOpen) {
    setSearchTerm('');
    setSearchResults([]);
    setRecentlyViewedProduct(null);
    // ⛔ Đừng reset thông báo ở đây
    // setCustomMessage({ show: false, text: '' });
    setShowConfirmReplaceModal(false);
    setProductToConfirmReplace(null);
    console.log("Modal useEffect: Modal closed, resetting state."); // DEBUG
}

    }, [isOpen, targetCategoryId]);

    useEffect(() => {
        const controller = new AbortController();

        if (searchTerm.length > 1) {
            const delay = setTimeout(() => {
                setIsLoadingSearch(true);
                console.log("Modal useEffect: Searching for keyword:", searchTerm, "categoryId:", targetCategoryId); // DEBUG
                productViewService
                    .searchForCompare({ keyword: searchTerm, page: 1, limit: 10, categoryId: targetCategoryId })
                    .then((res) => {
                        console.log("Modal useEffect: Raw search response:", res); // DEBUG
                        const productsWithFullCategory = (res.data.products || []).map(p => normalizeProductData(p)); // Chuẩn hóa từng sản phẩm
                        setSearchResults(productsWithFullCategory);
                        console.log("Modal useEffect: Search results after processing:", productsWithFullCategory); // DEBUG
                    })
                    .catch((err) => {
                        console.error('❌ Lỗi tìm kiếm:', err);
                        setSearchResults([]);
                    })
                    .finally(() => {
                        setIsLoadingSearch(false);
                    });
            }, 400);

            return () => {
                clearTimeout(delay);
                controller.abort();
            };
        } else {
            setSearchResults([]);
            console.log("Modal useEffect: Search term too short or empty, clearing search results."); // DEBUG
        }
    }, [searchTerm, targetCategoryId]);

    const handleCompareButtonClick = (product) => {
        // Đảm bảo product được chuẩn hóa ngay tại đây trước khi xử lý
        const normalizedProduct = normalizeProductData(product);

        const existingProductInCompare = compareItems.find(item => item && item.id === normalizedProduct.id);
        const currentCompareCount = compareItems.filter(Boolean).length;

        // Lấy sản phẩm đầu tiên thực sự tồn tại trong danh sách so sánh
        const firstExistingCompareItem = compareItems.find(item => item !== null);
 const firstCompareItemCategoryId = firstExistingCompareItem?.category?.id;
const productCategoryId = normalizedProduct.category?.id;
        console.log("--- handleCompareButtonClick Debug (Modal) ---");
        console.log("Product to add (input to this function):", {
            id: normalizedProduct.id,
            name: normalizedProduct.name,
            categoryId: normalizedProduct.category?.id,
            categoryName: normalizedProduct.category?.name,
            topLevelId: normalizedProduct.category?.topLevelId,
            topLevelName: normalizedProduct.category?.topLevelName,
            image: normalizedProduct.image 
        });
        if (firstExistingCompareItem) {
            console.log("First Compare Item in store:", {
                id: firstExistingCompareItem.id,
                name: firstExistingCompareItem.name,
                categoryId: firstExistingCompareItem.category?.id,
                categoryName: firstExistingCompareItem.category?.name,
                topLevelId: firstExistingCompareItem.category?.topLevelId,
                topLevelName: firstExistingCompareItem.category?.topLevelName,
                image: firstExistingCompareItem.image
            });
        } else {
            console.log("No existing compare items to check top-level category against.");
        }
        console.log("Is product already existing in compare list:", existingProductInCompare);
        console.log("Current number of compare items in store:", currentCompareCount);

        if (existingProductInCompare) {
            removeFromCompare(normalizedProduct.id);
            showCustomMessage("Đã bỏ sản phẩm khỏi danh sách so sánh.");
        } else {
            const productToStore = normalizedProduct; // Sử dụng sản phẩm đã được chuẩn hóa
if (currentCompareCount > 0) {
  if (firstCompareItemCategoryId !== productCategoryId) {
    clearCompare();
    addToCompare(productToStore);
    showCustomMessage(`Đã xóa các sản phẩm cũ và thêm "${productToStore.name}" vào danh sách so sánh.`);
    if (onClose) onClose(); // ✅ ĐÓNG MODAL
    return;
  } else {
    if (currentCompareCount < 3) {
      addToCompare(productToStore);
      showCustomMessage("Đã thêm sản phẩm vào danh sách so sánh.");
      if (onClose) onClose(); // ✅ ĐÓNG MODAL khi cùng danh mục
    } else {
      showCustomMessage("Bạn chỉ có thể so sánh tối đa 3 sản phẩm.");
    }
  }
} else {
  addToCompare(productToStore);
  showCustomMessage("Đã thêm sản phẩm vào danh sách so sánh.");
  if (onClose) onClose(); // ✅ ĐÓNG MODAL khi là sản phẩm đầu tiên
}


// 👇 ADD THIS LINE
useCompareStore.getState().setIsCompareBarCollapsed(false);

if (onProductChange) onProductChange();

// ✅ Chỉ đóng modal nếu là hành động thêm thành công
// Nếu là hành động THÊM (không phải xoá) => đóng modal
// ✅ Chỉ đóng modal nếu là hành động thêm (không phải xoá)
if (!existingProductInCompare) {
  if (onClose) onClose(); // 🔥 ĐÓNG trong mọi trường hợp thêm (kể cả cùng danh mục)
}


        }
       
        
    };

    const handleConfirmReplace = (confirm) => {
        if (confirm && productToConfirmReplace) {
            clearCompare();
            addToCompare(productToConfirmReplace);
            showCustomMessage(`Đã xóa các sản phẩm cũ và thêm "${productToConfirmReplace.name}" vào danh sách so sánh.`);
        } else {
            showCustomMessage("Hủy bỏ thao tác thêm sản phẩm.");
        }
        setShowConfirmReplaceModal(false);
        setProductToConfirmReplace(null);
        if (onProductChange) {
            onProductChange();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000]">
            <div className="bg-white rounded-tl-lg rounded-bl-lg rounded-br-lg shadow-xl w-full max-w-lg p-6 relative">
                {/* Custom Message Display */}
              
                <button
                    style={{ right: '43px' }}
                    className="absolute top-[-37px] translate-x-1/2 bg-white border border-gray-200 shadow-md text-gray-600 hover:text-gray-800 flex items-center space-x-1 text-sm px-4 py-2 rounded-t-lg cursor-pointer z-50 transform hover:scale-105 transition-transform duration-200"
                    onClick={onClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Đóng</span>
                </button>

                <h2 className="text-lg font-semibold mb-4">Sản phẩm đã xem gần nhất (cùng danh mục)</h2>

                {isRecentlyViewedLoading ? (
                    <p className="text-center text-blue-600">Đang tải sản phẩm đã xem...</p>
                ) : recentlyViewedProduct ? (
                    <div className="flex items-center justify-between mb-4 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center flex-1">
                            <img
                                src={recentlyViewedProduct.image} // Đã được chuẩn hóa bởi normalizeProductData
                                alt={recentlyViewedProduct.name}
                                className="w-16 h-16 object-contain mr-3"
                            />
                            <div>
                                <p className="text-sm font-medium">{recentlyViewedProduct.name}</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-xs text-red-600 font-semibold">
                                        {typeof recentlyViewedProduct.price === 'number'
                                            ? `${recentlyViewedProduct.price.toLocaleString('vi-VN')}₫`
                                            : '—'}
                                    </p>
                                    {recentlyViewedProduct.originalPrice &&
                                        recentlyViewedProduct.originalPrice > recentlyViewedProduct.price && (
                                            <p className="text-xs text-gray-500 line-through">
                                                {recentlyViewedProduct.originalPrice.toLocaleString('vi-VN')}₫
                                            </p>
                                        )}
                                </div>
                            </div>
                        </div>
                        <button
                            className={`ml-3 text-blue-600 hover:underline text-xs flex items-center p-2 rounded hover:bg-blue-50 transition-colors ${
                                compareItems.some(item => item && item.id === recentlyViewedProduct.id)
                                    ? 'text-blue-600 font-bold'
                                    : 'text-gray-600'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCompareButtonClick(recentlyViewedProduct);
                            }}
                        >
                            {compareItems.some(item => item && item.id === recentlyViewedProduct.id) ? (
                                <>
                                    <CheckIcon className="h-4 w-4 mr-1 text-blue-600" />
                                    <span>Đã thêm</span>
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    <span>So sánh</span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mb-4">Không có sản phẩm đã xem gần nhất trong danh mục này.</p>
                )}

                <p className="text-center text-gray-500 my-4">Hoặc nhập tên để tìm</p>

                {/* Search input */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tên sản phẩm để tìm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Search results */}
                {isLoadingSearch && <p className="text-center text-blue-600">Đang tìm kiếm...</p>}
                {!isLoadingSearch && searchTerm.length > 1 && searchResults.length > 0 && (
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                        {searchResults.map((product) => {
                            const isProductInCompare = compareItems.some(item => item && item.id === product.id);

                            return (
                                <div
                                    key={product.id}
                                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                    <img src={product.image} alt={product.name} className="w-12 h-12 object-contain mr-3" /> {/* Đã được chuẩn hóa bởi normalizeProductData */}
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{product.name}</p>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-xs text-red-600 font-semibold">
                                                {typeof product.price === 'number'
                                                    ? `${product.price.toLocaleString('vi-VN')}₫`
                                                    : '—'}
                                            </p>
                                            {product.originalPrice &&
                                                product.originalPrice > product.price && (
                                                    <p className="text-xs text-gray-500 line-through">
                                                        {product.originalPrice.toLocaleString('vi-VN')}₫
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                    <button
                                        className={`ml-3 text-xs flex items-center p-2 rounded transition-colors ${
                                            isProductInCompare
                                                ? 'text-blue-600 font-bold hover:text-blue-700 hover:bg-blue-50'
                                                : 'text-gray-600 hover:text-blue-700 hover:bg-gray-100'
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCompareButtonClick(product);
                                        }}
                                    >
                                        {isProductInCompare ? (
                                            <>
                                                <CheckIcon className="h-4 w-4 mr-1 text-blue-600" />
                                                <span>Đã thêm</span>
                                            </>
                                        ) : (
                                            <>
                                                <PlusIcon className="h-4 w-4 mr-1" />
                                                <span>So sánh</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
                {!isLoadingSearch && searchTerm.length > 1 && searchResults.length === 0 && (
                    <p className="text-center text-gray-500">Không tìm thấy sản phẩm nào.</p>
                )}
            </div>

            {/* Confirmation Modal */}
            {showConfirmReplaceModal && productToConfirmReplace && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1001]">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
                        <h3 className="text-lg font-semibold mb-4">Xác nhận thay thế sản phẩm</h3>
                        <p className="text-gray-700 mb-6">
                            Sản phẩm "{productToConfirmReplace.name}" thuộc danh mục "{productToConfirmReplace.category?.topLevelName || productToConfirmReplace.category?.name}" khác với các sản phẩm hiện có trong danh sách so sánh.
                            Bạn có muốn xóa tất cả sản phẩm cũ và thêm sản phẩm này không?
                        </p>
                        <div className="flex justify-around space-x-4">
                            <button
                                className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                onClick={() => handleConfirmReplace(true)}
                            >
                                Xóa & Thêm mới
                            </button>
                            <button
                                className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                                onClick={() => handleConfirmReplace(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductSearchModal;
