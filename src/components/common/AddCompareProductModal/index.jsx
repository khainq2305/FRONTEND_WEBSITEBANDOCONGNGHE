import React, { useEffect, useState } from 'react';
import { productService } from '../../../services/client/productService';

const AddCompareProductModal = ({ onClose, onProductSelect }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getAllForCompare()
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-md w-[90%] max-w-2xl p-4 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-lg font-semibold">Chọn sản phẩm để so sánh</h2>
          <button onClick={onClose} className="text-sm text-gray-500">Đóng</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {products.map(p => (
            <div
              key={p.id}
              className="border rounded p-2 text-center hover:shadow cursor-pointer"
              onClick={() => onProductSelect(p)}
            > 
              <img src={p.thumbnail} alt={p.name} className="w-full h-24 object-contain mb-1" />
              <div className="text-sm">{p.name}</div>
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
};

export default AddCompareProductModal;
