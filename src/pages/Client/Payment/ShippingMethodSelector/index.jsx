import React, { useEffect, useState } from 'react';
import { orderService } from '../../../../services/client/orderService';
import { FiTruck, FiLoader } from 'react-icons/fi';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';

/**
 * props
 * ─────────────────────────────────────────────
 * selectedAddress   : địa chỉ KH đã chọn
 * cartItems         : [{ skuId, quantity }]
 * onSelect          : fn(method)  → báo cho parent
 */
const ShippingMethodSelector = ({
  selectedAddress,
  cartItems = [],
  onSelect,
}) => {
  const [methods, setMethods]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [selectedMethod, setSelected] = useState(null);

  /** Lấy danh sách phương thức khi address || cartItems thay đổi */
 // src/components/client/checkout/ShippingMethodSelector.jsx

/** Lấy danh sách phương thức khi address || cartItems thay đổi */
useEffect(() => {
  const fetchOptions = async () => {
    if (
      !selectedAddress?.district?.id || // Sửa từ .ghnCode sang .id (nếu districtId bạn truyền là id nội bộ)
      !selectedAddress?.ward?.id ||    // SỬA TỪ .code SANG .id
      cartItems.length === 0
    )
      return;

    setLoading(true);
    try {
      const payload = {
          districtId : selectedAddress.district.id,
          wardId     : selectedAddress.ward.id, // Đảm bảo lấy ID của ward
          items      : cartItems,
      };

      const res = await orderService.getShippingOptions(payload);
      const opts = res.data?.data || [];

      setMethods(opts);
      if (opts.length) {
        setSelected(opts[0]);
        onSelect && onSelect(opts[0]);
      }
    } catch (err) {
      console.error('[ShippingMethodSelector] Lỗi:', err); // Log lỗi chi tiết hơn
      setMethods([]); // Đảm bảo methods rỗng khi có lỗi
      setSelected(null); // Đảm bảo selectedMethod là null
    } finally {
      setLoading(false);
    }
  };

  fetchOptions();
}, [selectedAddress, cartItems, onSelect]);
  /* chọn phương thức */
  const handleChange = (method) => {
    setSelected(method);
    onSelect && onSelect(method);
  };

  /* UI */
  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
      <h2 className="font-semibold text-sm sm:text-base mb-3 flex items-center">
        <FiTruck className="mr-2" /> Chọn phương thức vận chuyển
      </h2>

      {loading ? (
        <div className="flex items-center text-sm text-gray-500">
          <FiLoader className="animate-spin mr-2" /> Đang tải...
        </div>
      ) : methods.length === 0 ? (
        <p className="text-sm text-gray-500">Không có lựa chọn nào khả dụng.</p>
      ) : (
        <ul className="space-y-2">
          {methods.map((m) => (
            <li
              key={m.code}
              className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${
                selectedMethod?.code === m.code
                  ? 'border-primary ring-1 ring-primary/50'
                  : 'border-gray-200'
              }`}
              onClick={() => handleChange(m)}
            >
              <div>
                <p className="font-medium text-sm">{m.name}</p>
                <p className="text-xs text-gray-500">
                  Thời gian&nbsp;{m.leadTime || '?'} ngày
                </p>
              </div>
              <span className="text-sm font-semibold text-red-600">
                {m.fee === 0 ? 'Miễn phí' : formatCurrencyVND(m.fee)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShippingMethodSelector;
