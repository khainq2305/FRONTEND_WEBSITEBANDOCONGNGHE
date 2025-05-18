import React from 'react';
import Button from '@mui/material/Button';

const tabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Đã xuất bản', value: 'active' },
  { label: 'Thùng rác', value: 'trash' },
  { label: 'Nội dung cốt lõi', value: 'core' }
];

const Top = ({ onTabClick, counts, activeTab }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h1 className="uppercase font-bold">Tất cả bài viết</h1>
        <Button variant="contained">Thêm bài viết</Button>
      </div>

      <div className="flex items-center gap-4">
        {tabs.map((tab) => (
          <span
  key={tab.value}
  className="relative px-3 py-1 cursor-pointer text-sm"
  onClick={() => onTabClick(tab.value)}
>
  <span
    className={`transition-all ${
      activeTab === tab.value
        ? 'text-blue-600 font-semibold'
        : 'text-gray-800 hover:text-blue-500'
    }`}
  >
    {tab.label} ({counts[tab.value] || 0})
  </span>

  {/* underline khi active */}
  {activeTab === tab.value && (
    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full"></span>
  )}
</span>

          
        ))}
      </div>
    </div>
  );
};

export default Top;
