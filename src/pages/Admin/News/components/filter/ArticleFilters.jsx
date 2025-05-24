import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import SearchInput from 'components/common/SearchInput';
import FilterSelect from 'components/common/FilterSelect';
import { useArticle } from '../Context/ArticleContext';
import { newsCategoryService } from '@/services/admin/newCategoryService';

const ArticleFilters = () => {
  const {
    filters,
    setFilters,
    selectedRows,
    handleAction,
    getActionOptions
  } = useArticle();

  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    newsCategoryService.getAll().then(res => {
      const options = res.data.data.map(c => ({
        value: c.id.toString(), // đảm bảo là string nếu filter đang là string
        label: c.name
      }));
      setCategoryOptions(options);
    });
  }, []);

  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="flex gap-4 w-2/3 mb-5">
      {/* Hành động */}
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
          disabled={!selectedRows || selectedRows.length === 0 || filters.action === ''}

        >
          Thực hiện
        </Button>
      </div>

      {/* Danh mục */}
      <div className="w-1/3">
        <FilterSelect
          label="Danh mục"
          value={filters.category}
          onChange={(v) => handleChange('category', v)}
          options={categoryOptions}
        />
      </div>
    </div>
  );
};

export default ArticleFilters;
