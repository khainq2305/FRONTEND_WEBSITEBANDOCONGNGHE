// src/contexts/CategoryContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { categoryService } from '../../services/client/categoryService';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    categoryService.getAll()
    
      .then(res => setCategories(res.data))
      .catch(err => console.error('Lỗi tải danh mục:', err))
      .finally(() => setLoading(false));
  }, []);
console.log('[CategoryContext] Mounting...');

  return (
    <CategoryContext.Provider value={{ categories, loading }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => useContext(CategoryContext);
