import React from "react";

const OrderInfo = ({ data }) => {
  return (
    <div className="mt-6 border rounded-lg bg-white shadow p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600"><strong>Khách hàng:</strong> {data.customer}</p>
          <p className="text-sm text-gray-600"><strong>SĐT:</strong> {data.phone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600"><strong>Mã đơn:</strong> {data.code}</p>
          <p className="text-sm text-gray-600"><strong>Trạng thái:</strong> <span className="text-green-600 font-medium">{data.status}</span></p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-800 mb-2">Danh sách sản phẩm</h4>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-3 py-2">Sản phẩm</th>
              <th className="border px-3 py-2">Số lượng</th>
              <th className="border px-3 py-2">Giá</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((item, index) => (
              <tr key={index}>
                <td className="border px-3 py-2">{item.name}</td>
                <td className="border px-3 py-2">{item.quantity}</td>
                <td className="border px-3 py-2">{item.price.toLocaleString()}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right text-lg font-semibold text-gray-800">
        Tổng tiền: <span className="text-red-600">{data.total.toLocaleString()}đ</span>
      </div>
    </div>
  );
};

export default OrderInfo;
