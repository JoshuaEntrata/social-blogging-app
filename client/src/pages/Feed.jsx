import { ArticleCard } from "../components";
import { Divider, Pagination } from "antd";
import styles from "../styles/components/Feed.module.css";

function Feed({ articles }) {
  return (
    <>
      <div className={styles.feeds}>
        <div>
          {articles.map((article, idx) => (
            <div key={idx}>
              <ArticleCard articleDetails={article} />
              {idx !== articles.length - 1 && <Divider />}
            </div>
          ))}
        </div>

        <Pagination
          defaultCurrent={1}
          defaultPageSize={3}
          total={articles.length}
        />
      </div>
    </>
  );
}

export default Feed;
