import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "antd";
import styles from "../styles/pages/Auth.module.css";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      console.log("✅ Logged in!");
    } catch (err) {
      console.error("❌ Login failed:", err.message);
    }
    navigate("/");
  };

  return (
    <div className={styles.body}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Login</h1>
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
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
