import api from "../api/axios";

const commentService = {
  // Public
  getAll: async (slug) => {
    const { data } = await api.get(`/articles/${slug}/comments`);
    return data.comments;
  },

  // Private
  add: async (slug, body) => {
    const { data } = await api.post(
      `/articles/${slug}/comments`,
      { comment: { body } },
      { requiresAuth: true }
    );
    return data.comment;
  },

  delete: async (slug, id) => {
    await api.delete(`/articles/${slug}/comments/${id}`, {
      requiresAuth: true,
    });
  },
};

export default commentService;
