import React, { useState, useEffect } from 'react';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';
import CartHeader from './CartHeader';
import { FiTrash2 } from 'react-icons/fi';
import { cartService } from '../../../services/client/cartService';
import { formatCurrencyVND } from '../../../utils/formatCurrency';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmDelete } from '../../../components/common/ConfirmDeleteDialog';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { couponService } from '../../../services/client/couponService';
import Loader from '@/components/common/Loader';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const navigate = useNavigate();
  const [appliedCoupons, setAppliedCoupons] = useState({ discount: null, shipping: null });
  const totalAvailableItems = cartItems.filter((item) => item.stock > 0).length;
  const checkedAvailableItems = cartItems.filter((item, index) => item.stock > 0 && checkedItems[index]).length;
  const isAllChecked = totalAvailableItems > 0 && totalAvailableItems === checkedAvailableItems;
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const hasSelectedItems = checkedItems.some(Boolean);
  const selectedItems = cartItems.filter((_, index) => checkedItems[index]);
  const [usePoints, setUsePoints] = useState(false);
  const [pointInfo, setPointInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('usePoints', JSON.stringify(usePoints));
  }, [usePoints]);

  useEffect(() => {
    if (!appliedCoupons.discount && !appliedCoupons.shipping) return;

    const coupon = appliedCoupons.discount || appliedCoupons.shipping;
    const allowed = coupon.allowedSkuIds || [];
    const stillValid = allowed.length === 0 || selectedItems.some((i) => allowed.includes(i.skuId));

    if (!stillValid) {
      toast.info('Bạn đã bỏ sản phẩm đủ điều kiện, mã giảm giá bị gỡ.');
      setAppliedCoupons({ discount: null, shipping: null });
      localStorage.removeItem('appliedCoupons');
    }
  }, [selectedItems, appliedCoupons]);

  const totals = selectedItems.reduce(
    (acc, item) => {
      const qty = item.quantity;
      const original = item.originalPrice * qty;
      const current = item.finalPrice * qty;

      acc.totalPrice += original;
      acc.totalDiscount += original - current;
      acc.payablePrice += current;
      acc.rewardPoints += Math.floor(current / 4000);
      return acc;
    },
    { totalPrice: 0, totalDiscount: 0, payablePrice: 0, rewardPoints: 0 }
  );
  totals.rewardPoints = '+' + totals.rewardPoints;

  const fetchPointInfoOnly = async () => {
    try {
      const res = await cartService.getCart();
      setPointInfo(res.data?.pointInfo || {});
    } catch (err) {
      console.error('Lỗi khi lấy lại pointInfo', err);
    }
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartService.getCart();

      setPointInfo(response.data?.pointInfo || {});
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
      setIsCartLoaded(true);
    } catch (error) {
      const status = error?.response?.status;
      if (status === 401) {
        setCartItems([]);
        setCheckedItems([]);
        setIsCartLoaded(true);
        return;
      }

      console.error('Lỗi khi tải giỏ hàng:', error);
      toast.error('Không thể tải giỏ hàng. Vui lòng thử lại.', { position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('appliedCoupons');
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      if (!parsed?.discount?.code && !parsed?.shipping?.code) return;

      const isValidDiscount = parsed.discount && (!parsed.discount.endTime || new Date(parsed.discount.endTime) > new Date());
      const isValidShipping = parsed.shipping && (!parsed.shipping.endTime || new Date(parsed.shipping.endTime) > new Date());
      
      if (!isValidDiscount && !isValidShipping) {
          localStorage.removeItem('appliedCoupons');
          return;
      }
      
      setAppliedCoupons({
          discount: isValidDiscount ? parsed.discount : null,
          shipping: isValidShipping ? parsed.shipping : null,
      });

    } catch (err) {
      localStorage.removeItem('appliedCoupons');
    }
  }, []);

  useEffect(() => {
    if (!appliedCoupons.discount && !appliedCoupons.shipping) return;

    const skuIds = [...new Set(selectedItems.map((i) => i.skuId))];
    const orderTotal = totals.payablePrice;
    const codes = [appliedCoupons.discount?.code, appliedCoupons.shipping?.code].filter(Boolean);

    async function validate() {
      try {
        await couponService.applyCoupon({
          codes,
          skuIds,
          orderTotal
        });
      } catch (err) {
        toast.warn(err.response?.data?.message || 'Mã giảm giá không còn hiệu lực.', { position: 'top-right' });
        setAppliedCoupons({ discount: null, shipping: null });
        localStorage.removeItem('appliedCoupons');
      }
    }

    validate();

    const id = setInterval(validate, 60000);
    return () => clearInterval(id);
  }, [appliedCoupons, selectedItems, totals.payablePrice]);

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
    if (!isCartLoaded) return;
    if (selectedItems.length === 0 && (appliedCoupons.discount || appliedCoupons.shipping)) {
      setAppliedCoupons({ discount: null, shipping: null });
      localStorage.removeItem('appliedCoupons');
    }
  }, [isCartLoaded, selectedItems, appliedCoupons]);

  const handleProceedToCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.info('Vui lòng chọn ít nhất một sản phẩm để thanh toán.', { position: 'top-right' });
      return;
    }
    const skuIdsForCoupon = [...new Set(selectedItems.map((i) => Number(i.skuId)).filter(Boolean))];
    const codesToApply = [appliedCoupons.discount?.code, appliedCoupons.shipping?.code].filter(Boolean);

    if (codesToApply.length > 0) {
      try {
        await couponService.applyCoupon({
          codes: codesToApply,
          orderTotal: totals.payablePrice,
          skuIds: skuIdsForCoupon
        });
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || 'Mã giảm giá không còn hợp lệ, vui lòng thử lại.';
        toast.error(msg, { position: 'top-right' });
        setAppliedCoupons({ discount: null, shipping: null });
        localStorage.removeItem('appliedCoupons');
        return;
      }
    }
    localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
    navigate('/checkout', { replace: true });
  };

  return (
    <main className="max-w-[1200px] mx-auto pb-20">
      {loading && <Loader fullscreen />}
      <div className="py-2">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Giỏ hàng' }]} />
      </div>
      {cartItems.length > 0 ? (
        <div className="flex flex-col xl:flex-row gap-4">
          <section className="w-full xl:w-[70%]">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <CartHeader
                isAllChecked={isAllChecked}
                onToggleAll={toggleAll}
                totalItems={totalAvailableItems}
                onDeleteSelected={handleDeleteSelected}
                hasSelectedItems={hasSelectedItems}
              />
              <div className="flex flex-col">
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isChecked={checkedItems[index]}
                    onToggleChecked={() => handleToggleChecked(index)}
                    onQuantityChange={fetchCart}
                    isLastItem={index === cartItems.length - 1}
                  />
                ))}
              </div>
            </div>
          </section>
          <aside className="w-full xl:w-[30%] self-start h-fit mt-6 xl:mt-0">
            <div className="sticky top-[30px]">
              <CartSummary
                hasSelectedItems={hasSelectedItems}
                selectedItems={selectedItems}
                appliedCoupons={appliedCoupons}
                setAppliedCoupons={setAppliedCoupons}
                usePoints={usePoints}
                setUsePoints={setUsePoints}
                orderTotals={{
                  totalPrice: totals.totalPrice,
                  totalDiscount: totals.totalDiscount,
                  payablePrice: totals.payablePrice,
                  rewardPoints: totals.rewardPoints,
                  ...pointInfo
                }}
                onCheckout={handleProceedToCheckout}
              />
            </div>
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