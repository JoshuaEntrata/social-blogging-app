import { ArticleCard } from "../components";
import { Pagination } from "antd";
import styles from "../styles/components/Feed.module.css";

function Feed({ articles, total, page, onPageChange, pageSize }) {
  return (
    <>
      <div className={styles.feeds}>
        {articles.map((article, idx) => (
          <div key={idx}>
            <ArticleCard articleDetails={article} />
          </div>
        ))}

        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
        />
      </div>
    </>
  );
}

export default Feed;
