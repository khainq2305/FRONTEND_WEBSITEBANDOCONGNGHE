import React, { useState, useEffect } from 'react';
import { Search, Store, PackageOpen } from 'lucide-react';
import { orderService } from '../../../services/client/orderService';
import Loader from '../../../components/common/Loader';
import HighlightText from '../../../components/Admin/HighlightText';
import { formatCurrencyVND } from '../../../utils/formatCurrency';

import CancelOrderDialog from './CancelOrderDialog'; // ✅ import ở đầu file


// --- Component con để render một đơn hàng ---
const OrderItem = ({ order, searchTerm, refetchOrders }) => {

    const [showCancelDialog, setShowCancelDialog] = useState(false); // ✅ khai báo state
    return (
        <div className="bg-white mb-3 sm:mb-4 border border-gray-200 rounded-sm">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
                {/* ✅ ĐÃ BỎ NÚT XEM SHOP */}
                <div className="flex items-center">
  <Store size={18} className="text-gray-700 mr-2" />
  <span className="text-sm text-gray-700 font-medium">Thông tin đơn hàng</span>
</div>

                <div className="flex items-center">
                    <span className={`text-xs sm:text-sm font-semibold uppercase ${order.statusColor || 'text-primary'}`}>
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
                    <button className="text-sm bg-primary hover:bg-secondary text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
                        Mua Lại
                    </button>
                )}
                {order.buttons.includes('Trả hàng/Hoàn tiền') && (
                    <button className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
                        Trả hàng/Hoàn tiền
                    </button>
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
                    statusText = 'ĐÃ XÁC NHẬN'; // Đổi chữ
                    statusColor = 'text-yellow-600'; // Đổi màu cho dễ nhìn hơn
                    buttons.push('Hủy đơn');
                    break;
                case 'shipping':
                    statusText = 'ĐANG GIAO';
                    statusColor = 'text-cyan-500';
                    break;
             case 'completed':
  statusText = 'HOÀN THÀNH';
  statusColor = 'text-green-600';
  buttons.push('Mua Lại', 'Trả hàng/Hoàn tiền');
  break;

                case 'cancelled':
                    statusText = 'ĐÃ HỦY';
                    statusColor = 'text-red-500';
                    buttons.push('Mua Lại');
                    break;
                default:
                    statusText = 'KHÔNG RÕ';
            }

            return {
                id: order.id,
                status: order.status,
                statusText,
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
        { id: 'all', label: 'Tất cả' },
        { id: 'pending', label: 'Chờ xác nhận' },
        { id: 'confirmed', label: 'Đã xác nhận' }, // Đổi chữ ở đây cho khớp
        { id: 'shipping', label: 'Đang giao' },
        { id: 'delivered', label: 'Hoàn thành' },
        { id: 'cancelled', label: 'Đã hủy' },
    ];

    const filteredOrders = orders.filter(order => {
        const statusMatch = activePurchaseTab === 'all' || order.status === activePurchaseTab;
        const searchTermMatch = !searchTerm || order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) || order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return statusMatch && searchTermMatch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader />
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Nav Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <nav className="flex space-x-0 overflow-x-auto whitespace-nowrap hide-scrollbar">
                    {purchaseTabs.map(tab => (
                        <button key={tab.id} onClick={() => setActivePurchaseTab(tab.id)} className={`py-3 px-3 sm:px-4 md:px-5 text-sm font-medium focus:outline-none relative whitespace-nowrap ${activePurchaseTab === tab.id ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
                            {tab.label}
                            {activePurchaseTab === tab.id && (<span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary"></span>)}
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