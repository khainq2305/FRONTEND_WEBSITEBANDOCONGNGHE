// ProductInfoBox.js
import React from 'react';

// Icon Hộp quà (SVG mẫu - thay thế bằng SVG của bạn nếu cần)
const BoxIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9M3.75 15h16.5M12 22.5V15" />
  </svg>
);

// Icon Khiên (SVG mẫu - thay thế bằng SVG của bạn nếu cần)
const ShieldIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0112 2.714v.022z" />
  </svg>
);


export default function ProductInfoBox() {
  // Dữ liệu có thể được truyền qua props nếu cần thay đổi động
  const packageContents = "Thân máy, Cáp sạc, Tài liệu hướng dẫn, Dụng cụ lấy SIM, Túi giấy cao cấp Di Động Việt";
  const warrantyInfo = [
    { main: "Độc quyền tại Di Động Việt: Bảo hành ", highlight: "Hư Lỗi - Đổi mới", details: " trong vòng ", duration: "33 ngày", extra: ". Bảo hành độc quyền ", extraDuration: "02 năm" },
    { main: "Bảo hành ", highlight: "Hư Lỗi - Đổi mới 12 tháng", details: ", rơi vỡ với D.Care" },
    { main: "", highlight: "Bảo hành điện tử chính hãng", details: ": Sản phẩm mới chính hãng đã kích hoạt bảo hành, tham gia chương trình khuyến mãi có giá tốt nhất (Đầy đủ phụ kiện từ NSX. Có nguồn gốc rõ ràng, xuất hoá đơn eVAT)" },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-6"> {/* mt-6 để tạo khoảng cách với khối ảnh */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin sản phẩm</h2>
      
      <div className="space-y-4">
        {/* Trong hộp sản phẩm */}
        <div className="flex items-start">
          <BoxIcon className="w-6 h-6 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">{packageContents}</p>
        </div>

        {/* Thông tin bảo hành */}
        <div className="flex items-start">
          <ShieldIcon className="w-6 h-6 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700 space-y-1">
            {warrantyInfo.map((item, index) => (
              <p key={index}>
                {item.main}
                {item.highlight && <span className="font-semibold text-gray-800">{item.highlight}</span>}
                {item.details}
                {item.duration && <span className="font-semibold text-gray-800">{item.duration}</span>}
                {item.extra}
                {item.extraDuration && <span className="font-semibold text-gray-800">{item.extraDuration}</span>}
              </p>
            ))}
            <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline text-xs font-medium">
              (Xem chi tiết)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}