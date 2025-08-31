import { Avatar, Button, Tag } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/components/ArticleCard.module.css";

const ArticleCard = ({ articleDetails }) => {
  const {
    slug,
    title,
    description,
    createdAt,
    author,
    tagList,
    favorited,
    favoritesCount,
  } = articleDetails;

  const [liked, setLiked] = useState(favorited);

  return (
    <div className={styles.card}>
      <div className={styles.firstRow}>
        <div className={styles.meta}>
          <Avatar size={40} src={author.image} />
          <div>
            <span className={styles.author}>{author?.username}</span>
            <span className={styles.date}>
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        <Button
          type="text"
          icon={
            liked ? <HeartFilled style={{ color: "red" }} /> : <HeartOutlined />
          }
          onClick={() => setLiked(!liked)}
        >
          {liked ? `( ${favoritesCount + 1} )` : `( ${favoritesCount} )`}
        </Button>
      </div>
      <div className={styles.secondRow}>
        <h1 className={styles.title}>{title}</h1>
        <h3 className={styles.description}>{description}</h3>
      </div>
      <div className={styles.thirdRow}>
        <Link to={`/article/${slug}`}>Read more...</Link>
        <div className={styles.tags}>
          {tagList.map((tag, idx) => (
            <Tag key={idx}>{tag}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
