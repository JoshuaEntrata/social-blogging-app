import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Divider, Input } from "antd";
import styles from "../styles/pages/Settings.module.css";

const { TextArea } = Input;

const Settings = () => {
  const { updateUser, user: currentUser } = useAuth();
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
      const username = updatedFields.username ?? currentUser.username;

      await updateUser(updatedFields);
      navigate(`/profile/${username}`);
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
        <h1>Account Settings</h1>
        <h3>
          Update your profile and account details here. Leave blank to keep your
          current details.
        </h3>

        <h2>Profile Information</h2>
        <div className={styles.username}>
          <label htmlFor="username">Username</label>
          <Input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your display name"
            value={form.username}
            onChange={handleChange}
          />
        </div>
        <div className={styles.imageUrl}>
          <label htmlFor="image">Image URL</label>
          <Input
            id="image"
            name="image"
            placeholder="Paste a link to your profile picture"
            value={form.image}
            onChange={handleChange}
          />
        </div>
        <div className={styles.bio}>
          <label htmlFor="bio">Bio</label>
          <TextArea
            id="bio"
            name="bio"
            placeholder="Tell us something about yourself” or “Write a short bio (e.g. nurse, developer, coffee lover ☕)"
            value={form.bio}
            onChange={handleChange}
            autoSize={{ minRows: 3 }}
          />
        </div>

        <Divider />

        <h2>Account Security</h2>
        <div className={styles.email}>
          <label htmlFor="email">Email</label>
          <Input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.password}>
          <label htmlFor="password">Password</label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter a new password (leave blank to keep current)"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading} className={styles.saveButton}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
