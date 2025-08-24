import { createContext, useContext } from "react";

export const TagContext = createContext();
export const useTags = () => useContext(TagContext);
