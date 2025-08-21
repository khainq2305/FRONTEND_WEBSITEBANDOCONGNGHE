import React from "react";

const OrderInfo = ({ data }) => {
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0₫";
    const num = parseFloat(amount);
    if (isNaN(num)) return "0₫";
    return `${num.toLocaleString('vi-VN')}₫`;
  };

  const getShippingMethodName = (id) => {
    switch (id) {
      case 1: return "Giao hàng nhanh (GHN)";
      case 2: return "Giao hàng tiết kiệm (GHTK)";
      case 3: return "Viettel Post";
      default: return "Chưa xác định";
    }
  };
const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case "processing":
      return "Chờ xử lý";
    case "shipping":
      return "Đang giao";
    case "delivered":
      return "Đã giao";
    case "completed":
      return "Hoàn tất";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Không rõ";
  }
};

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cod":
      case "Thanh toán khi nhận hàng (COD)":
        return "Thanh toán khi nhận hàng (COD)";
      case "momo":
      case "Ví MoMo":
        return "Ví MoMo";
      case "zalopay":
      case "Ví ZaloPay":
        return "Ví ZaloPay";
      case "atm":
      case "Chuyển khoản ngân hàng":
        return "Chuyển khoản ngân hàng";
      case "vnpay":
      case "VNPay":
        return "VNPay";
      default:
        return method || "Không rõ";
    }
  };

  // Function to determine status badge color
  const getStatusBadgeClass = (status) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "DELIVERING":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-6 mb-4 border border-gray-200 rounded-lg bg-white shadow-xl p-6 md:p-8 space-y-8">
      {/* Top Section: Customer Info and Order Info - Grouped and Balanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-12">
        {/* Customer Information Column */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Thông tin khách hàng</h3>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium text-gray-800">Khách hàng:</span> <span className="font-semibold">{data.customer}</span>
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium text-gray-800">SĐT:</span> <span className="font-semibold">{data.phone}</span>
          </p>
          <p className="text-sm text-gray-700">
  <span className="font-medium text-gray-800">Địa chỉ:</span>{" "}
  <span className="font-semibold">{data.address || "Không rõ"}</span>
</p>

        </div>

        {/* Order Information Column */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Thông tin đơn hàng</h3>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium text-gray-800">Mã đơn:</span>{" "}
            <span className="font-bold text-blue-700 text-base">{data.code}</span>
          </p>
         <p className="text-sm text-gray-700 mb-2">
  <span className="font-medium text-gray-800">Trạng thái:</span>{" "}
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(data.status)}`}>
    {getStatusText(data.status)}
  </span>
</p>

          {data.paymentMethod && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium text-gray-800">PTTT:</span>{" "}
              <span className="font-normal text-gray-800">{getPaymentMethodText(data.paymentMethod)}</span>
            </p>
          )}
          {data.shippingProviderId && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium text-gray-800">PTVC:</span>{" "}
              <span className="font-normal text-gray-800">{getShippingMethodName(data.shippingProviderId)}</span>
            </p>
          )}
          {data.shippingFee !== undefined && data.shippingFee !== null && (
            <p className="text-sm text-gray-700">
              <span className="font-medium text-gray-800">Phí VC:</span>{" "}
              <span className="font-normal text-gray-800">{formatCurrency(data.shippingFee)}</span>
            </p>
          )}
        </div>
      </div>

      {/* Product List Section - Reverted to original style */}
      <div >
        <h4 className="font-semibold text-gray-800 mb-3 text-base">Danh sách sản phẩm</h4>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="border border-gray-200 px-4 py-3 text-left font-medium">Sản phẩm</th>
              <th className="border border-gray-200 px-4 py-3 text-center font-medium w-24">Số lượng</th>
              <th className="border border-gray-200 px-4 py-3 text-right font-medium w-32">Giá</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((item, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">{item.name}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">{item.quantity}</td>
                <td className="border border-gray-200 px-4 py-2 text-right">{formatCurrency(item.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Price Section */}
      <div className="text-right text-xl font-bold text-gray-800 pt-6 border-t border-gray-200">
        Tổng tiền: <span className="text-red-600 ml-2">{formatCurrency(data.totalPrice)}</span>
      </div>
    </div>
  );
};

export default OrderInfo;