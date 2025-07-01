import React, { useState, useEffect } from 'react';
import { Search, PackageOpen } from 'lucide-react';
import { orderService } from '../../../services/client/orderService';
import Loader from '../../../components/common/Loader';
import HighlightText from '../../../components/Admin/HighlightText';
import { formatCurrencyVND } from '../../../utils/formatCurrency';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import CancelOrderDialog from './CancelOrderDialog';
import ReturnMethodDialog from './ReturnMethodDialog';

const OrderItem = ({ order, searchTerm, refetchOrders }) => {
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [openReturnMethodDialog, setOpenReturnMethodDialog] = useState(false);
    const navigate = useNavigate();
    const [showAllProducts, setShowAllProducts] = useState(false);

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
    const res = await orderService.payAgain(order.id);
    if (res.data?.payUrl) {
      window.location.href = res.data.payUrl;   // chuyển sang trang thanh toán
    } else {
      toast.error('Không tạo được link thanh toán.');
    }
  } catch (err) {
    console.error('Pay-again error:', err);
    toast.error(err.response?.data?.message || 'Không thể thanh toán lại.');
  }
};

    const [showCancelDialog, setShowCancelDialog] = useState(false);
    return (
        <div className="bg-white dark:bg-gray-800 mb-3 sm:mb-4 border border-gray-200 dark:border-gray-700 rounded-sm">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Mã đơn hàng</span>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        <HighlightText
                            text={order.orderCode}
                            highlight={searchTerm}
                        />
                    </h4>
                </div>

                <div className="flex items-center">
                    <span
                        className={`text-xs sm:text-sm font-semibold uppercase ${order.statusColor || 'text-primary'}`}
                    >
                        {order.statusText}
                    </span>
                </div>
            </div>

            {order.products.slice(0, showAllProducts ? order.products.length : productsToShowInitially).map((product, index) => (
                <div key={`${order.id}-${product.skuId}-${index}`} className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex">
                    <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-sm border border-gray-200 dark:border-gray-600 mr-3 sm:mr-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 dark:text-gray-100 mb-1 line-clamp-2">
                            <HighlightText text={product.name} highlight={searchTerm} />
                        </p>
                        {product.variation && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phân loại hàng: {product.variation}</p>}
                        <p className="text-xs text-gray-700 dark:text-gray-300">x{product.quantity}</p>
                    </div>
                    <div className="text-right ml-3 sm:ml-4 flex-shrink-0">
                        {product.originalPrice && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 line-through mr-1.5">{formatCurrencyVND(product.originalPrice)}</span>
                        )}
                        <span className="text-sm text-red-500 dark:text-red-400">{formatCurrencyVND(product.price)}</span> {/* Changed to text-red-500 */}
                    </div>
                </div>
            ))}

            {order.products.length > productsToShowInitially && (
                <div className="px-4 sm:px-6 py-2 bg-gray-50 dark:bg-gray-700 text-center border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setShowAllProducts(!showAllProducts)}
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 font-medium"
                    >
                        {showAllProducts ? `Thu gọn (${order.products.length} sản phẩm)` : `Xem thêm (${order.products.length - productsToShowInitially} sản phẩm)`}
                    </button>
                </div>
            )}

            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 text-right">
                <div className="flex justify-end items-center mb-2">
                    <span className="text-sm text-gray-800 dark:text-gray-100">Thành tiền:</span>
                    <span className="text-lg sm:text-xl font-semibold text-red-500 dark:text-red-400 ml-2">{formatCurrencyVND(order.totalAmount)}</span> {/* Changed to text-red-500 */}
                </div>
            </div>

            <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap justify-end items-center gap-2">
                {order.buttons.includes('Thanh toán lại') && (
  <button
    onClick={handlePayAgain}
    className="
      text-sm border border-orange-500 text-orange-600
      hover:bg-orange-50 px-4 py-2 rounded-sm transition-colors
      dark:text-orange-400 dark:border-orange-500 dark:hover:bg-orange-900
    "
  >
    Thanh toán lại
  </button>
)}
<button
  className="text-sm text-blue-600 hover:underline"
  onClick={() => navigate(`/user-profile/orders/${order.orderCode}`)}
>
  Xem chi tiết
