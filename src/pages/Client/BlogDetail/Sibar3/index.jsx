import React from 'react';

const Sibar3 = ({title}) => {
    const keywordGroups = {
  "iPhone 16": [
    "iphone 16 pro max",
    "giá iphone 16",
    "đặt trước iphone 16"
  ],
  "iPhone 15": [
    "iphone 15 plus giá bao nhiêu",
    "iphone 15 128gb",
    "iphone 15 pro max 256gb"
  ],
  "iPhone 14": [
    "mua iphone 14 trả góp",
    "iphone 14 pro cũ",
    "giá iphone 14 giảm sâu"
  ]
};


  return (
    <div className="space-y-4 px-0 md:px-4">
  <div className="border-2 border-gray-300 rounded-md py-2 px-4">
    <div className="pb-1 relative">
      <div className="font-bold text-justify uppercase">{title}</div>
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 to-gray-300"></div>
    </div>

    <div className="space-y-3 pt-4">
      {Object.entries(keywordGroups).map(([groupName, keywords], groupIdx) => (
        <div key={groupIdx}>
          <div className="flex flex-wrap gap-2 text-sm text-gray-700 text-justify">
            {keywords.map((kw, idx) => (
              <span
                key={idx}
                className="hover:text-yellow-500 cursor-pointer transition"
              >
                {kw}
                {idx < keywords.length - 1 ? ',' : ''}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  )
}

export default Sibar3;
