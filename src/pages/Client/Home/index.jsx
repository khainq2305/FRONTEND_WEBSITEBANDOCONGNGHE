import React, { useState, useEffect } from 'react';
import moment from 'moment';

import SliderBanner from './SliderBanner';
import ProductCategorySection from './ProductCategorySection';
import ViewedProductsSlider from './ViewedProductsSlider';
import FreshProductSlider from './FreshProductSlider';
import PromoGridSection from './PromoGridSection';
import MainBannerSlider from './MainBannerSlider';
import TwoRowMarketSlider from './TwoRowMarketSlider';
import StickyBannerItem from './StickyBannerItem';
import { formatCurrencyVND } from '../../../utils/formatCurrency';
import { bannerService } from '../../../services/client/bannerService';
import { flashSaleService } from '../../../services/client/flashSaleService';
import { sectionService } from '../../../services/client/sectionService';

import { API_BASE_URL } from '../../../constants/environment';

const HomePage = () => {
  const [sections, setSections] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [stickyBanners, setStickyBanners] = useState([]);

  const constructImageUrl = (path) => {
    if (!path) {
      return 'https://placehold.co/300x300/e2e8f0/94a3b8?text=No+Image';
    }
    if (path.startsWith('http')) {
      return path;
    }
    return `${API_BASE_URL}${path}`;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [sectionsRes, flashSalesRes, stickyBannersRes] = await Promise.all([
          sectionService.list(),
          flashSaleService.list(),
          bannerService.getByType('banner-left-right')
        ]);

        setSections(sectionsRes.data?.data || []);
        setFlashSales(flashSalesRes.data.data || []);
        setStickyBanners(stickyBannersRes.data?.data || []);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang chủ:', error);
      }
    };
    fetchAllData();
  }, []);

  const leftBanner = stickyBanners[0];
  const rightBanner = stickyBanners[1];

  return (
    <div className="w-full bg-gray-100 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-x-5">
      <div className="hidden xl:flex justify-end items-start pl-5">
        <StickyBannerItem banner={leftBanner} />
      </div>
      <main className="w-full max-w-[1200px] flex flex-col gap-4 py-4">
        <section>
          <SliderBanner />
        </section>
        <section>
          <ProductCategorySection />
        </section>
        <section>
          <ViewedProductsSlider />
        </section>
        <section>
          <PromoGridSection />
        </section>

        {flashSales.map((saleEvent) => {
          if (!saleEvent || !saleEvent.flashSaleItems || saleEvent.flashSaleItems.length === 0) return null;

          const productsForSlider = saleEvent.flashSaleItems.map((item) => {
            const sku = item.sku || {};
            const product = sku.product || {};
            const originalPrice = sku.originalPrice || 0;
            const salePrice = item.salePrice || 0;

            const isGloballyOutOfStock = (sku.stock || 0) <= 0;
            const hasReachedLimit = (item.userPurchaseCount || 0) >= (item.limitPerUser || 1);
            const skuMedia = sku.ProductMedia || [];
            const imageUrl = skuMedia.length > 0 ? skuMedia[0].mediaUrl : product.thumbnail;

            return {
              id: product.id,
              productId: product.id,
              name: product.name || 'N/A',
              slug: product.slug,
              price: formatCurrencyVND(salePrice),

              oldPrice: originalPrice > 0 ? formatCurrencyVND(originalPrice) : null,

              discount: originalPrice > salePrice ? Math.round(100 - (salePrice * 100) / originalPrice) : 0,
              image: constructImageUrl(imageUrl),
              rating: parseFloat(product.averageRating) || 0,
              inStock: !isGloballyOutOfStock && !hasReachedLimit,
              soldCount: parseInt(product.soldCount) || 0,
              quantity: item.quantity || 0
            };
          });

          return (
            <section key={saleEvent.id}>
              <TwoRowMarketSlider
                productsInput={productsForSlider}
                imageBannerUrl={saleEvent.bannerUrl}
                endTime={saleEvent.endTime}
                bgColor={saleEvent.bgColor}
              />
            </section>
          );
        })}

        {sections.map((section) => {
          if (!section.products || section.products.length === 0) return null;

          const productsForSlider = section.products
            .map((product) => {
              const skus = product.skus || [];
              if (skus.length === 0) return null;

              const isProductInStock = skus.some((s) => (s.stock || 0) > 0);
              const displaySku = skus.find((s) => (s.stock || 0) > 0) || skus[0];
              const oldPriceNum = parseFloat(displaySku.originalPrice);
              const finalPriceNum = parseFloat(displaySku.price);

              return {
                id: displaySku.id,
                productId: product.id,
                name: product.name || 'N/A',
                slug: product.slug,
                badge: product.badge || null,
                price: formatCurrencyVND(finalPriceNum),
                oldPrice: oldPriceNum > 0 ? formatCurrencyVND(oldPriceNum) : null,
                image: constructImageUrl(displaySku.ProductMedia?.[0]?.url || product.thumbnail),
                discount: oldPriceNum > finalPriceNum ? Math.round(100 - (finalPriceNum * 100) / oldPriceNum) : 0,
                rating: parseFloat(product.averageRating) || 0,
                soldCount: parseInt(product.soldCount) || 0,
                inStock: isProductInStock
              };
            })
            .filter((p) => p && p.id);

          if (productsForSlider.length === 0 && (!section.banners || section.banners.length === 0)) return null;

          return (
            <section key={section.id}>
              <FreshProductSlider
                title={section.title}
                bannersData={section.banners || []}
                productsData={productsForSlider}
                linkedCategories={section.linkedCategories || []}
              />
            </section>
          );
        })}

        <section>
          <MainBannerSlider />
        </section>
      </main>
      <div className="hidden xl:flex justify-start items-start pr-5">
        <StickyBannerItem banner={rightBanner} />
      </div>
    </div>
  );
};

export default HomePage;
