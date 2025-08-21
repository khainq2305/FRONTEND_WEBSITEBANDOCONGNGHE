import React, { useState } from "react";
import FormLookup from "./FormLookup";
import OrderInfo from "./OrderInfo";
import OrderLookupBreadcrumb from "./OrderLookup";
import { orderService } from "../../../services/client/orderService"; // sửa đúng path bạn dùng

const OrderLookup = () => {
  const [orderData, setOrderData] = useState(null); 
  const [error, setError] = useState("");

  const handleLookup = async (phone, code) => {
  try {
    setError("");
    const res = await orderService.lookupOrder(code, phone);
    const order = res?.data;

    setOrderData({
      customer: order.customer,
      phone: order.phone,
      code: order.code,
       address: order.address, // ✅ THÊM DÒNG NÀY
      status: order.status,
      totalPrice: order.totalPrice || 0,
      shippingProviderId: order.shippingProviderId,
      paymentMethod: order.paymentMethod,
      shippingFee: order.shippingFee,
      products: order.products || []
    });
  } catch (err) {
    console.error(err);
    if (err.response?.status === 404) {
      setError("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại.");
    } else {
      setError("Lỗi hệ thống. Vui lòng thử lại sau.");
    }
    setOrderData(null);
  }
};


  return (
    <div className="w-full min-h-screen px-2 bg-gray-100">
      <div className="w-full max-w-[1200px] mx-auto">
        <OrderLookupBreadcrumb currentPage="Tra cứu đơn hàng" />
        <FormLookup onSubmit={handleLookup} />
        {error && <p className="text-red-500 text-center">{error}</p>}
        {orderData && <OrderInfo data={orderData} />}
      </div>
    </div>
  );
};

export default OrderLookup;
