import { useState, useCallback } from "react";
import { commentService } from "../services";
import { CommentContext } from "../contexts/CommentContext";

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getComments = useCallback(async (id, slug) => {
    setLoading(true);
    setError(null);

    try {
      const arr = await commentService.getAll(id, slug);
      setComments(arr);
      return arr;
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = async (id, slug, body) => {
    const newComment = await commentService.add(id, slug, body);
    setComments((prev) => [...prev, newComment]);
    return newComment;
  };

  const deleteComment = async (id, slug, commentId) => {
    await commentService.delete(id, slug, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
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
