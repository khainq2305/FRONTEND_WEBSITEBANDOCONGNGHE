import React, { useState, useEffect } from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import { FiTrash2 } from 'react-icons/fi';
import { cartService } from '../../../services/client/cartService';
import { formatCurrencyVND } from '../../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import Breadcrumb from '../../../components/common/Breadcrumb';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const isAllChecked = cartItems.length > 0 && cartItems.every((item, index) => item.stock <= 0 || checkedItems[index]);

  const hasSelectedItems = cartItems.length > 0 && checkedItems.some(Boolean);
  const selectedItems = cartItems.filter((_, index) => checkedItems[index]);

  // CartPage.jsx
const totals = selectedItems.reduce(
  (acc, item) => {
    const qty       = item.quantity;
    const original  = item.originalPrice * qty;   // ✅ giá niêm yết
    const current   = item.finalPrice   * qty;    // ✅ giá thực trả

    acc.totalPrice    += original;                // Tổng tiền hàng (niêm yết)
    acc.totalDiscount += original - current;      // Giảm giá từ SP
    acc.payablePrice  += current;                 // Cần thanh toán trước coupon
    acc.rewardPoints  += Math.floor(current / 1_000_000);
    return acc;
  },
  { totalPrice: 0, totalDiscount: 0, payablePrice: 0, rewardPoints: 0 },
   
  );
  totals.rewardPoints = '+' + totals.rewardPoints;

  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount || 0) : 0;
  const payableAfterCoupon = Math.max(0, totals.payablePrice - discountAmount);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      const items = response.data?.cartItems || [];
   const formattedItems = items.map((item) => ({
  ...item,
  name: item.productName,
  originalPrice: Number(item.originalPrice), // ✅ đúng trường
  price        : Number(item.price),         // (nếu vẫn cần tới price)
  finalPrice   : Number(item.finalPrice),
  flashSaleId  : item.flashSaleId || null
}));

      const newChecked = formattedItems.map((item) => !!item.isSelected && item.stock > 0);

      setCartItems(formattedItems);
      setCheckedItems(newChecked);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
      toast.error('Không thể tải giỏ hàng. Vui lòng thử lại.', {
        position: 'top-right'
      });
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('appliedCoupon');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.code) setAppliedCoupon(parsed);
      } catch (e) {
        localStorage.removeItem('appliedCoupon');
      }
    }
  }, []);

  const toggleAll = async () => {
    const targetValue = !isAllChecked;

    try {
      const itemsToUpdate = cartItems.filter((item) => item.stock > 0);

      const updates = itemsToUpdate.map((item) => cartService.updateSelected({ cartItemId: item.id, isSelected: targetValue }));

      await Promise.all(updates);

      setCheckedItems(cartItems.map((item) => (item.stock > 0 ? targetValue : false)));
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái chọn tất cả!', {
        position: 'top-right'
      });
    }
  };

  const handleToggleChecked = async (index) => {
    const item = cartItems[index];

    if (item.stock <= 0) {
      toast.warn('Sản phẩm này đã hết hàng và không thể chọn.', { position: 'top-right' });
      return;
    }

    const newCheckedState = !checkedItems[index];
    try {
      await cartService.updateSelected({
        cartItemId: item.id,
        isSelected: newCheckedState
      });
      const updated = [...checkedItems];
      updated[index] = newCheckedState;
      setCheckedItems(updated);
    } catch (err) {
      toast.error('Không thể cập nhật trạng thái chọn!', {
        position: 'top-right'
      });
      console.error('Lỗi update isSelected:', err);
    }
  };

  const handleDeleteSelected = async () => {
    if (!hasSelectedItems) {
      toast.info('Vui lòng chọn sản phẩm để xóa.', { position: 'top-right' });
      return;
    }

    const itemIdsToDelete = selectedItems.map((item) => item.id);
    const isConfirmed = await confirmDelete('xoá', `các sản phẩm đã chọn (${selectedItems.length})`);

    if (isConfirmed) {
      try {
        await cartService.deleteMultiple(itemIdsToDelete);
        toast.success('Đã xóa các sản phẩm đã chọn khỏi giỏ hàng!', {
          position: 'top-right'
        });
        fetchCart();
      } catch (error) {
        console.error('Lỗi khi xóa nhiều sản phẩm:', error);
        const msg = error.response?.data?.message || 'Không thể xóa các sản phẩm đã chọn.';
        toast.error(msg, { position: 'top-right' });
      }
    }
  };

  useEffect(() => {
    if (selectedItems.length === 0 && appliedCoupon) {
      setAppliedCoupon(null);
      localStorage.removeItem('appliedCoupon');
    }
  }, [selectedItems, appliedCoupon]);

  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      toast.info('Vui lòng chọn ít nhất một sản phẩm để thanh toán.', {
        position: 'top-right'
      });
      return;
    }
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
    navigate('/checkout', { replace: true });
  };

  return (
    <main className="max-w-[1200px] mx-auto pb-20">
      <div className="py-3">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng' }]} />
      </div>

      {cartItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-6">
          <section className="w-full lg:w-2/3">
            <div className="bg-white rounded-md p-3 sm:p-4 border border-gray-200">
              <div className="flex items-center h-11 mb-3 sm:mb-4">
                <div onClick={toggleAll} className="flex items-center gap-2 cursor-pointer pl-3 sm:pl-4 flex-grow">
                  <div
                    className={`w-5 h-5 border rounded-sm flex items-center justify-center transition-colors ${
                      isAllChecked ? 'bg-primary border-primary' : 'border-gray-400 bg-white'
                    }`}
                  >
                    {isAllChecked && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <span className="text-sm text-gray-700 min-w-0 truncate mr-2">
                    Chọn tất cả ({cartItems.filter((item) => item.stock > 0).length} sản phẩm còn hàng) {/* Sửa lại số lượng hiển thị */}
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

              <div className="flex flex-col gap-3 sm:gap-5">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isChecked={checkedItems[index]}
                    onToggleChecked={() => handleToggleChecked(index)}
                    onQuantityChange={fetchCart}
                  />
                ))}
              </div>
            </div>
          </section>

          <aside className="w-full lg:w-1/3 lg:sticky lg:top-35 self-start h-fit mt-6 lg:mt-0">
            <CartSummary
              hasSelectedItems={hasSelectedItems}
              selectedItems={selectedItems}
              appliedCoupon={appliedCoupon}
              discountAmount={discountAmount}
              orderTotals={{
                totalPrice: totals.totalPrice,
                totalDiscount: totals.totalDiscount,
                payablePrice: payableAfterCoupon,
                rewardPoints: totals.rewardPoints
              }}
              onCheckout={handleProceedToCheckout}
              setAppliedCoupon={setAppliedCoupon}
            />
          </aside>
        </div>
      ) : (
        <div className="w-full">
          <EmptyCart />
        </div>
      )}
    </main>
  );
};

export default CartPage;
