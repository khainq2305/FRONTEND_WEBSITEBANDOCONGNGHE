// src/components/CompareProducts/index.jsx
import React, { useState } from 'react';
import ProductHeaderComparison from './ProductHeaderComparison'; // Đường dẫn đến file component con
import QuickCompareSection from './QuickCompareSection';       // Đường dẫn đến file component con
import ProductFeaturesSection from './ProductFeaturesSection';   // Đường dẫn đến file component con

// --- DỮ LIỆU SẢN PHẨM VÀ FEATURE ORDER (GỘP VÀO ĐÂY) ---
const productsDataArray = [
  {
    id: 'asia-vy639790',
    isNew: false,
    topRightBadges: [{ text: '3 mức gió', iconClass: 'fan-speed-icon' }], // iconClass sẽ không được dùng nếu không có IconRenderer
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/275185/dung-asia-vy539790-290823-035045-600x600.jpg',
    nameInCard: 'Quạt đứng Asia 5 CÁNH VY539790 55W',
    nameForSidebar: 'QUẠT ĐỨNG ASIA 5 CÁNH VY539790 55W',
    currentPrice: '650.000₫',
    originalPrice: '775.000₫',
    discountPercent: '16%',
    promoText: 'Online giá rẻ quá',
    rating: 4.9,
    reviewsCount: '27,9k',
    features: {
      'Loại quạt': 'Quạt đứng',
      'Chế độ gió': 'Gió thường',
      'Bảng điều khiển': 'Nút xoay',
      'Loại motor': 'Bạc thau',
      'Chiều dài dây điện': '167 cm',
      'Thương hiệu của': 'Việt Nam',
      'Sản xuất tại': 'Việt Nam',
      'Năm ra mắt': '2022',
      'Tiện ích': ['Điều chỉnh được chiều cao', 'Lồng quạt có khe hở nan quạt nhỏ'],
      'Ngang': '46.5 cm',
      'Cao': '110.5 - 139.5 cm',
      'Sâu': '46.5 cm',
      'Mức gió': '3 mức gió',
      'Số cánh quạt': '5 cánh',
      'Đường kính cánh quạt': '44 cm',
      'Công suất': '55W',
      'Khối lượng': '6 kg',
    },
  },
  {
    id: 'midea-fs40-18navnk',
    isNew: true,
    nameInCard: <>Quạt đứng Midea 3 CÁNH FS40-18NAV(N)K) 55W <span className="text-orange-500 font-semibold">Mới</span></>,
    nameForSidebar: 'QUẠT ĐỨNG MIDEA 3 CÁNH FS40-18NAV(N)K) 55W',
    topRightBadges: [{ text: '3 mức gió', iconClass: 'fan-speed-icon' }],
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/275185/dung-asia-vy539790-290823-035045-600x600.jpg',
    currentPrice: '420.000₫',
    originalPrice: '840.000₫',
    discountPercent: '50%',
    promoText: 'Online giá rẻ quá',
    rating: 4.9,
    reviewsCount: '18,1k',
    features: {
      'Loại quạt': 'Quạt đứng',
      'Chế độ gió': 'Gió thường',
      'Bảng điều khiển': 'Nút nhấn',
      'Loại motor': 'Bạc thau',
      'Chiều dài dây điện': '185 cm',
      'Thương hiệu của': 'Trung Quốc',
      'Sản xuất tại': 'Việt Nam',
      'Năm ra mắt': '2024',
      'Tiện ích': 'Điều chỉnh được chiều cao',
      'Ngang': '39.5 cm',
      'Cao': '106.5 - 130.5 cm',
      'Sâu': '38.5 cm',
      'Mức gió': '3 mức gió',
      'Số cánh quạt': '3 cánh',
      'Đường kính cánh quạt': '40 cm',
      'Công suất': '50W',
      'Khối lượng': '5.9 kg',
    },
  },
  {
    id: 'midea-fs40-24evnk',
    isNew: true,
    nameInCard: <>Quạt đứng Midea 7 CÁNH FS40-24EVN(K) 50W <span className="text-orange-500 font-semibold">Mới</span></>,
    nameForSidebar: 'QUẠT ĐỨNG MIDEA 7 CÁNH FS40-24EVN(K) 50W',
    topRightBadges: [
        { text: '3 mức gió', iconClass: 'fan-speed-icon' },
        { text: 'Hẹn giờ tắt đến 2 tiếng', iconClass: 'timer-icon' }
    ],
    imageUrl: 'https://cdn.tgdd.vn/Products/Images/1992/275185/dung-asia-vy539790-290823-035045-600x600.jpg',
    currentPrice: '550.000₫',
    originalPrice: '1.080.000₫',
    discountPercent: '49%',
    promoText: 'Online giá rẻ quá',
    rating: 4.9,
    reviewsCount: '1,3k',
    features: {
      'Loại quạt': 'Quạt đứng',
      'Chế độ gió': 'Gió thường',
      'Bảng điều khiển': ['Nút xoay', 'Nút nhấn'],
      'Loại motor': 'Bạc thau',
      'Chiều dài dây điện': '186 cm',
      'Thương hiệu của': 'Trung Quốc',
      'Sản xuất tại': 'Việt Nam',
      'Năm ra mắt': '2025',
      'Tiện ích': ['Điều chỉnh được chiều cao', 'Hẹn giờ tắt'],
      'Ngang': '40 cm',
      'Cao': '112.5 - 127.6 cm',
      'Sâu': '40 cm',
      'Mức gió': '3 mức gió',
      'Số cánh quạt': '7 cánh',
      'Đường kính cánh quạt': '40 cm',
      'Công suất': '50W',
      'Khối lượng': '5.45 kg',
    },
  },
];

