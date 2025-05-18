import { Button } from '@mui/material';
import SearchInput from 'components/common/SearchInput';
import FilterSelect from 'components/common/FilterSelect';

const ArticleFilters = ({
  filters,
  onFilterChange,
  onAction,
  articleList,
  selectedCount,
  actionOptions
}) => {
  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }} className="w-[80%] mx-auto">
  {/* Tìm kiếm */}
  <div style={{ flex: 1 }}>
    <SearchInput value={filters.search} onChange={(v) => handleChange('search', v)} />
  </div>

  {/* Trạng thái */}
  <div style={{ flex: 1 }}>
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
  <div style={{ flex: 1 }}>
    <FilterSelect
      label="Danh mục"
      value={filters.category}
      onChange={(v) => handleChange('category', v)}
      options={[
  { value: '', label: 'Tất cả danh mục' },
  ...[...new Set(articleList.map(a => a.category))].map(c => ({
    value: c,
    label: c
  }))
]}

    />
  </div>

  {/* Hành động + Button */}
  <div style={{ flex: 1 }}>
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <FilterSelect
          label="Hành động"
          value={filters.action}
          onChange={(v) => handleChange('action', v)}
          options={actionOptions}
        />
      </div>
      <Button
        variant="contained"
        size="small"
        onClick={onAction}
        disabled={selectedCount === 0 || filters.action === ''}
      >
        Thực hiện
      </Button>
    </div>
  </div>
</div>

  );
};

export default ArticleFilters;
