import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSummary = ({ totalAmount, discount, shippingFee }) => {
  const navigate = useNavigate();
  const finalAmount = totalAmount - discount + shippingFee;

  const handlePlaceOrder = () => {
    navigate('/order-confirmation');
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm text-sm sticky top-6">
      <div className="space-y-4">
        <h2 className="font-semibold text-base mb-2">Chọn hoặc nhập ưu đãi</h2>
        <div className="text-xs text-gray-500 border rounded px-3 py-2">Đổi 0 điểm (-0đ)</div>

        <h3 className="font-semibold text-base mt-4">Thông tin đơn hàng</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Tổng tiền</span>
            <span>{totalAmount.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between">
            <span>Hóa đơn giảm giá</span>
            <span className="text-red-500">-{discount.toLocaleString('vi-VN')} ₫</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span className="text-green-600 font-medium">Miễn phí</span>
          </div>
        </div>

        <div className="flex justify-between text-base font-semibold border-t pt-3">
          <span>Cần thanh toán</span>
          <span className="text-red-600">{finalAmount.toLocaleString('vi-VN')} ₫</span>
        </div>

        <div className="text-green-600 text-sm">+5,336 điểm thưởng</div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-red-600 text-white rounded py-2 font-semibold hover:bg-red-700"
        >
          Đặt hàng
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          Bằng việc nhấn Đặt hàng, bạn đồng ý với <a className="text-blue-500 underline" href="#">Điều khoản dịch vụ</a> và <a className="text-blue-500 underline" href="#">chính sách xử lý dữ liệu cá nhân</a> của PHT Shop
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
