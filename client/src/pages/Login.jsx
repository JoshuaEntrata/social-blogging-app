import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button, Divider, message } from "antd";
import styles from "../styles/pages/Auth.module.css";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      message.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      message.error(
        err.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
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
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
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
