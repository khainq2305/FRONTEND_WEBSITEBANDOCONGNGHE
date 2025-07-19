import React, { useState, useEffect } from 'react';
import ProductHeaderComparison from './ProductHeaderComparison';
import QuickCompareSection from './QuickCompareSection';
import ProductFeaturesSection from './ProductFeaturesSection';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../../../services/client/productService';
import { toast } from 'react-toastify';
import { useCompareStore } from '@/stores/useCompareStore';
import ProductSearchModal from '../../../layout/Client/CompareBar/ProductSearchModal';

function CompareProducts() {
    const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [productIds, setProductIds] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [specs, setSpecs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedProductIndexForModal, setSelectedProductIndexForModal] = useState(null);
    const [targetCategoryIdForModal, setTargetCategoryIdForModal] = useState(null);

    const compareItemsFromStore = useCompareStore((state) => state.compareItems);
    const setCompareItems = useCompareStore((state) => state.setCompareItems);
    const addToCompare = useCompareStore((state) => state.addToCompare);

    const sidebarWidthClass = 'w-full lg:w-[230px] lg:min-w-[200px]';
    const productColumnClasses = 'flex-1 min-w-0';

    const handleRemoveProduct = (idToRemove) => {
        const updatedItems = compareItemsFromStore.filter((item) => item && item.id !== idToRemove);
        setCompareItems(updatedItems);

        if (updatedItems.filter(Boolean).length === 0) {
            localStorage.removeItem('compareIds');
            window.location.href = '/';
        } else {
            const updatedIds = updatedItems.filter(Boolean).map(item => item.id);
            localStorage.setItem('compareIds', JSON.stringify(updatedIds));
            setSearchParams({ ids: updatedIds.join(',') });
        }
    };

    useEffect(() => {
        const idList = compareItemsFromStore.map(item => item ? item.id : null).filter(Boolean);

        if (idList.length === 0) {
            toast.error('Không có sản phẩm nào để so sánh. Đang chuyển hướng...');
            setLoading(false);
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
            return;
        }

        setLoading(true);
        setProductIds(idList);
        localStorage.setItem('compareIds', JSON.stringify(idList));

        productService
            .getCompareByIds(idList)
            .then((res) => {
                const fetchedProductsMap = new Map(res.data.products.map(p => [p.id, p]));
                const orderedProducts = compareItemsFromStore
                    .map(item => item ? fetchedProductsMap.get(item.id) : null)
                    .filter(Boolean)
                    .map(p => {
                        const productName = p.name || 'Sản phẩm không tên';
                        return {
                            id: p.id,
                            slug: p.slug,
                            isNew: p.isNew || false,
                            topRightBadges: p.topRightBadges || [],
                            imageUrl: p.image || p.thumbnail,
                            thumbnail: p.thumbnail,
                            nameInCard: productName,
                            nameForSidebar: productName.toUpperCase(),
                            currentPrice: p.price ? p.price.toLocaleString('vi-VN') + '₫' : 'Liên hệ',
                            originalPrice: p.oldPrice ? p.oldPrice.toLocaleString('vi-VN') + '₫' : null,
                            discountPercent: p.discount ? `${p.discount}%` : null,
                            promoText: p.promoText || null,
                            rating: p.rating || 0,
                            reviewsCount: p.soldCount ? p.soldCount.toLocaleString('vi-VN') + 'k' : '0',
                            features: p.features || {},
                            category: p.category || {},
                        };
                    });

                const finalProducts = [...orderedProducts];
                while (finalProducts.length < 3) {
                    finalProducts.push(null);
                }

                setProducts(finalProducts);
                setSpecs(res.data.specs || []);
            })
            .catch((err) => {
                console.error("Lỗi khi tải dữ liệu so sánh:", err);
                toast.error('Không thể tải dữ liệu so sánh');
                setProducts([null, null, null]);
                setSpecs([]);
            })
            .finally(() => setLoading(false));
    }, [compareItemsFromStore, setCompareItems, setSearchParams]);

    const handleToggleDifferences = () => {
        setShowOnlyDifferences(!showOnlyDifferences);
    };

    // Hàm này lọc các thông số dựa trên chế độ "chỉ hiển thị khác biệt"
    // HÀM NÀY ĐÃ ĐƯỢC CHỈNH SỬA ĐỂ TỐI ƯU HƠN VÀ XỬ LÝ CÁC TRƯỜNG HỢP NULL/UNDEFINED
    const getFilteredFeatures = (featureKey) => {
        if (!showOnlyDifferences) {
            return true; // Nếu không bật chế độ, hiển thị tất cả
        }

        // Lọc bỏ các sản phẩm null/undefined trước khi so sánh
        const validProducts = products.filter(Boolean);

        // Nếu có ít hơn 2 sản phẩm hợp lệ, không có gì để so sánh sự khác biệt
        if (validProducts.length < 2) {
            return true;
        }

        // Lấy giá trị của tính năng từ sản phẩm đầu tiên
        // Đảm bảo truy cập an toàn để tránh lỗi nếu features hoặc featureKey không tồn tại
        const firstProductFeatureValue = validProducts[0]?.features?.[featureKey];

        // Duyệt qua các sản phẩm còn lại để tìm sự khác biệt
        for (let i = 1; i < validProducts.length; i++) {
            const currentProductFeatureValue = validProducts[i]?.features?.[featureKey];

            // So sánh các giá trị:
            // 1. Nếu một trong hai là mảng và độ dài khác nhau, coi là khác biệt.
            if (Array.isArray(firstProductFeatureValue) && Array.isArray(currentProductFeatureValue)) {
                if (firstProductFeatureValue.length !== currentProductFeatureValue.length) {
                    return true;
                }
                // Nếu cùng là mảng và cùng độ dài, so sánh từng phần tử
                for (let j = 0; j < firstProductFeatureValue.length; j++) {
                    if (firstProductFeatureValue[j] !== currentProductFeatureValue[j]) {
                        return true;
                    }
                }
            }
            // 2. Nếu không phải mảng, hoặc một là mảng một không phải, so sánh trực tiếp
            // Coi undefined/null là một giá trị để so sánh khác biệt
            else if (firstProductFeatureValue !== currentProductFeatureValue) {
                return true;
            }
        }
        // Nếu duyệt hết mà không tìm thấy sự khác biệt nào
        return false;
    };


    const renderFeatureValue = (value) => {
        if (Array.isArray(value)) {
            return value.map((item, index) => <div key={index} className="text-center">{item || '-'}</div>);
        }
        return value || '-';
    };

    const handleOpenAddModal = (indexToReplace = null) => {
        setSelectedProductIndexForModal(indexToReplace);
        let categoryIdToPass = null;

        if (indexToReplace !== null && compareItemsFromStore[indexToReplace]?.category?.id) {
            categoryIdToPass = compareItemsFromStore[indexToReplace].category.id;
        } else {
            for (let i = 0; i < compareItemsFromStore.length; i++) {
                if (compareItemsFromStore[i]?.category?.id) {
                    categoryIdToPass = compareItemsFromStore[i].category.id;
                    break;
                }
            }
        }
        setTargetCategoryIdForModal(categoryIdToPass);
        setShowAddModal(true);
    };

    const handleSelectProductFromModal = (product) => {
        if (selectedProductIndexForModal !== null) {
            const newItems = [...compareItemsFromStore];
            newItems[selectedProductIndexForModal] = product;
            setCompareItems(newItems);
        } else {
            addToCompare(product);
        }
        setShowAddModal(false);
        setSelectedProductIndexForModal(null);
        setTargetCategoryIdForModal(null);
    };


    return (
        <div className="bg-[#f3f4f6] min-h-screen py-3 px-2 text-xs font-['Roboto',_sans-serif]">
            <div className="container mx-auto max-w-[1200px] bg-white border-gray-300">
                <div className="z-10 bg-white shadow-sm">
                    <ProductHeaderComparison
                        products={products}
                        specs={specs}
                        onAddProduct={handleOpenAddModal}
                        onRemoveProduct={handleRemoveProduct}
                        sidebarWidthClass={sidebarWidthClass}
                        productColumnClasses={productColumnClasses}
                        showOnlyDifferences={showOnlyDifferences}
                        onToggleDifferences={handleToggleDifferences}
                    />
                </div>

                <div className="border-b border-gray-300">
                    <QuickCompareSection
                        products={products}
                        specs={specs}
                        sidebarWidthClass={sidebarWidthClass}
                        productColumnMinWidthClass={productColumnClasses}
                    />
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Đang tải thông số...</div>
                ) : (
                    <ProductFeaturesSection
                        products={products.map((p) => {
                            if (!p) {
                                return { features: {} };
                            }
                            return {
                                ...p,
                                features: specs.reduce((acc, spec) => {
                                    acc[spec.specKey] = spec.values?.[p.id] !== undefined ? spec.values[p.id] : '-';
                                    return acc;
                                }, {})
                            };
                        })}
                        featureOrder={specs.map((s) => s.specKey)}
                        showOnlyDifferences={showOnlyDifferences}
                        onToggleDifferences={handleToggleDifferences}
                        sidebarWidthClass={sidebarWidthClass}
                        productColumnClasses={productColumnClasses}
                        getFilteredFeatures={getFilteredFeatures}
                        renderFeatureValue={renderFeatureValue}
                    />
                )}
            </div>

            <ProductSearchModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSelectProduct={handleSelectProductFromModal}
                targetCategoryId={targetCategoryIdForModal}
            />
        </div>
    );
}

export default CompareProducts;