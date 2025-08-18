import React, { useEffect, useState } from 'react';
import { orderService } from '../../../../services/client/orderService';
import { FiTruck, FiLoader } from 'react-icons/fi';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';

const ShippingMethodSelector = ({
  selectedAddress,
  cartItems = [],
  onSelect,
}) => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelected] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!selectedAddress?.district?.id || !selectedAddress?.ward?.id || cartItems.length === 0) {
        return;
      }
      setLoading(true);
      try {
        const payload = {
          districtId: selectedAddress.district.id,
          wardId: selectedAddress.ward.id,
          items: cartItems,
        };
        const res = await orderService.getShippingOptions(payload);
        const opts = res.data?.data || [];
        setMethods(opts);
        if (opts.length) {
          setSelected(opts[0]);
          onSelect && onSelect(opts[0]);
        }
      } catch (err) {
        console.error('[ShippingMethodSelector] Lỗi:', err);
        setMethods([]);
        setSelected(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [selectedAddress, cartItems, onSelect]);

  const handleChange = (method) => {
    setSelected(method);
    onSelect && onSelect(method);
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
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
          {methods.map((m) => {
            const isSelected = selectedMethod?.code === m.code;
            return (
              <li
                key={m.code}
                onClick={() => handleChange(m)}
                className={[
                  "flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors",
                  "hover:border-gray-300",
                  isSelected ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"
                ].join(" ")}
              >
                {/* Changed items-start to items-center */}
                <div className="flex items-center gap-3">
                  {/* Removed mt-1 */}
                  <span
                    className={[
                      "inline-block h-3 w-3 rounded-full border",
                      isSelected ? "bg-primary border-primary" : "bg-white border-gray-300"
                    ].join(" ")}
                  />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">Thời gian {m.leadTime || "?"} ngày</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  {m.fee === 0 ? "Miễn phí" : formatCurrencyVND(m.fee)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ShippingMethodSelector;