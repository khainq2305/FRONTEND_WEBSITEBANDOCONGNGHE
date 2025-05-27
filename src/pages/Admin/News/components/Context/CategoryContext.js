import { createContext, useContext } from 'react';

const CategoryContext = createContext();
export const useCategory = () => useContext(CategoryContext);

export default CategoryContext;
