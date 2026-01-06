import { useState } from "react";
import { Link } from "react-router-dom";
import { Divider } from "antd";
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
      <Link to={`/`}>
        <img src={"/vite.svg"} alt="" />
      </Link>

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Register</h1>
        <div className={styles.username}>
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
        <button type="submit" className={styles.submitBtn}>
          Register
        </button>

        <Divider />

        <span className={styles.register}>
          Already have an account?{" "}
          <Link to={`/login`} className={styles.registerLink}>
            Sign In
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
