import { useState, useCallback } from "react";
import { profileService } from "../services";
import { ProfileContext } from "../contexts/ProfileContext";

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProfile = useCallback(
    async (username, { authenticated = false } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const p = await profileService.getProfile(username, { authenticated });
        setProfile(p);
        return p;
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const follow = useCallback(async (username) => {
    setError(null);
    const p = await profileService.follow(username);
    setProfile(p);
    return p;
  }, []);

  const unfollow = useCallback(async (username) => {
    setError(null);
    const p = await profileService.unfollow(username);
    setProfile(p);
    return p;
  }, []);

  return (
    <ProfileContext.Provider
      value={{ profile, loading, error, getProfile, follow, unfollow }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
