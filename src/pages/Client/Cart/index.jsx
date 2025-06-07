// src/pages/Client/CartPage/CartPage.jsx

import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import { FiTrash2 } from "react-icons/fi";
import { cartService } from "../../../services/client/cartService";
import { formatCurrencyVND } from "../../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmDelete } from "../../../components/common/ConfirmDeleteDialog";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();

  const isAllChecked = cartItems.length > 0 && checkedItems.every(Boolean);
  const hasSelectedItems = cartItems.length > 0 && checkedItems.some(Boolean);
  const selectedItems = cartItems.filter((_, index) => checkedItems[index]);

  const totals = {
    totalPrice: selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ),
    totalDiscount: selectedItems.reduce(
      (sum, item) => sum + (item.price - item.finalPrice) * item.quantity,
      0
    ),
    payablePrice: selectedItems.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity,
      0
    ),
    rewardPoints:
      "+" +
      selectedItems.reduce(
        (sum, item) => sum + Math.floor((item.finalPrice * item.quantity) / 1000000),
        0
      ),
  };

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      const items = response.data?.cartItems || [];
      const formattedItems = items.map((item) => ({
        ...item,
        name: item.productName,
        price: Number(item.price),
        finalPrice: Number(item.finalPrice),
      }));

      // Preserve checked state for existing items
      const currentCheckedMap = {};
      cartItems.forEach((item, index) => {
        currentCheckedMap[item.id] = checkedItems[index];
      });
      const newChecked = formattedItems.map(
        (item) => currentCheckedMap[item.id] ?? false
      );

      setCartItems(formattedItems);
      setCheckedItems(newChecked);
    } catch (error) {
      console.error("Lỗi khi cập nhật giỏ hàng:", error);
      toast.error("Không thể tải giỏ hàng. Vui lòng thử lại.", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
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

  const handleDeleteSelected = async () => {
    if (!hasSelectedItems) {
      toast.info("Vui lòng chọn sản phẩm để xóa.", { position: "top-right" });
      return;
    }

    const itemIdsToDelete = selectedItems.map((item) => item.id);
    const isConfirmed = await confirmDelete(
      "xoá",
      `các sản phẩm đã chọn (${selectedItems.length})`
    );

    if (isConfirmed) {
      try {
        await cartService.deleteMultiple(itemIdsToDelete);
        toast.success("Đã xóa các sản phẩm đã chọn khỏi giỏ hàng!", {
          position: "top-right",
        });
        fetchCart(); // Re-fetch cart after deletion
      } catch (error) {
        console.error("Lỗi khi xóa nhiều sản phẩm:", error);
        const msg =
          error.response?.data?.message ||
          "Không thể xóa các sản phẩm đã chọn.";
        toast.error(msg, { position: "top-right" });
      }
    }
  };

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.info("Vui lòng chọn ít nhất một sản phẩm để thanh toán.", {
        position: "top-right",
      });
      return;
    }
    localStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
    navigate("/checkout");
  };

  return (
    <main className="max-w-screen-xl mx-auto px-4 pb-20">
      <nav className="py-3 text-xs sm:text-sm text-blue-500 whitespace-normal">
        <a href="/" className="hover:underline">
          Trang chủ
        </a>{" "}
        / <span>Giỏ hàng</span>
      </nav>

      {/* ✅ BẮT ĐẦU THAY ĐỔI CẤU TRÚC TỪ ĐÂY */}
      {cartItems.length > 0 ? (
        // If there are items, render 2-column layout
        <div className="flex flex-col lg:flex-row gap-6">
          <section className="w-full lg:w-2/3">
            <div className="bg-white rounded-md p-3 sm:p-4 border border-gray-200">
              {/* Cart Header */}
              <div className="flex items-center h-11 mb-3 sm:mb-4">
                <div
                  onClick={toggleAll}
                  className="flex items-center gap-2 cursor-pointer pl-3 sm:pl-4 flex-grow"
                >
                  <div
                    className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-colors ${
                      isAllChecked
                        ? "bg-primary border-primary"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {isAllChecked && (
                      <span className="text-white text-xs font-bold">✓</span>
                    )}
                  </div>
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

              {/* Product List */}
              <div className="flex flex-col gap-3 sm:gap-5">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isChecked={checkedItems[index]}
                    onToggleChecked={() => handleToggleChecked(index)}
                    onQuantityChange={fetchCart} // Pass fetchCart to refresh
                  />
                ))}
              </div>
            </div>
          </section>

          <aside className="w-full lg:w-1/3 mt-6 lg:mt-0">
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
          </aside>
        </div>
      ) : (
        // If cart is empty, render EmptyCart component (full width)
        <div className="w-full">
          <EmptyCart />
        </div>
      )}
      {/* KẾT THÚC THAY ĐỔI CẤU TRÚC */}
    </main>
  );
};

export default CartPage;