import { useState } from "react";
import styles from "../styles/pages/Settings.module.css";

const Settings = () => {
  const [form, setForm] = useState({
    imageUrl: "",
    username: "",
    bio: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className={styles.body}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Settings</h1>
        <div className={styles.imageUrl}>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="imageUrl"
            id="imageUrl"
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.username}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
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
            required
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
            required
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
            required
          />
        </div>
        <div className={styles.buttonarea}>
          <button type="submit">Update Settings</button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
