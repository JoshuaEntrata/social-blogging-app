import { useNavigate } from "react-router-dom";
import { Avatar, Button, Tabs } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { Feed } from ".";
import styles from "../styles/pages/Profile.module.css";
import dummyArticles from "../components/dummyArticles.json";

const Profile = () => {
  const navigate = useNavigate();
  const items = [
    {
      key: "1",
      label: "My Articles",
      children: <Feed articles={dummyArticles} />,
    },
    {
      key: "2",
      label: "Favorited Articles",
      children: <Feed articles={dummyArticles} />,
    },
  ];

  return (
    <div className={styles.body}>
      <div className={styles.profileHeader}>
        <Avatar
          size={120}
          src="https://i.pravatar.cc/300"
          style={{ marginBottom: 16 }}
        />
        <Button
          type="primary"
          icon={<SettingOutlined />}
          onClick={() => navigate("/settings")}
        >
          Settings
        </Button>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={(key) => {
          console.log(key);
        }}
      />
    </div>
  );
};

export default Profile;
