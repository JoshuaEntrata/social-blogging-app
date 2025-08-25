import { useState, useEffect } from "react";
import { Tabs, Spin, Alert, Empty } from "antd";
import { TagBox } from "../components";
import { Feed } from ".";
import Sider from "antd/es/layout/Sider";
import { useAuth } from "../contexts/AuthContext";
import { useArticles } from "../contexts/ArticleContext";
import styles from "../styles/pages/Home.module.css";
import dummyTags from "../components/dummyTags.json";

function Home() {
  const { user } = useAuth();
  const { listArticles } = useArticles();

  const [myFeed, setMyFeed] = useState([]);
  const [globalFeed, setGlobalFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        if (user) {
          const arr = await listArticles({ author: user.username });
          setMyFeed(arr);
        }

        const globalArr = await listArticles();
        setGlobalFeed(globalArr);
      } catch (err) {
        setError(err.message || "Failed to load feeds");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [user, listArticles]);

  const items = [
    {
      key: "1",
      label: "My Feed",
      children: myFeed.length ? (
        <Feed articles={myFeed} />
      ) : (
        <Empty description="No articles found in your feed" />
      ),
    },
    {
      key: "2",
      label: "Global Feed",
      children: globalFeed.length ? (
        <Feed articles={globalFeed} />
      ) : (
        <Empty description="No articles available" />
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.tagContainer}>
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

      <Sider className={styles.sider}>
        <TagBox tags={dummyTags} />
      </Sider>
    </div>
  );
}

export default Home;
