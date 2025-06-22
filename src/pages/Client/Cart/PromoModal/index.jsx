import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FiX, FiInfo, FiLoader } from 'react-icons/fi';
import { couponService } from '../../../../services/client/couponService';
import defaultShippingIcon from '../../../../assets/Client/images/image 12.png';
import defaultDiscountIcon from '../../../../assets/Client/images/pngtree-voucher-discount-png-image_4613299.png';
import { formatCurrencyVND } from '../../../../utils/formatCurrency';
import { FaTicketAlt } from 'react-icons/fa';
const discountSVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Crect width='32' height='32' fill='%23FFFFFF'/%3E%3Cpath d='M26.7233 5.71704L30.1623 19.6235C30.2881 20.1317 29.9874 20.6484 29.4902 20.7771L9.27562 26.0109C8.63108 26.1775 7.94958 25.968 7.5026 25.4644L2.82365 20.1972C2.41971 19.7426 2.2641 19.113 2.40813 18.5162L4.07575 11.6065C4.23523 10.9458 4.73739 10.4291 5.38137 10.2626L25.5959 5.02928C26.0926 4.90054 26.5975 5.20828 26.7233 5.71704Z' fill='%23EF4444'/%3E%3Cpath d='M28.8525 11.6417V26.1156C28.8525 26.6046 28.4651 27.0004 27.9878 27.0004H7.0735C6.4091 27.0004 5.79823 26.6255 5.48534 26.0253L2.2119 19.7457C1.92937 19.2036 1.92937 18.5537 2.2119 18.0122L5.48534 11.732C5.79823 11.1318 6.40855 10.7568 7.0735 10.7568H27.9878C28.4656 10.7568 28.8525 11.1532 28.8525 11.6417Z' fill='white'/%3E%3Cpath d='M7.83626 18.8781C7.83626 19.5766 7.28278 20.143 6.59962 20.143C5.91646 20.143 5.36353 19.5766 5.36353 18.8781C5.36353 18.1796 5.91701 17.6133 6.59962 17.6133C7.28223 17.6133 7.83626 18.1796 7.83626 18.8781Z' fill='%23FEE2E2'/%3E%3Cpath d='M16.4658 13.9346C15.3241 13.9346 14.3954 14.8843 14.3954 16.0526C14.3954 17.2209 15.3236 18.1712 16.4658 18.1712C17.6081 18.1712 18.5363 17.2215 18.5363 16.0526C18.5363 14.8838 17.6076 13.9346 16.4658 13.9346ZM16.4658 16.759C16.0845 16.759 15.7755 16.4434 15.7755 16.0526C15.7755 15.6619 16.084 15.3462 16.4658 15.3462C16.8477 15.3462 17.1562 15.6624 17.1562 16.0526C17.1562 16.4428 16.8472 16.759 16.4658 16.759Z' fill='%23EF4444'/%3E%3Cpath d='M22.5611 15.033L17.0401 23.5069C16.832 23.8265 16.4055 23.9213 16.0832 23.7022C15.7659 23.486 15.6804 23.0478 15.8917 22.7237L21.4128 14.2498C21.6219 13.9251 22.0501 13.8365 22.3696 14.0533C22.6869 14.2701 22.7725 14.7083 22.5611 15.033Z' fill='%23EF4444'/%3E%3Cpath d='M21.9868 19.585C20.8451 19.585 19.9164 20.5347 19.9164 21.703C19.9164 22.8713 20.8446 23.8216 21.9868 23.8216C23.1291 23.8216 24.0573 22.8718 24.0573 21.7036C24.0573 20.5353 23.1286 19.585 21.9868 19.585ZM21.9868 22.4094C21.6055 22.4094 21.2965 22.0937 21.2965 21.703C21.2965 21.3123 21.605 20.9966 21.9868 20.9966C22.3687 20.9966 22.6766 21.3128 22.6772 21.703C22.6772 22.0932 22.3681 22.4094 21.9868 22.4094Z' fill='%23EF4444'/%3E%3C/svg%3E";

