import { ArticleCard } from "../components";
import { Pagination } from "antd";
import styles from "../styles/components/Feed.module.css";

function Feed({ articles, total, page, onPageChange, pageSize }) {
  return (
    <>
      <div className={styles.feeds}>
        {articles.map((article) => (
          <ArticleCard key={article.id} articleDetails={article} />
        ))}

        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          hideOnSinglePage
          showSizeChanger={false}
        />
      </div>
    </>
  );
}

export default Feed;
