import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/pages/Settings.module.css";

const Settings = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    image: "",
    username: "",
    bio: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedFields = Object.fromEntries(
        Object.entries(form).filter(
          ([, value]) => value !== undefined && value !== ""
        )
      );

      await updateUser(updatedFields);
      navigate(`/profile`);
    } catch (err) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Settings</h1>
        <div className={styles.username}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
        </div>
        <div className={styles.imageUrl}>
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />
        </div>
        <div className={styles.bio}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            placeholder="Short bio about you"
            value={form.bio}
            onChange={handleChange}
            rows={3}
          />
        </div>
        <div className={styles.email}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.password}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className={styles.buttonarea}>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update information"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
