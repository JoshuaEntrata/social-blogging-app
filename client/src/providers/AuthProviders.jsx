import { useEffect, useState } from "react";
import { authService } from "../services";
import { AuthContext } from "../contexts/AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getCurrentUser()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setError(null);
    const u = await authService.login({ email, password });
    localStorage.setItem("token", u.token);
    setUser(u);
    return u;
  };

  const register = async (username, email, password) => {
    setError(null);
    const u = await authService.register({ username, email, password });
    localStorage.setItem("token", u.token);
    setUser(u);
    return u;
  };

  const updateUser = async (updates) => {
    setError(null);
    const u = await authService.updateUser(updates);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, updateUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
