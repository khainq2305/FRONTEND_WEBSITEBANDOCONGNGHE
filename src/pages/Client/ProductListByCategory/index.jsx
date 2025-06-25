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
import { bannerService } from '../../../services/client/bannerService';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';

import { formatCurrencyVND } from '../../../utils/formatCurrency';
import { useParams } from 'react-router-dom';
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
  const [banners, setBanners] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState({ id: null, name: 'Danh mục', description: null });
  const sortBarRef = useRef();
  const { slug } = useParams();
  const fetchCategoryName = async () => {
    try {
      const res = await categoryService.getBySlug(slug);
      const cat = res.data;

      setCategoryId(cat.id);

      setCategoryInfo({
        id: cat.id,
        name: cat.parent?.name || cat.name || 'Danh mục',
        description: cat.description || null
      });
    } catch (err) {
      console.error('Không lấy được tên danh mục:', err);
      setCategoryName('Danh mục');
    }
  };

  const fetchCategoryBanners = async () => {
    if (!categoryId) return;
    try {
      const res = await bannerService.getByCategoryId(categoryId);
      console.log('Banners by category:', res.data?.data);
      setBanners(res.data?.data || []);
    } catch (err) {
      console.error('Lỗi khi lấy banner danh mục:', err);
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
      const formatted = (res.data.products || []).map((item) => {
        const sku = item.skus?.[0] || {};
        const flash = sku.flashSaleSkus?.find((f) => f.isActive);

        const priceNum = Number(flash?.salePrice || sku.price) || 0;
        const oldPriceNum = Number(sku.originalPrice ?? sku.price) || 0;
        const originalPriceNum = Number(sku.originalPrice ?? sku.price) || 0;

        let calculatedDiscount = 0;
        const comparePriceForDiscount = flash && flash.salePrice ? oldPriceNum : oldPriceNum;

        if (comparePriceForDiscount > priceNum && comparePriceForDiscount > 0) {
          calculatedDiscount = Math.round(((comparePriceForDiscount - priceNum) / comparePriceForDiscount) * 100);
        }

        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          badge: item.badge,
          image: item.image || item.thumbnail,

          priceNum,
          oldPriceNum,
          originalPriceNum,
          discount: calculatedDiscount,
          rating: item.averageRating,
          inStock: item.inStock,
          soldCount: item.soldCount,
          skus: item.skus
        };
      });

      setProducts(formatted);
      setTotalItems(res.data.totalItems);
      setPaginationEnabled(res.data.paginationEnabled);
    } catch (err) {
      console.error('Lỗi gọi API:', err);
      setProducts([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchCategoryName();
  }, [slug]);

  useEffect(() => {
    fetchCategoryBanners();
  }, [categoryId]);
  useEffect(() => {
    const fetchBrandsForCategory = async () => {
      if (!categoryId) return;
      try {
        const res = await brandService.getAll(categoryId);
        setBrands(res.data || []);
      } catch (err) {
        console.error('Lỗi khi tải thương hiệu:', err);
        setBrands([]);
      }
    };
    fetchBrandsForCategory();
  }, [categoryId]);

  // ...
  useEffect(() => {
    fetchProducts(1);
    setCurrentPage(1);
  }, [filters, sortOption, slug, favorites]);

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
      <div className="w-full max-w-[1200px]">
        {!isStickySortBar && <Breadcrumb categoryName={categoryName} categorySlug={slug} />}
        <Banner banners={banners} />
        <FilterBar categorySlug={slug} filters={filters} setFilters={setFilters} brands={brands} />
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
        <Description content={categoryInfo.description} />
      </div>
    </main>
  );
}
