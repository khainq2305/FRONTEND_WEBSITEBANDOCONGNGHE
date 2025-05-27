import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { FiTrash2 } from "react-icons/fi";
import { cartService } from "../../../services/client/cartService";
import { formatCurrencyVND } from "../../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  const isAllChecked = cartItems.length > 0 && checkedItems.every(Boolean);
  const hasSelectedItems = cartItems.length > 0 && checkedItems.some(Boolean);

  const selectedItems = cartItems.filter((_, index) => checkedItems[index]);

  const totals = {
    totalPrice: selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    totalDiscount: selectedItems.reduce((sum, item) => sum + (item.price - item.finalPrice) * item.quantity, 0),
    payablePrice: selectedItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0),
    rewardPoints:
      "+" + selectedItems.reduce((sum, item) => sum + Math.floor(item.finalPrice * item.quantity / 1000000), 0),
  };

  const handleQuantityChange = async () => {
    try {
      const response = await cartService.getCart();
      const items = response.data?.cartItems || [];

      const formattedItems = items.map(item => ({
        ...item,
        name: item.productName,
        price: Number(item.price),
        finalPrice: Number(item.finalPrice),
      }));

      const currentCheckedMap = {};
      cartItems.forEach((item, index) => {
        currentCheckedMap[item.id] = checkedItems[index];
      });

      const newChecked = formattedItems.map(item => currentCheckedMap[item.id] ?? false);

      setCartItems(formattedItems);
      setCheckedItems(newChecked);
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await cartService.getCart();
        const items = response.data?.cartItems || [];

        const formattedItems = items.map(item => ({
          ...item,
          name: item.productName,
          price: Number(item.price),
          finalPrice: Number(item.finalPrice),
        }));

        setCartItems(formattedItems);

        const storedSelected = JSON.parse(localStorage.getItem("selectedCartItems") || "[]");
        const selectedIdMap = new Set(storedSelected.map(i => i.id));

        const checked = formattedItems.map(item => selectedIdMap.has(item.id));
        setCheckedItems(checked);
      } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng:", error);
      }
    };

    fetchCart();
  }, []);

  const toggleAll = () => {
    setCheckedItems(cartItems.map(() => !isAllChecked));
  };

  const handleToggleChecked = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const handleDeleteSelected = () => {
    if (!hasSelectedItems) {
      alert("Vui lòng chọn sản phẩm để xóa.");
      return;
    }
    // LƯU Ý: Phần logic xóa này bạn cần tự hoàn thiện việc gọi API để xóa trên server
    const newCartItems = cartItems.filter((_, index) => !checkedItems[index]);
    setCartItems(newCartItems);
    setCheckedItems(newCartItems.map(() => false));
    alert("Đã xóa các sản phẩm đã chọn!"); // Cân nhắc cập nhật sau khi API thành công
  };

  const handleProceedToCheckout = () => {
    const selectedCartItems = cartItems.filter((_, index) => checkedItems[index]);
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedCartItems));
    navigate("/checkout");
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 pb-20">
      <nav className="py-3 text-xs sm:text-sm text-blue-500 whitespace-normal">
        <a href="/" className="hover:underline">Trang chủ</a> / <span>Giỏ hàng</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        <section className="w-full lg:w-2/3 bg-white rounded-md p-3 sm:p-4 border border-gray-200">
          {/* ================= BẮT ĐẦU PHẦN SỬA ĐỔI HEADER ================= */}
        <div className="flex items-center h-11 mb-3 sm:mb-4">
          <div
            onClick={toggleAll}
            // THAY ĐỔI Ở ĐÂY: Thêm 'flex-grow' vào div này
            className="flex items-center gap-2 cursor-pointer pl-3 sm:pl-4 flex-grow"
          >
            <div className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-colors ${
              isAllChecked ? "bg-primary border-primary" : "border-gray-400 bg-white"
            }`}>
              {isAllChecked && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            {/* Tùy chọn: có thể bỏ 'flex-grow' ở span này nếu div cha đã có */}
            <span className="text-sm text-gray-700 min-w-0 truncate mr-2"> 
              Chọn tất cả ({cartItems.length})
            </span>
          </div>

          <button
            onClick={handleDeleteSelected}
            className="text-gray-500 hover:text-red-600 p-1 transition-colors flex-shrink-0 mr-3 sm:mr-4"
            title="Xóa các mục đã chọn"
            disabled={!hasSelectedItems}
          >
            <FiTrash2 size={20} />
          </button>
        </div>
          {/* ================= KẾT THÚC PHẦN SỬA ĐỔI HEADER ================= */}

          {cartItems.length > 0 ? (
            <div className="flex flex-col gap-3 sm:gap-5">
              {cartItems.map((item, index) => (
                <CartItem
                  key={item.id}
                  item={item}
                  isChecked={checkedItems[index]}
                  onToggleChecked={() => handleToggleChecked(index)}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Giỏ hàng của bạn đang trống.</p>
          )}
        </section>

        <aside className="w-full lg:w-1/3 mt-6 lg:mt-0">
          {cartItems.length > 0 && (
            <div className="sticky top-20">
              <CartSummary
                hasSelectedItems={hasSelectedItems}
                selectedItems={selectedItems}
                orderTotals={{
                  totalPrice: formatCurrencyVND(totals.totalPrice),
                  totalDiscount: formatCurrencyVND(totals.totalDiscount),
                  payablePrice: formatCurrencyVND(totals.payablePrice),
                  rewardPoints: totals.rewardPoints,
                }}
                onCheckout={handleProceedToCheckout}
              />
            </div>
          )}
        </aside>
      </div>
    </main>
  );
};

export default CartPage;