</button>


                {order.buttons.includes('Hủy đơn') && (
                    <>
                        <button
                            className="
    text-sm
    border  border-red-500
    text-red-600
    hover:bg-red-50
    px-4 py-2 rounded-sm
    transition-colors
    dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900
  "
                            onClick={() => setShowCancelDialog(true)}
                        >
                            Hủy đơn
                        </button>
                        <CancelOrderDialog
                            isOpen={showCancelDialog}
                            onClose={() => setShowCancelDialog(false)}
                            orderId={order.id}
                            onSuccess={() => {
                                refetchOrders();
                            }}
                        />
                    </>
                )}
                {order.buttons.includes('Mua Lại') && (
                    <button
                        className="
    text-sm
    border  border-primary
    text-primary
    hover:bg-primary/10
    px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm
    transition-colors
    dark:text-primary-light dark:border-primary-dark dark:hover:bg-primary-dark/20
  "
                        onClick={handleReorder}
                    >
                        Mua Lại
                    </button>
                )}

                {order.buttons.includes('Trả hàng/Hoàn tiền') && (
                    <>
                        <button
                             className="
    text-sm
    border  border-blue-500
    text-blue-600
    hover:bg-blue-50
    px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm
    transition-colors
    dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900
  "
                            onClick={() => navigate('/return-order', {
                                state: {
                                    orderId: order.id,
                                    orderPaymentMethodCode: order.paymentMethod?.code,
                                    orderProducts: order.products,
                                    finalPrice             : order.totalAmount,   
                                }
                            })}
                        >
                            Trả hàng/Hoàn tiền
                        </button>
                    </>
                )}
                {order.buttons.includes('Đã nhận hàng') && (
                    <button
                         className="
    text-sm
    border  border-green-600
    text-green-600
    hover:bg-green-50
    px-4 py-2 rounded-sm
    transition-colors
    dark:text-green-400 dark:border-green-600 dark:hover:bg-green-900
  "
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
                    >
                        Đã nhận hàng
                    </button>
                )}

                  {order.buttons.includes("Chọn cách hoàn hàng") && (
                    <>
                        <button
                            className="
    text-sm
    border  border-blue-500
    text-blue-600
    hover:bg-blue-50
    px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm
    transition-colors
    dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900
  "
                            onClick={() => setOpenReturnMethodDialog(true)}
                        >
                            Chọn cách hoàn hàng
                        </button>
                        <ReturnMethodDialog
                            open={openReturnMethodDialog}
                            onClose={() => setOpenReturnMethodDialog(false)}
                            returnRequestId={order.returnRequest.id}
                            onSuccess={refetchOrders}
                            // THÊM CÁC PROPS NÀY VÀO ĐÂY
                              
                          shippingAddress={order.shippingAddress}
                            shippingMethodName={order.shippingMethod?.name || 'GHN'} // Tên đơn vị vận chuyển (giả định có trong order)
                        />
                    </>
                )}
            </div>
        </div>
    );
};

