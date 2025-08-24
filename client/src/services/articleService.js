import api from "../api/axios";

const articleService = {
  // Public
  list: async (params = {}) => {
    const { data } = await api.get("/articles", { params });
    return data.articles;
  },

  get: async (slug) => {
    const { data } = await api.get(`/articles/${slug}`);
    return data.article;
  },

  // Protected
  feed: async (params = {}) => {
    const { data } = await api.get("/articles/feed", {
      params,
      requiresAuth: true,
    });
    return data.articles;
  },

  create: async (article) => {
    const { data } = await api.post(
      "/articles",
      { article },
      { requiresAuth: true }
    );
    return data.article;
  },

  update: async (slug, article) => {
    const { data } = await api.put(
      `/articles/${slug}`,
      { article },
      { requiresAuth: true }
    );
    return data.article;
  },

  delete: async (slug) => {
    await api.delete(`/articles/${slug}`, { requiresAuth: true });
  },

  favorite: async (slug) => {
    const { data } = await api.post(
      `/articles/${slug}/favorite`,
      {},
      { requiresAuth: true }
    );
    return data.article;
  },

  unfavorite: async (slug) => {
    const { data } = await api.delete(
      `/articles/${slug}/favorite`,
      {},
      { requiresAuth: true }
    );
    return data.article;
  },
};

export default articleService;
