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
    const slug = window.location.pathname.split('/').pop();

    const fetchCategoryName = async () => {
        try {
            const res = await categoryService.getBySlug(slug);
            const cat = res.data;
         // Gộp 3 dòng trên thành 1 dòng setCategoryInfo này
setCategoryInfo({
    id: cat.id,
    name: cat.parent?.name || cat.name || 'Danh mục',
    description: cat.description || null // Thêm description vào đây
});
        } catch (err) {
            console.error('❌ Không lấy được tên danh mục:', err);
            setCategoryName('Danh mục');
        }
    };

    const fetchCategoryBanners = async () => {
  if (!categoryId) return;
  try {
    const res = await bannerService.getByCategoryId(categoryId);
    console.log('📌 Banners by category:', res.data?.data);
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

  // ProductListByCategory.jsx
const fetchProducts = async (page = 1) => {
  if (!slug) return;
  setLoading(true);

  try {
    /** 1. Gọi API */
    const res = await productService.getByCategory({
      slug,
      page,
      limit: ITEMS_PER_PAGE,
      brand: filters.brand,
      stock: filters.stock,
      priceRange: filters.price,
      sort: sortOption,
    });

    /** 2. Chuẩn hoá dữ liệu cho UI */
    const formatted = (res.data.products || []).map((item) => {
      const sku               = item.skus?.[0] || {};           // SKU chính
      const priceNum          = sku.price ?? null;              // null nếu ko có
      const originalPriceNum  = sku.originalPrice ?? null;

      /* ----- Tính giá hiển thị & % giảm ----- */
      let displayPrice   = null;   // giá chính
      let displayOld     = null;   // giá gạch ngang
      let discountPct    = null;   // badge %

      if (priceNum && priceNum > 0) {               // có giá bán
        displayPrice = formatCurrencyVND(priceNum);

        if (originalPriceNum && originalPriceNum > priceNum) {
          displayOld  = formatCurrencyVND(originalPriceNum);
          discountPct = Math.round(
            ((originalPriceNum - priceNum) / originalPriceNum) * 100
          );
        }
      } else if (originalPriceNum) {                // chỉ có giá gốc
        displayPrice = formatCurrencyVND(originalPriceNum);
      }

      return {
        id: item.id,
        name: item.name,
        slug: item.slug,

        /* ảnh đại diện – ưu tiên ảnh SKU, fallback thumbnail sản phẩm */
        image:
          sku.ProductMedia?.[0]?.mediaUrl ||
          sku.media?.[0]?.mediaUrl ||
          item.thumbnail,

        /* thông tin giá đã chuẩn hoá */
        price:      displayPrice,          // luôn có 1 con số để in
        oldPrice:   displayOld,            // null nếu không cần gạch ngang
        priceNum:   priceNum ?? originalPriceNum ?? 0,
        oldPriceNum: originalPriceNum ?? 0,
        discount:   discountPct,           // null nếu không giảm

        rating:      item.averageRating || 0,
        inStock:     sku.stock > 0,
        soldCount:   item.soldCount ?? 0,
        isFavorite:  favorites.includes(item.id),
      };
    });

    /** 3. Cập nhật state */
    setProducts(formatted);
    setTotalItems(res.data.totalItems);
    setPaginationEnabled(res.data.paginationEnabled);
  } catch (err) {
    console.error("❌ Lỗi gọi API:", err);
    setProducts([]);
    setTotalItems(0);
  } finally {
    setLoading(false);
  }
};

    useEffect(() => {
        fetchCategoryName();
        fetchFavorites();
    }, [slug]);

    useEffect(() => {
        fetchCategoryBanners();
    }, [categoryId]);

   // pages/ProductListByCategory/index.jsx

// ...
useEffect(() => {
    const fetchBrandsForCategory = async () => {
        if (!categoryId) return;
        try {
            const res = await brandService.getAll(categoryId);
            setBrands(res.data || []);
        } catch (err) {
            console.error('❌ Lỗi khi tải thương hiệu:', err);
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
                  <FilterBar 
            categorySlug={slug} 
            filters={filters} 
            setFilters={setFilters}
            brands={brands}  // <--- DÒNG QUAN TRỌNG
        />
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
           <Description content={categoryInfo.description} />
            </div>
        </main>
    );
}