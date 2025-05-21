import React from 'react'
import { useCategory } from '../table/CategoryPage';
import FilterSelect from '@/components/common/FilterSelect/index'
import { Button } from '@mui/material';
const CategoryFilters = () => {
    const {
        filters,
        setFilters,
        articles,
        selectedRows,
        handleAction,
        getActionOptions
    } = useCategory();
    const handleChange = (key, value) => {
        setFilters({ ...filters, [key]: value });
    };

    const categoryOptions = [
        ...[...new Set(articles.map(a => a.category).filter(Boolean))].map(c => ({
            value: c,
            label: c
        }))
    ];


    console.log('status:', filters.status || 'ko có'

    );

    return (
        <div className="flex gap-4 w-2/3 mb-5">
            {/* Hành động + nút */}
            <div className="w-1/2 flex gap-2">
                {/* Giữ width cố định cho select */}
                <div className="flex-[3]">
                    <FilterSelect
                        label="Hành động"
                        value={filters.action}
                        onChange={(v) => handleChange('action', v)}
                        options={getActionOptions()}
                    />
                </div>

                {/* Nút không được đè, nên set min-w cho nút */}
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
                    options={categoryOptions}
                />
            </div>

        </div>

    );
}

export default CategoryFilters