const PromoModal = ({
    modalTitle = "Ưu đãi",
    onClose,
    onApplySuccess,
    skuId,
    orderTotal,
    appliedCode = "",
}) => {
    const [availablePromos, setAvailablePromos] = useState([]);
    const [selectedCode, setSelectedCode] = useState('');
    const [inputPromoCode, setInputPromoCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [applyError, setApplyError] = useState('');

    useEffect(() => {
        if (appliedCode) {
            setSelectedCode(appliedCode);
        }
    }, [appliedCode]);

    useEffect(() => {
        const fetchCoupons = async () => {
            setIsLoading(true);
            try {
                const res = await couponService.getAvailable(skuId ? `?skuId=${skuId}` : '');
                const couponsFromApi = res.data?.data || [];
                const mapped = couponsFromApi.map((coupon) => ({
                    id: coupon.code,
                    code: coupon.code,
                    type: coupon.discountType === 'shipping' ? 'shipping' : 'discount',
                    title: coupon.title || coupon.code,
                    description: `Cho đơn hàng từ ${formatCurrencyVND(coupon.minOrderAmount)}`,
                    expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: '2-digit' }) : null,
                    isApplicable: coupon.isApplicable,
              iconSrc: coupon.bannerUrl || (coupon.discountType === 'shipping'
  ? defaultShippingIcon
  : 'https://cdn-icons-png.flaticon.com/512/869/869636.png'), // voucher icon đẹp



                }));
                setAvailablePromos(mapped);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách coupons:", err);
                alert('Không thể tải danh sách khuyến mãi. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        };

        document.body.style.overflow = 'hidden';
        fetchCoupons();
        return () => { document.body.style.overflow = 'unset'; };
    }, [skuId]);

    const handleSelect = (promo) => {
        if (!promo.isApplicable) return;
        setInputPromoCode('');
        setApplyError('');
        setSelectedCode(prev => prev === promo.code ? '' : promo.code);
    };

const _applyCode = async (codeToApply) => {
  const trimmedCode = String(codeToApply || '').trim();
  
  // ✅ Nếu bỏ chọn (mã rỗng), chỉ đóng popup và clear mã
  if (!trimmedCode) {
    onApplySuccess(null); // gán null coupon
    setSelectedCode('');
    setInputPromoCode('');
    setApplyError('');
    onClose();
    return;
  }

  // ✅ Có mã thì mới gọi API
  setIsLoading(true);
  setApplyError('');

  try {
    const payload = {
      code: trimmedCode,
      orderTotal: Number(orderTotal)
    };
    if (skuId) payload.skuId = Number(skuId);

    const response = await couponService.applyCoupon(payload);
    const { coupon } = response.data;
    onApplySuccess(coupon);
    onClose();
  } catch (error) {
    const msg = error?.response?.data?.message || error.message || "Lỗi không xác định";
    console.error("❌ APPLY FAIL:", msg);
    setApplyError(msg);
  } finally {
    setIsLoading(false);
  }
};


    
    const handleApplyInputCode = () => {
        _applyCode(inputPromoCode.trim().toUpperCase());
    };
    
    const handleConfirmSelection = () => {
        _applyCode(selectedCode);
    };


    const groupedPromos = availablePromos.reduce((acc, promo) => {
        const key = promo.type === 'shipping' ? 'Mã Vận Chuyển' : 'Mã Giảm Giá';
        acc[key] = acc[key] || [];
        acc[key].push(promo);
        return acc;
    }, {});

    const modalContent = (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-md flex flex-col" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh' }}>
                {/* Header */}
                <div className="relative text-center py-3 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-base font-semibold text-gray-800">{modalTitle}</h3>
                    <button onClick={onClose} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-800">
                        <FiX size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex items-start gap-2">
                        <div className="flex-grow">
                             <input
                                value={inputPromoCode}
                                onChange={(e) => {
                                    setInputPromoCode(e.target.value.toUpperCase());
                                    setSelectedCode('');
                                    if (applyError) setApplyError('');
                                }}
                                placeholder="Nhập mã giảm giá tại đây"
                                className={`w-full px-3 py-2 border ${applyError ? 'border-red-500' : 'border-gray-300'} rounded-sm text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                            />
                            {applyError && (
                                <p className="text-xs text-red-500 mt-1">{applyError}</p>
                            )}
                        </div>
                        <button
                            onClick={handleApplyInputCode}
                            disabled={!inputPromoCode.trim() || isLoading}
                            className="flex-shrink-0 bg-blue-600 text-white font-semibold py-2 px-4 rounded-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading && !selectedCode ? <FiLoader className="animate-spin" /> : 'Áp dụng'}
                        </button>
                    </div>

                    {isLoading && availablePromos.length === 0 ? <p className="text-center py-10">Đang tải...</p> :
                        (availablePromos.length > 0 ? (
                            Object.entries(groupedPromos).map(([groupName, promos]) => (
                                <div key={groupName}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-gray-800 text-sm">{groupName}</h4>
                                        <span className="text-xs text-gray-500">Áp dụng tối đa: 1</span>
                                    </div>
                                    <div className="space-y-3">
                                        {promos.map((promo) => {
                                            const isSelected = selectedCode === promo.code;
                                            return (
                                                <div
                                                    key={promo.id}
                                                    onClick={() => handleSelect(promo)}
                                                    className={`relative w-full flex bg-white rounded-md shadow-sm overflow-hidden transition-all duration-200 ${promo.isApplicable ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'} ${isSelected ? 'border-2 border-blue-500' : 'border-2 border-transparent'}`}
                                                >
                                                    <div className="w-24 flex-shrink-0 relative bg-white flex items-center justify-center p-2">
                                                        <img
                                                            src={promo.iconSrc}
                                                            alt="promo icon"
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => { e.target.onerror = null; e.target.src = defaultDiscountIcon; }}
                                                        />
                                                        <div className="absolute top-0 right-0 h-full w-px bg-[repeating-linear-gradient(to_bottom,#e5e7eb,#e5e7eb_4px,transparent_4px,transparent_8px)]"></div>
                                                    </div>
                                                    <div className="flex-1 p-3 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold text-sm text-gray-900">{promo.title}</p>
                                                            <p className="text-xs text-gray-600">{promo.description}</p>
                                                            {promo.expiryDate && (
                                                                <p className="text-xs text-gray-500 mt-1">HSD: {promo.expiryDate}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2 pl-2">
                                                            <FiInfo className="text-gray-400 flex-shrink-0" size={16} />
                                                            
                                                            {/* ✅ THAY ĐỔI: Hiển thị nút "Bỏ chọn" thay cho dấu tick */}
                                                            {!promo.isApplicable ? (
                                                                <div className="absolute top-1/2 right-4 -translate-y-1/2 transform -rotate-12">
                                                                    <div className="border-2 border-gray-400 rounded-md px-2 py-1">
                                                                        <span className="text-xs text-center font-bold text-gray-400">CHƯA THOẢ ĐIỀU KIỆN</span>
                                                                    </div>
                                                                </div>
                                                            ) : isSelected ? (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleSelect(promo); }}
                                                                    className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-sm hover:opacity-90 transition-colors"
                                                                >
                                                                    Bỏ chọn
                                                                </button>
                                                            ) : (
                                                                <div className="w-5 h-5 border-2 border-gray-400 rounded-full"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            !isLoading && (
                                <div className="text-center py-10 px-4">
                                    <FaTicketAlt className="mx-auto text-5xl text-gray-300" />
                                    <p className="mt-4 text-sm font-medium text-gray-600">
                                        Rất tiếc, không có ưu đãi nào khả dụng.
                                    </p>
                                </div>
                            )
                        ))
                    }
                </div>
                
                <div className="p-4 bg-white border-t flex-shrink-0">
                    <button
                        onClick={handleConfirmSelection}
                        disabled={isLoading}
                        // ✅ SỬA LẠI: Nút xác nhận sẽ disable nếu không có mã nào được chọn
                        className="w-full bg-primary text-white font-bold py-2 px-4 rounded hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    >
                        {isLoading ? <FiLoader className="animate-spin" /> : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );

    let modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'modal-root';
        document.body.appendChild(modalRoot);
    }

    return ReactDOM.createPortal(modalContent, modalRoot);
};

export default PromoModal;