import { ArticleCard } from "../components";
import { Divider } from "antd";
import styles from "../styles/components/Feed.module.css";

function Feed({ articles }) {
  console.log("articles", articles);
  return (
    <>
      <div className={styles.feeds}>
        {articles.map((article, index) => (
          <div key={article.id}>
            <ArticleCard articleDetails={article} />
            {index < articles.length - 1 && <Divider />}
          </div>
        ))}
      </div>
    </>
  );
}

export default Feed;
