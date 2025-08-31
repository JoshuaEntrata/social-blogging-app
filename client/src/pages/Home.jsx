import { useState, useEffect } from "react";
import { Tabs, Spin, Alert, Empty } from "antd";
import { Feed, TagBox } from "../components";
import Sider from "antd/es/layout/Sider";
import { useAuth } from "../contexts/AuthContext";
import { useArticles } from "../contexts/ArticleContext";
import { useTags } from "../contexts/TagContext";
import styles from "../styles/pages/Home.module.css";

function Home() {
  const { user } = useAuth();
  const { listArticles } = useArticles();
  const { getTags } = useTags();

  const [allMyFeed, setAllMyFeed] = useState([]);
  const [allGlobalFeed, setAllGlobalFeed] = useState([]);

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [myPage, setMyPage] = useState(1);
  const [globalPage, setGlobalPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        if (user) {
          const { articles } = await listArticles({
            author: user.username,
          });
          setAllMyFeed(articles);
        }

        const { articles: globalArticles } = await listArticles();
        setAllGlobalFeed(globalArticles);
      } catch (err) {
        setError(err.message || "Failed to load feeds");
      } finally {
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const t = await getTags();
        setTags(t);
      } catch (err) {
        setError(err.message || "Failed to load tags");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
    fetchTags();
  }, [user, listArticles, getTags]);

  const myFeed = allMyFeed.slice((myPage - 1) * pageSize, myPage * pageSize);
  const globalFeed = allGlobalFeed.slice(
    (globalPage - 1) * pageSize,
    globalPage * pageSize
  );

  const items = [
    {
      key: "1",
      label: "My Feed",
      children: myFeed.length ? (
        <Feed
          articles={myFeed}
          total={allMyFeed.length}
          page={myPage}
          onPageChange={setMyPage}
          pageSize={pageSize}
        />
      ) : (
        <Empty description="No articles found in your feed" />
      ),
    },
    {
      key: "2",
      label: "Global Feed",
      children: globalFeed.length ? (
        <Feed
          articles={globalFeed}
          total={allGlobalFeed.length}
          page={globalPage}
          onPageChange={setGlobalPage}
          pageSize={pageSize}
        />
      ) : (
        <Empty description="No articles available" />
      ),
    },
  ];
  const feedTabs = user ? items : [items[1]];

  return (
    <div className={styles.page}>
      <div className={styles.feed}>
        {loading ? (
          <div className={styles.centered}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          <Tabs defaultActiveKey="1" items={feedTabs} />
        )}
      </div>

      <Sider className={styles.sider}>
        <TagBox tags={tags} />
      </Sider>
    </div>
  );
}

export default Home;
