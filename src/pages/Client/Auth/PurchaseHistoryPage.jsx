// PurchaseHistoryPage.jsx (Hoặc một tên file phù hợp cho nội dung trang Đơn Mua)
// Bạn có thể gọi component này là RenderDonMuaContent như trước, hoặc một tên khác.
import React, { useState } from 'react';
import { Search, MessageCircle, Store, ChevronDown, ShoppingCart, Truck, Star, Phone, PackageOpen, Info } from 'lucide-react';

// Component con để render một đơn hàng
const OrderItem = ({ order }) => {
  return (
    <div className="bg-white mb-3 sm:mb-4 border border-gray-200 rounded-sm">
      {/* Header của đơn hàng: Tên shop và trạng thái */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          {order.shopLogoUrl && (
             <img src={order.shopLogoUrl} alt="Shop Logo" className="w-5 h-5 mr-2 rounded-sm object-contain"/>
          )}
          <span className="font-semibold text-sm text-gray-800 mr-2 sm:mr-3 truncate">{order.shopName}</span>
          <button className="flex items-center text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-1 rounded-sm mr-1.5 sm:mr-2 transition-colors">
            <MessageCircle size={14} className="mr-1 text-gray-600" /> Chat
          </button>
          <a href={order.shopLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2 py-1 rounded-sm transition-colors">
            <Store size={14} className="mr-1 text-gray-600" /> Xem Shop
          </a>
        </div>
        <div className="flex items-center">
          {order.deliveryStatusIcon && <Truck size={16} className="text-green-600 mr-1.5" />}
          {order.deliveryStatusText && <span className="text-xs text-green-600 mr-2 sm:mr-3">{order.deliveryStatusText}</span>}
          <span className={`text-xs sm:text-sm font-semibold uppercase ${order.statusColor || 'text-gray-700'}`}>
            {order.statusText}
          </span>
        </div>
      </div>

      {/* Danh sách sản phẩm trong đơn hàng */}
      {order.products.map((product, index) => (
        <div key={product.id || index} className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex">
          <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-sm border border-gray-200 mr-3 sm:mr-4" />
          <div className="flex-1">
            <p className="text-sm text-gray-800 mb-1 line-clamp-2">{product.name}</p>
            {product.variation && <p className="text-xs text-gray-500 mb-1">Phân loại hàng: {product.variation}</p>}
            <p className="text-xs text-gray-700">x{product.quantity}</p>
          </div>
          <div className="text-right ml-3 sm:ml-4">
            {product.originalPrice && product.originalPrice > product.discountPrice && (
              <span className="text-xs text-gray-500 line-through mr-1.5">₫{product.originalPrice.toLocaleString('vi-VN')}</span>
            )}
            <span className="text-sm text-orange-500">₫{product.discountPrice.toLocaleString('vi-VN')}</span>
          </div>
        </div>
      ))}

      {/* Tổng tiền và thông báo phụ (nếu có) */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 text-right">
        <div className="flex justify-end items-center mb-2">
            <span className="text-sm">Thành tiền:</span>
            <span className="text-lg sm:text-xl font-semibold text-orange-500 ml-2">₫{order.totalAmount.toLocaleString('vi-VN')}</span>
        </div>
        {order.cancellationReason && (
          <div className="flex items-center justify-end text-xs text-gray-500 mt-1">
            <Info size={14} className="mr-1" />
            <span>{order.cancellationReason}</span>
          </div>
        )}
      </div>

      {/* Các nút hành động */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap justify-end items-center gap-2">
        {order.buttons.includes('Đánh Giá') && (
          <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
            Đánh Giá
          </button>
        )}
         {order.buttons.includes('Mua Lại') && (
          <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
            Mua Lại
          </button>
        )}
        {order.buttons.includes('Xem Chi Tiết Đơn') && (
          <button className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
            Xem Chi Tiết Đơn
          </button>
        )}
         {order.buttons.includes('Liên Hệ Người Bán') && (
          <button className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
            Liên Hệ Người Bán
          </button>
        )}
        {/* Thêm các nút điều kiện khác nếu cần */}
      </div>
    </div>
  );
};


// Component chính cho nội dung tab "Đơn Mua"
const RenderDonMuaContent = () => {
  const [activePurchaseTab, setActivePurchaseTab] = useState('tat-ca');
  const [searchTerm, setSearchTerm] = useState('');

  // Dữ liệu mẫu (thay thế bằng API call)
  const sampleOrders = [
    {
      id: 1,
      shopName: 'Đặc Sản Quê Hương Kiwi Mart...',
      shopLink: '#xem-shop-1',
      chatLink: '#chat-1',
      statusText: 'ĐÃ HỦY',
      statusColor: 'text-red-500',
      products: [
        {
          id: 'sp1',
          imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lq7px9g1j2293c_tn', // Ảnh mẫu
          name: '* SIÊU HOT * Bột Ớt Tê Cay 1+2 Gói 100gr 40gr Chẩm lạp xưởng nướng đá, xúc xích siêu thơm ngon',
          quantity: 1,
          originalPrice: 20000,
          discountPrice: 16000,
        }
      ],
      totalAmount: 16000,
      cancellationReason: 'Đã hủy tự động bởi hệ thống Shopee',
      buttons: ['Mua Lại', 'Xem Chi Tiết Đơn', 'Liên Hệ Người Bán']
    },
    {
      id: 2,
      shopName: 'WASEN VIỆT NAM',
      shopLogoUrl: 'https://down-vn.img.susercontent.com/file/vn-11134211-7r98o-lryw55qzd21l0a_tn', // Ảnh mẫu logo shop
      shopLink: '#xem-shop-2',
      chatLink: '#chat-2',
      deliveryStatusIcon: true,
      deliveryStatusText: 'Giao hàng thành công',
      statusText: 'HOÀN THÀNH',
      statusColor: 'text-green-600',
      products: [
        {
          id: 'sp2',
          imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lkv5x2q50yn77f_tn', // Ảnh mẫu
          name: 'NƯỚC LAU SÀN 1L WASEN SIÊU SẠCH TINH CHẤT THIÊN NHIÊN HƯƠNG SẢ CHANH',
          quantity: 2,
          // originalPrice: 40000, // Giá gốc / đơn vị
          discountPrice: 25000, // Giá sau giảm / đơn vị
        }
      ],
      totalAmount: 50000,
      buttons: ['Đánh Giá', 'Mua Lại', 'Xem Chi Tiết Đơn']
    },
    // Thêm đơn hàng khác
  ];

  const purchaseTabs = [
    { id: 'tat-ca', label: 'Tất cả' },
    { id: 'cho-thanh-toan', label: 'Chờ thanh toán' },
    { id: 'van-chuyen', label: 'Vận chuyển' },
    { id: 'cho-giao-hang', label: 'Chờ giao hàng' },
    { id: 'hoan-thanh', label: 'Hoàn thành' },
    { id: 'da-huy', label: 'Đã hủy' },
    { id: 'tra-hang-hoan-tien', label: 'Trả hàng/Hoàn tiền' },
  ];

  // Lọc đơn hàng dựa trên tab đang active và searchTerm (sẽ cần logic phức tạp hơn cho search)
  const filteredOrders = sampleOrders.filter(order => {
    if (activePurchaseTab === 'da-huy' && order.statusText !== 'ĐÃ HỦY') return false;
    if (activePurchaseTab === 'hoan-thanh' && order.statusText !== 'HOÀN THÀNH') return false;
    // Thêm logic lọc cho các tab khác nếu cần
    // Thêm logic search ở đây (ví dụ: order.shopName.includes(searchTerm) || order.products.some(p => p.name.includes(searchTerm)))
    return true;
  });

  return (
    <div className="w-full"> {/* Container chính của trang Đơn Mua */}
      {/* Thanh Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10"> {/* sticky để giữ tabs khi cuộn */}
        <nav className="flex space-x-0 overflow-x-auto whitespace-nowrap">
          {purchaseTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePurchaseTab(tab.id)}
              className={`py-3 px-3 sm:px-5 md:px-6 text-sm font-medium focus:outline-none relative ${
                activePurchaseTab === tab.id
                  ? 'text-orange-500'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              {tab.label}
              {activePurchaseTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Thanh Tìm Kiếm */}
      <div className="my-3 sm:my-4 px-3 sm:px-4 md:px-0"> {/* Cho thanh tìm kiếm có padding riêng nếu cần */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Bạn có thể tìm kiếm theo Tên Shop, ID đơn hàng hoặc Tên sản phẩm"
            className="block w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-orange-500 focus:border-orange-500 py-2.5 pl-10 pr-3"
          />
        </div>
      </div>

      {/* Danh sách đơn hàng */}
      <div className="px-0 sm:px-0"> {/* Bỏ padding nếu OrderItem đã có */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => <OrderItem key={order.id} order={order} />)
        ) : (
          <div className="text-center py-10 text-gray-500">
            <PackageOpen size={48} className="mx-auto mb-2" />
            Không có đơn hàng nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default RenderDonMuaContent; // Nếu bạn muốn dùng nó như một file riêng