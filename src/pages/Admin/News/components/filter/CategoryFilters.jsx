import React from 'react';
import FilterSelect from '@/components/common/FilterSelect';
import { Button } from '@mui/material';
import SearchInput from '@/components/common/SearchInput'

const CategoryFilters = ({
  filters,
  setFilters,
  selectedRows,
  handleAction,
  getActionOptions,
  categories
}) => {
 const handleChange = (key, value) => {
  setFilters({ ...filters, [key]: value?.toString?.() || '' });
};



  return (
    <div className="flex gap-4 mb-5">
      {/* Hành động + nút */}
      <div className="w-1/4 flex gap-2">
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

      {/* Danh mục */}
      <div className="w-1/6">
        <FilterSelect
  label="Danh mục"
  value={filters.categoryId}
  onChange={(v) => handleChange('categoryId', v)}
  options={categories.map((c) => ({
    value: c.id.toString(), // ép chắc chắn là string
    label: `${'— '.repeat(c.level)}${c.name}`
  }))}
/>



      </div>
      <div className="w-1/4 ml-auto">
          <SearchInput
            value={filters.search || ''}
            onChange={(value) => {
              setFilters((prev) => ({
                ...prev,
                search: value
              }));
            }}
          />
        </div>
    </div>
  );
};

export default CategoryFilters;
