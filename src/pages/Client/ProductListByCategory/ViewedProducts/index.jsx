export default function ViewedProducts() {
  const viewed = [
    {
      name: 'Samsung Galaxy A06 4GB/128GB Chính Hãng - BHĐTSamsung G- BHĐTSamsung G- BHĐTSamsung G- BHĐTSamsung G- BHĐTSamsung G- BHĐTSamsung Galaxy A06 4GB/128GB Chính Hãng - BHĐT',
      price: '2.390.000',
      image: 'https://cdn.dienthoaigiakho.vn/photos/1746613789982-Realme-14-Si.jpg',
    },
    {
      name: 'Realme Note 60 4GB/128GB Chính Hãng Ngắn Gọn',
      price: '2.490.000',
      image: 'https://cdn.dienthoaigiakho.vn/photos/1746613789982-Realme-14-Si.jpg',
    },
    {
      name: 'Realme Note 60 4GB/128GB Chính Hãng tên sản phẩm này khá là dài và sẽ cần phải xuống dòng',
      price: '2.490.000',
      image: 'https://cdn.dienthoaigiakho.vn/photos/1746613789982-Realme-14-Si.jpg',
    },
    {
      name: 'Xiaomi Redmi Pad Pro 5G Siêu phẩm Cấu Hình Khủng Màn Hình Lớn Pin Trâu Giá Rẻ Vô Địch Trong Tầm Giá',
      price: '5.490.000',
      image: 'https://cdn.dienthoaigiakho.vn/photos/1715765839607-6644893710879-redmi-pad-pro-5g.JPG',
    },
    {
      name: 'iPhone 15 Pro Max 256GB Chính hãng (VN/A) - Giá siêu tốt',
      price: '27.790.000',
      image: 'https://cdn.dienthoaigiakho.vn/photos/1694668766214-iPhone-15-Pro-Max-natural-titanium.png',
    },
  ];

  return (
    <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-4 pt-4">
        <h3 className="font-bold text-[16px] text-gray-800">Sản phẩm bạn đã xem</h3>
        <button className="text-gray-600 text-sm hover:text-red-500 transition-colors duration-200 group flex items-center gap-1">
          <span className="font-semibold group-hover:underline">Xóa Lịch Sử</span>
          <span className="text-yellow-500 text-base group-hover:text-red-500 transition-colors duration-200">✖</span>
        </button>
      </div>
      <div className="mt-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thumb-rounded-full">
        <div className="w-max min-w-full px-4 py-3 flex gap-3">
          {viewed.map((item, index) => (
     <div
  key={index}
  className="w-[278px] h-[88px] bg-white rounded-lg px-3 py-2
             flex items-center gap-3 shrink-0 shadow hover:shadow-lg
             transition-all duration-200 hover:-translate-y-0.5"
>
  <img
    src={item.image}
    alt={item.name}
    className="w-16 h-16 object-contain rounded shrink-0"
  />
  <div className="flex-1 flex flex-col justify-between h-full text-sm overflow-hidden">
<p className="text-[13px] text-gray-800 line-clamp-2 min-h-[40px] leading-5 hover:text-blue-600 transition-colors duration-150">
  {item.name}
</p>
    <p className="text-red-600 font-bold text-[15px]">{item.price}đ</p>
  </div>
</div>
          ))}
        </div>
      </div>
    </div>
  );
}