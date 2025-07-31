import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../../../services/client/orderService';
import { cartService } from '../../../services/client/cartService';
import { userAddressService } from '../../../services/client/userAddressService';
import CheckoutForm from './CheckoutForm';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import Breadcrumb from '../../../components/common/Breadcrumb';
import ShippingMethodSelector from './ShippingMethodSelector';

const CheckoutPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
  const [shippingFee, setShippingFee] = useState(0);
  const [productsInOrder, setProductsInOrder] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [selectedShipMethod, setSelectedShipMethod] = useState(null);
  const [usePoints, setUsePoints] = useState(() => {
    const stored = localStorage.getItem('usePoints');
    return stored ? JSON.parse(stored) : false;
  });
  const [pointInfo, setPointInfo] = useState({ maxUsablePoints: 0, canUsePoints: false });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await cartService.getCart();
        setPointInfo(res.data?.pointInfo || { maxUsablePoints: 0, canUsePoints: false });
      } catch (err) {
        console.error('❌ Lỗi lấy điểm thưởng ở CheckoutPage:', err);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    localStorage.setItem('usePoints', JSON.stringify(usePoints));
  }, [usePoints]);

  useEffect(() => {
    const storedItems = localStorage.getItem('selectedCartItems');
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        const formatted = parsedItems.map((item) => ({
          ...item,
          oldPrice: item.originalPrice,
          price: item.finalPrice || item.price,

          variant: Array.isArray(item.variantValues)
            ? item.variantValues.map((v) => `${v.variant}: ${v.value}`).join(', ')
            : item.variant || ''
        }));

        setProductsInOrder(formatted);
      } catch (err) {
        console.error('Lỗi parse selectedCartItems:', err);
      }
    }
    const storedCoupon = localStorage.getItem('selectedCoupon') || localStorage.getItem('appliedCoupon');

    if (storedCoupon) {
      try {
        setSelectedCoupon(JSON.parse(storedCoupon));
      } catch (err) {
        console.error('Lỗi parse selectedCoupon:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedShipMethod) setShippingFee(selectedShipMethod.fee);
  }, [selectedShipMethod]);

  const refetchAddresses = useCallback(async () => {
    setIsLoadingAddress(true);
    try {
      const res = await userAddressService.getList();
      const allAddresses = res.data?.data || [];

      if (allAddresses.length > 0) {
        allAddresses.sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : 0));
        setAddressList(allAddresses);
        const savedAddressId = localStorage.getItem('selectedAddressId');
        const savedAddress = allAddresses.find((addr) => addr.id === Number(savedAddressId));

        setSelectedAddress(savedAddress || allAddresses.find((addr) => addr.isDefault) || allAddresses[0]);
      } else {
        setAddressList([]);
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error('Không thể lấy sổ địa chỉ:', error);
      toast.error('Lỗi khi tải sổ địa chỉ của bạn.');
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  const cartPayload = useMemo(
    () =>
      productsInOrder.map((i) => ({
        skuId: i.skuId,
        quantity: i.quantity
      })),
    [productsInOrder]
  );

  useEffect(() => {
    refetchAddresses();
  }, [refetchAddresses]);

  const totals = productsInOrder.reduce(
    (acc, item) => {
      const qty = item.quantity || 1;
      const oldPrice = item.oldPrice || item.price || 0;
      const currentPrice = item.price || 0;
      acc.totalAmount += oldPrice * qty;
      acc.discount += (oldPrice - currentPrice) * qty;
      return acc;
    },
    { totalAmount: 0, discount: 0 }
  );

  const breadcrumbItems = [{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng', href: '/cart' }, { label: 'Thanh toán' }];

  return (
    <div className="bg-gray-100 max-w-[1200px] mx-auto min-h-screen ">
      <div className="max-w-7xl mx-auto mb-4 mt-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:items-start">
        <div className="w-full lg:w-[70%] space-y-3 sm:space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 text-xs sm:text-sm">
            <h2 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Sản phẩm trong đơn ({productsInOrder.length})</h2>
            <div className="product-list-inner-box bg-gray-50 p-3 rounded-md space-y-3 sm:space-y-4">
              {productsInOrder.length > 0 ? (
                productsInOrder.map((product, index) => (
                  <div key={product.id || `product-${index}`} className="flex items-center gap-2 sm:gap-3">
                    <img
                      src={
                        product.image ||
                        'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg'
                      }
                      alt={product.productName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          'https://mucinmanhtai.com/wp-content/themes/BH-WebChuan-032320/assets/images/default-thumbnail-400.jpg';
                      }}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium leading-snug line-clamp-2">{product.productName}</p>

                      {product.variant && (
                        <div className="mt-1 text-xs text-gray-600 flex flex-wrap gap-x-1">
                          <span className="font-medium">Phân loại:</span>
                          {product.variant.split(',').map((v, i, arr) => (
                            <span key={i}>
                              {v.trim()}
                              {i < arr.length - 1 && ','}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-1">
                        Số lượng: <span className="font-medium text-gray-800">{product.quantity || 1}</span>
                      </div>
                    </div>

                    <div className="text-right whitespace-nowrap ml-2 self-center">
                      <p className="text-red-600 font-semibold text-sm sm:text-base">
                        {Number(product.price || 0).toLocaleString('vi-VN')} ₫
                      </p>

                      {product.oldPrice && product.oldPrice > (product.price || 0) && (
                        <p className="text-gray-400 text-xs line-through mt-0.5">{Number(product.oldPrice).toLocaleString('vi-VN')} ₫</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">Không có sản phẩm nào được chọn để thanh toán.</p>
              )}
            </div>
          </div>
          <ShippingMethodSelector selectedAddress={selectedAddress} cartItems={cartPayload} onSelect={setSelectedShipMethod} />
          <CheckoutForm
            isLoading={isLoadingAddress}
            addressList={addressList}
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
            onAddressCreated={refetchAddresses}
          />

          <div className="mb-2">
            <PaymentMethod selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} />
          </div>
        </div>

        <div className="w-full mb-2 lg:w-[30%] lg:sticky lg:top-5 lg:h-fit">
          <OrderSummary
            totalAmount={totals.totalAmount}
            discount={totals.discount}
            shippingFee={shippingFee}
            selectedPaymentMethod={selectedPaymentMethod}
            selectedCoupon={selectedCoupon}
            selectedAddress={selectedAddress}
            selectedShipMethod={selectedShipMethod}
            selectedItems={productsInOrder}
            usePoints={usePoints}
            pointInfo={pointInfo}
            setUsePoints={setUsePoints}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;