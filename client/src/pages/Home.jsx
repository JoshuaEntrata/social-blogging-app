import { useState, useEffect } from "react";
import { Divider, Tag, Spin, Alert, Empty } from "antd";
import { Feed } from "../components";
import { useAuth } from "../contexts/AuthContext";
import { useArticles } from "../contexts/ArticleContext";
import { useTags } from "../contexts/TagContext";
import styles from "../styles/pages/Home.module.css";

function Home() {
  const { user } = useAuth();
  const { listArticles } = useArticles();
  const { getTags } = useTags();

  const [allGlobalFeed, setAllGlobalFeed] = useState([]);

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [globalPage, setGlobalPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    const fetchFeed = async () => {
      try {
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

  const globalFeed = allGlobalFeed.slice(
    (globalPage - 1) * pageSize,
    globalPage * pageSize
  );

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
          <section className={styles.sections}>
            <div className={styles.tagsSection}>
              <h1>Explore Topics</h1>
              <div className={styles.tagList}>
                {!tags || tags.length === 0 ? (
                  <Empty />
                ) : (
                  <>
                    {tags.slice(0, 5).map((tag, idx) => (
                      <Tag key={idx} className={styles.tag}>
                        {tag}
                      </Tag>
                    ))}
                    {tags.length > 5 && (
                      <Tag className={styles.tag}>+{tags.length - 5} more</Tag>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className={styles.articlesSection}>
              <h1>Recently Published</h1>
              <div className={styles.center}>
                {globalFeed.length ? (
                  <Feed
                    articles={globalFeed}
                    total={allGlobalFeed.length}
                    page={globalPage}
                    onPageChange={setGlobalPage}
                    pageSize={pageSize}
                  />
                ) : (
                  <Empty description="No articles available" />
                )}
              </div>
              <Divider />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Home;
