export default function Description() {
    return (
      <div className="mt-10 text-sm leading-relaxed space-y-6">
        {/* Tiêu đề chính */}
        <h2 className="text-xl font-bold text-gray-800">Điện thoại di động – Trợ thủ đắc lực</h2>
  
        {/* Phần giới thiệu */}
        <p>
          Ở thời đại công nghệ hiện đại, điện thoại di động được xem như là một vật “bất ly thân” không thể thiếu.
          Bởi đây là thiết bị hữu dụng với nhiều chức năng thiết thực phục vụ cho cuộc sống như liên lạc, giải trí,
          chụp ảnh, quay phim, tra cứu thông tin… Thiết kế nhỏ gọn giúp người dùng tiện mang theo mọi lúc mọi nơi.
        </p>
  
        {/* Hình minh họa */}
        <img
          src="https://cdn.dienthoaigiakho.vn/photos/1738746634864-600x180_Subbanner-Mua-truoc-tra-sau.jpg"
          alt="Điện thoại hiện đại"
          className="rounded-lg w-full object-cover"
        />
  
        {/* Lợi ích */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Lợi ích khi dùng điện thoại</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Giao tiếp và kết nối:</strong> Gọi điện, nhắn tin, video call dễ dàng.</li>
            <li><strong>Truy cập thông tin:</strong> Lướt web, cập nhật tin tức chỉ vài cú chạm.</li>
            <li><strong>Giải trí:</strong> Xem phim, chơi game, đọc sách, nghe nhạc mọi nơi.</li>
            <li><strong>Quản lý cuộc sống:</strong> Nhắc nhở công việc, sự kiện, lịch hẹn tiện lợi.</li>
          </ul>
        </div>
  
        {/* Phân loại sản phẩm */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Phân loại điện thoại di động</h3>
          <div className="grid md:grid-cols-2 gap-4 text-justify">
            <div>
              <h4 className="font-semibold mb-1">Theo tính năng:</h4>
              <ul className="list-disc list-inside">
                <li>Điện thoại phổ thông</li>
                <li>Điện thoại thông minh (Smartphone)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Theo nhu cầu:</h4>
              <ul className="list-disc list-inside">
                <li>Chơi game / Chụp ảnh</li>
                <li>Pin trâu / Lưu trữ lớn / Thiết kế mỏng nhẹ</li>
              </ul>
            </div>
          </div>
        </div>
  
        {/* Phân khúc giá */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Phân khúc giá</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Giá rẻ:</strong> Dưới 3 triệu</li>
            <li><strong>Tầm trung:</strong> 4 – 7 triệu</li>
            <li><strong>Cận cao cấp:</strong> Trên 7 triệu</li>
            <li><strong>Cao cấp:</strong> Trên 15 triệu</li>
          </ul>
        </div>
  
        {/* Thương hiệu nổi bật */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Top thương hiệu bán chạy</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center text-sm font-medium text-gray-700">
            {["Apple", "Samsung", "Xiaomi", "Oppo", "Google Pixel"].map((brand, i) => (
              <div key={i} className="p-3 bg-white shadow rounded border">{brand}</div>
            ))}
          </div>
        </div>
  
        {/* CTA */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-6">
          <p className="font-semibold mb-1 text-black">Mua điện thoại chính hãng tại Điện thoại Giá Kho</p>
          <p>
            Hỗ trợ trả góp 0%, giao nhanh miễn phí, đổi trả 45 ngày và nhiều ưu đãi hấp dẫn khác.
            Liên hệ <strong className="text-red-600">1900 8922</strong> hoặc ghé showroom gần nhất tại TP.HCM!
          </p>
        </div>
      </div>
    );
  }
  