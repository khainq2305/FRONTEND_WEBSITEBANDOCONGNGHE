import React from 'react';
import CategoryMain from '@/pages/Admin/News/components/form/CategoryMain';
import { newsService } from '@/services/admin/postService';
const CategoryAdd = () => {
  const handleSubmit = (data) => {
    
  };

  return <CategoryMain onSubmit={handleSubmit}/>;
};

export default CategoryAdd;
