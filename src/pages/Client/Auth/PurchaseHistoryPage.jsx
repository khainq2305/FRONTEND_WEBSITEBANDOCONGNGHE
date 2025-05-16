// PurchaseHistoryPage.jsx
import React, { useState } from 'react';
import { Search, MessageCircle, Store, Truck, PackageOpen, Info } from 'lucide-react';

// Component con để render một đơn hàng
const OrderItem = ({ order }) => {
  return (
    <div className="bg-white mb-3 sm:mb-4 border border-gray-200 rounded-sm">
      {/* Header của đơn hàng */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          {/* HOT Badge */}
          {order.isShopHot && (
            <span className="bg-red-600 text-white text-[10px] font-semibold px-1 py-0.5 rounded-sm mr-2">
              HOT
            </span>
          )}
          {/* Shop Logo hoặc Icon mặc định */}
          {order.shopLogoUrl ? (
            <img src={order.shopLogoUrl} alt="Shop Logo" className="w-5 h-5 mr-2 rounded-sm object-contain"/>
          ) : (
            <Store size={18} className="text-gray-700 mr-2" /> // Icon mặc định nếu không có logo
          )}
          {/* TÊN SHOP ĐÃ BỎ THEO YÊU CẦU */}
          {/* Nút Chat và Xem Shop */}
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
          <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-sm border border-gray-200 mr-3 sm:mr-4 flex-shrink-0" />
          <div className="flex-1 min-w-0"> {/* min-w-0 để text ellipsis hoạt động đúng */}
            <p className="text-sm text-gray-800 mb-1 line-clamp-2">{product.name}</p>
            {product.variation && <p className="text-xs text-gray-500 mb-1">Phân loại hàng: {product.variation}</p>}
            <p className="text-xs text-gray-700">x{product.quantity}</p>
          </div>
          <div className="text-right ml-3 sm:ml-4 flex-shrink-0">
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
            <span className="text-sm text-gray-800">Thành tiền:</span>
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
        {/* Các nút được hiển thị dựa trên trạng thái đơn hàng, ví dụ */}
        {order.buttons.includes('Mua Lại') && (
          <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
            Mua Lại
          </button>
        )}
         {order.buttons.includes('Đánh Giá') && (
          <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
            Đánh Giá
          </button>
        )}
        {order.buttons.includes('Xem Chi Tiết Hủy Đơn') && ( /* Đã sửa tên nút */
          <button className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
            Xem Chi Tiết Hủy Đơn
          </button>
        )}
        {order.buttons.includes('Xem Chi Tiết Đơn') && !order.buttons.includes('Xem Chi Tiết Hủy Đơn') && ( // Chỉ hiện thị nếu không phải là nút hủy đơn
          <button className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
            Xem Chi Tiết Đơn
          </button>
        )}
        {order.buttons.includes('Liên Hệ Người Bán') && (
          <button className="text-sm bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 sm:px-5 py-1.5 sm:py-2 rounded-sm transition-colors">
            Liên Hệ Người Bán
          </button>
        )}
      </div>
    </div>
  );
};

const RenderDonMuaContent = () => {
  const [activePurchaseTab, setActivePurchaseTab] = useState('tat-ca');
  const [searchTerm, setSearchTerm] = useState('');

  const sampleOrders = [
    {
      id: 1,
      // shopName: 'Đặc Sản Quê Hương Kiwi Mart...', // Đã bỏ tên shop
      shopLogoUrl: null, // Sẽ dùng icon Store mặc định
      shopLink: '#xem-shop-1',
      chatLink: '#chat-1',
      statusText: 'ĐÃ HỦY',
      statusColor: 'text-red-500',
      products: [
        {
          id: 'sp1',
          imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lq7px9g1j2293c_tn',
          name: '* SIÊU HOT * Bột Ớt Tê Cay 1+2 Gói 100gr 40gr Chẩm lạp xưởng nướng đá, xúc xích siêu thơm ngon',
          quantity: 1,
          originalPrice: 20000,
          discountPrice: 16000,
        }
      ],
      totalAmount: 16000,
      cancellationReason: 'Đã hủy tự động bởi hệ thống Shopee',
      buttons: ['Mua Lại', 'Xem Chi Tiết Hủy Đơn', 'Liên Hệ Người Bán'] // Đã sửa nút
    },
    {
      id: 2,
      // shopName: 'WASEN VIỆT NAM', // Đã bỏ tên shop
      isShopHot: true, // Thêm để hiển thị badge HOT
      shopLogoUrl: 'https://down-vn.img.susercontent.com/file/vn-11134211-7r98o-lryw55qzd21l0a_tn',
      shopLink: '#xem-shop-2',
      chatLink: '#chat-2',
      deliveryStatusIcon: true,
      deliveryStatusText: 'Giao hàng thành công',
      statusText: 'HOÀN THÀNH',
      statusColor: 'text-green-600',
      products: [
        {
          id: 'sp2',
          imageUrl: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lkv5x2q50yn77f_tn',
          name: 'NƯỚC LAU SÀN 1L WASEN SIÊU SẠCH TINH CHẤT THIÊN NHIÊN HƯƠNG SẢ CHANH',
          quantity: 2,
          discountPrice: 25000,
        }
      ],
      totalAmount: 50000,
      buttons: ['Đánh Giá', 'Mua Lại', 'Xem Chi Tiết Đơn']
    },
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

  const filteredOrders = sampleOrders.filter(order => {
    if (activePurchaseTab === 'tat-ca') return true;
    if (activePurchaseTab === 'da-huy' && order.statusText === 'ĐÃ HỦY') return true;
    if (activePurchaseTab === 'hoan-thanh' && order.statusText === 'HOÀN THÀNH') return true;
    // Thêm logic lọc cho các tab khác (ví dụ: Chờ thanh toán, Vận chuyển...)
    // Logic search cơ bản:
    if (searchTerm && !(
        (order.id && order.id.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    ) {
      return false;
    }
    return false; // Mặc định không hiển thị nếu không khớp tab nào rõ ràng (ngoại trừ 'Tất cả')
  }).filter(order => { // Lọc lần 2 cho các tab khác ngoài 'Tất cả', 'Đã hủy', 'Hoàn thành' nếu chưa có logic cụ thể
    if (activePurchaseTab !== 'tat-ca' && activePurchaseTab !== 'da-huy' && activePurchaseTab !== 'hoan-thanh') {
        // Ví dụ: Nếu tab là 'van-chuyen', bạn cần có trường 'order.deliveryStatusType === "SHIPPING"' chẳng hạn
        // Hiện tại, các tab này sẽ không hiển thị đơn nào trừ khi bạn thêm logic
        if(order.statusText.toLowerCase().replace(' ', '-') === activePurchaseTab) return true; // Thử khớp đơn giản
    }
    if (activePurchaseTab === 'tat-ca' || activePurchaseTab === 'da-huy' || activePurchaseTab === 'hoan-thanh') return true; // Các tab đã có logic lọc thì giữ lại
    return false;
  });


  return (
    <div className="w-full">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <nav className="flex space-x-0 overflow-x-auto whitespace-nowrap hide-scrollbar">
          {purchaseTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePurchaseTab(tab.id)}
              className={`py-3 px-3 sm:px-4 md:px-5 text-sm font-medium focus:outline-none relative whitespace-nowrap ${
                activePurchaseTab === tab.id
                  ? 'text-orange-500'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              {tab.label}
              {activePurchaseTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="my-3 sm:my-4 px-0"> {/* Bỏ padding ngang của container search bar */}
        <div className="relative mx-0 sm:mx-0"> {/* Cho phép search bar full width trên mobile */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Bạn có thể tìm kiếm theo ID đơn hàng hoặc Tên sản phẩm" // Sửa placeholder vì tên shop đã bỏ
            className="block w-full bg-white border-y sm:border-x border-gray-200 text-gray-900 text-sm focus:ring-orange-500 focus:border-orange-500 py-2.5 pl-10 pr-3 sm:rounded-sm"
          />
        </div>
      </div>

      <div className="px-0">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => <OrderItem key={order.id} order={order} />)
        ) : (
          <div className="text-center py-16 text-gray-500 bg-white rounded-sm border border-gray-200">
            <PackageOpen size={48} className="mx-auto mb-3 text-gray-400" />
            Không có đơn hàng nào.
          </div>
        )}
      </div>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default RenderDonMuaContent;