const RenderDonMuaContent = () => {
    const [activePurchaseTab, setActivePurchaseTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

/* ================================================================
   MAP API  →  VIEW
   ================================================================ */
/* ================================================================
   MAP API → VIEW  (thêm "Mua Lại" cho DELIVERED)
================================================================ */
/* eslint-disable camelcase */
const mapApiDataToView = (apiOrders = []) =>
  apiOrders.map(order => {
    /* -------------------------------------------------- *
     * 1. TAB ID                                          *
     * -------------------------------------------------- *
     * KHÔNG can thiệp “chuyển tab tự động”.
     * Mỗi đơn ở đúng tab = order.status                */
    const tabId = order.status || 'unknown';

    /* -------------------------------------------------- *
     * 2. STATUS TEXT + COLOR                             *
     * -------------------------------------------------- */
    let statusText  = '';
    let statusColor = '';

    switch (order.status) {
      case 'processing':
        statusText  = 'ĐANG XỬ LÝ';
        statusColor = 'text-blue-600';
        break;
      case 'shipping':
        statusText  = 'ĐANG GIAO';
        statusColor = 'text-cyan-500';
        break;
      case 'delivered':
        statusText  = 'ĐÃ GIAO';
        statusColor = 'text-green-500';
        break;
      case 'completed':
        statusText  = 'HOÀN THÀNH';
        statusColor = 'text-emerald-600';
        break;
      case 'cancelled':
        statusText  = 'ĐÃ HỦY';
        statusColor = 'text-red-500';
        break;
      default:
        statusText  = 'KHÔNG RÕ';
        statusColor = 'text-gray-400';
    }

    // Nếu đơn đang CHỜ THANH TOÁN, chỉ đổi màu + text — KHÔNG đổi tab
    if (order.paymentStatus === 'waiting') {
      statusText  = 'CHỜ THANH TOÁN';
      statusColor = 'text-orange-500';
    }

    /* -------------------------------------------------- *
     * 3. BUTTONS                                         *
     * -------------------------------------------------- */
    const rr          = order.returnRequest;
    const hasRR       = !!rr;
    const rrApproved  = rr?.status === 'approved';

    const buttons = [];

    // ——— PROCESSING
    if (order.status === 'processing') {
      if (order.paymentStatus === 'waiting') buttons.push('Thanh toán lại');
      buttons.push('Hủy đơn');
    }

    // ——— SHIPPING
    if (order.status === 'shipping') buttons.push('Đã nhận hàng');

    // ——— DELIVERED
    if (order.status === 'delivered') {
      buttons.push('Đã nhận hàng', 'Mua Lại');
      if (!hasRR)         buttons.push('Trả hàng/Hoàn tiền');
      else if (rrApproved) buttons.push('Chọn cách hoàn hàng');
    }

    // ——— COMPLETED
    if (order.status === 'completed') {
      buttons.push('Mua Lại');
      if (!hasRR)         buttons.push('Trả hàng/Hoàn tiền');
      else if (rrApproved) buttons.push('Chọn cách hoàn hàng');
    }

    // ——— CANCELLED
    if (order.status === 'cancelled') buttons.push('Mua Lại');

    /* -------------------------------------------------- *
     * 4. OBJECT RETURN                                   *
     * -------------------------------------------------- */
    return {
      id                : order.id,
      tabId,
      statusText,
      statusColor,
      orderCode         : order.orderCode,
      totalAmount       : order.finalPrice,
  shippingAddress : order.shippingAddress || null,   // 👈 thêm
      paymentMethod     : order.paymentMethod || null,
      paymentMethodCode : order.paymentMethod?.code || null,
      returnRequest     : order.returnRequest || null,

      products: order.products.map(p => ({
        skuId        : p.skuId,
        imageUrl     : p.imageUrl,
        name         : p.name,
        variation    : p.variation,
        quantity     : p.quantity,
        price        : p.price,
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
        {
            id: 'all',
            label: 'Tất cả',
            activeClasses: 'text-primary border-b-2 border-primary font-bold',
            inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
        },
         {
  id: 'await_payment',
   label: 'Chờ thanh toán',
  activeClasses:
   'text-orange-500 border-b-2 border-orange-500 font-bold',
  inactiveClasses:
    'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
},
        {
            id: 'processing',
            label: 'Đang xử lý',
            activeClasses: 'text-blue-600 border-b-2 border-blue-600 font-bold',
            inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
        },
        {
            id: 'shipping',
            label: 'Vận chuyển',
            activeClasses: 'text-cyan-500 border-b-2 border-cyan-500 font-bold',
            inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
        },
        {
            id: 'delivered',
            label: 'Đã giao',
            activeClasses: 'text-green-500 border-b-2 border-green-500 font-bold',
            inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
        },
        {
            id: 'completed',
            label: 'Hoàn thành',
            activeClasses: 'text-emerald-600 border-b-2 border-emerald-600 font-bold',
            inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
        },
        {
            id: 'return',
            label: 'Trả hàng/Hoàn tiền',
            activeClasses: 'text-purple-600 border-b-2 border-purple-600 font-bold',
            inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
        },
        {
            id: 'cancelled',
            label: 'Đã hủy',
            activeClasses: 'text-red-600 border-b-2 border-red-600 font-bold',
            inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
        },
    ];



const filteredOrders = (orders || []).filter(order => {
    // 1) Tab "Trả hàng/Hoàn tiền": lấy mọi đơn có returnRequest
  const isReturnTab = activePurchaseTab === 'return';
  const statusMatch = isReturnTab
    ? Boolean(order.returnRequest)              // có yêu cầu đổi/trả
    : (activePurchaseTab === 'all' ||
       order.tabId === activePurchaseTab);      // các tab khác như cũ
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