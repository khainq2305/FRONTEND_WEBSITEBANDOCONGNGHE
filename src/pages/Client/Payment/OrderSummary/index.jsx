import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../../../services/client/orderService';
import { userAddressService } from '../../../../services/client/userAddressService';
import { toast } from 'react-toastify';
import PromoModal from '../../Cart/PromoModal';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { FaPercentage } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { couponService } from '../../../../services/client/couponService'; // đảm bảo đã import
const OrderSummary = ({ totalAmount, discount, shippingFee, selectedPaymentMethod, selectedCoupon: propCoupon }) => {
  const navigate = useNavigate();
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
const selectedItems = JSON.parse(localStorage.getItem('selectedCartItems') || '[]');
const selectedSkuId = selectedItems[0]?.skuId || null;

  useEffect(() => {
    if (propCoupon) setSelectedCoupon(propCoupon);
  }, [propCoupon]);

useEffect(() => {
  if (propCoupon) {
    setSelectedCoupon(propCoupon);
  } else {
    const stored =
      localStorage.getItem('selectedCoupon') ||
      localStorage.getItem('appliedCoupon'); // ✅ đọc thêm key này
    if (stored) {
      try {
        setSelectedCoupon(JSON.parse(stored));
      } catch (e) {
        console.error('Không parse được selectedCoupon:', e);
      }
    }
  }
}, [propCoupon]);

  

const handleApplyPromo = async (couponCode) => {
  // ✅ Nếu couponCode = null → là hành động BỎ mã
  if (!couponCode) {
    setSelectedCoupon(null);
    localStorage.removeItem('selectedCoupon');
    toast.success('Đã bỏ mã giảm giá.');
    return;
  }

  // ✅ Nếu được truyền object dạng { code, ... }
  const code = typeof couponCode === 'object' ? couponCode.code : couponCode;
  if (!code || typeof code !== 'string') {
    toast.error('Mã giảm giá không hợp lệ!');
    return;
  }

  try {
    const res = await couponService.applyCoupon({
      code: code.trim(),
      skuId: Number(selectedSkuId),
      orderTotal: Number(totalAmount)
    });

    const applied = res.data?.coupon;
    if (applied) {
      setSelectedCoupon(applied);
      localStorage.setItem('selectedCoupon', JSON.stringify(applied));
      toast.success(`Áp dụng mã ${code} thành công!`);
    } else {
      toast.error(`Không tìm thấy thông tin mã "${code}"`);
    }
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Lỗi khi áp mã giảm giá!');
  }

  setIsPromoModalOpen(false);
};




// ✅ Nếu propCoupon truyền sẵn couponDiscount thì ưu tiên xài lại
const couponDiscount =
  typeof selectedCoupon?.discountAmount === 'number'
    ? selectedCoupon.discountAmount
    : 0;



  const shippingDiscount =
    selectedCoupon?.discountType === 'shipping'
      ? Math.min(shippingFee, selectedCoupon.discountValue || 0)
      : 0;

 const totalDiscount = Number(discount || 0) + Number(couponDiscount || 0);

  const finalAmount = totalAmount - totalDiscount + (shippingFee - shippingDiscount);

  const handlePlaceOrder = async () => {
    try {
      const selectedItems = JSON.parse(localStorage.getItem('selectedCartItems') || '[]');
      if (selectedItems.length === 0) return toast.error('Không có sản phẩm được chọn!');

      const addressRes = await userAddressService.getDefault();
      const address = addressRes.data?.data;
      if (!address?.id) return toast.error('Chưa có địa chỉ giao hàng mặc định!');
let paymentStatus = 'unpaid';
if ([2, 3, 4, 5].includes(selectedPaymentMethod)) {
  paymentStatus = 'waiting';
}

const payload = {
  addressId: address.id,
  paymentMethodId: selectedPaymentMethod,
  couponCode: selectedCoupon?.code || null,
  note: '',
  items: selectedItems.map((item) => ({
    skuId: item.skuId,
    quantity: item.quantity,
    price: item.finalPrice,
    flashSaleId: item.flashSaleId    // ← thêm dòng này
  })),
  cartItemIds: selectedItems.map((item) => item.id),
  couponDiscount: couponDiscount,
  paymentStatus // ✅ thêm dòng này
};



      const res = await orderService.createOrder(payload);
  const createdOrderId = res.data?.orderId || res.data?.data?.orderId || res.data?.data?.id;
const createdOrderCode = res.data?.orderCode || res.data?.data?.orderCode;


      if (!createdOrderId || !createdOrderCode) {
        toast.error('Không lấy được mã đơn hàng.');
        return;
      }

      // VietQR hoặc MoMo xử lý riêng
      const isQR = selectedPaymentMethod === 2;
      const isMoMo = selectedPaymentMethod === 4;
const isZalo = selectedPaymentMethod === 5;
const isVNPay = selectedPaymentMethod === 3;

      const fullCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const updatedCart = fullCart.filter(
        (cartItem) => !selectedItems.some((selected) => selected.skuId === cartItem.skuId)
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      localStorage.removeItem('selectedCartItems');
      localStorage.removeItem('selectedCoupon');

      if (isQR) {
        const vietqrRes = await orderService.vietqrPay({
          accountNumber: '2222555552005',
          accountName: 'NGUYEN QUOC KHAI',
          bankCode: 'MB',
          amount: finalAmount,
          message: createdOrderCode
        });

        const qrUrl = vietqrRes.data?.qrImage;
        if (!qrUrl) return toast.error('Không lấy được ảnh VietQR.');

        navigate(`/order-confirmation?orderCode=${createdOrderCode}&qr=${encodeURIComponent(qrUrl)}`);
        return;
      }

      if (isMoMo) {
        const momoRes = await orderService.momoPay({ orderId: createdOrderId });
        const momoPayUrl = momoRes.data?.payUrl;
        if (!momoPayUrl) return toast.error('Không nhận được link thanh toán MoMo.');
        window.location.href = momoPayUrl;
        return;
      }
if (isVNPay) {
  const res = await orderService.vnpay({ orderId: createdOrderId });
  const url = res.data?.payUrl;
  if (!url) return toast.error('Không nhận được link VNPay');
  window.location.href = url;
  return;
}

if (isZalo) {
  const res = await orderService.zaloPay({ orderId: createdOrderId });
  const url = res.data?.payUrl;
  if (!url) return toast.error('Không nhận được link ZaloPay');
  window.location.href = url;
  return;
}

      toast.success('Đặt hàng thành công!');
      navigate(`/order-confirmation?orderCode=${createdOrderCode}`);
    } catch (err) {
      console.error('Lỗi khi đặt hàng:', err);
      toast.error(err?.response?.data?.message || 'Lỗi đặt hàng!');
    }
  };

  return (
    <div className="relative">
      <aside className="bg-white rounded-md p-3 sm:p-4 border border-gray-200 shadow-sm sticky top-6 h-fit">
        {selectedCoupon?.code && (
          <div className="mb-2 text-xs text-green-600">
            Mã đã áp: <strong>{selectedCoupon.code}</strong>
          </div>
        )}

       <div
  onClick={() => setIsPromoModalOpen(true)}
  className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-3 mb-3 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer"
>
  <span className="flex items-center font-medium">
    <span className={`mr-2 text-lg ${selectedCoupon ? 'text-red-500' : 'text-gray-400'}`}>
      <FaPercentage />
    </span>
    {selectedCoupon
      ? `Đã áp dụng: ${selectedCoupon.code}`
      : 'Chọn hoặc nhập ưu đãi'}
  </span>
  <FiChevronRight className="text-gray-400" />
</div>


        

       <div className="text-xs sm:text-sm text-gray-600 mb-4">
  <h3 className="font-semibold mb-2 text-gray-800">Thông tin đơn hàng</h3>

  <div className="flex justify-between mb-2">
    <span>Tổng tiền hàng</span>
    <span className="font-medium text-gray-800">{formatCurrencyVND(totalAmount)}</span>
  </div>

  <div className="flex justify-between mb-2 text-sm text-gray-600">
    <span>Giảm giá từ sản phẩm</span>
    <span>{formatCurrencyVND(discount)}</span>
  </div>

  {couponDiscount > 0 && (
    <div className="flex justify-between mb-2 text-sm text-green-600">
      <span>Giảm giá từ coupon</span>
      <span>- {formatCurrencyVND(couponDiscount)}</span>
    </div>
  )}

  <div className="flex justify-between mb-2 text-sm text-gray-800">
    <span>Tổng khuyến mãi</span>
    <span>{formatCurrencyVND(totalDiscount)}</span>
  </div>

  {/* === PHÍ VẬN CHUYỂN (hiển thị 3 dòng nếu có giảm) === */}
{/* === PHÍ VẬN CHUYỂN (hiển thị đã sửa gọn gàng hơn) === */}
{shippingDiscount > 0 ? (
  <div className="mb-2 text-sm">
    <div className="flex justify-between">
      <span>Phí vận chuyển</span>
      <span className="font-medium text-gray-800 line-through">
        {formatCurrencyVND(shippingFee)}
      </span>
    </div>
    <div className="flex justify-between text-green-600">
      <span className="pl-2">Sau giảm</span> {/* Label "Sau giảm" ở đây */}
      <span>{formatCurrencyVND(shippingFee - shippingDiscount)}</span>
    </div>
  </div>
) : (
  /* Trường hợp không có giảm phí ship */
  <div className="flex justify-between mb-2 text-sm">
    <span>Phí vận chuyển</span>
    <span className="text-gray-800">
      {shippingFee === 0 ? 'Miễn phí' : formatCurrencyVND(shippingFee)}
    </span>
  </div>
)}


  <div className="pt-2">
    <div className="border-t border-dashed border-gray-300 mb-2" />
    <div className="flex justify-between text-base sm:text-sm font-bold text-red-600">
      <span>Cần thanh toán</span>
      <span>{formatCurrencyVND(finalAmount)}</span>
    </div>
    <div className="text-sm text-green-600 mt-1 text-right">
      Tiết kiệm {formatCurrencyVND(totalDiscount)}
    </div>
    <p className="text-[11px] text-gray-400 text-right">
      (Đã bao gồm VAT nếu có)
    </p>
  </div>
</div>


        <button
          onClick={handlePlaceOrder}
          className="block text-center hover:opacity-85 w-full bg-primary text-white font-semibold py-3 rounded-md transition"
        >
          Đặt hàng
        </button>

        <p className="text-[11px] text-gray-400 text-center mt-2">
          Bằng việc nhấn <strong>Đặt hàng</strong>, bạn đồng ý với{' '}
          <a href="#" className="text-blue-500 underline">Điều khoản dịch vụ</a> và{' '}
          <a href="#" className="text-blue-500 underline">Chính sách xử lý dữ liệu cá nhân</a> của PHT Shop
        </p>
      </aside>

      {isPromoModalOpen && (
<PromoModal
  onClose={() => setIsPromoModalOpen(false)}
  onApplySuccess={handleApplyPromo}
  appliedCode={selectedCoupon?.code || ''}
  orderTotal={Number(totalAmount) || 0}
  skuId={selectedSkuId} // ✅ THÊM DÒNG NÀY
/>


      )}
    </div>
  );
};

export default OrderSummary;
