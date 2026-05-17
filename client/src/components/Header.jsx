import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import {
  HomeOutlined,
  PlusCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/components/Header.module.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  const items = [
    {
      key: "profile",
      label: <Link to={`/profile/${user?.username}`}>Profile</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: <Link to="/settings">Settings</Link>,
      icon: <SettingOutlined />,
    },
    { type: "divider" },
    {
      key: "logout",
      label: <Link to="/">Logout</Link>,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/" aria-label="Go to home">
          <span className={styles.logoMark}>S</span>
          <h1>Social Blogging</h1>
        </Link>
      </div>

      <nav className={styles.navLinks}>
        <ul>
          <li>
            <Link
              to="/"
              className={`${styles.navLinksLi} ${
                isActive("/") ? styles.active : ""
              }`}
            >
              <span>Home</span>
              <HomeOutlined />
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to="/post"
                  className={`${styles.navLinksLi} ${
                    isActive("/post") ? styles.active : ""
                  }`}
                >
                  <span>Create Article</span>
                  <PlusCircleOutlined />
                </Link>
              </li>
              <li>
                <Dropdown
                  menu={{ items, onClick: handleMenuClick }}
                  trigger={["click"]}
                >
                  <div className={styles.userMenu}>
                    <Avatar
                      src={user.image}
                      alt="avatar"
                      className={styles.avatar}
                      icon={<UserOutlined />}
                    />
                    <span className={styles.username}>{user.username}</span>
                  </div>
                </Dropdown>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/login"
                className={`${styles.navLinksLi} ${
                  isActive("/login") ? styles.active : ""
                }`}
              >
                <span>Login</span>
                <LoginOutlined />
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
