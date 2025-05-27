import React from 'react';
import { useCategory } from '../Context/CategoryContext';
import FilterSelect from '@/components/common/FilterSelect';
import { Button } from '@mui/material';

const CategoryFilters = () => {
  const {
    filters,
    setFilters,
    selectedRows,
    handleAction,
    getActionOptions
  } = useCategory();

  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="flex gap-4 w-2/3 mb-5">
      {/* Hành động + nút */}
      <div className="w-1/2 flex gap-2">
        <div className="flex-[3]">
          <FilterSelect
            label="Hành động"
            value={filters.action}
            onChange={(v) => handleChange('action', v)}
            options={getActionOptions()}
          />
        </div>
        <Button
          className="whitespace-nowrap flex-[1] p-1"
          variant="contained"
          size="small"
          onClick={handleAction}
          disabled={selectedRows.length === 0 || filters.action === ''}
        >
          Thực hiện
        </Button>
      </div>

      {/* Trạng thái */}
      <div className="w-1/3">
        <FilterSelect
          label="Trạng thái"
          value={filters.status}
          onChange={(v) => handleChange('status', v)}
          options={[
            { value: 'active', label: 'Đang hoạt động' },
            { value: 'inactive', label: 'Ngưng hoạt động' }
          ]}
        />
      </div>

      {/* Danh mục */}
      <div className="w-1/3">
        <FilterSelect
          label="Danh mục"
          value={filters.category}
          onChange={(v) => handleChange('category', v)}
          options={[]} // ⛔ bỏ categoryOptions — không cần
        />
      </div>
    </div>
  );
};

export default CategoryFilters;
