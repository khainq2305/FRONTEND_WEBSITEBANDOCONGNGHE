import React, { useState } from 'react';

const Compare = () => {
  const [showAll, setShowAll] = useState(false);

  const specs1 = [
    'Màn hình IPS LCD, 6.67", HD+',
    'Chip Snapdragon 680',
    'RAM: 8 GB',
    'Dung lượng: 128 GB',
    'Camera sau: Chính 50 MP & Phụ 2 MP',
    'Camera trước: 8 MP',
    'Pin 5000 mAh, Sạc 45 W',
  ];

  const specs2 = [
    'Màn hình AMOLED, 6.67", Full HD+',
    'Chip Snapdragon 685 8 nhân',
    'RAM: 8 GB',
    'Dung lượng: 256 GB',
    'Camera sau: Chính 50 MP & Phụ 2 MP',
    'Camera trước: 16 MP',
    'Pin 5000 mAh, Sạc 67 W',
  ];

  const specs3 = [
    'Màn hình IPS LCD, 6.67", HD+',
    'Chip Snapdragon 680',
    'RAM: 8 GB',
    'Dung lượng: 256 GB',
    'Camera sau: Chính 50 MP & Phụ 2 MP',
    'Camera trước: 8 MP',
    'Pin 5000 mAh, Sạc 45 W',
  ];

  const data = [specs1, specs2, specs3];

  return (
    <div className="w-full md:flex  md:border border-gray-300 text-sm">
      {/* Cột tiêu đề */}
      <div className="w-full  md:w-1/3 md:border md:border-gray-300  p-3 font-semibold text-left">
        So sánh nhanh
      </div>

      {/* Khối sản phẩm */}
      <div className="flex w-full overflow-x-auto md:overflow-visible">
        {data.map((specs, index) => (
          <div
            key={index}
            className="w-full border border-gray-300 bg-white p-3 justify-between"
          >
            <ul className="space-y-1 mb-2">
              {(showAll ? specs : specs.slice(0, 5)).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 text-xs hover:underline mt-auto"
            >
              {showAll ? 'Thu gọn' : 'Xem thêm'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Compare;
