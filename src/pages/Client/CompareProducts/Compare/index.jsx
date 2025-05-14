import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AiOutlineUp } from 'react-icons/ai';
const Compare = () => {
  return (
    <div className="mt-10 bg-white">
      {/* Khung So sánh nhanh */}
      <h2 className="text-gl font-bold text-gray-800 mb-2 text-left flex items-center gap-2">
        <span className="p-1 rounded-full border border-gray-300">
    <AiOutlineUp size={15} className="text-gray-800" />
  </span>
   SO SÁNH NHANH
        <span className="text-yellow-500 text-xl">★</span>
      </h2>
  
      <div className="border border-t-3 border-t-gray-700 grid grid-cols-1 md:grid-cols-4 text-gray-700 text-sm">
        {/* Khung "So sánh nhanh" */}
        <div className="border border-gray-300 p-2">
          <p>So sánh nhanh</p>
        </div>

        {/* Sản phẩm 1 */}
        <div className="border border-gray-300 p-2">
          <ul className="list-inside list-disc space-y-5 break-words">
            <li className="mb-5">Màn hình IPS LCD, 6.67", HD+.</li>
            <li className="mb-5">Chip Snapdragon 680.</li>
            <li className="mb-5">RAM: 8 GB.</li>
            <li className="mb-5">Dung lượng: 128 GB.</li>
            <li className="mb-5">Camera sau: Chính 50 MP & Phụ 2 MP.</li>
          </ul>
          <button className="text-blue-500 text-sm hover:underline mt-3">Xem thêm</button>
        </div>

        {/* Sản phẩm 2 */}
        <div className="border border-gray-300 p-2">
          <ul className="list-inside list-disc space-y-5 break-words">
            <li className="mb-5">Màn hình AMOLED, 6.67", Full HD+.</li>
            <li className="mb-5">Chip Snapdragon 685 8 nhân.</li>
            <li className="mb-5">RAM: 8 GB.</li>
            <li className="mb-5">Dung lượng: 256 GB.</li>
            <li className="mb-5">Camera sau: Chính 50 MP & Phụ 2 MP.</li>
          </ul>
          <button className="text-blue-500 text-sm hover:underline mt-3">Xem thêm</button>
        </div>

        {/* Sản phẩm 3 */}
        <div className="border border-gray-300 p-2">
          <ul className="list-inside list-disc space-y-5  break-words">
            <li className="mb-5">Màn hình IPS LCD, 6.67", HD+.</li>
            <li className="mb-5">Chip Snapdragon 680.</li>
            <li className="mb-5">RAM: 8 GB.</li>
            <li className="mb-5">Dung lượng: 256 GB.</li>
            <li className="mb-5">Camera sau: Chính 50 MP & Phụ 2 MP.</li>
          </ul>
          <button className="text-blue-500 text-sm hover:underline mt-3">Xem thêm</button>
        </div>
      </div>

      {/* Khung Cấu hình & Bộ nhớ */}
     <h2 className="text-gl font-bold text-gray-800 mb-2 text-left flex items-center gap-2 mt-10">
        <span className="p-1 rounded-full border border-gray-300">
    <AiOutlineUp size={15} className="text-gray-800" />
  </span>
   CẤU HÌNH & BỘ NHỚ
      </h2>
      <div className="grid md:grid-cols-4 text-gray-800 border border-t-3 border-t-gray-700">
        {/* Các tiêu đề cấu hình, mỗi dòng đóng khung */}
        <div className="border border-gray-300 p-2 space-y-2">
          
          <p className=" border-b border-gray-300 p-1">Hệ điều hành</p>
          <p className=" border-b border-gray-300 p-1">Chip xử lý (CPU)</p>
          <p className=" border-b border-gray-300 p-1">Tốc độ CPU</p>
          <p className=" border-b border-gray-300 p-1">Chip đồ họa (GPU)</p>
          <p className=" border-b border-gray-300 p-1">RAM</p>
          <p className=" border-b border-gray-300 p-1">Dung lượng lưu trữ</p>
          <p className=" border-b border-gray-300 p-1">Dung lượng còn lại (khả dụng) khoảng</p>
          <p className=" border-b border-gray-300 p-1">Thẻ nhớ</p>
          <p className=" p-1">Danh bạ</p>
        </div>

        {/* Sản phẩm 1 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Android 14</p>
          <p className="border-b border-gray-300 p-1">Snapdragon 680 8 nhân</p>
          <p className="border-b border-gray-300 p-1">2p-1.4 GHz</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>
          <p className="border-b border-gray-300 p-1">8 GB</p>
          <p className="border-b border-gray-300 p-1">128 GB</p>
          <p className="border-b border-gray-300 p-1">103 GB</p>
          <p className="border-b border-gray-300 p-1">MicroSD, hỗ trợ tối đa 1 TB</p>
          <p className="p-1">Không giới hạn</p>
        </div>

        {/* Sản phẩm 2 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Android 14</p>
          <p className="border-b border-gray-300 p-1">Snapdragon 685 8 nhân</p>
          <p className="border-b border-gray-300 p-1">2.8 GHz</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>
          <p className="border-b border-gray-300 p-1">8 GB</p>
          <p className="border-b border-gray-300 p-1">256 GB</p>
          <p className="border-b border-gray-300 p-1">230.1 GB</p>
          <p className="border-b border-gray-300 p-1">MicroSD, hỗ trợ tối đa 1 TB</p>
          <p className="p-1">Không giới hạn</p>
        </div>

        {/* Sản phẩm 3 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Android 14</p>
          <p className="border-b border-gray-300 p-1">Snapdragon 680 8 nhân</p>
          <p className="border-b border-gray-300 p-1">2.4 GHz</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>
          <p className="border-b border-gray-300 p-1">8 GB</p>
          <p className="border-b border-gray-300 p-1">256 GB</p>
          <p className="border-b border-gray-300 p-1">233 GB</p>
          <p className="border-b border-gray-300 p-2">MicroSD, hỗ trợ tối đa 1 TB</p>
          <p className="p-1">Không giới hạn</p>
        </div>
      </div>

     <h2 className="text-gl font-bold text-gray-800 mb-2 text-left flex items-center gap-2 mt-10">
        <span className="p-1 rounded-full border border-gray-300">
    <AiOutlineUp size={15} className="text-gray-800" />
  </span>
   CAMERA & MÀN HÌNH
      </h2>
      <div className="grid md:grid-cols-4 text-gray-800 border border-t-3 border-t-gray-700">
        {/* Các tiêu đề cấu hình, mỗi dòng đóng khung */}
        <div className="border border-gray-300 p-2 space-y-2">
          
          <p className=" border-b border-gray-300 p-1">Độ phân giải camera sau</p>
          <p className=" border-b border-gray-300 p-1">Quay phim camera sau</p>
          <p className=" border-b border-gray-300 p-1">Tính năng camera sau</p>
          <p className=" border-b border-gray-300 p-1">Độ phân giải camera trước</p>
          <p className=" p-1">Mặt kính cảm ứng</p>
        </div>

        {/* Sản phẩm 1 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Chính 50 MP & Phụ 2 MP</p>
          <p className="border-b border-gray-300 p-1">FullHD 1080p@30fps</p>
          <p className="border-b border-gray-300 p-1">Toàn cảnh (Panorama)</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>        
          <p className="p-1">Không giới hạn</p>
        </div>

        {/* Sản phẩm 2 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Android 14</p>
          <p className="border-b border-gray-300 p-1">Snapdragon 685 8 nhân</p>
          <p className="border-b border-gray-300 p-1">2.8 GHz</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>
          <p className="p-1">Không giới hạn</p>
        </div>

        {/* Sản phẩm 3 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Android 14</p>
          <p className="border-b border-gray-300 p-1">Snapdragon 680 8 nhân</p>
          <p className="border-b border-gray-300 p-1">2.4 GHz</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>
          <p className="p-1">Không giới hạn</p>
        </div>
      </div>

                 <h2 className="text-gl font-bold text-gray-800 mb-2 text-left flex items-center gap-2 mt-10">
        <span className="p-1 rounded-full border border-gray-300">
    <AiOutlineUp size={15} className="text-gray-800" />
  </span>
   PIN & SẠC
      </h2>
      <div className="grid md:grid-cols-4 text-gray-800 border border-t-3 border-t-gray-700">
        {/* Các tiêu đề cấu hình, mỗi dòng đóng khung */}
        <div className="border border-gray-300 p-2 space-y-2">
          
          <p className=" border-b border-gray-300 p-1">Độ phân giải camera sau</p>
          <p className=" border-b border-gray-300 p-1">Quay phim camera sau</p>
          <p className=" border-b border-gray-300 p-1">Tính năng camera sau</p>
          <p className=" border-b border-gray-300 p-1">Độ phân giải camera trước</p>
          <p className=" p-1">Mặt kính cảm ứng</p>
        </div>

        {/* Sản phẩm 1 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Chính 50 MP & Phụ 2 MP</p>
          <p className="border-b border-gray-300 p-1">FullHD 1080p@30fps</p>
          <p className="border-b border-gray-300 p-1">Toàn cảnh (Panorama)</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>        
          <p className="p-1">Không giới hạn</p>
        </div>

        {/* Sản phẩm 2 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Android 14</p>
          <p className="border-b border-gray-300 p-1">Snapdragon 685 8 nhân</p>
          <p className="border-b border-gray-300 p-1">2.8 GHz</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>
          <p className="p-1">Không giới hạn</p>
        </div>

        {/* Sản phẩm 3 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Android 14</p>
          <p className="border-b border-gray-300 p-1">Snapdragon 680 8 nhân</p>
          <p className="border-b border-gray-300 p-1">2.4 GHz</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>
          <p className="p-1">Không giới hạn</p>
        </div>
      </div>

                <h2 className="text-gl font-bold text-gray-800 mb-2 text-left flex items-center gap-2 mt-10">
        <span className="p-1 rounded-full border border-gray-300">
    <AiOutlineUp size={15} className="text-gray-800" />
  </span>
   KẾT NỐI
      </h2>
      <div className="grid md:grid-cols-4 text-gray-800 border border-t-3 border-t-gray-700">
        {/* Các tiêu đề cấu hình, mỗi dòng đóng khung */}
        <div className="border border-gray-300 p-2 space-y-2">
          
          <p className=" border-b border-gray-300 p-1">Độ phân giải camera sau</p>
          <p className=" border-b border-gray-300 p-1">Quay phim camera sau</p>
          <p className=" border-b border-gray-300 p-1">Tính năng camera sau</p>
          <p className=" border-b border-gray-300 p-1">Độ phân giải camera trước</p>
          <p className=" p-1">Mặt kính cảm ứng</p>
        </div>

        {/* Sản phẩm 1 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Chính 50 MP & Phụ 2 MP</p>
          <p className="border-b border-gray-300 p-1">FullHD 1080p@30fps</p>
          <p className="border-b border-gray-300 p-1">Toàn cảnh (Panorama)</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>        
          <p className="p-1">Không giới hạn</p>
        </div>

        {/* Sản phẩm 2 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Android 14</p>
          <p className="border-b border-gray-300 p-1">Snapdragon 685 8 nhân</p>
          <p className="border-b border-gray-300 p-1">2.8 GHz</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>
          <p className="p-1">Không giới hạn</p>
        </div>

        {/* Sản phẩm 3 */}
        <div className="border border-gray-300 p-2 space-y-2">
          <p className="border-b border-gray-300 p-1">Android 14</p>
          <p className="border-b border-gray-300 p-1">Snapdragon 680 8 nhân</p>
          <p className="border-b border-gray-300 p-1">2.4 GHz</p>
          <p className="border-b border-gray-300 p-1">Adreno 610</p>
          <p className="p-1">Không giới hạn</p>
        </div>
      </div>
    </div>
  );
};

export default Compare;
