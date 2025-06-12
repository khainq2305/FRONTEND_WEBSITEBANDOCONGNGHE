// src/pages/Client/CompareProducts/index.jsx
import React, { useEffect, useState } from 'react';
import ProductHeaderComparison from './ProductHeaderComparison';
import QuickCompareSection from './QuickCompareSection';
import ProductFeaturesSection from './ProductFeaturesSection';
import { productService } from '../../../services/client/productService';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

function CompareProducts() {
  const [products, setProducts] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [productIds, setProductIds] = useState([]);

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

  const getFilteredSpecs = (spec) => {
    if (!showOnlyDifferences) return true;
    const values = spec.values || {};
    const first = values[products[0]?.id];
    return Object.values(values).some((v) => v !== first);
  };

  if (loading) {
    return <div className="py-10 text-center text-sm text-gray-500">Đang tải dữ liệu so sánh...</div>;
  }

  if (!products.length) {
    return <div className="py-10 text-center text-sm text-red-500">Không có sản phẩm hợp lệ để so sánh.</div>;
  }

  return (
    <div className="bg-[#f3f4f6] min-h-screen py-3 px-2 text-xs font-['Roboto',_sans-serif]">
      <div className="container mx-auto max-w-screen-xl bg-white shadow-sm rounded-md border border-gray-300">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <ProductHeaderComparison
            products={products}
            onRemoveProduct={handleRemoveProduct}
            sidebarWidthClass={sidebarWidthClass}
            productColumnClasses={productColumnClasses}
          />
        </div>

        <QuickCompareSection
          products={products}
          sidebarWidthClass={sidebarWidthClass}
          productColumnMinWidthClass={productColumnClasses}
        />

        {specs.filter(getFilteredSpecs).map((spec) => (
          <div key={spec.specKey} className="flex border-t border-gray-300">
            <div
              className={`${sidebarWidthClass} flex-shrink-0 py-2 px-2.5 text-left whitespace-nowrap font-medium border-r border-gray-300 bg-gray-50`}
            >
              {spec.specKey}
            </div>
<div className={`flex-grow grid grid-cols-${products.length || 3}`}>
              {products.map((product, idx) => (
                <div
                  key={`${spec.specKey}-${product.id}`}
                  className={`py-2 px-2.5 text-center ${productColumnClasses} ${
                    idx < products.length - 1 ? 'border-r border-gray-300' : ''
                  }`}
                >
                  {spec.values[product.id] || '-'}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompareProducts;
