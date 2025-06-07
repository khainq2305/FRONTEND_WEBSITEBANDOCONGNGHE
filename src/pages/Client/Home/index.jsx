import React, { useState, useEffect } from "react";
import moment from 'moment'; // ✅ THÊM DÒNG NÀY

import SliderBanner from "./SliderBanner";
import ProductCategorySection from "./ProductCategorySection";
import ViewedProductsSlider from "./ViewedProductsSlider";
import FreshProductSlider from "./FreshProductSlider";
import PromoGridSection from "./PromoGridSection";
import MainBannerSlider from "./MainBannerSlider";
import TwoRowMarketSlider from "./TwoRowMarketSlider";

import { flashSaleService } from '../../../services/client/flashSaleService';
import { wishlistService } from '../../../services/client/wishlistService';
import { sectionService } from "../../../services/client/sectionService";

const HomePage = () => {
    const [sections, setSections] = useState([]);
    const [flashSales, setFlashSales] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // --- CÁC LOGIC FETCH VÀ TOGGLE FAVORITES (GIỮ NGUYÊN) ---
    useEffect(() => {
        sectionService.list()
            .then(res => {
                const data = res.data?.data || [];
                const validSections = data.filter(s =>
                    (s.products?.length || 0) > 0 &&
                    s.products.some(p => p.skus && p.skus.length > 0)
                );
                setSections(validSections);
            })
            .catch(err => {
                console.error("Lỗi khi tải sections cho HomePage:", err);
                setSections([]);
            });
    }, []);

    useEffect(() => {
        const fetchFlashSales = async () => {
            try {
                const response = await flashSaleService.list();
                setFlashSales(response.data.data || []);
            } catch (err) {
                console.error("Lỗi khi tải Flash Sale:", err);
                setFlashSales([]);
            }
        };
        fetchFlashSales();
    }, []);
    
    const handleToggleFavorite = async (productId) => {
        try {
            const productIdInt = parseInt(productId);
            if (favorites.includes(productIdInt)) {
                await wishlistService.remove(productIdInt);
                setFavorites((prev) => prev.filter((id) => id !== productIdInt));
            } else {
                await wishlistService.add(productIdInt);
                setFavorites((prev) => [...prev, productIdInt]);
            }
        } catch (err) {
            console.error("❌ Toggle favorite lỗi:", err);
        }
    };

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await wishlistService.getAll();
                const ids = res.data.filter(item => item?.product?.id).map(item => item.product.id);
                setFavorites(ids);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách yêu thích:", err);
            }
        };
        fetchFavorites();
    }, []);


    return (
        <>
            {/* --- CÁC KHỐI KHÁC CỦA TRANG WEB --- */}
            <div className="flex justify-center px-2 py-2 bg-gray-100"><div className="max-w-screen-xl w-full mx-auto"><SliderBanner /></div></div>
            <div className="flex justify-center px-2 py-2 bg-gray-100"><div className="max-w-screen-xl w-full mx-auto"><ProductCategorySection /></div></div>
            <div className="flex justify-center px-2 py-2 bg-gray-100"><div className="max-w-screen-xl w-full mx-auto flex flex-col gap-6 items-start"><ViewedProductsSlider /></div></div>
            <div className="flex justify-center px-2 py-2 bg-gray-100"><div className="max-w-screen-xl w-full mx-auto flex flex-col gap-6 items-start"><PromoGridSection /></div></div>
            
            {/* ✅✅✅ KHỐI CODE FLASH SALE ĐÃ SỬA LẠI - THAY THẾ KHỐI CŨ ✅✅✅ */}
            {flashSales.map(saleEvent => {
    if (!saleEvent || !saleEvent.flashSaleItems || saleEvent.flashSaleItems.length === 0) {
        return null;
    }

    const productsForSlider = saleEvent.flashSaleItems.map(item => {
        const sku = item.sku || {};
        const product = sku.product || {};
        const originalPrice = sku.price || 0;
        const salePrice = item.salePrice || 0;

        return {
            id: product.id,
            name: product.name || "N/A",
            price: salePrice.toLocaleString('vi-VN'),
            oldPrice: originalPrice > 0 ? originalPrice.toLocaleString('vi-VN') : null,
            image: product.thumbnail || 'https://placehold.co/300x300',
            discount: originalPrice > salePrice ? Math.round(100 - (salePrice * 100 / originalPrice)) : 0,
            rating: product.averageRating || 4.5,
            inStock: sku.stock > 0,
            soldCount: product.soldCount || item.quantity || 0,
            isFavorite: favorites.includes(product.id),
            slug: product.slug,
        };
    });

    const saleTimeText = `CHỈ DIỄN RA TỪ ${moment(saleEvent.startTime).format('DD/MM')} - ${moment(saleEvent.endTime).format('DD/MM')}`;

    return (
        <div key={saleEvent.id} className="flex justify-center px-2 py-2 bg-gray-100 w-full">
            <div className="max-w-screen-xl w-full mx-auto">
                <TwoRowMarketSlider
                    productsInput={productsForSlider}
                    imageBannerUrl={saleEvent.bannerUrl}
                    saleTimeText={saleTimeText}
                    bgColor={saleEvent.bgColor}
                    onToggleFavorite={handleToggleFavorite}
                />
            </div>
        </div>
    );
})}

            
            {/* --- PHẦN RENDER CÁC KHỐI FreshProductSlider TỪ API (giữ nguyên) --- */}
            {sections.map(section => {
                // ... logic render FreshProductSlider của anh giữ nguyên ...
                if (!section.products || section.products.length === 0) {
                    return null;
                }
                const productsForSlider = section.products.map(product => {
                    const sku = (product.skus && product.skus.length > 0) ? product.skus[0] : {};
                    const oldPriceNum = parseFloat(sku.originalPrice);
                    const finalPriceNum = parseFloat(sku.price);
                    
                    return {
                        id: sku.id,
                        productId: product.id,
                        name: product.name || "N/A",
                        slug: product.slug,
                        price: finalPriceNum,
                        oldPrice: oldPriceNum,
                        image: product.thumbnail || 'https://placehold.co/300x300',
                        discount: oldPriceNum > finalPriceNum ? Math.round(100 - (finalPriceNum * 100 / oldPriceNum)) : 0,
                        rating: product.averageRating || 5,
                        inStock: (sku.stock || 0) > 0,
                        soldCount: product.soldCount || 0,
                        isFavorite: favorites.includes(product.id),
                    };
                }).filter(p => p.id);

                if (productsForSlider.length === 0 && (!section.banners || section.banners.length === 0)) {
                    return null;
                }

                return (
                    <div key={section.id} className="flex justify-center px-2 py-2 bg-gray-100 w-full">
                        <div className="max-w-screen-xl w-full mx-auto">
                           <FreshProductSlider
                                title={section.title}
                                bannersData={section.banners || []}
                                productsData={productsForSlider}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        </div>
                    </div>
                );
            })}
            
            {/* --- CÁC KHỐI KHÁC CỦA TRANG WEB --- */}
            <div className="flex justify-center py-2 bg-gray-100">
                <div className="max-w-screen-xl w-full mx-auto flex flex-col gap-6 items-start">
                    <MainBannerSlider />
                </div>
            </div>
        </>
    );
};

export default HomePage;