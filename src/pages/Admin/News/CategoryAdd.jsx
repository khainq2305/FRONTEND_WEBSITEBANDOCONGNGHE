import React from 'react';
import CategoryMain from './components/CategoryMain';
import { newsService } from '../../../services/admin/postService';
const CategoryAdd = () => {
  const handleSubmit = (data) => {
    
  };

  return <CategoryMain onSubmit={handleSubmit}/>;
};

export default CategoryAdd;
