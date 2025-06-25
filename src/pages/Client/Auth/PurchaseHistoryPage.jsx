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
                {order.buttons.includes('Hủy đơn') && (
                    <>
                        <button
                            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-sm transition-colors dark:bg-red-700 dark:hover:bg-red-600"
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
                        className="text-sm bg-primary hover:bg-secondary text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors dark:bg-primary-dark dark:hover:bg-secondary-dark"
                        onClick={handleReorder}
                    >
                        Mua Lại
                    </button>
                )}

                {order.buttons.includes('Trả hàng/Hoàn tiền') && (
                    <>
                        <button
                            className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            onClick={() => navigate('/return-order', {
                                state: {
                                    orderId: order.id,
                                    orderPaymentMethodCode: order.paymentMethod?.code,
                                    orderProducts: order.products,
                                }
                            })}
                        >
                            Trả hàng/Hoàn tiền
                        </button>
                    </>
                )}
                {order.buttons.includes('Đã nhận hàng') && (
                    <button
                        className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-sm transition-colors dark:bg-green-800 dark:hover:bg-green-700"
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
                            className="text-sm bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-sm transition-colors dark:bg-gray-800 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900"
                            onClick={() => setOpenReturnMethodDialog(true)}
                        >
                            Chọn cách hoàn hàng
                        </button>
                        <ReturnMethodDialog
                            open={openReturnMethodDialog}
                            orderPaymentMethodCode={order.paymentMethodCode}

                            onClose={() => setOpenReturnMethodDialog(false)}
                            returnRequestId={order.returnRequest.id}
                            onSuccess={refetchOrders}
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

    const mapApiDataToView = (apiOrders) => {
        if (!apiOrders || !Array.isArray(apiOrders)) return [];
        return apiOrders.map(order => {
            let statusText = '';
            let statusColor = 'text-primary';
            let buttons = [];

            switch (order.status) {
                case 'pending':
                    statusText = 'CHỜ XÁC NHẬN';
                    statusColor = 'text-blue-500';
                    buttons.push('Hủy đơn');
                    break;
                case 'confirmed':
                    statusText = 'ĐÃ XÁC NHẬN';
                    statusColor = 'text-yellow-600';
                    buttons.push('Hủy đơn');
                    break;
                case 'shipping':
                    statusText = 'ĐANG GIAO';
                    statusColor = 'text-cyan-500';
                    break;
                case 'delivered':
                    statusText = 'ĐÃ GIAO';
                    statusColor = 'text-green-500';
                    buttons.push('Đã nhận hàng');
                    break;

                case 'completed':
                    statusText = 'HOÀN THÀNH';
                    statusColor = 'text-green-600';
                    if (!order.returnRequest) {
                        buttons.push('Mua Lại', 'Trả hàng/Hoàn tiền');
                    } else if (order.returnRequest.status === 'approved') {
                        buttons.push('Chọn cách hoàn hàng');
                    } else {
                        buttons.push('Mua Lại');
                    }
                    break;

                case 'cancelled':
                    statusText = 'ĐÃ HỦY';
                    statusColor = 'text-red-500';
                    buttons.push('Mua Lại');
                    break;
                case 'return_requested':
                    statusText = 'YÊU CẦU TRẢ HÀNG';
                    statusColor = 'text-purple-600';
                    buttons.push('Mua Lại');
                    break;
                case 'return_approved':
                    statusText = 'ĐÃ DUYỆT TRẢ HÀNG';
                    statusColor = 'text-purple-700';
                    buttons.push('Chọn cách hoàn hàng');
                    break;
                case 'returned':
                    statusText = 'ĐÃ HOÀN TIỀN/HÀNG';
                    statusColor = 'text-indigo-600';
                    buttons.push('Mua Lại');
                    break;
                case 'return_rejected':
                    statusText = 'TỪ CHỐI TRẢ HÀNG';
                    statusColor = 'text-gray-500';
                    buttons.push('Mua Lại');
                    break;
                default:
                    statusText = 'KHÔNG RÕ';
                    statusColor = 'text-gray-400';
            }

            return {
                id: order.id,
                status: order.status,
                statusText,
                orderCode: order.orderCode,
                statusColor,
                products: order.products.map(p => ({
                    skuId: p.skuId,
                    imageUrl: p.imageUrl,
                    name: p.name,
                    variation: p.variation,
                    quantity: p.quantity,
                    price: p.price,
                    originalPrice: p.originalPrice,
                })),
                totalAmount: order.finalPrice,
                buttons,
                paymentMethod: order.paymentMethod || null,
                paymentMethodCode: order.paymentMethod?.code || null,
                returnRequest: order.returnRequest || null,
            };
        });
    };

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
            activeClasses: 'text-yellow-600 border-b-2 border-yellow-600 font-bold',
            inactiveClasses: 'text-gray-600 dark:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
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



    const filteredOrders = orders.filter(order => {
        const statusMatch = activePurchaseTab === 'all' || order.status === activePurchaseTab;
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