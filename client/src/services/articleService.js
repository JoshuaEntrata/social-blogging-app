import api from "../api/axios";

const articleService = {
  // Public
  list: async (params = {}) => {
    const { data } = await api.get("/articles", { params });
    const { articles, articlesCount } = data;
    return { articles, articlesCount };
  },

  get: async (id, slug) => {
    const { data } = await api.get(`/articles/${id}/${slug}`);
    return data.article;
  },

  // Protected
  feed: async (params = {}) => {
    const { data } = await api.get("/articles/feed", {
      params,
      requiresAuth: true,
    });
    const { articles, articlesCount } = data;
    return { articles, articlesCount };
  },

  create: async (article) => {
    const { data } = await api.post(
      "/articles",
      { article },
      { requiresAuth: true }
    );
    return data.article;
  },

  update: async (id, slug, article) => {
    const { data } = await api.put(
      `/articles/${id}/${slug}`,
      { article },
      { requiresAuth: true }
    );
    return data.article;
  },

  delete: async (id, slug) => {
    await api.delete(`/articles/${id}/${slug}`, { requiresAuth: true });
  },

  favorite: async (id, slug) => {
    const { data } = await api.post(
      `/articles/${id}/${slug}/favorite`,
      {},
      { requiresAuth: true }
    );
    return data.article;
  },

  unfavorite: async (id, slug) => {
    const { data } = await api.delete(`/articles/${id}/${slug}/favorite`, {
      requiresAuth: true,
    });
    return data.article;
  },
};

export default articleService;
