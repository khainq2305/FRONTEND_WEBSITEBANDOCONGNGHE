import React, {createContext, useContext, useState, useEffect } from 'react'
import { use } from 'react'
import { TableContainer } from '@mui/material';

import CategoryFilters from './CategoryFilters';
import CategoryTable from './CategoryTable';

const CategoryContex = createContext()
export const useCategory = () => useContext(CategoryContex);
const CategoryPage = () => {
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        category: '',
        action: ''
      });
      const [articles, setArticles] = useState([]);
      const [selectedRows, setSelectedRows] = useState([]);
      const [modalItem, setModalItem] = useState(null);
      const [currentPage, setCurrentPage] = useState(1);
      const [activeTab, setActiveTab] = useState('all');
      // ✅ Bổ sung dữ liệu mẫu để filteredArticles có kết quả
  useEffect(() => {
    setArticles([
      { id: 1, name: 'Style', author: 'Admin', category: 'Thời trang', status: 'active' },
      { id: 2, name: '— Danh mục cha', author: 'Editor', category: 'Thời trang', status: 'active' },
      { id: 3, name: '— — Danh mục con nè', author: 'Mod', category: 'Thời trang', status: 'inactive' }
    ]);
  }, []);
  // ✅ Xử lý lọc theo filter (demo đơn giản theo status)
  const filteredArticles = articles.filter((a) =>
    !filters.status || a.status === filters.status
  );

    const getActionOptions = () => {
    if (filters.status === 'trash') {
      return [
        { value: 'restore', label: 'Khôi phục đã chọn' },
        { value: 'delete_forever', label: 'Xoá vĩnh viễn' }
      ];
    } else if (filters.status === 'draft') {
      return [
        { value: 'edit', label: 'Chỉnh sửa' },
        { value: 'delete', label: 'Xoá khỏi danh sách cốt lõi' }
      ];
    } else {
      return [
        { value: 'delete', label: 'Xoá đã chọn' },
        { value: 'edit', label: 'Chỉnh sửa' }
      ];
    }
  };
  return (
    <CategoryContex.Provider
    value={{filters, setFilters,
        articles, setArticles,
        modalItem, setModalItem,
        currentPage, setCurrentPage,
        selectedRows, setSelectedRows,
        activeTab, setActiveTab,
        getActionOptions,
        filteredArticles


    }}>
        <CategoryFilters />
        <CategoryTable /> 
    </CategoryContex.Provider>
  )
}

export default CategoryPage