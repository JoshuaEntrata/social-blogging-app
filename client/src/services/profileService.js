import api from "../api/axios";

const profileService = {
  getProfile: async (username, { authenticated = false } = {}) => {
    const { data } = await api.get(`/profiles/${username}`, {
      requiresAuth: authenticated,
    });
    return data.profile;
  },
  follow: async (username) => {
    const { data } = await api.post(
      `/profiles/${username}/follow`,
      {},
      { requiresAuth: true }
    );
    return data.profile;
  },
  unfollow: async (username) => {
    const { data } = await api.delete(`/profiles/${username}/follow`, {
      requiresAuth: true,
    });
    return data.profile;
  },
};

export default profileService;
