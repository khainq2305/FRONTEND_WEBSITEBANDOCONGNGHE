import React, { useEffect, useState } from 'react';
import ProductHeaderComparison from './ProductHeaderComparison';
import QuickCompareSection from './QuickCompareSection';
import ProductFeaturesSection from './ProductFeaturesSection';
import { productService } from '../../../services/client/productService';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import ProductSelectModal from '../../../components/common/ProductSelectModal';

function CompareProducts() {
  const [products, setProducts] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);
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
    return () => {
      localStorage.removeItem('compareIds');
    };
  }, []);

  useEffect(() => {
  console.log("🔍 Products từ API:", products);
}, [products]);

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
      console.log('🧪 Kết quả từ API:', res.data.products); // ✅ CHẮC CHẮN CÓ categoryId chưa?

        setProducts(res.data.products || []);
        setSpecs(res.data.specs || []);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || 'Không thể tải dữ liệu so sánh';
        toast.error(msg);

        // ✅ Rollback nếu lỗi do khác danh mục
        if (idList.length > 1) {
          const rollbackIds = idList.slice(0, -1);
          setProductIds(rollbackIds);
          localStorage.setItem('compareIds', JSON.stringify(rollbackIds));
          setSearchParams({ ids: rollbackIds.join(',') });
        } else {
          localStorage.removeItem('compareIds');
          window.location.href = '/';
        }
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleToggleDifferences = () => {
    setShowOnlyDifferences(!showOnlyDifferences);
  };

  const getFilteredSpecs = (spec) => {
    if (!showOnlyDifferences) return true;
    const values = spec.values || {};
    const first = values[products[0]?.id];
    return Object.values(values).some((v) => v !== first);
  };

  const columnsToRender = [...products];
  while (columnsToRender.length < 3) {
    columnsToRender.push(null);
  }

  if (loading) {
    return <div className="py-10 text-center text-sm text-gray-500">Đang tải dữ liệu so sánh...</div>;
  }

  if (!products.length) {
    return <div className="py-10 text-center text-sm text-red-500">Không có sản phẩm hợp lệ để so sánh.</div>;
  }

  return (
    <div className="bg-[#f3f4f6] min-h-screen py-3 px-2 text-xs font-['Roboto',_sans-serif]">
      <div className="container mx-auto max-w-screen-xl bg-white border-gray-300">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <ProductHeaderComparison
            products={products}
            specs={specs}
            onAddProduct={() => setShowAddModal(true)}
            onRemoveProduct={handleRemoveProduct}
            sidebarWidthClass={sidebarWidthClass}
            productColumnClasses={productColumnClasses}
            showOnlyDifferences={showOnlyDifferences}
            onToggleDifferences={handleToggleDifferences}
          />
        </div>

<QuickCompareSection
  products={products}
  specs={specs}
  sidebarWidthClass={sidebarWidthClass}
  productColumnMinWidthClass={productColumnClasses}
  showOnlyDifferences={showOnlyDifferences} // ✅ bắt buộc phải truyền
/>


       {showAddModal && products.length > 0 && products[0]?.categoryId && (
  <ProductSelectModal
    onClose={() => setShowAddModal(false)}
    excludedProductIds={productIds.map((id) => parseInt(id))}
    onSelect={(product) => {
      const updatedIds = [...productIds, product.id.toString()];
      setSearchParams({ ids: updatedIds.join(',') });
      setShowAddModal(false);
    }}
    categoryId={products[0]?.categoryId} // ✅ đảm bảo luôn có categoryId
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
          getFilteredFeatures={(key) => {
            if (!showOnlyDifferences) return true;
            const values = specs.find((s) => s.specKey === key)?.values || {};
            const first = values[products[0]?.id];
            return Object.values(values).some((v) => v !== first);
          }}
          renderFeatureValue={(value) => value || '-'}
        />
      </div>
    </div>
  );
}

export default CompareProducts;
