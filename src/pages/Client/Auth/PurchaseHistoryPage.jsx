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
import socket from '../../../constants/socket';
import MUIPagination from '../../../components/common/Pagination';
import CancelOrderDialog from './CancelOrderDialog';
import { paymentService } from '../../../services/client/paymentService';


const OrderItem = ({ order, searchTerm, refetchOrders }) => {
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [openReturnMethodDialog, setOpenReturnMethodDialog] = useState(false);
    const navigate = useNavigate();
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    const moreButtonRef = useRef(null);
    const [loadingReorder, setLoadingReorder] = useState(false);
    const productsToShowInitially = 2;
   const getOrderStatusDisplay = (order) => {
  const rr = order.returnRequest;

  if (rr?.status === 'rejected') {
    return {
      text: 'YÊU CẦU BỊ TỪ CHỐI',
      dotColor: 'bg-red-500',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    };
  }
const allowChooseReturnMethodStatuses = [
    'approved',
    'awaiting_pickup',
    'pickup_booked',
    'received',
    'refunded'
  ];
  if (
    rr &&
    rr.status &&
    allowChooseReturnMethodStatuses.includes(rr.status) &&
    !rr.returnMethod
  ) {
    return {
      text: 'CHỌN CÁCH HOÀN HÀNG', // bạn có thể để rỗng và hiển thị nút riêng
      dotColor: 'bg-blue-500',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      isChooseReturnMethod: true, // flag để render nút thay text
    };
  }
  if (rr?.status === 'refunded') {
    return {
      text: 'Đã hoàn tiền',
      dotColor: 'bg-green-500',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    };
  }

  if (
    rr &&
    ['pending', 'approved', 'awaiting_pickup', 'pickup_booked', 'returning', 'received', 'cancelled'].includes(rr.status)
  ) {
    let text = 'Yêu cầu trả hàng/hoàn tiền';

    if (rr.status === 'pending') {
      text = 'CYBERZONE ĐANG XEM XÉT';
    } else if (rr.status === 'cancelled') {
      text = 'YÊU CẦU ĐÃ BỊ HỦY';
    }

    return {
      text,
      dotColor: 'bg-yellow-500',
      bgColor: 'bg-yellow-100',
      textColor: 'text-gray-800 dark:text-gray-200',
    };
  }

  // fallback theo order.status
  switch (order.status) {
    case 'cancelled':
      return {
        text: order.statusText,
        dotColor: 'bg-red-500',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600',
      };
    case 'pending_payment':
      return {
        text: order.statusText,
        dotColor: 'bg-yellow-500',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-600',
      };
    default:
      return {
        text: order.statusText,
        dotColor: 'bg-green-500',
        bgColor: 'bg-green-100',
        textColor: 'text-gray-800 dark:text-gray-200',
      };
  }
};



    const statusDisplay = getOrderStatusDisplay(order);


    const handleReorder = async () => {
        try {
            setLoadingReorder(true); 
            await orderService.reorder(order.id);
            toast.success('Đã thêm sản phẩm vào giỏ hàng!');
            navigate('/cart');
        } catch (err) {
            console.error('Lỗi khi mua lại:', err);
            toast.error('Không thể mua lại đơn hàng!');
        } finally {
            setLoadingReorder(false); 
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
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const userId = localStorage.getItem('userId');
        if (userId) {
            socket.emit('join', `user-${userId}`);
        }

        const handleOrderUpdate = (data) => {

            fetchOrders();
        };

        socket.on('order-updated', handleOrderUpdate);

        return () => {
            socket.off('order-updated', handleOrderUpdate);
        };
    }, []);

    return (

        <div className="bg-white dark:bg-gray-800 mb-3 sm:mb-4 border border-gray-200 dark:border-gray-700 rounded-sm">
             {loadingReorder && <Loader fullscreen />}
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
                    <span className={`
    flex items-center justify-center h-5 w-5 rounded-full
    ${statusDisplay.bgColor}
  `}>
                        <span className={`h-2.5 w-2.5 rounded-full ${statusDisplay.dotColor}`} />
                    </span>
                    <span className={`text-xs sm:text-sm font-semibold uppercase ${statusDisplay.textColor}`}>
                        {statusDisplay.text}
                    </span>
                </div>


            </div>

            <div className="">

                {order.products.slice(0, showAllProducts ? order.products.length : productsToShowInitially).map((product, index) => {
                    const isOutOfStock = Boolean(product?.isOutOfStock);

                const isReturning = order.returnRequest?.status !== 'cancelled'
  && order.returnRequest?.status !== 'rejected' 
  && order.returnRequest?.items?.some(item => item.skuId === product.skuId);


                    const isProductInReturnRequest = order.returnRequest &&
                        order.returnRequest.items.some(item => item.skuId === product.skuId);

                    return (
                        <div
                            key={`${order.id}-${product.skuId}-${index}`}
                            className={`relative px-4 sm:px-6 py-3 sm:py-4 dark:border-gray-700 flex hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${isOutOfStock ? 'opacity-50' : ''}`}
                            onClick={() => navigate(`/user-profile/orders/${order.orderCode}`)}
                        >

                            {isProductInReturnRequest && order.returnRequest?.status !== 'cancelled' && (
                                <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-60 pointer-events-none z-10 rounded-sm" />
                            )}



                           <div className="relative mr-3 sm:mr-4 flex-shrink-0">
  <img
    src={product.imageUrl}
    alt={product.name}
    className="w-20 h-20 object-cover rounded-sm border border-gray-200 dark:border-gray-600"
  />
  {isOutOfStock && (
    <span className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">
      Hết hàng
    </span>
  )}
</div>

                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900">
                                    {product.name}
                                </p>
                                {isReturning && (
                                    <span className="inline-block mt-1 border border-yellow-500 text-yellow-600 bg-yellow-50 text-[9px] font-bold px-2 py-[2px] rounded-sm uppercase tracking-wide z-20 relative">
                                        TRẢ HÀNG / HOÀN TIỀN
                                    </span>
                                )}


                                {product.variation && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phân loại hàng: {product.variation}</p>}
                                <p className="text-xs text-gray-700 dark:text-gray-300">x{product.quantity}

                                </p>

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
            </div>
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

                    {order.returnRequest ? (
                     order.returnRequest.status === 'cancelled' ? (
    <p className="text-xs text-gray-500 italic dark:text-gray-400 max-w-[360px] leading-snug">
      Yêu cầu <strong>đã bị hủy</strong>
    </p>
  ) : order.returnRequest.status === 'rejected' ? ( 
    <p className="text-xs text-red-600 italic dark:text-red-400 max-w-[360px] leading-snug">
      Yêu cầu <strong>bị từ chối</strong>
    </p>
  ) : (
    <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[360px] leading-snug">
      Yêu cầu <strong>trả hàng / hoàn tiền</strong>
    </p>
  )
                    ) : order.buttons.includes('Đã nhận hàng') ? (
                        <p className="text-xs text-gray-600 dark:text-gray-400 max-w-[360px] leading-snug">
                            Vui lòng chỉ nhấn <strong>"Đã nhận được hàng"</strong> khi đơn hàng đã được giao đến bạn và sản phẩm nhận được không có vấn đề nào.
                        </p>
                    ) : <div className="hidden sm:block" />}


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
                                        onClick={() => setShowCancelDialog(true)}
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


            <CancelOrderDialog
                open={showCancelDialog}
                onClose={() => setShowCancelDialog(false)}
                orderCode={order.orderCode}
                orderId={order.id}
                onSuccess={refetchOrders}
            />


        </div>
    );
};


const RenderDonMuaContent = () => {

    const [activePurchaseTab, setActivePurchaseTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 10;

const mapApiDataToView = (apiOrders = []) =>
  apiOrders.map(order => {
    const tabId = order.status || 'unknown';

    let statusText = '';
    let statusColor = 'text-gray-800';

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

    const rr = order.returnRequest;
    const hasRR = !!rr;

    const buttons = [];

    if (order.status === 'processing') {
      const manualTransferCodes = ['atm', 'vietqr', 'manual_transfer'];
      const isManualTransfer = manualTransferCodes.includes(order.paymentMethod?.code);
      if (order.paymentStatus === 'waiting' && !isManualTransfer) {
        buttons.push('Thanh toán lại');
      }
      buttons.push('Hủy đơn');
    }

    if (order.status === 'shipping' && !hasRR) {
      buttons.push('Đã nhận hàng');
    }

    if (order.status === 'delivered') {
      if (!hasRR || (rr?.status === 'cancelled' && rr?.cancelledBy === 'user')) {
        buttons.push('Trả hàng/Hoàn tiền');
      }
      if (!hasRR) {
        buttons.push('Đã nhận hàng');
      }
    }

    const allowChooseReturnMethodStatuses = ['approved', 'awaiting_pickup', 'pickup_booked', 'received', 'refunded'];
    if (
      hasRR &&
      rr.status &&
      allowChooseReturnMethodStatuses.includes(rr.status) &&
      !rr.returnMethod
    ) {
      buttons.push('Chọn cách hoàn hàng');
    }

    if (order.status === 'completed') {
      buttons.push('Mua Lại');
      if (!hasRR || (rr?.status === 'cancelled' && rr?.cancelledBy === 'user')) {
        buttons.push('Trả hàng/Hoàn tiền');
      }
    }

    if (hasRR) {
      buttons.push('Xem chi tiết trả hàng');
    }

    if (order.status === 'cancelled') {
      buttons.push('Mua Lại');
    }

    return {
      id: order.id,
      tabId,
      statusText,
      status: order.status,
      statusColor,
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
            cancelledBy: order.returnRequest.cancelledBy || null,
            returnMethod: order.returnRequest.returnMethod,
            items: order.returnRequest.items || []
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
        isOutOfStock: Boolean(p.isOutOfStock)
      })),
      buttons
    };
  });


    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);

            const res = await orderService.getUserOrders({
                page,
                limit: itemsPerPage
            });



            const apiData = res.data?.data ?? [];
            const mapped = mapApiDataToView(apiData);
            setOrders(mapped);

            const pg = res.data?.pagination ?? {};
            setTotalItems(pg.totalItems ?? 0);
            setCurrentPage(pg.currentPage ?? page);

        } catch (err) {
            console.error("Lỗi khi tải lịch sử mua hàng:", err);
            setOrders([]);
            setTotalItems(0);
            setCurrentPage(1);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => { fetchOrders(1); }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchOrders(page);
    };


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
                    filteredOrders.map(order => (
                        <OrderItem
                            key={order.id}
                            order={order}
                            searchTerm={searchTerm}
                            refetchOrders={() => fetchOrders(currentPage)}
                        />
                    ))
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

            {filteredOrders.length > 0 && totalItems > itemsPerPage && (
                <MUIPagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />
            )}



        </div>
    );
};

export default RenderDonMuaContent;