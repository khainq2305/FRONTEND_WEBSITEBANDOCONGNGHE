// src/pages/CartPage.jsx
import React, { useState } from "react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

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
  const [checkedItems, setCheckedItems] = useState(dummyItems.map(() => true));
  const isAllChecked = checkedItems.every(Boolean);

  const toggleAll = () => {
    setCheckedItems(checkedItems.map(() => !isAllChecked));
  };

  const handleToggleChecked = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 pb-20">
      {/* Breadcrumb */}
      <nav className="py-3 text-xs sm:text-sm text-blue-500 whitespace-normal">
        <a href="#" className="hover:underline">Trang chủ</a> / <span>Giỏ hàng</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Danh sách sản phẩm */}
        <section className="w-full lg:w-[calc(100%-1rem)] lg:w-2/3 bg-white rounded-md p-3 sm:p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-y-2">
            <div
              onClick={toggleAll}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div
                className={`w-5 h-5 border rounded-sm flex items-center justify-center ${isAllChecked ? "bg-red-600 border-red-600" : "border-gray-400"
                  }`}
              >
                {isAllChecked && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <span className="text-sm">Chọn tất cả ({dummyItems.length})</span>
            </div>
            <button className="text-gray-400 hover:text-red-600">
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:gap-5">
            {dummyItems.map((item, index) => (
              <CartItem
                key={item.id}
                item={item}
                isChecked={checkedItems[index]}
                onToggleChecked={() => handleToggleChecked(index)}
              />
            ))}
          </div>
        </section>

        {/* Tóm tắt đơn hàng */}
        <aside className="w-full lg:w-1/3 mt-6 lg:mt-0">
          {checkedItems.some((c) => c) && (
            <div className="sticky top-20">
              <CartSummary />
            </div>
          )}
        </aside>
      </div>
    </main>
  );
};

export default CartPage;