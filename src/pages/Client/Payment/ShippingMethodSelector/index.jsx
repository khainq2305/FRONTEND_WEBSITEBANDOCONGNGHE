import React, { useEffect, useState } from 'react';
import { orderService } from '../../../../services/client/orderService';
import { FiTruck, FiLoader } from 'react-icons/fi';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import ghnLogo from '@/assets/Client/images/unnamed.png';
import ghtkLogo from '@/assets/Client/images/vav-1725788421441340763684.webp';

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

    {!selectedAddress ? (
      <p className="text-sm text-gray-500">
        Vui lòng nhập thông tin giao hàng để tính phí vận chuyển.
      </p>
    ) : (methods.length === 0 && !loading) ? (
      <p className="text-sm text-gray-500">Không có lựa chọn nào khả dụng.</p>
    ) : (
      <ul className="space-y-2">
        {(methods.length > 0 ? methods : [
          { code: "ghn", name: "Giao Hàng Nhanh", fee: null, leadTime: null },
          { code: "ghtk", name: "Giao Hàng Tiết Kiệm", fee: null, leadTime: null }
        ]).map((m) => {
          const isSelected = selectedMethod?.code === m.code;
          return (
            <li
              key={m.code}
              onClick={() => m.fee !== null && handleChange(m)}
              className={[
                "flex items-center justify-between p-3 border rounded-md cursor-pointer transition-colors",
                "hover:border-gray-300",
                isSelected ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "inline-block h-3 w-3 rounded-full border",
                    isSelected ? "bg-primary border-primary" : "bg-white border-gray-300"
                  ].join(" ")}
                />
                <div className="flex items-center gap-2">
                  {m.code === "ghn" && (
                    <img src={ghnLogo} alt="GHN" className="w-8 h-8 object-contain" />
                  )}
                  {m.code === "ghtk" && (
                    <img src={ghtkLogo} alt="GHTK" className="w-8 h-8 object-contain" />
                  )}
                  <div>
                    <p className="font-medium text-sm text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">
                      Thời gian {m.leadTime || (loading ? "đang tính..." : "?")} ngày
                    </p>
                  </div>
                </div>
              </div>
              <span className="text-sm font-semibold text-red-600">
                {m.fee === null ? (
                  <span className="text-gray-400">Đang tính...</span>
                ) : m.fee === 0 ? "Miễn phí" : formatCurrencyVND(m.fee)}
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