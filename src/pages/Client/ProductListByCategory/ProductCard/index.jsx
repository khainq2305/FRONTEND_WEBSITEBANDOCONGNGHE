import React from 'react';
import { ArrowPathIcon as CompareIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import InStockIcon from '../../../../assets/Client/images/icon-deli.webp';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { useCompareStore } from '../../../../stores/useCompareStore';
import GiaoNhanhBadge from '@/assets/Client/images/1717405144807-Left-Tag-Giao-Nhanh.webp';
import TraGopBadge from '@/assets/Client/images/1717405144808-Left-Tag-Tra-Gop-0.webp';
import GiaTotBadge from '@/assets/Client/images/1732077440142-Left-tag-Bestprice-0.gif';
import GiaKhoBadge from '@/assets/Client/images/1739182448835-Left-tag-GK-Choice.gif';
import ThuCuDoiMoiBadge from '@/assets/Client/images/1740550907303-Left-tag-TCDM (1).webp';

export default function ProductCard({
    id,
    slug,
    name,
    priceNum,
    oldPriceNum,
    originalPriceNum,
    discount,
    image,
    badge,
    badgeImage,
    inStock,
    categoryId,
    categoryName,
    // THÊM CÁC PROP NÀY VÀ ĐẢM BẢO CHÚNG ĐƯỢC TRUYỀN TỪ COMPONENT CHA
    categoryTopLevelId,
    categoryTopLevelName,
    onCompareAction,
     showToast 
}) {
    const compareItems = useCompareStore((state) => state.compareItems);
    const addToCompare = useCompareStore((state) => state.addToCompare);
    const removeFromCompare = useCompareStore((state) => state.removeFromCompare);
    const setCompareItems = useCompareStore((state) => state.setCompareItems);

    const isAddedToCompare = compareItems.some(item => item && item.id === id);

    const calculateSavings = () => {
        const priceToCompareForSavings = oldPriceNum || originalPriceNum;
        if (!isNaN(priceNum) && !isNaN(priceToCompareForSavings) && priceToCompareForSavings > priceNum && priceToCompareForSavings > 0) {
            const diff = priceToCompareForSavings - priceNum;
            return formatCurrencyVND(diff);
        }
        return null;
    };

    const renderBadge = () => {
        if (!badge) return <div className="mb-2 h-[28px]"></div>;

        const badgeImageMap = {
  'GIAO NHANH': GiaoNhanhBadge,
  'THU CŨ ĐỔI MỚI': ThuCuDoiMoiBadge,
  'TRẢ GÓP 0%': TraGopBadge,
  'GIÁ TỐT': GiaTotBadge,
  'GIÁ KHO': GiaKhoBadge
};

        const upperCaseBadge = badge.toUpperCase();
        let imageUrl = null;

        if (upperCaseBadge.includes('GIAO NHANH')) imageUrl = badgeImageMap['GIAO NHANH'];
        else if (upperCaseBadge.includes('THU CŨ')) imageUrl = badgeImageMap['THU CŨ ĐỔI MỚI'];
        else if (upperCaseBadge.includes('TRẢ GÓP')) imageUrl = badgeImageMap['TRẢ GÓP 0%'];
        else if (upperCaseBadge.includes('GIÁ KHO'))
            imageUrl = badgeImageMap['GIÁ KHO'];
        else if (upperCaseBadge.includes('GIÁ TỐT') || upperCaseBadge.includes('BEST PRICE'))
            imageUrl = badgeImageMap['GIÁ TỐT'];

        return imageUrl ? (
            <div className="flex justify-start items-center mb-2 h-[28px]">
                <img src={imageUrl} alt={`Huy hiệu ${badge}`} className="h-[24px] object-contain" loading="lazy" />
            </div>
        ) : (
            <div className="mb-2 h-[28px]"></div>
        );
    };

 const savings =
  typeof priceNum === 'number' && priceNum > 0 &&
  typeof oldPriceNum === 'number' && oldPriceNum > priceNum
    ? formatCurrencyVND(oldPriceNum - priceNum)
    : null;

    const isProductTotallyOutOfStock = !inStock;

   const handleCompareClick = (e) => {
  e.stopPropagation();

  if (isAddedToCompare) {
    removeFromCompare(id);
    console.log("Product removed from compare:", { id, name });
  } else {
    const currentCompareCount = compareItems.filter(Boolean).length;
    const firstCompareItem = compareItems[0];

    const productToAdd = {
      id,
      slug,
      name,
      image,
      price: priceNum,
      oldPrice: oldPriceNum,
      originalPrice: originalPriceNum,
      category: {
        id: categoryId,
        name: categoryName,
        topLevelId: categoryTopLevelId,
        topLevelName: categoryTopLevelName,
      }
    };

    console.log("--- ProductCard handleCompareClick Debug ---");
    console.log("Product to add:", productToAdd);
    console.log("Compare count:", currentCompareCount);

    if (currentCompareCount === 0) {
      addToCompare(productToAdd);
      useCompareStore.getState().setOpenCompareBar(true);
      console.log("Action: Added first compare item.");
      onCompareAction?.();
    } else {
   const firstTopLevelId = firstCompareItem?.category?.topLevelId ?? firstCompareItem?.category?.id;
const currentTopLevelId = categoryTopLevelId ?? categoryId;

      if (firstTopLevelId !== currentTopLevelId) {
        // ❌ Không hỏi confirm — tự reset và thêm mới
        setCompareItems([productToAdd]);
        useCompareStore.getState().setOpenCompareBar(true);

        if (typeof showToast === 'function') {
          showToast(`Đã xoá sản phẩm cũ và thêm "${name}" vào danh sách so sánh.`);
        }

        console.log("Action: Replaced compare list with new item from different top-level category.");
        onCompareAction?.();
      } else {
        if (currentCompareCount < 3) {
          addToCompare(productToAdd);
          useCompareStore.getState().setOpenCompareBar(true);
          console.log("Action: Added product to compare (same category).");
          onCompareAction?.();
        } else {
          if (typeof showToast === 'function') {
            showToast("Chỉ có thể so sánh tối đa 3 sản phẩm.");
          } else {
            alert("Bạn chỉ có thể so sánh tối đa 3 sản phẩm. Vui lòng xóa bớt sản phẩm để thêm mới.");
          }
          console.warn("Compare full. Cannot add more.");
        }
      }
    }
  }
};


    return (
        <div className="w-full h-full flex flex-col border border-gray-200/70 rounded-lg overflow-hidden shadow-sm bg-white p-2.5 sm:p-3 relative transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 group">
            {typeof discount === 'number' && discount > 0 && (
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-25">
                    -{discount}%
                </div>
            )}

            <Link to={`/product/${slug}`} className="block">
                <div className="relative w-full h-[160px] sm:h-[200px] mb-2 flex items-center justify-center overflow-hidden">
                    {isProductTotallyOutOfStock && (
                        <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20 rounded-lg">
                            <span className="text-rose-600 font-bold text-base border-2 border-rose-500 rounded-lg px-4 py-2 transform -rotate-12 shadow-lg bg-white">
                                Hết Hàng
                            </span>
                        </div>
                    )}
                    <img
                        src={image || 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image'}
                        alt={name}
                        className={`max-h-full max-w-full object-contain transition-transform duration-300 ${
                            isProductTotallyOutOfStock ? 'grayscale opacity-80' : 'group-hover:scale-105'
                        }`}
                        loading="lazy"
                        style={{ zIndex: 10 }}
                    />
                    {badgeImage && (
                        <img
                            src={badgeImage}
                            alt="badge overlay"
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                         w-full h-full object-contain z-20 pointer-events-none select-none"
                            loading="lazy"
                        />
                    )}
                </div>

                {renderBadge()}

                <h3
                    className={`font-medium text-xs sm:text-[13px] line-clamp-2 min-h-9 sm:min-h-[25px] leading-snug sm:leading-tight mb-1 group-hover:text-blue-600 transition-colors duration-200 ${
                        isProductTotallyOutOfStock ? 'text-gray-500' : ''
                    }`}
                    title={name}
                >
                    {name}
                </h3>
            </Link>

            <div className="mt-auto flex flex-col flex-grow justify-end">
                <div className="product-card-price text-sm mb-1">
                   {typeof priceNum === 'number' && priceNum > 0 ? (
  <>
    <span className="text-red-600 text-base font-bold">{formatCurrencyVND(priceNum)}</span>
    {typeof oldPriceNum === 'number' && oldPriceNum > priceNum && (
      <span className="text-gray-400 text-[10px] sm:text-xs line-through ml-1.5">
        {formatCurrencyVND(oldPriceNum)}
      </span>
    )}
  </>
) : originalPriceNum > 0 ? (
  <span className="text-red-600 text-base font-bold">{formatCurrencyVND(originalPriceNum)}</span>
) : (
  <span className="text-gray-500 italic">Liên hệ</span>
)}

                </div>

                <div className="min-h-[20px] sm:min-h-[22px]">
                    {savings && <div className="text-green-600 text-xs">Tiết kiệm {savings}</div>}
                </div>

                <div className="flex justify-between items-center text-[10px] sm:text-xs mb-1.5 sm:mb-2 min-h-[16px] sm:min-h-[18px]">
                    <div className="min-h-[14px] sm:min-h-[16px]"></div>
                    <div className="min-h-[14px] sm:min-h-[16px]"></div>
                </div>

                <div className="product-card-actions flex items-center justify-between min-h-[26px] pt-1 relative z-25">
                    <button
                        onClick={handleCompareClick}
                        aria-label={isAddedToCompare ? "Bỏ so sánh sản phẩm" : "So sánh sản phẩm"}
                        className={`flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 hover:text-primary transition-colors focus:outline-none p-1 rounded-md ${
                            isAddedToCompare ? 'text-primary font-bold' : ''
                        }`}
                    >
                        {isAddedToCompare ? (
                            <>
                                <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                                <span className="leading-none whitespace-nowrap text-primary">Đã thêm</span>
                            </>
                        ) : (
                            <>
                                <CompareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="leading-none whitespace-nowrap">So sánh</span>
                            </>
                        )}
                    </button>

                    <div className="flex items-center gap-1 min-w-[60px] justify-end">
                        {isProductTotallyOutOfStock ? (
                            <span className="text-red-500 font-semibold text-[10px] sm:text-xs leading-none whitespace-nowrap">
                                Hết hàng
                            </span>
                        ) : (
                            <>
                                <span className="text-green-600 font-semibold text-[10px] sm:text-xs leading-none whitespace-nowrap">
                                    Còn hàng
                                </span>
                                <img src={InStockIcon} alt="Còn hàng" className="w-4 h-4 object-contain" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}