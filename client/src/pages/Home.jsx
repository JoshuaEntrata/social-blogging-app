import { useState, useEffect } from "react";
import { Tag, Skeleton, Alert, Empty } from "antd";
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
    globalPage * pageSize,
  );

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <main className={styles.feed}>
          {loading ? (
            <div className={styles.centered}>
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : (
            <section className={styles.articlesSection}>
              <div className={styles.feedHeader}>
                <span className={styles.kicker}>Latest stories</span>
                <h1>Recently Published</h1>
                <p>
                  Essays, notes, and community stories from writers you can
                  follow.
                </p>
              </div>

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
            </section>
          )}
        </main>

        <aside className={styles.topicRail}>
          <div className={styles.topicPanel}>
            <span className={styles.kicker}>Discover</span>
            <h2>Explore Topics</h2>
            <div className={styles.tagList}>
              {!tags || tags.length === 0 ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <>
                  {tags.slice(0, 8).map((tag) => (
                    <Tag key={tag} className={styles.tag}>
                      {tag}
                    </Tag>
                  ))}
                  {tags.length > 8 && (
                    <Tag className={styles.tag}>+{tags.length - 8} more</Tag>
                  )}
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Home;
