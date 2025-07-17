import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  cartItems: [],

  // Đặt danh sách cart từ API
  setCartItems: (items) => set({ cartItems: items }),

  // Thêm sản phẩm
  addToCart: (newItem) => {
    const { cartItems } = get();
    const existingIndex = cartItems.findIndex((item) => item.skuId === newItem.skuId);

    if (existingIndex !== -1) {
      // Nếu đã có sản phẩm, tăng số lượng
      const updatedItems = [...cartItems];
      updatedItems[existingIndex].quantity += newItem.quantity;
      set({ cartItems: updatedItems });
    } else {
      set({ cartItems: [...cartItems, newItem] });
    }
  },

  // Cập nhật số lượng
  updateQuantity: (skuId, newQuantity) => {
    const updatedItems = get().cartItems.map((item) =>
      item.skuId === skuId ? { ...item, quantity: newQuantity } : item
    );
    set({ cartItems: updatedItems });
  },

  // Xóa 1 sản phẩm khỏi giỏ hàng
  removeFromCart: (skuId) => {
    set({
      cartItems: get().cartItems.filter((item) => item.skuId !== skuId),
    });
  },

  // Xóa toàn bộ
  clearCart: () => set({ cartItems: [] }),

  // Selector: tổng số lượng sản phẩm
  totalQuantity: () => get().cartItems.reduce((sum, item) => sum + item.quantity, 0),
}));
