import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button, Divider } from "antd";
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
      <Link to={`/`}>
        <img src={"/vite.svg"} alt="" />
      </Link>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Sign In to Social Blogging</h1>
        <div className={styles.email}>
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
        <button htmlType="submit" className={styles.submitBtn}>
          Sign In
        </button>

        <Divider />

        <span className={styles.register}>
          Don't have an account?{" "}
          <Link to={`/register`} className={styles.registerLink}>
            Sign Up
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
