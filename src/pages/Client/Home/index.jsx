import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { useShallow } from 'zustand/react/shallow';
import io from 'socket.io-client';
import LuckyWheel from '@/components/Client/LuckyWheel';

import SliderBanner from './SliderBanner';
import ProductCategorySection from './ProductCategorySection';
import ViewedProductsSlider from './ViewedProductsSlider';
import FreshProductSlider from './FreshProductSlider';
import PromoGridSection from './PromoGridSection';
import MainBannerSlider from './MainBannerSlider';
import HorizontalProductSlider from './TwoRowMarketSlider';
import StickyBannerItem from './StickyBannerItem';
import { formatCurrencyVND } from '../../../utils/formatCurrency';
import { bannerService } from '../../../services/client/bannerService';
import { flashSaleService } from '../../../services/client/flashSaleService';
import { sectionService } from '../../../services/client/sectionService';
import RecommendedProductsSection from './RecommendedProductsSection';

import { API_BASE_URL } from '../../../constants/environment';
import useAuthStore from '../../../stores/AuthStore';

const HomePage = () => {
  const [sections, setSections] = useState([]);
  const [flashSales, setFlashSales] = useState([]);
  const [stickyBanners, setStickyBanners] = useState([]);

  const {
    user,
    loading: authLoading,
    fetchUserInfo
  } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      loading: state.loading,
      fetchUserInfo: state.fetchUserInfo
    }))
  );

  const userId = user ? user.id : null;
  useEffect(() => {
    const socket = io(API_BASE_URL, {
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
    });

    socket.on('flash-sale-updated', () => {
      console.log('Đã nhận sự kiện cập nhật flash sale, đang reload...');
      flashSaleService
        .list()
        .then((res) => setFlashSales(res.data.data || []))
        .catch((err) => console.error('Lỗi khi reload Flash Sale:', err));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

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

        console.log('Sections:', sectionsRes.data);
        console.log('FlashSales:', flashSalesRes.data);
        console.log('StickyBanners:', stickyBannersRes.data);

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
    <div className="w-full bg-gray-100 overflow-x-hidden">
      <div className="xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-x-4">
        <div className="hidden xl:flex justify-end items-start">
          <StickyBannerItem banner={leftBanner} />
        </div>
        <main className="w-full max-w-[1200px] mx-auto flex flex-col gap-4 py-4">
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

          {Array.isArray(flashSales) && flashSales.length > 0 && (
            <section>
              <HorizontalProductSlider flashSales={flashSales} bgColor="#007BFF" />
            </section>
          )}

          {!authLoading && userId && (
            <section>
              <RecommendedProductsSection userId={userId} />
            </section>
          )}
          {sections.map((section) => {
            if (!section.products || section.products.length === 0) return null;

            const productsForSlider = section.products
              .map((product) => {
                // Lấy defaultSku đã được tính toán và gán ở backend
                const displaySku = product.defaultSku;

                if (!displaySku) return null; // Nếu không có SKU nào để hiển thị, bỏ qua sản phẩm này

                const isProductInStock = (displaySku.stock || 0) > 0;
                const mediaImage = displaySku.ProductMedia?.find((m) => m.type === 'image')?.mediaUrl;

                // Lấy giá đã được xử lý từ backend (price đã là giá cuối cùng)
                const finalPriceNum = parseFloat(displaySku.price);
                // originalPrice cũng được backend xử lý để thể hiện giá gốc hoặc giá trước khuyến mãi
                const oldPriceNum = parseFloat(displaySku.originalPrice);

                // Tính toán discount dựa trên originalPrice (giá ban đầu của SKU hoặc giá mặc định) và finalPriceNum
                const discount = oldPriceNum > finalPriceNum && oldPriceNum > 0 ? Math.round(100 - (finalPriceNum * 100) / oldPriceNum) : 0;

                return {
                  id: displaySku.id, // ID của SKU
                  productId: product.id,
                  name: product.name || 'N/A',
                  badgeImage: product.badgeImage ? constructImageUrl(product.badgeImage) : null,
                  slug: product.slug,
                  badge: product.badge || null,
                  price: formatCurrencyVND(finalPriceNum),
                  oldPrice: oldPriceNum > finalPriceNum ? formatCurrencyVND(oldPriceNum) : null, // Chỉ hiển thị oldPrice nếu có giảm giá
                  image: constructImageUrl(mediaImage || product.thumbnail),
                  discount: discount,
                  rating: parseFloat(product.rating) || 0,
                  soldCount: parseInt(product.soldCount) || 0,
                  inStock: isProductInStock,
                  sortOrder: product.ProductHomeSection?.sortOrder ?? 0,
                  flashSaleInfo: displaySku.flashSaleInfo || null, // Truyền thông tin flash sale
                  currentPrice: finalPriceNum // Truyền giá thực tế để so sánh
                };
              })
              .filter((p) => p && p.id) // Lọc bỏ các sản phẩm không có displaySku
              .sort((a, b) => a.sortOrder - b.sortOrder);

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
        <div className="hidden xl:flex justify-start items-start">
          <StickyBannerItem banner={rightBanner} />
        </div>
      </div>
      <LuckyWheel />
    </div>
  );
};

export default HomePage;
