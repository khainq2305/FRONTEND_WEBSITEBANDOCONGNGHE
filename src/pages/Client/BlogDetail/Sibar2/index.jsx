import React from 'react'

const Sibar2 = ({title}) => {
  const suggestedKeywords = [
    "Galaxy S25 Ultra",
    "Samsung flagship 2025",
    "Thông số Galaxy S25",
    "Đánh giá Galaxy S25",
    "Samsung vs iPhone 16"
  ];

  return (
    <div className="space-y-4 px-0 md:px-4">
      <div className="border-2 border-gray-300 rounded-md py-2 px-4">
        {/* Tiêu đề */}
        <div className="pb-1 relative">
          <div className="font-bold text-justify uppercase">{title}</div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 to-gray-300"></div>
        </div>

        {/* Danh sách từ khóa */}
        <div className="space-y-3 pt-4">
          {suggestedKeywords.map((keyword, index) => (
            <div key={index} className="text-sm text-blue-600 cursor-pointer">
              {keyword}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sibar2