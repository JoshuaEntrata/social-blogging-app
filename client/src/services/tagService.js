import api from "../api/axios";

const tagService = {
  getAll: async () => {
    const { data } = await api.get("/tags");
    return data.tags;
  },
};

export default tagService;
