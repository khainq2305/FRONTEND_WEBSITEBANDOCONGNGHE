import React from 'react';

const CheckoutForm = () => {
  return (
    <div className="space-y-6 text-sm">
      {/* Người đặt hàng */}
      <section className="bg-white rounded-lg p-4 shadow-sm space-y-3">
        <h2 className="font-semibold">Người đặt hàng</h2>
        <input
          type="text"
          placeholder="Họ và tên"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
        <input
          type="email"
          placeholder="Email (Không bắt buộc)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />
      </section>

      {/* Hình thức nhận hàng */}
      <section className="bg-white rounded-lg p-4 shadow-sm space-y-3">
        <h2 className="font-semibold">Hình thức nhận hàng</h2>
        <label className="flex items-center gap-2">
          <input type="radio" name="delivery" defaultChecked className="accent-red-500" />
          Giao hàng tận nơi
        </label>

        <input
          type="text"
          placeholder="Tỉnh/Thành Phố, Quận/Huyện, Phường/Xã"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />

        <textarea
          rows="3"
          maxLength={128}
          placeholder="Ghi chú (Ví dụ: Hãy gọi tôi khi chuẩn bị hàng xong)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
        />

        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Nhờ người khác nhận hàng
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Yêu cầu hỗ trợ kỹ thuật
          </label>
        </div>
      </section>

      {/* Xuất hóa đơn điện tử */}
      <section className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
        <span className="font-semibold text-sm">Xuất hóa đơn điện tử</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-500 peer-focus:ring-2 peer-focus:ring-red-300 after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
        </label>
      </section>
    </div>
  );
};

export default CheckoutForm;
