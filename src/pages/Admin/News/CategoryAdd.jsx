import React from 'react';
import CategoryMain from './components/CategoryMain';

const CategoryAdd = () => {
  const handleSubmit = (data) => {
    console.log('🟢 Thêm mới:', data);
    // Gọi API tạo mới
  };

  return <CategoryMain onSubmit={handleSubmit}/>;
};

export default CategoryAdd;
