import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SEO from '../../../components/common/SEO';
import { 
  createCategoryUrl, 
  createBreadcrumbStructuredData,
  createSlug 
} from '../../../utils/seoUtils';
import Banner from './Banner';
import ProductFilters from './ProductFilters'; // Component lọc chi tiết (giá, còn hàng, thương hiệu)
import FilterBar from './FilterBar'; // Component lọc thương hiệu dạng tab
import SortOptions from './SortOptions'; // Component sắp xếp riêng
import Description from './Description';
import Breadcrumb from '../../../components/common/Breadcrumb';

import ViewedProducts from '../Home/ViewedProductsSlider'; // Component này rất có thể là thủ phạm
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
  const [categoryName, setCategoryName] = useState('Danh mục');
  const [brands, setBrands] = useState([]); 
  const [banners, setBanners] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState({ id: null, name: 'Danh mục', description: null });
  const { slug } = useParams();

  const fetchCategoryName = async () => {
    try {
      const res = await categoryService.getBySlug(slug);
      const cat = res.data;

      setCategoryId(cat.id);

      setCategoryInfo({
        id: cat.id,
        name: cat.parent?.name || cat.name || 'Danh mục',
        description: cat.description || null,
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
        sort: sortOption,
      });

      const formatted = (res.data.products || []).map((item) => {
        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          badge: item.badge,
          image: item.image || item.thumbnail,
          badgeImage: item.badgeImage,
          priceNum: item.price,
          oldPriceNum: item.oldPrice,
          originalPriceNum: item.originalPrice,
          discount: item.discount,
          rating: item.averageRating,
          inStock: item.inStock,
          soldCount: item.soldCount,
          skus: item.skus,
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

  useEffect(() => {
    fetchProducts(1);
    setCurrentPage(1);
  }, [filters, sortOption, slug]);

  return (
    <main className="w-full flex justify-center">
     
      <div className="w-full max-w-[1200px] overflow-x-hidden">
        <div className="px-4">
          <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: categoryInfo.name }]} />
        </div>

        <Banner banners={banners} /> 
        
        <FilterBar 
          categorySlug={slug} 
          filters={filters} 
          setFilters={setFilters} 
          brands={brands} 
        />

        <div className="bg-white p-3 sm:p-3 md:p-3 rounded-lg mb-2 shadow-sm">
          <ProductFilters
            currentFilters={filters}
            onApplyFilters={setFilters}
            brandOptions={brands} 
          />
        </div>

        <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg shadow-sm mb-4">
          <SortOptions
            currentSortOption={sortOption}
            onApplySort={setSortOption}
          />
          {loading ? (
            <div className="py-10">
              <Loader fullscreen />
            </div>
          ) : (
            <div className="mt-4">
              <ProductList
                products={products}
                favorites={favorites}
                 categoryInfo={categoryInfo} 
                loading={false}
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  fetchProducts(page);
                }}
              />
            </div>
          )}
        </div>
        
        <ViewedProducts /> 
        <Description content={categoryInfo.description} />
      </div>
    </main>
  );
}