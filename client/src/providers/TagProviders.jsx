import { useState } from "react";
import { tagService } from "../services";
import { TagContext } from "../contexts/TagContext";

export const TagProvider = ({ children }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getTags = async () => {
    setLoading(true);
    setError(null);

    try {
      const arr = await tagService.getAll();
      setTags(arr);
      return arr;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TagContext.Provider value={{ tags, loading, error, getTags }}>
      {children}
    </TagContext.Provider>
  );
};
