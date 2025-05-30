import { createContext, useContext } from 'react';

export const NewsContext = createContext();

export const useNews = () => useContext(NewsContext);
