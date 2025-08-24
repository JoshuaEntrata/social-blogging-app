import { createContext, useContext } from "react";

export const ArticleContext = createContext();
export const useArticles = () => useContext(ArticleContext);
