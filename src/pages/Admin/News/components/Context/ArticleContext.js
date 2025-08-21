// src/contexts/ArticleContext.js
import { createContext, useContext } from 'react';

export const ArticleContext = createContext();
export const useArticle = () => useContext(ArticleContext);
