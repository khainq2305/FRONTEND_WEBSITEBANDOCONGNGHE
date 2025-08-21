import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, PackageOpen } from 'lucide-react';
import { orderService } from '../../../services/client/orderService';
import Loader from '../../../components/common/Loader';
import HighlightText from '../../../components/Admin/HighlightText';
import { formatCurrencyVND } from '../../../utils/formatCurrency';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Đảm bảo bạn có các dialog này
import CancelOrderDialog from './CancelOrderDialog';
import { paymentService } from '../../../services/client/paymentService';

// Hàm ánh xạ trạng thái trả hàng sang text hiển thị
const getReturnStatusText = (status) => {
    switch (status) {
        case 'pending': return 'Đang chờ duyệt';
        case 'approved': return 'Đã duyệt';
        case 'rejected': return 'Đã từ chối';
        case 'awaiting_pickup': return 'Chờ nhận hàng trả';
        case 'pickup_booked': return 'Đã đặt GHN lấy';
        case 'returning': return 'Đang hoàn về kho';
        case 'received': return 'Đã nhận hàng trả';
        case 'refunded': return 'Đã hoàn tiền';
        case 'cancelled': return 'Đã hủy yêu cầu'; // Thêm trạng thái hủy yêu cầu trả hàng nếu có
        default: return 'Không rõ';
    }
};