const featureOrderArray = [
  'Loại quạt', 'Chế độ gió', 'Bảng điều khiển', 'Loại motor',
  'Chiều dài dây điện', 'Thương hiệu của', 'Sản xuất tại', 'Năm ra mắt',
  'Tiện ích', 'Ngang', 'Cao', 'Sâu', 'Mức gió', 'Số cánh quạt',
  'Đường kính cánh quạt', 'Công suất', 'Khối lượng'
];
// --- HẾT PHẦN DỮ LIỆU ---


function CompareProducts() { // Đổi tên component cha
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [productIds, setProductIds] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const sidebarWidthClass = 'w-full lg:w-[230px] lg:min-w-[200px]';
  const productColumnClasses = 'flex-1 min-w-0';

  const handleRemoveProduct = (idToRemove) => {
    const updatedIds = productIds.filter((id) => id !== idToRemove.toString());
    if (updatedIds.length === 0) {
      localStorage.removeItem('compareIds');
      window.location.href = '/';
    } else {
      setProductIds(updatedIds);
      localStorage.setItem('compareIds', JSON.stringify(updatedIds));
      setSearchParams({ ids: updatedIds.join(',') });
    }
  };
  useEffect(() => {
    console.log('✅ specs từ API:', specs);
  }, [specs]);

  useEffect(() => {
    const ids = searchParams.get('ids');
    if (!ids) {
      const saved = JSON.parse(localStorage.getItem('compareIds') || '[]');
      if (saved.length > 0) {
        window.location.href = `/compare-products?ids=${saved.join(',')}`;
        return;
      } else {
        toast.error('Không có sản phẩm nào để so sánh');
        setLoading(false);
        return;
      }
    }

    const idList = ids.split(',');
    setProductIds(idList);
    localStorage.setItem('compareIds', JSON.stringify(idList));

    productService
      .getCompareByIds(idList)
      .then((res) => {
        setProducts(res.data.products || []);
        setSpecs(res.data.specs || []);
      })
      .catch(() => toast.error('Không thể tải dữ liệu so sánh'))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleToggleDifferences = () => {
    setShowOnlyDifferences(!showOnlyDifferences);
  };

  const getFilteredFeatures = (featureKey) => {
    if (!showOnlyDifferences) return true;
    const firstProductFeature = productsDataArray[0].features[featureKey];
    if (Array.isArray(firstProductFeature)) {
        return productsDataArray.some(p => {
            const currentProductFeature = p.features[featureKey];
            if (!Array.isArray(currentProductFeature) || currentProductFeature.length !== firstProductFeature.length) return true;
            return currentProductFeature.some((item, i) => item !== firstProductFeature[i]);
        });
    }
    return productsDataArray.some(p => p.features[featureKey] !== firstProductFeature);
  };

  const renderFeatureValue = (value) => {
    if (Array.isArray(value)) {
      return value.map((item, index) => <div key={index} className="text-center">{item || '-'}</div>);
    }
    return value || '-';
  };

  // const sidebarWidthClass = "w-full lg:w-[230px] lg:min-w-[200px]";
  // const productColumnClasses = "flex-1 min-w-0"; // Cho phép cột co lại nếu cần trong grid

  return (
    <div className="bg-[#f3f4f6] min-h-screen py-3 px-2 text-xs font-['Roboto',_sans-serif]">
      <div className="container mx-auto max-w-screen-xl bg-white border-gray-300">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <ProductHeaderComparison
            products={products}
            specs={specs} // ✅ THÊM DÒNG NÀY
            onAddProduct={() => setShowAddModal(true)} // ✅ truyền đúng hàm mở modal
            onRemoveProduct={handleRemoveProduct}
            sidebarWidthClass={sidebarWidthClass}
            productColumnClasses={productColumnClasses}
            showOnlyDifferences={showOnlyDifferences} // ✅ truyền trạng thái
            onToggleDifferences={handleToggleDifferences}
          />
        </div>

        <QuickCompareSection products={products} sidebarWidthClass={sidebarWidthClass} productColumnMinWidthClass={productColumnClasses} />

        {/* {specs.filter(getFilteredSpecs).map((spec) => (
          <div key={spec.specKey} className="flex border-t border-gray-300">
            <div
              className={`${sidebarWidthClass} flex-shrink-0 py-2 px-2.5 text-left whitespace-nowrap font-medium border-r border-gray-300 bg-gray-50`}
            >
              {spec.specKey}
            </div>
            <div className="flex-grow grid grid-cols-3">
              {columnsToRender.map((product, idx) => (
                <div
                  key={`${spec.specKey}-${product?.id || 'empty-' + idx}`}
                  className={`py-2 px-2.5 text-center ${productColumnClasses} ${idx < 2 ? 'border-r border-gray-300' : ''}`}
                >
                  {product?.id ? spec.values[product.id] || '-' : '-'}
                </div>
              ))}
            </div>
          </div>
        ))} */}
        {showAddModal && (
          <AddCompareProductModal
            onClose={() => setShowAddModal(false)}
            onProductSelect={(product) => {
              const updatedIds = [...productIds, product.id];
              setProductIds(updatedIds);
              localStorage.setItem('compareIds', JSON.stringify(updatedIds));
              setSearchParams({ ids: updatedIds.join(',') });
              setShowAddModal(false);
            }}
          />
        )}

        <ProductFeaturesSection
          products={products.map((p) => ({
            ...p,
            features: specs.reduce((acc, spec) => {
              acc[spec.specKey] = spec.values?.[p.id] || '-';
              return acc;
            }, {})
          }))}
          featureOrder={specs.map((s) => s.specKey)}
          showOnlyDifferences={showOnlyDifferences}
          onToggleDifferences={handleToggleDifferences}
          sidebarWidthClass={sidebarWidthClass}
          productColumnClasses={productColumnClasses}
        />
        <QuickCompareSection
          products={productsDataArray}
          sidebarWidthClass={sidebarWidthClass}
          productColumnClasses={productColumnClasses}
        />
        <ProductFeaturesSection
          products={productsDataArray}
          featureOrder={featureOrderArray}
          showOnlyDifferences={showOnlyDifferences} // Truyền state này
          getFilteredFeatures={getFilteredFeatures} // Truyền hàm filter
          renderFeatureValue={renderFeatureValue}   // Truyền hàm render
          sidebarWidthClass={sidebarWidthClass}
          productColumnClasses={productColumnClasses}
        />
      </div>
    </div>
  );
}

// --- CSS cho webkit-box-2 (Thêm vào file CSS chính của bạn nếu Tailwind JIT không tự xử lý) ---
/*
.webkit-box-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
*/

export default CompareProducts;