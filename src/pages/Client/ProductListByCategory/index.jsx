// src/pages/client/ProductListByCategory/index.js

import { useEffect, useRef, useState } from 'react';
import Banner from './Banner';
import FilterBar from './FilterBar';
import SortBar from './SortBar';
import Description from './Description';
import Breadcrumb from './Breadcrumb';
import ViewedProducts from './ViewedProducts';
import ProductList from './ProductList';
import { productService } from '../../../services/client/productService';
import { brandService } from '../../../services/client/brandService';
import { categoryService } from '../../../services/client/categoryService';
import { wishlistService } from '../../../services/client/wishlistService';
import { bannerService } from '../../../services/client/bannerService'; // Thêm import
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';

const ITEMS_PER_PAGE = 20;

export default function ProductListByCategory() {
  const [filters, setFilters] = useState({ stock: false, price: null, brand: [] });
  const [sortOption, setSortOption] = useState('popular');
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [paginationEnabled, setPaginationEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isStickySortBar, setIsStickySortBar] = useState(false);
  const [categoryName, setCategoryName] = useState('Danh mục');
  const [brands, setBrands] = useState([]);
  
  // State mới cho banner và categoryId
  const [banners, setBanners] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  const sortBarRef = useRef();
  const slug = window.location.pathname.split('/').pop();

  // Lấy tên và ID của danh mục
  const fetchCategoryName = async () => {
    try {
      const res = await categoryService.getBySlug(slug);
      const cat = res.data;
      const name = cat.parent?.name || cat.name || 'Danh mục';
      setCategoryName(name);
      setCategoryId(cat.id); // Lưu lại ID
    } catch (err) {
      console.error('❌ Không lấy được tên danh mục:', err);
      setCategoryName('Danh mục');
    }
  };

  // Hàm mới để lấy banner theo categoryId
  const fetchCategoryBanners = async () => {
    if (!categoryId) return;
    try {
      const res = await bannerService.getByCategoryId(categoryId);
      setBanners(res.data?.data || []);
    } catch (err) {
      console.error('❌ Lỗi khi lấy banner danh mục:', err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await wishlistService.getAll();
      const ids = res.data
        .filter(item => item && item.product && item.product.id)
        .map(item => item.product.id);
      setFavorites(ids);
    } catch (err) {
      console.error('❌ Lỗi khi lấy wishlist:', err);
    }
  };

  const handleToggleFavorite = async (productId) => {
    try {
      if (favorites.includes(productId)) {
        await wishlistService.remove(productId);
        setFavorites((prev) => prev.filter((id) => id !== productId));
        toast.info('Đã xoá khỏi yêu thích');
      } else {
        await wishlistService.add(productId);
        setFavorites((prev) => [...prev, productId]);
        toast.success('Đã thêm vào yêu thích');
      }
    } catch (err) {
      console.error('❌ Toggle wishlist thất bại:', err);
      toast.error('Lỗi khi cập nhật yêu thích!');
    }
  };

  const fetchProducts = async (page = 1) => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await productService.getByCategory({
        slug,
        page,
        limit: ITEMS_PER_PAGE,
        brand: filters.brand,
        stock: filters.stock,
        priceRange: filters.price,
        sort: sortOption
      });

      const raw = res.data.products || [];
      const formatted = raw.map((item) => {
        const sku = item.skus?.[0] || {};
        const price = sku.price ?? 0;
        const originalPrice = sku.originalPrice ?? 0;
        const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;

        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          image: sku.media?.[0]?.mediaUrl || item.thumbnail,
          price: price.toLocaleString('vi-VN'),
          oldPrice: originalPrice ? originalPrice.toLocaleString('vi-VN') : null,
          discount,
          rating: item.rating || 0,
          inStock: sku.stock > 0,
          soldCount: Math.floor(Math.random() * 1000),
          isFavorite: favorites.includes(item.id)
        };
      });

      setProducts(formatted);
      setTotalItems(res.data.totalItems);
      setPaginationEnabled(res.data.paginationEnabled);
    } catch (err) {
      console.error('❌ Lỗi gọi API:', err);
      setProducts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // useEffect để lấy thông tin chung ban đầu
  useEffect(() => {
    fetchCategoryName();
    fetchFavorites();
  }, [slug]);

  // useEffect riêng để lấy banner sau khi đã có categoryId
  useEffect(() => {
    fetchCategoryBanners();
  }, [categoryId]);

  // useEffect để lấy danh sách brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await brandService.getAll();
        setBrands(res.data || []);
      } catch (err) {
        console.error('❌ Lỗi khi tải thương hiệu:', err);
      }
    };
    fetchBrands();
  }, [slug]);

  // useEffect để gọi lại sản phẩm khi filter/sort thay đổi
  useEffect(() => {
    fetchProducts(1);
    setCurrentPage(1);
  }, [filters, sortOption, slug, favorites]);

  // useEffect để theo dõi vị trí thanh sort
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickySortBar(!entry.isIntersecting);
      },
      { rootMargin: '-64px 0px 0px 0px' }
    );

    if (sortBarRef.current) observer.observe(sortBarRef.current);
    return () => sortBarRef.current && observer.unobserve(sortBarRef.current);
  }, []);

  return (
    <main className="w-full flex justify-center">
      <div className="w-full max-w-screen-xl px-4">
        {!isStickySortBar && <Breadcrumb categoryName={categoryName} categorySlug={slug} />}
        
        <Banner banners={banners} />
        
        <FilterBar categorySlug={slug} filters={filters} setFilters={setFilters} />
        <div ref={sortBarRef} />
        <SortBar
          sticky={isStickySortBar}
          currentFilters={filters}
          onApplyFilters={setFilters}
          currentSortOption={sortOption}
          onApplySort={setSortOption}
          brandOptions={brands}
        />
        {loading ? (
          <div className="py-10">
            <Loader fullscreen />
          </div>
        ) : (
          <ProductList
            products={products}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            loading={false}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => {
              setCurrentPage(page);
              fetchProducts(page);
            }}
          />
        )}

        <ViewedProducts />
        <Description />
      </div>
    </main>
  );
}