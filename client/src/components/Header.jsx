import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import {
  HomeOutlined,
  PlusCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/components/Header.module.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      logout();
      navigate("/");
    }
  };

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
        <Link to="/">
          <h1>Social Blogging App</h1>
        </Link>
      </div>

      <nav className={styles.navLinks}>
        <ul>
          <li className={styles.navLinksLi}>
            <HomeOutlined />
            <Link to="/">Home</Link>
          </li>
          {user ? (
            <>
              <li className={styles.navLinksLi}>
                <PlusCircleOutlined />
                <Link to="/post">Create Article</Link>
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
                    />
                    <span className={styles.username}>{user.username}</span>
                  </div>
                </Dropdown>
              </li>
            </>
          ) : (
            <li className={styles.navLinksLi}>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
