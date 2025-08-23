import React from "react";

const OrderInfo = ({ data }) => {
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "0₫";
    const num = parseFloat(amount);
    if (isNaN(num)) return "0₫";
    return `${num.toLocaleString("vi-VN")}₫`;
  };

  const getShippingMethodName = (id) => {
    switch (id) {
      case 1:
        return "Giao hàng nhanh (GHN)";
      case 2:
        return "Giao hàng tiết kiệm (GHTK)";
      case 3:
        return "Viettel Post";
      default:
        return "Chưa xác định";
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
    switch (method?.toLowerCase()) {
      case "cod":
      case "thanh toán khi nhận hàng":
      case "thanh toán khi nhận hàng (cod)":
        return "Thanh toán khi nhận hàng (COD)";

      case "atm":
      case "chuyển khoản ngân hàng":
        return "Chuyển khoản ngân hàng";

      case "vnpay":
      case "vn pay":
      case "thanh toán bằng ví vnpay":
        return "Thanh toán bằng ví VNPay";

      case "momo":
      case "ví momo":
        return "Ví MoMo";

      case "zalopay":
      case "ví zalopay":
        return "Ví ZaloPay";

      case "stripe":
      case "visa":
      case "mastercard":
      case "thanh toán quốc tế visa/mastercard":
        return "Thanh toán quốc tế Visa/Mastercard";

      case "internalwallet":
      case "tài khoản cyberzone":
        return "Ví nội bộ CyBerZone";

      case "payos":
      case "vietqr":
      case "chuyển khoản ngân hàng qua vietqr":
        return "Chuyển khoản qua VietQR";

      default:
        return method || "Không rõ";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "DELIVERING":
      case "SHIPPING":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-6 mb-8 border border-gray-200 rounded-lg bg-white shadow-lg p-6 md:p-8 space-y-8">
      {/* Header: Customer & Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
            Thông tin khách hàng
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Khách hàng:</span>{" "}
            <span className="font-semibold">{data.customer}</span>
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">SĐT:</span>{" "}
            <span className="font-semibold">{data.phone}</span>
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Địa chỉ:</span>{" "}
            <span className="font-semibold">{data.address || "Không rõ"}</span>
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
            Thông tin đơn hàng
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Mã đơn:</span>{" "}
            <span className="font-bold text-blue-700 text-base">
              {data.code}
            </span>
          </p>
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Trạng thái:</span>{" "}
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                data.status
              )}`}
            >
              {getStatusText(data.status)}
            </span>
          </p>
          {data.paymentMethod && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">PTTT:</span>{" "}
              <span>{getPaymentMethodText(data.paymentMethod)}</span>
            </p>
          )}
          {data.paymentStatus && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Trạng thái thanh toán:</span>{" "}
              <span
                className={`${
                  data.paymentStatus === "paid"
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }`}
              >
                {data.paymentStatus === "paid"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </span>
            </p>
          )}
          {data.shippingProviderId && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">PTVC:</span>{" "}
              <span>{getShippingMethodName(data.shippingProviderId)}</span>
            </p>
          )}
          {data.trackingCode && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Mã vận đơn:</span>{" "}
              <span className="font-semibold">{data.trackingCode}</span>
            </p>
          )}
          {data.createdAt && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Ngày tạo:</span>{" "}
              <span>
                {new Date(data.createdAt).toLocaleString("vi-VN")}
              </span>
            </p>
          )}
          {data.customerNote && (
            <p className="text-sm text-gray-700">
              <span className="font-medium">Ghi chú:</span>{" "}
              <span>{data.customerNote}</span>
            </p>
          )}
        </div>
      </div>

      {/* Product List */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-3 text-base">
          Danh sách sản phẩm
        </h4>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="border border-gray-200 px-4 py-3 text-left font-medium">
                Sản phẩm
              </th>
              <th className="border border-gray-200 px-4 py-3 text-center font-medium w-24">
                SL
              </th>
              <th className="border border-gray-200 px-4 py-3 text-right font-medium w-32">
                Giá
              </th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((item, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2">
                  {item.name}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {item.quantity}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-right">
                  {formatCurrency(item.price)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Price Breakdown */}
      <div className="text-sm text-gray-700 space-y-1 pt-6 border-t">
        <div className="flex justify-between">
          <span>Tạm tính:</span>
          <span>{formatCurrency(data.totalPrice)}</span>
        </div>
        {data.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá:</span>
            <span>-{formatCurrency(data.discount)}</span>
          </div>
        )}
        {data.shippingFee > 0 && (
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
            <span>{formatCurrency(data.shippingFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t">
          <span>Tổng thanh toán:</span>
          <span className="text-red-600">
            {formatCurrency(data.finalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
