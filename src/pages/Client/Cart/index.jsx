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
import { couponService } from '../../../services/client/couponService';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const isAllChecked = cartItems.length > 0 && cartItems.every((item, index) => item.stock <= 0 || checkedItems[index]);
 const [isCartLoaded, setIsCartLoaded] = useState(false);   // ⭐
  const hasSelectedItems = cartItems.length > 0 && checkedItems.some(Boolean);
  const selectedItems = cartItems.filter((_, index) => checkedItems[index]);

useEffect(() => {
  // 1️⃣  Nếu chưa có mã nào đang áp → thoát
  if (!appliedCoupon) return;

  // 2️⃣  Lấy danh sách SKU mà coupon cho phép (backend trả về)
  const allowed = appliedCoupon.allowedSkuIds || [];

  // 3️⃣  Xác định mã vẫn hợp lệ?
  //    • allowed rỗng  → coupon áp cho mọi SKU
  //    • hoặc còn ít nhất 1 SKU đang chọn thuộc allowed
  const stillValid =
    allowed.length === 0 ||
    selectedItems.some(i => allowed.includes(i.skuId));

  // 4️⃣  Nếu KHÔNG còn hợp lệ → thông báo & gỡ mã
  if (!stillValid) {
    toast.info('Bạn đã bỏ sản phẩm đủ điều kiện, mã giảm giá bị gỡ.');
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
  }
}, [selectedItems, appliedCoupon]);


  // CartPage.jsx
  const totals = selectedItems.reduce(
    (acc, item) => {
      const qty = item.quantity;
      const original = item.originalPrice * qty; 
      const current = item.finalPrice * qty; 

      acc.totalPrice += original; 
      acc.totalDiscount += original - current;
      acc.payablePrice += current; 
      acc.rewardPoints += Math.floor(current / 1_000_000);
      return acc;
    },
    { totalPrice: 0, totalDiscount: 0, payablePrice: 0, rewardPoints: 0 }
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
        skuId: Number(item.skuId),        
        originalPrice: Number(item.originalPrice),
        price: Number(item.price),
        finalPrice: Number(item.finalPrice),
        flashSaleId: item.flashSaleId || null
      }));

      const newChecked = formattedItems.map((item) => !!item.isSelected && item.stock > 0);

      setCartItems(formattedItems);
      setCheckedItems(newChecked);
      setIsCartLoaded(true);           // ⭐ đã load xong
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

// CartPage.jsx
useEffect(() => {
  const saved = localStorage.getItem('appliedCoupon');
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);

    /* 1. Không có code → bỏ qua */
    if (!parsed?.code) return;

    /* 2. Hết hạn → xoá & thoát */
    if (parsed.expiryDate && new Date(parsed.expiryDate) < new Date()) {
      localStorage.removeItem('appliedCoupon');
      return;                      // <── quan trọng: thoát luôn, KHÔNG set nữa
    }

    /* 3. Vẫn hợp lệ → set vào state */
    setAppliedCoupon(parsed);

  } catch (err) {
    /* JSON hỏng → xoá */
    localStorage.removeItem('appliedCoupon');
  }
}, []);

/* ➊ Đặt NGAY dưới useEffect đang có (giữ nguyên useEffect cũ) */
useEffect(() => {
  if (!appliedCoupon) return;

  const skuIds = [...new Set(selectedItems.map(i => i.skuId))];
  const orderTotal = totals.payablePrice;

  // hàm kiểm tra lại coupon
  async function validate() {
    try {
      await couponService.applyCoupon({
        code: appliedCoupon.code,
        skuIds,
        orderTotal,
      });
      /* hợp lệ → không làm gì */
    } catch (err) {
      toast.warn(
        err.response?.data?.message || 'Mã giảm giá không còn hiệu lực.',
        { position: 'top-right' }
      );
      setAppliedCoupon(null);
      localStorage.removeItem('appliedCoupon');
    }
  }

  /* chạy ngay 1 lần */
  validate();

  /* lặp lại 60 giây/lần khi trang Cart đang mở */
  const id = setInterval(validate, 60_000);
  return () => clearInterval(id);
}, [appliedCoupon, selectedItems, totals.payablePrice]);

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
  if (!isCartLoaded) return;  // ⬅️ bỏ qua lần render đầu
  if (selectedItems.length === 0 && appliedCoupon) {
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
  }
}, [isCartLoaded, selectedItems, appliedCoupon]);
const handleProceedToCheckout = async () => {

  if (selectedItems.length === 0) {
    toast.info('Vui lòng chọn ít nhất một sản phẩm để thanh toán.', { position: 'top-right' });
    return;
  }
  const skuIdsForCoupon = [...new Set(
    selectedItems.map(i => Number(i.skuId)).filter(Boolean)  
  )];

  console.log('🚚 [CHECKOUT] payload', {
    code      : appliedCoupon?.code,
    orderTotal: totals.payablePrice,
    skuIds    : skuIdsForCoupon
  });
  if (appliedCoupon) {
    try {
      await couponService.applyCoupon({
        code      : appliedCoupon.code,
        orderTotal: totals.payablePrice,  
        skuIds    : skuIdsForCoupon
      });
    } catch (err) {
      const msg = err?.response?.data?.message ||
                  err.message ||
                  'Mã giảm giá không còn hợp lệ, vui lòng thử lại.';
      toast.error(msg, { position: 'top-right' });

     
      setAppliedCoupon(null);
      localStorage.removeItem('appliedCoupon');
      return;                             
    }
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
          <section className="w-full lg:w-[70%]">
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

          <aside className="w-full lg:w-[30%] lg:sticky lg:top-35 self-start h-fit mt-6 lg:mt-0">
            <CartSummary
              hasSelectedItems={hasSelectedItems}
              selectedItems={selectedItems}
              appliedCoupon={appliedCoupon}
            
              orderTotals={{
                totalPrice: totals.totalPrice,
                totalDiscount: totals.totalDiscount,
                payablePrice  : totals.payablePrice, 
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
