import { Link } from "react-router-dom";
import { Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import styles from "../styles/components/Header.module.css";

const Header = () => {
  const items = [
    {
      key: "profile",
      label: <Link to="/profile">Profile</Link>,
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
      label: <Link to="/logout">Logout</Link>,
      icon: <LogoutOutlined />,
    },
  ];
  const username = "Joshua";

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>Social Blogging App</h1>
      </div>

      <nav className={styles.navLinks}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/post">Post</Link>
          </li>
          <li>
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div className={styles.userMenu}>
                <Avatar
                  src="https://wallpapers.com/images/featured/rick-and-morty-pictures-b3e2pq02sb2fuvy3.jpg"
                  alt="avatar"
                  className={styles.avatar}
                />
                <span className={styles.username}>Hi, {username}</span>
              </div>
            </Dropdown>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
