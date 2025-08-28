import React, { useState, useEffect, useRef } from 'react';
import { useMemo } from 'react';
import xudiem from '@/assets/Client/images/xudiem.png';
import { FaPercentage, FaQuestionCircle } from 'react-icons/fa';
import { FiChevronUp, FiInfo, FiChevronRight } from 'react-icons/fi';
import PromoModal, { CouponCard } from '../PromoModal';
import { couponService } from '../../../../services/client/couponService';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { toast } from 'react-toastify';
import { Coins } from 'lucide-react';
import defaultShippingIcon from '../../../../assets/Client/images/image 12.png';
import { rewardPointService } from '../../../../services/client/rewardPointService';
import Loader from '../../../../components/common/Loader';

const CartSummary = ({
    hasSelectedItems,
    selectedItems,
    orderTotals,
    appliedCoupons,
    setAppliedCoupons,
    onCheckout,
    usePoints,
    setUsePoints
}) => {
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [showDiscountDetails, setShowDiscountDetails] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    
    const {
        userPointBalance = 0,
        earnRate = 10000,
        redeemRate = 100,
        minPointRequired = 1,
        canUsePoints = false
    } = orderTotals || {};

    const recalculatedMaxUsablePoints = useMemo(() => {
        const payable = Number(orderTotals?.payablePrice || 0);
        return Math.min(userPointBalance, Math.floor(payable / redeemRate));
    }, [orderTotals, userPointBalance, redeemRate]);

    const recalculatedPointDiscount = recalculatedMaxUsablePoints * redeemRate;

    const openPromoModal = () => {
        if (!hasSelectedItems) {
            alert('Vui lòng chọn sản phẩm trước khi áp dụng ưu đãi.');
            return;
        }
        setIsPromoModalOpen(true);
    };

    const closePromoModal = () => setIsPromoModalOpen(false);

    const stableSkuIds = useMemo(() => {
        return selectedItems.map((i) => i.skuId).sort();
    }, [selectedItems]);

    const stableOrderTotal = useMemo(() => {
        return Number(orderTotals?.payablePrice || 0);
    }, [orderTotals]);

    const handleApplySuccess = async (couponObject) => {
        if (!couponObject || (!couponObject.discount && !couponObject.shipping)) {
            setAppliedCoupons({ discount: null, shipping: null });
            localStorage.removeItem('appliedCoupons');
            toast.success('Đã bỏ mã giảm giá.');
            return;
        }
    
        try {
            const res = await couponService.applyCoupon({
                codes: [couponObject.discount?.code, couponObject.shipping?.code].filter(Boolean),
                skuIds: selectedItems.map((i) => i.skuId),
                shippingFee: Number(orderTotals?.shippingFee || 0),   // ✅ thêm dòng này
                orderTotal: Number(orderTotals?.payablePrice || 0)
            });

            const { discountCoupon, shippingCoupon, isValid } = res.data;

            if (isValid) {
                const newAppliedCoupons = { discount: discountCoupon, shipping: shippingCoupon };
                setAppliedCoupons(newAppliedCoupons);
                localStorage.setItem('appliedCoupons', JSON.stringify(newAppliedCoupons));
                toast.success('Áp dụng mã giảm giá thành công!');
            } else {
                throw new Error(res.data?.message || 'Không thể áp dụng mã');
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || 'Lỗi khi áp mã giảm giá!');
            setAppliedCoupons({ discount: null, shipping: null });
            localStorage.removeItem('appliedCoupons');
        }
    };
    
    const prevRef = useRef({ skuIds: [], orderTotal: null });

    useEffect(() => {
        if (!appliedCoupons || (!appliedCoupons.discount && !appliedCoupons.shipping) || !selectedItems.length) return;

        const skuIds = selectedItems.map((i) => i.skuId).sort();
        const orderTotal = Number(orderTotals?.payablePrice || 0);
    
        const prev = prevRef.current;
        const skuChanged = JSON.stringify(prev.skuIds) !== JSON.stringify(skuIds);
        const totalChanged = prev.orderTotal !== orderTotal;
    
        if (!skuChanged && !totalChanged) return;
    
        const refreshCoupons = async () => {
            try {
                const codes = [appliedCoupons.discount?.code, appliedCoupons.shipping?.code].filter(Boolean);
                if (codes.length === 0) return;

                const res = await couponService.applyCoupon({
                    codes: codes,
                    orderTotal,
                    skuIds,
                        shippingFee: Number(orderTotals?.shippingFee || 0)   // ✅ thêm dòng này
                });
    
                if (!res.data?.isValid) {
                    toast.warn(res.data.message || 'Mã giảm giá không còn hiệu lực');
                    setAppliedCoupons({ discount: null, shipping: null });
                    localStorage.removeItem('appliedCoupons');
                    return;
                }
    
                const { discountCoupon, shippingCoupon } = res.data;
                const updatedCoupons = { discount: discountCoupon, shipping: shippingCoupon };
                setAppliedCoupons(updatedCoupons);
                localStorage.setItem('appliedCoupons', JSON.stringify(updatedCoupons));
            } catch (err) {
                console.error('Lỗi validate lại coupon:', err);
                setAppliedCoupons({ discount: null, shipping: null });
                localStorage.removeItem('appliedCoupons');
                toast.warn(err?.response?.data?.message || err.message || 'Không thể áp dụng mã giảm giá');
            }
        };

        refreshCoupons();
    
        prevRef.current = { skuIds, orderTotal };
    }, [selectedItems, orderTotals, appliedCoupons?.discount?.code, appliedCoupons?.shipping?.code]);

    const discountAmount = appliedCoupons?.discount?.discountAmount ? Number(appliedCoupons.discount.discountAmount) : 0;
    const shippingDiscount = appliedCoupons?.shipping?.discountAmount ? Number(appliedCoupons.shipping.discountAmount) : 0;

    const payableBeforeDiscount = Number(orderTotals?.payablePrice || 0);
    
    const payableAfterDiscount = Math.max(
        0,
        payableBeforeDiscount - discountAmount - shippingDiscount - (usePoints ? recalculatedPointDiscount : 0)
    );

    const payableAfterDiscountFormatted = formatCurrencyVND(payableAfterDiscount > 0 ? payableAfterDiscount : 0);
    
    const totals = orderTotals || {
        totalPrice: '0 đ',
        totalDiscount: '0 đ',
        payablePrice: '0 đ',
        rewardPoints: '+0'
    };

    const handleCheckout = async () => {
        try {
            setIsCheckingOut(true);
            const codesToApply = [appliedCoupons?.discount?.code, appliedCoupons?.shipping?.code].filter(Boolean);
            if (codesToApply.length > 0) {
                const res = await couponService.applyCoupon({
                    codes: codesToApply,
                    orderTotal: Number(orderTotals?.payablePrice || 0),
                    shippingFee: Number(orderTotals?.shippingFee || 0) ,  // ✅ thêm dòng này
                    skuIds: selectedItems.map((i) => i.skuId)
                });
    
                if (!res.data?.isValid) {
                    const msg = (res.data?.message || '').toLowerCase();
                    if (msg.includes('hết lượt') || msg.includes('hết hạn')) {
                        toast.error(res.data.message || 'Mã giảm giá không còn hiệu lực');
                        return;
                    }
                    setAppliedCoupons({ discount: null, shipping: null });
                    localStorage.removeItem('appliedCoupons');
                    throw new Error(res.data?.message || 'Mã không còn hiệu lực');
                }
    
                const { discountCoupon, shippingCoupon } = res.data;
                const updatedCoupons = { discount: discountCoupon, shipping: shippingCoupon };
                setAppliedCoupons(updatedCoupons);
                localStorage.setItem('appliedCoupons', JSON.stringify(updatedCoupons));
            }
            onCheckout();
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message || 'Lỗi áp dụng mã giảm giá');
        } finally {
            setIsCheckingOut(false);
        }
    };
    
    return (
        <>
            <aside className="bg-white rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm flex flex-col gap-4">
                {isCheckingOut && <Loader fullscreen />}
                <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-gray-800">CYBERZONE khuyến mãi</h4>
                    <div className="flex items-center text-xs text-gray-500">
                        Có thể chọn&nbsp;1
                        <FiInfo className="ml-1 text-gray-400" size={14} />
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <div className="border border-gray-200 rounded-md p-3">
                        {(appliedCoupons?.discount || appliedCoupons?.shipping) ? (
                            <div className="flex flex-col gap-2">
                                {appliedCoupons?.discount && (
                                    <CouponCard
                                        compact
                                        logoW={70}
                                        titleClassName="text-left ml-5"
                                        compactHeight={76}
                                        containerBg="white"
                                        promo={{
                                            id: appliedCoupons.discount.code,
                                            code: appliedCoupons.discount.code,
                                            type: 'discount',
                                            title: appliedCoupons.discount.title || appliedCoupons.discount.code,
                                            isApplicable: true
                                        }}
                                        isSelected
                                        onSelect={() => handleApplySuccess({ ...appliedCoupons, discount: null })}
                                    />
                                )}
                                {appliedCoupons?.shipping && (
                                    <CouponCard
                                        compact
                                        logoW={70}
                                        titleClassName="text-left ml-5"
                                        compactHeight={76}
                                        containerBg="white"
                                        promo={{
                                            id: appliedCoupons.shipping.code,
                                            code: appliedCoupons.shipping.code,
                                            type: 'shipping',
                                            title: appliedCoupons.shipping.title || appliedCoupons.shipping.code,
                                            isApplicable: true
                                        }}
                                        isSelected
                                        onSelect={() => handleApplySuccess({ ...appliedCoupons, shipping: null })}
                                    />
                                )}
                                <button onClick={openPromoModal} className="text-primary text-sm font-medium inline-flex items-center self-start">
                                    <FaPercentage className="mr-1.5" />
                                    Chọn hoặc nhập mã khác
                                    <FiChevronRight className="ml-0.5" />
                                </button>
                            </div>
                        ) : (
                            <div className="relative group">
                                <div className="flex justify-between items-center w-full text-sm text-gray-800 disabled:text-gray-400">
                                    <button onClick={openPromoModal} disabled={!hasSelectedItems} className="flex items-center font-medium flex-1 text-left">
                                        <FaPercentage className={`mr-2 text-lg ${hasSelectedItems ? 'text-red-500' : 'text-gray-400'}`} />
                                        Chọn hoặc nhập ưu đãi
                                    </button>
                                    <div className="flex items-center gap-2 ml-2">
                                        <FiChevronRight className="text-gray-400" />
                                        {!hasSelectedItems && (
                                            <div className="relative group">
                                                <FaQuestionCircle className="text-gray-400 text-sm cursor-pointer" />
                                                <div className="absolute z-10 top-full right-0 mt-1 w-max max-w-[220px] bg-black text-white border border-gray-700 shadow-md rounded-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-[12px]">
                                                    Vui lòng chọn sản phẩm để áp dụng mã ưu đãi
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-between h-11 px-3 border border-gray-200 rounded-md">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <img src={xudiem} alt="coin" className="w-6 h-6 object-contain" />
                            <div className="flex items-baseline gap-1">
                                <span>Đổi {recalculatedMaxUsablePoints.toLocaleString('vi-VN')} điểm</span>
                                <span className="text-gray-400 text-xs">(~{formatCurrencyVND(recalculatedPointDiscount)})</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 relative group">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={usePoints}
                                    disabled={!canUsePoints || !hasSelectedItems}
                                    onChange={() => setUsePoints(!usePoints)}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 rounded-full relative transition-colors bg-gray-200 peer-checked:bg-[var(--primary-color)]">
                                    <div
                                        className="absolute top-[2px] w-4 h-4 bg-white rounded-full transition-transform duration-200"
                                        style={{ left: usePoints ? 'calc(100% - 18px)' : '2px' }}
                                    ></div>
                                </div>
                            </label>
                            {(!canUsePoints || !hasSelectedItems) && (
                                <>
                                    <FaQuestionCircle className="text-gray-400 text-sm cursor-pointer" />
                                    <div className="absolute z-10 top-full right-0 mt-1 w-max max-w-[220px] bg-black text-white border border-gray-700 shadow-md rounded-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-[12px]">
                                        {!hasSelectedItems ? 'Bạn cần chọn sản phẩm để sử dụng điểm' : `Cần ít nhất ${minPointRequired} điểm để sử dụng`}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-sm text-gray-700 space-y-2">
                    <h3 className="font-semibold text-base text-gray-800">Thông tin đơn hàng</h3>
                    <div className="flex justify-between">
                        <span>Tổng tiền hàng</span>
                        <span className="font-medium text-gray-800">{formatCurrencyVND(totals.totalPrice)}</span>
                    </div>
                    {showDiscountDetails && (
                        <>
                            {Number(totals.totalDiscount) > 0 && (
                                <div className="flex justify-between text-xs text-gray-600 ml-2 relative">
                                    <span className="before:content-['•'] before:mr-1 before:text-gray-500">Giảm giá từ sản phẩm</span>
                                    <span>{formatCurrencyVND(Number(totals.totalDiscount))}</span>
                                </div>
                            )}
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-xs text-green-600 ml-2 relative">
                                    <span className="before:content-['•'] before:mr-1 before:text-green-600">Giảm giá từ coupon</span>
                                    <span>- {formatCurrencyVND(discountAmount)}</span>
                                </div>
                            )}
                            {shippingDiscount > 0 && (
                                <div className="flex justify-between text-xs text-green-600 ml-2 relative">
                                    <span className="before:content-['•'] before:mr-1 before:text-green-600">Giảm giá vận chuyển</span>
                                    <span>- {formatCurrencyVND(shippingDiscount)}</span>
                                </div>
                            )}
                        </>
                    )}
                    <div className="flex justify-between">
                        <span>Tổng khuyến mãi</span>
                        <span className="font-medium text-gray-800">{formatCurrencyVND(Number(totals.totalDiscount) + discountAmount + shippingDiscount)}</span>
                    </div>
                    <hr className="border-dashed" />
                    <div className="flex justify-between text-gray-800 font-semibold">
                        <span>Cần thanh toán</span>
                        <span className="text-red-600">{formatCurrencyVND(payableAfterDiscount)}</span>
                    </div>
                    {payableAfterDiscount > 0 && (
                        <div className="flex justify-between text-xs text-yellow-600 font-medium items-center">
                            <span>Điểm thưởng</span>
                            <span className="flex items-center gap-1">
                                <img src={xudiem} alt="coin" className="w-4 h-4 object-contain" />
                                {'+' + Math.floor(payableAfterDiscount / earnRate).toLocaleString('vi-VN')} điểm
                            </span>
                        </div>
                    )}
                    {(Number(totals.totalDiscount) + discountAmount + shippingDiscount > 0) && (
                        <button
                            className="text-blue-600 text-sm font-medium inline-flex items-center ml-auto"
                            onClick={() => setShowDiscountDetails((prev) => !prev)}
                        >
                            {showDiscountDetails ? 'Thu gọn' : 'Xem chi tiết'}
                            {showDiscountDetails ? <FiChevronUp className="ml-1" /> : <FiChevronRight className="ml-1 transform rotate-90" />}
                        </button>
                    )}
                    {(Number(totals.totalDiscount) + discountAmount + shippingDiscount) > 0 && (
                        <div className="text-sm text-green-600 mt-1 text-right">
                            Tiết kiệm {formatCurrencyVND(Number(totals.totalDiscount) + discountAmount + shippingDiscount)}
                        </div>
                    )}
                    <p className="text-[11px] text-gray-400 text-right">(Đã bao gồm VAT nếu có)</p>
                </div>
                <button
                    onClick={handleCheckout}
                    disabled={!hasSelectedItems}
                    className={`block text-center w-full font-semibold py-3 rounded-md transition-colors text-base ${
                        hasSelectedItems ? 'bg-primary text-white hover:opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Xác nhận đơn
                </button>
            </aside>
            <style jsx global>{`
                .tight-title .mx-2 {
                    margin-left: 0.25rem;
                }
            `}</style>
            {isPromoModalOpen && (
                <PromoModal
                    onClose={closePromoModal}
                    onApplySuccess={handleApplySuccess}
                    skuIds={stableSkuIds}
                    orderTotal={stableOrderTotal}
                    appliedCodes={[appliedCoupons?.discount?.code, appliedCoupons?.shipping?.code].filter(Boolean)}
                />
            )}
        </>
    );
};

export default CartSummary;