const OrderItem = ({ order, searchTerm, refetchOrders }) => {
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [openReturnMethodDialog, setOpenReturnMethodDialog] = useState(false);
    const navigate = useNavigate();
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const moreButtonRef = useRef(null);

    const productsToShowInitially = 2;

    const handleReorder = async () => {
        try {
            await orderService.reorder(order.id);
            toast.success('Đã thêm sản phẩm vào giỏ hàng!');
            navigate('/cart');
        } catch (err) {
            console.error('Lỗi khi mua lại:', err);
            toast.error('Không thể mua lại đơn hàng!');
        }
    };

    const handlePayAgain = async () => {
    try {
        const res = await paymentService.payAgain(order.id, { bankCode: '' });
        if (res.data?.payUrl) {
            window.location.href = res.data.payUrl;
        } else {
            toast.error('Không tạo được link thanh toán.');
        }
    } catch (err) {
        console.error('Pay-again error:', err);
        toast.error(err.response?.data?.message || 'Không thể thanh toán lại.');
    }
};


    const [showCancelDialog, setShowCancelDialog] = useState(false);

    // Xử lý click ra ngoài để đóng dropdown "Thêm"
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moreButtonRef.current && !moreButtonRef.current.contains(event.target)) {
                setShowMoreDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 mb-3 sm:mb-4 border border-gray-200 dark:border-gray-700 rounded-sm">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex flex-col">
                    <div className="text-sm text-gray-800 font-medium">
                        Mã đơn hàng: <span className="font-semibold">{order.orderCode}</span>
                        {order.createdAt && !isNaN(new Date(order.createdAt)) && (
                            <>
                                <span className="mx-2 text-gray-400">|</span>
                                <span className="text-gray-600">
                                    {format(new Date(order.createdAt), 'HH:mm dd-MM-yyyy', { locale: vi })}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <span
                        className={`
                            flex items-center justify-center h-5 w-5 rounded-full
                            ${
                                order.returnRequest
                                    ? 'bg-[rgba(28,167,236,0.1)]'
                                    : order.status === 'cancelled'
                                        ? 'bg-red-100'
                                        : order.status === 'pending_payment'
                                            ? 'bg-yellow-100'
                                            : 'bg-green-100'
                            }
                        `}
                    >
                        <span
                            className={`
                                h-2.5 w-2.5 rounded-full 
                                ${
                                    order.returnRequest
                                        ? 'bg-primary'
                                        : order.status === 'cancelled'
                                            ? 'bg-red-500'
                                            : order.status === 'pending_payment'
                                                ? 'bg-yellow-500'
                                                : 'bg-green-500'
                                }
                            `}
                        />
                    </span>
                    <span
                        className={`
                            text-xs sm:text-sm font-semibold uppercase
                            ${
                                order.returnRequest
                                    ? 'text-primary dark:text-primary'
                                    : order.status === 'cancelled'
                                        ? 'text-red-600'
                                        : order.status === 'pending_payment'
                                            ? 'text-yellow-600'
                                            : 'text-gray-800 dark:text-gray-200'
                            }
                        `}
                    >
                        {order.returnRequest ? 'Yêu cầu trả hàng/hoàn tiền' : order.statusText}
                    </span>
                </div>
            </div>

            {order.products.slice(0, showAllProducts ? order.products.length : productsToShowInitially).map((product, index) => {
                // KIỂM TRA XEM SẢN PHẨM NÀY CÓ TRONG YÊU CẦU TRẢ HÀNG KHÔNG
                const isProductInReturnRequest = order.returnRequest && 
                                                 order.returnRequest.items.some(item => item.skuId === product.skuId);
                
                return (
                    <div key={`${order.id}-${product.skuId}-${index}`} 
                         onClick={() => navigate(`/user-profile/orders/${order.orderCode}`)} 
                         className="px-4 sm:px-6 py-3 sm:py-4 dark:border-gray-700 flex cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-sm border border-gray-200 dark:border-gray-600 mr-3 sm:mr-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 dark:text-gray-100 mb-1 line-clamp-2">
                                <HighlightText text={product.name} highlight={searchTerm} />
                            </p>
                            {product.variation && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phân loại hàng: {product.variation}</p>}
                            <p className="text-xs text-gray-700 dark:text-gray-300">x{product.quantity}
                                {/* HIỂN THỊ TRẠNG THÁI TRẢ HÀNG CỦA SẢN PHẨM CỤ THỂ */}
                                {isProductInReturnRequest && order.returnRequest && (
                                    <span className="text-primary dark:text-primary ml-2">
                                        (Trạng thái trả hàng: <span className="font-semibold uppercase">{getReturnStatusText(order.returnRequest.status)}</span>)
                                    </span>
                                )}
                            </p>
                            {/* Hiển thị trạng thái thanh toán dưới sản phẩm */}
                            {order.paymentStatus === 'waiting' && (
                                <>
                                    {order.paymentMethod?.code === 'atm' ? (
                                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mt-0.5">
                                            Chờ xác nhận chuyển khoản
                                        </p>
                                    ) : ['momo', 'vnpay', 'stripe', 'zalopay'].includes(order.paymentMethod?.code) && (
                                        <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mt-0.5">
                                            Chờ thanh toán
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="text-right ml-3 sm:ml-4 flex-shrink-0">
                            {product.originalPrice && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 line-through mr-1.5">{formatCurrencyVND(product.originalPrice)}</span>
                            )}
                            <span className="text-sm text-red-500 dark:text-red-400">{formatCurrencyVND(product.price)}</span>
                        </div>
                    </div>
                );
            })}

            {order.products.length > productsToShowInitially && (
                <div className="px-4 sm:px-6 py-2 text-center border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setShowAllProducts(!showAllProducts)}
                        className="text-sm text-primary dark:text-blue-400 dark:hover:text-blue-500 font-medium"
                    >
                        {showAllProducts ? `Thu gọn (${order.products.length} sản phẩm)` : `Xem thêm (${order.products.length - productsToShowInitially} sản phẩm)`}
                    </button>
                </div>
            )}

            <div className="w-full border-t border-dotted border-gray-300 rounded-full"></div>

            <div className=" bg-[#1CA7EC]/5">
                <div className="px-4 sm:px-6 py-3 sm:py-4 text-right rounded-b-md">
                    <div className="flex justify-end items-center mb-2">
                        <span className="text-sm text-gray-800 dark:text-gray-100">Thành tiền:</span>
                        <span className="text-lg sm:text-xl font-semibold text-red-500 dark:text-red-400 ml-2">{formatCurrencyVND(order.totalAmount)}</span>
                    </div>
                </div>

                <div className="px-4 py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    {/* Bên trái: Hướng dẫn nhận hàng */}
                    {order.returnRequest ? (
                        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[360px] leading-snug">
                            Yêu cầu <strong>trả hàng / hoàn tiền</strong>
                        </p>
                    ) : order.buttons.includes('Đã nhận hàng') ? (
                        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[360px] leading-snug">
                            Vui lòng chỉ nhấn <strong>"Đã nhận được hàng"</strong> khi đơn hàng đã được giao đến bạn và sản phẩm nhận được không có vấn đề nào.
                        </p>
                    ) : <div className="hidden sm:block" />}

                    {/* Bên phải: Các nút thao tác */}
                    <div className="relative flex flex-wrap justify-end items-center gap-2">
                        {order.buttons.slice(0, 3).map((label) => {
                            if (label === 'Thanh toán lại') {
                                return (
                                    <button
                                        key={label}
                                        onClick={handlePayAgain}
                                        className="text-sm border border-orange-500 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-sm transition-colors dark:text-orange-400 dark:border-orange-500 dark:hover:bg-orange-900"
                                    >
                                        Thanh toán lại
                                    </button>
                                );
                            }
                            if (label === 'Mua Lại') {
                                return (
                                    <button
                                        key={label}
                                        onClick={handleReorder}
                                        className="text-sm text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 px-4 py-2 rounded-sm transition-colors dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                                    >
                                        Mua Lại
                                    </button>
                                );
                            }
                            if (label === 'Chọn cách hoàn hàng') {
                                return (
                                    <button
                                        key={label}
                                        onClick={() => navigate(`/user-profile/return-order/code/${order.returnRequest?.returnCode}/choose-method`)}
                                        className="text-sm border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-sm transition-colors dark:border-primary dark:text-primary dark:hover:bg-primary/10"
                                    >
                                        Chọn cách hoàn hàng
                                    </button>
                                );
                            }
                            if (label === 'Hủy đơn') {
    return (
        <button
            key={label}
            onClick={() => setShowCancelDialog(true)} // ✅ mở dialog
            className="text-sm text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 px-4 py-2 rounded-sm transition-colors dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
        >
            Hủy đơn
        </button>
    );
}

                            if (label === 'Đã nhận hàng') {
                                return (
                                    <button
                                        key={label}
                                        onClick={async () => {
                                            try {
                                                await orderService.markAsCompleted(order.id);
                                                toast.success('Đã xác nhận đã nhận hàng!');
                                                refetchOrders();
                                            } catch (err) {
                                                console.error('Lỗi xác nhận đã nhận hàng:', err);
                                                toast.error('Không thể xác nhận đơn hàng.');
                                            }
                                        }}
                                        className="text-sm bg-primary text-white px-4 py-2 rounded-sm transition-colors hover:bg-primary/90"
                                    >
                                        Đã nhận hàng
                                    </button>
                                );
                            }
                            if (label === 'Xem chi tiết trả hàng') {
                                return (
                                    <button
                                        key={label}
                                        onClick={() => {
                                            console.log('Return ID:', order.returnRequest?.id);
                                            navigate(`/user-profile/return-order/${order.returnRequest?.id}`);
                                        }}
                                        className="text-sm bg-primary text-white px-4 py-2 rounded-sm transition-colors hover:bg-primary/90"
                                    >
                                        Xem chi tiết trả hàng
                                    </button>
                                );
                            }
                            if (label === 'Trả hàng/Hoàn tiền') {
                                return (
                                    <button
                                        key={label}
                                        onClick={() => navigate('/return-order', {
                                            state: {
                                                orderId: order.id,
                                                orderPaymentMethodCode: order.paymentMethod?.code,
                                                orderProducts: order.products,
                                                finalPrice: order.totalAmount,
                                            }
                                        })}
                                        className="text-sm text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 px-4 py-2 rounded-sm transition-colors dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                                    >
                                        Yêu Cầu Trả Hàng/Hoàn Tiền
                                    </button>
                                );
                            }
                            return null;
                        })}

                        {order.buttons.length > 3 && (
                            <div className="relative" ref={moreButtonRef}>
                                <button
                                    onClick={() => setShowMoreDropdown((prev) => !prev)}
                                    className="text-sm border border-red-500 text-red-600 hover:bg-red-50 px-4 py-2 rounded-sm transition-colors dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900"
                                >
                                    Thêm ▾
                                </button>
                                {showMoreDropdown && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-red-500 rounded-sm shadow z-50">
                                        {order.buttons.slice(3).map((label) => (
                                            <button
                                                key={label}
                                                onClick={() => {
                                                    setShowMoreDropdown(false);
                                                    if (label === 'Mua Lại') handleReorder();
                                                    else if (label === 'Thanh toán lại') handlePayAgain();
                                                    else if (label === 'Đã nhận hàng') {
                                                        orderService.markAsCompleted(order.id)
                                                            .then(() => {
                                                                toast.success('Đã xác nhận đã nhận hàng!');
                                                                refetchOrders();
                                                            })
                                                            .catch(() => toast.error('Không thể xác nhận đơn hàng.'));
                                                    }
                                                    else if (label === 'Trả hàng/Hoàn tiền') {
                                                        navigate('/return-order', {
                                                            state: {
                                                                orderId: order.id,
                                                                orderPaymentMethodCode: order.paymentMethod?.code,
                                                                orderProducts: order.products,
                                                                finalPrice: order.totalAmount,
                                                            }
                                                        });
                                                    }
                                                    // Thêm các trường hợp khác cho nút trong dropdown nếu có
                                                }}
                                                className="w-full text-left text-sm text-gray-700 hover:bg-red-50 px-4 py-2"
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal/Dialogs */}
            {/* Bạn cần đảm bảo các dialog này được import và sử dụng đúng cách nếu cần */}
           <CancelOrderDialog
  open={showCancelDialog}
  onClose={() => setShowCancelDialog(false)}
  orderCode={order.orderCode}
  orderId={order.id}
   onSuccess={refetchOrders} // ✅ Đúng
/>

             {/* <ReturnMethodDialog open={openReturnMethodDialog} onClose={() => setOpenReturnMethodDialog(false)} /> */}
        </div>
    );
};


const RenderDonMuaContent = () => {
    // ... (Giữ nguyên phần này)
    const [activePurchaseTab, setActivePurchaseTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ================================================================
    MAP API → VIEW
    ================================================================ */
    const mapApiDataToView = (apiOrders = []) =>
        apiOrders.map(order => {
            /* -------------------------------------------------- *
             * 1. TAB ID
             * -------------------------------------------------- */
            const tabId = order.status || 'unknown';

            /* -------------------------------------------------- *
             * 2. STATUS TEXT + COLOR
             * -------------------------------------------------- */
            let statusText = '';
            let statusColor = 'text-gray-800'; // Đặt mặc định là màu xám

            switch (order.status) {
                case 'processing':
                    statusText = 'ĐANG XỬ LÝ';
                    break;
                case 'shipping':
                    statusText = 'ĐANG GIAO';
                    break;
                case 'delivered':
                    statusText = 'ĐÃ GIAO';
                    break;
                case 'completed':
                    statusText = 'HOÀN THÀNH';
                    break;
                case 'cancelled':
                    statusText = 'ĐÃ HỦY';
                    break;
                default:
                    statusText = 'KHÔNG RÕ';
            }

            /* -------------------------------------------------- *
             * 3. BUTTONS
             * -------------------------------------------------- */
            const rr = order.returnRequest;
            const hasRR = !!rr;
            // const rrApproved = rr?.status === 'approved'; // Các biến này có thể không cần nếu dùng trực tiếp rr.status
            // const rrAwaitingPickup = rr?.status === 'awaiting_pickup';
            // const rrPickupBooked = rr?.status === 'pickup_booked';
            // const rrReceived = rr?.status === 'received';
            // const rrRefunded = rr?.status === 'refunded';

            const buttons = [];

            // ——— PROCESSING
            if (order.status === 'processing') {
                const manualTransferCodes = ['atm', 'vietqr', 'manual_transfer'];
                const isManualTransfer = manualTransferCodes.includes(order.paymentMethod?.code);

                if (order.paymentStatus === 'waiting' && !isManualTransfer) {
                    buttons.push('Thanh toán lại');
                }
                buttons.push('Hủy đơn'); // Giả định nút hủy đơn luôn có trong trạng thái processing
            }

            // ——— SHIPPING
            if (order.status === 'shipping' && !hasRR) {
                buttons.push('Đã nhận hàng');
            }

            // ——— DELIVERED
            if (order.status === 'delivered') {
                if (!hasRR) {
                    // buttons.push('Đã nhận hàng'); // Nếu đã delivered, thường đã nhận hàng rồi, có thể bỏ nút này
                    buttons.push('Trả hàng/Hoàn tiền');
                }
            }
            
            // Logic cho nút 'Chọn cách hoàn hàng'
            const allowChooseReturnMethodStatuses = ['approved', 'awaiting_pickup', 'pickup_booked', 'received', 'refunded'];
            if (
                hasRR &&
                rr.status && // Đảm bảo có status
                allowChooseReturnMethodStatuses.includes(rr.status) &&
                !rr.returnMethod // đã chọn rồi thì ẩn nút
            ) {
                buttons.push('Chọn cách hoàn hàng');
            }

            if (order.status === 'completed') {
                buttons.push('Mua Lại');
                if (!hasRR) buttons.push('Trả hàng/Hoàn tiền');
            }
            
            // Nút xem chi tiết trả hàng luôn hiển thị nếu có yêu cầu trả hàng
            if (hasRR) buttons.push('Xem chi tiết trả hàng');

            // ——— CANCELLED
            if (order.status === 'cancelled') buttons.push('Mua Lại');

            /* -------------------------------------------------- *
             * 4. OBJECT RETURN
             * -------------------------------------------------- */
            return {
                id: order.id,
                tabId,
                statusText,
                statusColor, // Màu text cho status của đơn hàng (không phải dot)
                orderCode: order.orderCode,
                createdAt: order.createdAt,
                totalAmount: order.finalPrice,
                shippingAddress: order.shippingAddress || null,
                paymentMethod: order.paymentMethod || null,
                paymentMethodCode: order.paymentMethod?.code || null,
                returnRequest: order.returnRequest
                    ? {
                        id: order.returnRequest.id,
                        returnCode: order.returnRequest.returnCode,
                        deadlineChooseReturnMethod: order.returnRequest.deadlineChooseReturnMethod,
                        status: order.returnRequest.status,
                        returnMethod: order.returnRequest.returnMethod,
                        // Thêm danh sách các sản phẩm trong yêu cầu trả hàng
                        items: order.returnRequest.items || [] // RẤT QUAN TRỌNG: API cần trả về returnRequest.items
                    }
                    : null,
                paymentStatus: order.paymentStatus,
                products: order.products.map(p => ({
                    skuId: p.skuId,
                    imageUrl: p.imageUrl,
                    name: p.name,
                    variation: p.variation,
                    quantity: p.quantity,
                    price: p.price,
                    originalPrice: p.originalPrice,
                })),
                buttons,
            };
        });


    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getUserOrders();

            if (response && response.data?.data) {
                const mappedData = mapApiDataToView(response.data.data);
                setOrders(mappedData);
            }
        } catch (error) {
            console.error("Lỗi khi tải lịch sử mua hàng:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);


    const purchaseTabs = [
        { id: 'all', label: 'Tất cả', activeClasses: 'text-primary border-b-2 border-primary font-bold', inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600' },
        { id: 'await_payment', label: 'Chờ thanh toán', activeClasses: 'text-primary border-b-2 border-primary font-bold', inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600' },
        { id: 'processing', label: 'Đang xử lý', activeClasses: 'text-primary border-b-2 border-primary font-bold', inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600' },
        { id: 'shipping', label: 'Vận chuyển', activeClasses: 'text-primary border-b-2 border-primary font-bold', inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600' },
        { id: 'delivered', label: 'Đã giao', activeClasses: 'text-primary border-b-2 border-primary font-bold', inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600' },
        { id: 'completed', label: 'Hoàn thành', activeClasses: 'text-primary border-b-2 border-primary font-bold', inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600' },
        { id: 'return', label: 'Trả hàng/Hoàn tiền', activeClasses: 'text-primary border-b-2 border-primary font-bold', inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600' },
        { id: 'cancelled', label: 'Đã hủy', activeClasses: 'text-primary border-b-2 border-primary font-bold', inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600' },
    ];

    const filteredOrders = (orders || []).filter(order => {
        const isReturnTab = activePurchaseTab === 'return';
        const isAwaitPaymentTab = activePurchaseTab === 'await_payment';

        const statusMatch = isReturnTab
            ? Boolean(order.returnRequest)
            : isAwaitPaymentTab
                ? ['waiting', 'processing'].includes(order.paymentStatus) && order.tabId !== 'cancelled'
                : (activePurchaseTab === 'all' || order.tabId === activePurchaseTab);

        const term = searchTerm.toLowerCase();
        const searchTermMatch =
            !term ||
            (order.orderCode && order.orderCode.toLowerCase().includes(term)) ||
            order.id.toString().includes(term) ||
            order.products.some(p => p.name.toLowerCase().includes(term));
        return statusMatch && searchTermMatch;
    });


    if (loading) {
        return <Loader fullscreen={true} />;
    }

    return (
        <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 py-2 shadow-sm">
                <nav className="flex space-x-2 overflow-x-auto whitespace-nowrap hide-scrollbar px-4 sm:px-6">
                    {purchaseTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActivePurchaseTab(tab.id)}
                            className={`
                                px-4 py-2 text-sm font-semibold transition-all duration-200 ease-in-out flex-shrink-0
                                ${activePurchaseTab === tab.id ? tab.activeClasses : tab.inactiveClasses}
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="my-3 sm:my-4 px-0">
                <div className="relative mx-0 sm:mx-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm kiếm theo ID đơn hàng hoặc Tên sản phẩm" className="block w-full bg-white border-y sm:border-x border-gray-200 text-gray-900 text-sm focus:ring-sky-300 focus:border-sky-400 py-2.5 pl-10 pr-3 sm:rounded-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400" />
                </div>
            </div>
            <div className="px-0">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => <OrderItem key={order.id} order={order} searchTerm={searchTerm} refetchOrders={fetchOrders} />)
                ) : (
                    <div className="text-center py-16 text-gray-500 bg-white rounded-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                        <PackageOpen size={48} className="mx-auto mb-3 text-gray-400" />
                        Không tìm thấy đơn hàng nào phù hợp.
                    </div>
                )}
            </div>
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default RenderDonMuaContent;