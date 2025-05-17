import React from 'react';

const CompareComponents = () => {
  const compareData = [
    {
      label: 'Màn hình',
      values: ['IPS LCD, 6.67", HD+', 'AMOLED, 6.5", Full HD+', 'IPS LCD, 6.8", HD+'],
    },
    {
      label: 'Chip',
      values: ['Snapdragon 680', 'Snapdragon 695', 'Helio G99'],
    },
    {
      label: 'RAM',
      values: ['8 GB', '6 GB', '12 GB'],
    },
    {
      label: 'Dung lượng',
      values: ['128 GB', '128 GB', '256 GB'],
    },
    {
      label: 'Camera sau',
      values: ['Chính 50 MP & Phụ 2 MP', 'Chính 64 MP & Phụ 2 MP', 'Chính 50 MP'],
    },
    {
      label: 'Camera trước',
      values: ['8 MP', '16 MP', '13 MP'],
    },
    {
      label: 'Pin',
      values: ['5000 mAh, Sạc 45 W', '4500 mAh, Sạc 33 W', '6000 mAh, Sạc 18 W'],
    },
    {
      label: 'Hệ điều hành',
      values: ['Android 14', 'Android 15', 'Android 16'],
    },
  ];

  return (
    
    <div className="p-4">
      
      <h1 className="font-bold uppercase text-lg mb-2">So sánh nhanh</h1>

      <div className="border border-gray-200 divide-y divide-gray-300">
        {compareData.map((row, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row"
          >
            {/* Label bên trái hoặc trên mobile */}
            <div className="w-full md:w-1/4 border border-gray-300 p-2 font-semibold bg-gray-100">
              {row.label}
            </div>

            {/* Giá trị sản phẩm */}
            <div className="flex md:flex-row w-full">
              {row.values.slice(0, 3).map((val, idx) => (
                <div
                  key={idx}
                  className="w-full text-xs md:w-1/3 border border-gray-300 p-2"
                >
                  {val}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompareComponents;
