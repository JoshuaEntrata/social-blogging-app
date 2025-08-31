import { ArticleCard } from "../components";
import { Divider, Pagination } from "antd";
import styles from "../styles/components/Feed.module.css";

function Feed({ articles, total, page, onPageChange, pageSize }) {
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
