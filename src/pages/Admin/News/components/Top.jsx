import React from 'react';
import Button from '@mui/material/Button';
import SearchInput from 'components/common/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useArticle } from '../News';

const Top = () => {
  const { activeTab, handleTabClick, counts, filters,
    setFilters, } = useArticle();

  const tabs = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Đã xuất bản', value: 'active' },
    { label: 'Bản nháp', value: 'draft' },
    { label: 'Thùng rác', value: 'trash' },

  ];  const handleChange = (key, value) => {

    setFilters({ ...filters, [key]: value });
  };
  return (
    <div className="space-y-2">
      {/* Tiêu đề + nút thêm */}
      <div className="flex items-center gap-2">
        <h1 className="uppercase font-bold text-md">Tất cả bài viết</h1>
        <Button variant="contained" size="medium">
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
          Thêm bài viết
        </Button>

      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-gray-200">
        <div>
          {tabs.map((tab) => (
            <span
              key={tab.value}
              className="relative px-3 py-2 cursor-pointer text-sm"
              onClick={() => handleTabClick(tab.value)}
            >
              <span
                className={`transition-all ${activeTab === tab.value
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-800 hover:text-blue-500'
                  }`}
              >
                {tab.label} ({counts[tab.value] || 0})
              </span>

              {activeTab === tab.value && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full"></span>
              )}
            </span>
          ))}
        </div>
        <div className='w-1/4'>
          <SearchInput value={filters.search} onChange={(v) => handleChange('search', v)} />
        </div>
      </div>

    </div>

  );
};

export default Top;
