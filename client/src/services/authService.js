import api from "../api/axios";

const authService = {
  login: async ({ email, password }) => {
    const { data } = await api.post("/users/login", {
      user: { email, password },
    });
    return data.user; // { email, token, username, ... }
  },

  register: async ({ username, email, password }) => {
    const { data } = await api.post("/users", {
      user: { username, email, password },
    });
    return data.user;
  },

  getCurrentUser: async () => {
    const { data } = await api.get("/user", { requiresAuth: true });
    return data.user;
  },

  updateUser: async (updates) => {
    const { data } = await api.put(
      "/user",
      { user: updates },
      { requiresAuth: true }
    );
    return data.user;
  },
};

export default authService;
