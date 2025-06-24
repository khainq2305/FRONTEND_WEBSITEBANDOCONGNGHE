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

// --- Component con để render một đơn hàng ---
const OrderItem = ({ order, searchTerm, refetchOrders }) => {
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [openReturnMethodDialog, setOpenReturnMethodDialog] = useState(false);
    const navigate = useNavigate();

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
        <div className="bg-white mb-3 sm:mb-4 border border-gray-200 rounded-sm">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Mã đơn hàng</span>
                    <h4 className="text-sm font-semibold text-gray-800">
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

            {/* Products */}
            {order.products.map((product, index) => (
                <div key={`${order.id}-${product.skuId}-${index}`} className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex">
                    <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-sm border border-gray-200 mr-3 sm:mr-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 mb-1 line-clamp-2">
                            <HighlightText text={product.name} highlight={searchTerm} />
                        </p>
                        {product.variation && <p className="text-xs text-gray-500 mb-1">Phân loại hàng: {product.variation}</p>}
                        <p className="text-xs text-gray-700">x{product.quantity}</p>
                    </div>
                    <div className="text-right ml-3 sm:ml-4 flex-shrink-0">
                        {product.originalPrice && (
                            <span className="text-xs text-gray-500 line-through mr-1.5">{formatCurrencyVND(product.originalPrice)}</span>
                        )}
                        <span className="text-sm text-primary">{formatCurrencyVND(product.price)}</span>
                    </div>
                </div>
            ))}

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 text-right">
                <div className="flex justify-end items-center mb-2">
                    <span className="text-sm text-gray-800">Thành tiền:</span>
                    <span className="text-lg sm:text-xl font-semibold text-primary ml-2">{formatCurrencyVND(order.totalAmount)}</span>
                </div>
            </div>

            {/* ✅ CẬP NHẬT LẠI CÁC NÚT BẤM */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap justify-end items-center gap-2">
                {order.buttons.includes('Hủy đơn') && (
                    <>
                        <button
                            className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-sm"
                            onClick={() => setShowCancelDialog(true)}
                        >
                            Hủy đơn
                        </button>
                        <CancelOrderDialog
                            isOpen={showCancelDialog}
                            onClose={() => setShowCancelDialog(false)}
                            orderId={order.id}
                            onSuccess={() => {
                                refetchOrders(); // ✅ gọi lại để cập nhật UI ngay
                            }}
                        />
                    </>
                )}
                {order.buttons.includes('Mua Lại') && (
                    <button
                        className="text-sm bg-primary hover:bg-secondary text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors"
                        onClick={handleReorder}
                    >
                        Mua Lại
                    </button>
                )}

                {order.buttons.includes('Trả hàng/Hoàn tiền') && (
                    <>
                     <button
                            className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors"
                            onClick={() => navigate('/return-order', { // ✅ THAY ĐỔI TẠI ĐÂY
                                state: {
                                    orderId: order.id,
                                    orderPaymentMethodCode: order.paymentMethod?.code,
                                    orderProducts: order.products, // Truyền danh sách sản phẩm
                                }
                            })}
                        >
                            Trả hàng/Hoàn tiền
                        </button>
                                          </>
                )}
                {order.buttons.includes('Đã nhận hàng') && (
                    <button
                        className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-sm"
                        onClick={async () => {
                            try {
                                await orderService.markAsCompleted(order.id);
                                toast.success('Đã xác nhận đã nhận hàng!');
                                refetchOrders(); // cập nhật lại danh sách đơn hàng
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
                            className="text-sm bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-sm transition-colors"
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

// ... Phần còn lại của component RenderDonMuaContent giữ nguyên như cũ ...
const RenderDonMuaContent = () => {
    const [activePurchaseTab, setActivePurchaseTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);


    const mapApiDataToView = (apiOrders) => {
        if (!apiOrders || !Array.isArray(apiOrders)) return [];
        return apiOrders.map(order => {
            let statusText = '';
            let statusColor = 'text-primary'; // Mặc định là màu primary
            let buttons = [];

            // ✅ CẬP NHẬT LOGIC
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
                    // ❌ Không thêm nút hủy
                    break;
                case 'delivered':
                    statusText = 'ĐÃ GIAO';
                    statusColor = 'text-green-500';
                    buttons.push('Đã nhận hàng');
                    break;

                case 'completed':
                    statusText = 'HOÀN THÀNH';
                    statusColor = 'text-green-600';

                    // Nếu chưa có yêu cầu trả hàng thì mới hiển thị nút "Trả hàng/Hoàn tiền"
                    if (!order.returnRequest) {
                        buttons.push('Mua Lại', 'Trả hàng/Hoàn tiền');
                    } else if (order.returnRequest.status === 'approved') {
                        // Nếu đã được admin duyệt, hiện nút chọn phương thức hoàn hàng
                        buttons.push('Chọn cách hoàn hàng');
                    } else {
                        // Nếu có returnRequest nhưng chưa được duyệt, chỉ hiển thị 'Mua Lại'
                        buttons.push('Mua Lại');
                    }
                    break;

                case 'cancelled':
                    statusText = 'ĐÃ HỦY';
                    statusColor = 'text-red-500';
                    buttons.push('Mua Lại'); // ❌ Không có hủy đơn
                    break;
                default:
                    statusText = 'KHÔNG RÕ';
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
            
console.log("📦 API data:", response.data?.data);
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
            activeClasses: 'bg-slate-800 text-white border-slate-800',
            inactiveClasses: 'text-slate-600 border-slate-300 hover:bg-slate-100 hover:border-slate-400',
        },
        {
            id: 'pending',
            label: 'Chờ xác nhận',
            activeClasses: 'bg-blue-600 text-white border-blue-600',
            inactiveClasses: 'text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-500',
        },
        {
            id: 'confirmed',
            label: 'Đã xác nhận',
            activeClasses: 'bg-amber-500 text-white border-amber-500',
            inactiveClasses: 'text-amber-600 border-amber-300 hover:bg-amber-50 hover:border-amber-500',
        },
        {
            id: 'shipping',
            label: 'Đang giao',
            activeClasses: 'bg-cyan-500 text-white border-cyan-500',
            inactiveClasses: 'text-cyan-600 border-cyan-300 hover:bg-cyan-50 hover:border-cyan-500',
        },
        {
            id: 'delivered',
            label: 'Đã giao',
            activeClasses: 'bg-green-500 text-white border-green-500',
            inactiveClasses: 'text-green-600 border-green-300 hover:bg-green-50 hover:border-green-500',
        },
        {
            id: 'completed',
            label: 'Hoàn thành',
            activeClasses: 'bg-emerald-600 text-white border-emerald-600',
            inactiveClasses: 'text-emerald-600 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-500',
        },
        {
            id: 'return',
            label: 'Trả hàng/Hoàn tiền',
            activeClasses: 'bg-purple-600 text-white border-purple-600',
            inactiveClasses: 'text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-500',
        },
        {
            id: 'cancelled',
            label: 'Đã hủy',
            activeClasses: 'bg-red-600 text-white border-red-600',
            inactiveClasses: 'text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500',
        },
    ];


    const filteredOrders = orders.filter(order => {
        const statusMatch = activePurchaseTab === 'all' || order.status === activePurchaseTab;
        const term = searchTerm.toLowerCase();
        const searchTermMatch =
            !term ||
            // tìm theo mã đơn hàng
            (order.orderCode && order.orderCode.toLowerCase().includes(term)) ||
            // tìm theo ID nội bộ (nếu vẫn muốn)
            order.id.toString().includes(term) ||
            // tìm theo tên sản phẩm
            order.products.some(p => p.name.toLowerCase().includes(term));
        return statusMatch && searchTermMatch;
    });


    if (loading) {
        return <Loader fullscreen={true} />;
    }


    return (
        <div className="w-full">
            {/* Nav Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 py-2 shadow-sm">
                <nav className="flex space-x-2 overflow-x-auto whitespace-nowrap hide-scrollbar px-4 sm:px-6">
                    {purchaseTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActivePurchaseTab(tab.id)}
                            // Thay đổi padding và font size để trông hợp lý hơn
                            className={`
                                px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ease-in-out border
                                ${activePurchaseTab === tab.id ? tab.activeClasses : tab.inactiveClasses}
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            {/* Search Bar */}
            <div className="my-3 sm:my-4 px-0">
                <div className="relative mx-0 sm:mx-0">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm kiếm theo ID đơn hàng hoặc Tên sản phẩm" className="block w-full bg-white border-y sm:border-x border-gray-200 text-gray-900 text-sm focus:ring-sky-300 focus:border-sky-400 py-2.5 pl-10 pr-3 sm:rounded-sm" />
                </div>
            </div>
            {/* Orders List */}
            <div className="px-0">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => <OrderItem key={order.id} order={order} searchTerm={searchTerm} refetchOrders={fetchOrders} />)
                ) : (
                    <div className="text-center py-16 text-gray-500 bg-white rounded-sm border border-gray-200">
                        <PackageOpen size={48} className="mx-auto mb-3 text-gray-400" />
                        Không tìm thấy đơn hàng nào phù hợp.
                    </div>
                )}
            </div>
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default RenderDonMuaContent;