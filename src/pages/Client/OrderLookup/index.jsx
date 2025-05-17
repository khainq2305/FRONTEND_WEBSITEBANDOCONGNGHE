import React, { useState } from "react";
import FormLookup from "./FormLookup";
import OrderInfo from "./OrderInfo";
import OrderLookupBreadcrumb from "./OrderLookup";

const OrderLookup = () => {
  const [orderData, setOrderData] = useState(null); 
  const [error, setError] = useState("");

  const handleLookup = async (phone, code) => {
    try {
      setError("");
      if (phone === "0909123456" && code === "DH123456") {
        setOrderData({
          customer: "Nguyễn Văn A",
          phone,
          code,
          products: [
            { name: "iPhone 15", quantity: 1, price: 25000000 },
            { name: "Ốp lưng", quantity: 2, price: 200000 },
          ],
          total: 25400000,
          status: "Đang giao",
        });
      } else {
        setError("Không tìm thấy đơn hàng. Vui lòng kiểm tra lại.");
        setOrderData(null);
      }
    } catch (err) {
      setError("Lỗi hệ thống. Vui lòng thử lại sau.");
    }
  };

  return (
  <div className="w-full min-h-screen py-10 px-4 bg-gray-100">
    <div className="w-full max-w-[1280px] mx-auto">
      {/* Breadcrumb */}
      <OrderLookupBreadcrumb currentPage="Tra cứu đơn hàng" />

      
      <FormLookup onSubmit={handleLookup} />
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {orderData && <OrderInfo data={orderData} />}
    </div>
  </div>
);

};

export default OrderLookup;
