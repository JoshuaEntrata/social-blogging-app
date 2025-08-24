import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/pages/Auth.module.css";

const Register = () => {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.username, form.email, form.password);
      console.log("✅ Registered successfully!");
    } catch (err) {
      console.error("❌ Registration failed:", err.message);
    }
  };

  return (
    <div className={styles.body}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Register</h1>
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
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
