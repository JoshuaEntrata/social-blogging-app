import api from "../api/axios";

const commentService = {
  // Public
  getAll: async (id, slug) => {
    const { data } = await api.get(`/articles/${id}/${slug}/comments`);
    return data.comments;
  },

  // Private
  add: async (id, slug, body) => {
    const { data } = await api.post(
      `/articles/${id}/${slug}/comments`,
      { comment: { body } },
      { requiresAuth: true }
    );
    return data.comment;
  },

  delete: async (id, slug, commentId) => {
    await api.delete(`/articles/${id}/${slug}/comments/${commentId}`, {
      requiresAuth: true,
    });
  },
};

export default commentService;
