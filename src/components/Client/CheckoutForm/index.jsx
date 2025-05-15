import React from 'react';

const CheckoutForm = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm space-y-4 text-sm">
      <h2 className="font-semibold">Người đặt hàng</h2>
      <input
        type="text"
        placeholder="Họ và tên"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-red-500"
      />
      <input
        type="text"
        placeholder="Số điện thoại"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-red-500"
      />
      <input
        type="email"
        placeholder="Email (Không bắt buộc)"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-red-500"
      />

      <h2 className="font-semibold pt-2">Hình thức nhận hàng</h2>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-1">
          <input type="radio" name="delivery" defaultChecked className="accent-red-500" />
          Giao hàng tận nơi
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="delivery" className="accent-red-500" />
          Nhận tại cửa hàng
        </label>
      </div>
      <input
        type="text"
        placeholder="Tỉnh/Thành Phố, Quận/Huyện, Phường/Xã"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
      <textarea
        rows="3"
        placeholder="Ghi chú (Ví dụ: Hãy gọi tôi khi chuẩn bị hàng xong)"
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
      />
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Nhờ người khác nhận hàng
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" />
          Yêu cầu hỗ trợ kỹ thuật <i className="fas fa-question-circle text-gray-400"></i>
        </label>
      </div>
    </div>
  );
};

export default CheckoutForm;
