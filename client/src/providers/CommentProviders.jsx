import { useState } from "react";
import { commentService } from "../services";
import { CommentContext } from "../contexts/CommentContext";

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getComments = async (slug) => {
    setLoading(true);
    setError(null);

    try {
      const arr = await commentService.getAll(slug);
      setComments(arr);
      return arr;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (slug, body) => {
    const newComment = await commentService.add(slug, body);
    setComments((prev) => [...prev, newComment]);
    return newComment;
  };

  const deleteComment = async (slug, id) => {
    await commentService.delete(slug, id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        loading,
        error,
        getComments,
        addComment,
        deleteComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
