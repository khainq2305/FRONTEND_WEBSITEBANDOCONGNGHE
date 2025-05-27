import React from 'react';
import Button from '@mui/material/Button';
import SearchInput from 'components/common/SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Top = ({
  title = 'Tiêu đề',
  tabs = [],
  activeTab,
  onTabChange,
  counts = {},
  search,
  onSearchChange
}) => {
  return (
    <div className="space-y-2">
      {/* Tiêu đề + nút thêm */}
      <div className="flex items-center gap-2">
        <h1 className="uppercase font-bold text-md">{title}</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-gray-200">
        <div>
          {tabs.map((tab) => (
            <span
              key={tab.value}
              className="relative px-3 py-2 cursor-pointer text-sm"
              onClick={() => onTabChange(tab.value)}
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
        <div className="w-1/4">
          <SearchInput value={search} onChange={(v) => onSearchChange(v)} />
        </div>
      </div>
    </div>
  );
};

export default Top;
