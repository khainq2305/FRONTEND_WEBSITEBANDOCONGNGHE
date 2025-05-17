// src/pages/CartPage.jsx
import React, { useState } from "react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { FiTrash2 } from "react-icons/fi";

const dummyItems = [
  {
    id: 1,
    name: "Huawei Watch Fit 3 Đen",
    color: "Đen",
    warranty: true,
    price: "2.390.000",
    originalPrice: "2.990.000",
    image:
      "https://storage.googleapis.com/a1aa/image/3e879426-3b4b-4cd9-ee28-23048412636f.jpg ",
    quantity: 1,
    warrantyOptions: [
      {
        label: "Đặc quyền Bảo hành thêm 1 năm MTXT (BT)",
        price: "+800.000 đ",
        oldPrice: "2.400.000 đ",
      },
    ],
  },
  {
    id: 2,
    name: "Máy lạnh Casper Inverter 1 HP (9300 BTU) GC-09IS35",
    color: "Trắng",
    warranty: false,
    price: "5.790.000",
    originalPrice: "7.990.000",
    image:
      "https://storage.googleapis.com/a1aa/image/35970635-d5f7-4386-b7ee-0491451ffdaf.jpg ",
    quantity: 1,
  },
];

const CartPage = () => {
  const [cartItems, setCartItems] = useState(dummyItems);
  const [checkedItems, setCheckedItems] = useState(cartItems.map(() => true));
  const isAllChecked = cartItems.length > 0 && checkedItems.every(Boolean);
  const hasSelectedItems = cartItems.length > 0 && checkedItems.some(Boolean); // BIẾN MỚI

  const toggleAll = () => {
    setCheckedItems(cartItems.map(() => !isAllChecked));
  };

  const handleToggleChecked = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const handleDeleteSelected = () => {
    if (!hasSelectedItems) { // Sử dụng hasSelectedItems
        alert("Vui lòng chọn sản phẩm để xóa.");
        return;
    }
    const newCartItems = cartItems.filter((item, index) => !checkedItems[index]);
    const newCheckedItems = newCartItems.map(() => false);
    setCartItems(newCartItems);
    setCheckedItems(newCheckedItems);
    alert("Đã xóa các sản phẩm đã chọn!");
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 pb-20">
      <nav className="py-3 text-xs sm:text-sm text-blue-500 whitespace-normal">
        <a href="#" className="hover:underline">Trang chủ</a> / <span>Giỏ hàng</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        <section className="w-full lg:w-2/3 bg-white rounded-md p-3 sm:p-4 border border-gray-200">
          <div className="flex justify-between items-center ml-3 mb-3 sm:mb-4 flex-wrap gap-y-2">
            <div
              onClick={toggleAll}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div
                className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-colors ${
                  isAllChecked
                    ? "bg-primary border-primary"
                    : "border-gray-400 bg-white"
                }`}
              >
                {isAllChecked && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <span className="text-sm text-gray-700">Chọn tất cả ({cartItems.length})</span>
            </div>
            <button
              onClick={handleDeleteSelected}
              className="text-gray-500 hover:text-red-600 p-1 transition-colors"
              title="Xóa các mục đã chọn"
              disabled={!hasSelectedItems} // Có thể disable cả nút xóa nếu không có gì được chọn
            >
              <FiTrash2 size={20} />
            </button>
          </div>

          {cartItems.length > 0 ? (
            <div className="flex flex-col gap-3 sm:gap-5">
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.id}
                  item={item}
                  isChecked={checkedItems[index]}
                  onToggleChecked={() => handleToggleChecked(index)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Giỏ hàng của bạn đang trống.</p>
          )}
        </section>

        <aside className="w-full lg:w-1/3 mt-6 lg:mt-0">
          {/* CartSummary sẽ luôn hiển thị nếu có sản phẩm trong giỏ */}
          {cartItems.length > 0 && (
            <div className="sticky top-20">
              <CartSummary hasSelectedItems={hasSelectedItems} /> {/* TRUYỀN PROP XUỐNG */}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
};

export default CartPage;