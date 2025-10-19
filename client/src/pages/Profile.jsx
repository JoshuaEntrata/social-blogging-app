import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useArticles } from "../contexts/ArticleContext";
import { Alert, Avatar, Button, Spin, Tabs } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { Feed } from "../components";
import styles from "../styles/pages/Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { listArticles } = useArticles();

  const [allMyArticles, setAllMyArticles] = useState([]);
  const [allFavoritedArticles, setAllFavoritedArticles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [myPage, setMyPage] = useState(1);
  const [favoritedPage, setFavoritedPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { articles } = await listArticles({
          author: user?.username,
        });
        setAllMyArticles(articles);

        const { articles: userFavoritedArticles } = await listArticles({
          favorited: user?.username,
        });
        setAllFavoritedArticles(userFavoritedArticles);
      } catch (err) {
        setError(err.message || "Failed to load feeds");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user, listArticles]);

  const myArticles = allMyArticles.slice(
    (myPage - 1) * pageSize,
    myPage * pageSize
  );
  const favoritedArticles = allFavoritedArticles.slice(
    (favoritedPage - 1) * pageSize,
    favoritedPage * pageSize
  );

  const items = [
    {
      key: "1",
      label: "My Articles",
      children: (
        <Feed
          articles={myArticles}
          total={allMyArticles.length}
          page={myPage}
          onPageChange={setMyPage}
          pageSize={pageSize}
        />
      ),
    },
    {
      key: "2",
      label: "Favorited Articles",
      children: (
        <Feed
          articles={favoritedArticles}
          total={allFavoritedArticles.length}
          page={favoritedPage}
          onPageChange={setFavoritedPage}
          pageSize={pageSize}
        />
      ),
    },
  ];

  return (
    <div className={styles.body}>
      <div className={styles.profileHeader}>
        <Avatar size={120} src={user.image} style={{ marginBottom: 16 }} />
        <h3>{user.username}</h3>
        {user.bio && <h4>{user.bio}</h4>}

        <Button
          type="primary"
          icon={<SettingOutlined />}
          onClick={() => navigate("/settings")}
          style={{ marginTop: 16 }}
        >
          Settings
        </Button>
      </div>

      <div className={styles.feed}>
        {loading ? (
          <div className={styles.centered}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          <Tabs defaultActiveKey="1" items={items} />
        )}
      </div>
    </div>
  );
};

export default Profile;
