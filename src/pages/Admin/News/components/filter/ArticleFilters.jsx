import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import SearchInput from 'components/common/SearchInput';
import FilterSelect from 'components/common/FilterSelect';
import { newsCategoryService } from '@/services/admin/newCategoryService';
import { normalizeCategoryList } from "@/utils/index";
const ArticleFilters = ({
  filters = {},
  setFilters,
  selectedRows,
  handleAction,
  getActionOptions
}) => {
  const [categoryOptions, setCategoryOptions] = useState([]);
  console.log("DEBUG filters:", filters);
useEffect(() => {
  newsCategoryService.getAll().then(res => {
    const normalized = normalizeCategoryList(res.data.data);
    console.log("💡 normalized categories:", normalized);

    const flatOptions = normalized.map(item => ({
      value: item.id.toString(),
      label: `${'— '.repeat(item.level)}${item.name}`
    }));
    console.log("✅ categoryOptions:", flatOptions);

    setCategoryOptions(flatOptions);
  });
}, []);



  const handleChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // SEO Score options
  const seoScoreOptions = [
    { value: '', label: 'Tất cả SEO' },
    { value: 'good', label: 'SEO tốt (≥70)' },
    { value: 'average', label: 'SEO trung bình (50-69)' },
    { value: 'poor', label: 'Cần cải thiện (<50)' },
    { value: 'no-seo', label: 'Chưa có SEO' }
  ];

  return (
    <div className="flex gap-4 mb-5">
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
          disabled={!selectedRows || selectedRows.length === 0 || filters.action === ''}
        >
          Thực hiện
        </Button>
      </div>

      <div className="w-1/6">
        <FilterSelect
          label="Danh mục"
          value={filters.category}
          onChange={(v) => handleChange('category', v)}
          options={categoryOptions}
        />
      </div>

      <div className="w-1/6">
        <FilterSelect
          label="SEO Score"
          value={filters.seoScore}
          onChange={(v) => handleChange('seoScore', v)}
          options={seoScoreOptions}
        />
      </div>

      {/* 👉 Di chuyển ô tìm kiếm sang phải */}
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

export default ArticleFilters;
