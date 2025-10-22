import { Avatar, Button, Tag } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useArticles } from "../contexts/ArticleContext";
import styles from "../styles/components/ArticleCard.module.css";

const ArticleCard = ({ articleDetails }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
  const [count, setCount] = useState(favoritesCount);
  const { favorite, unfavorite } = useArticles();
  const [error, setError] = useState(null);

  useEffect(() => {
    setLiked(favorited);
  }, [favorited]);

  useEffect(() => {
    setCount(favoritesCount);
  }, [favoritesCount]);

  const handleFavorite = async () => {
    if (!user) {
      navigate(`/login`);
      return;
    }

    try {
      if (liked) {
        const updated = await unfavorite(slug);
        setLiked(false);
        setCount(updated.favoritesCount);
      } else {
        const updated = await favorite(slug);
        setLiked(true);
        setCount(updated.favoritesCount);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.firstRow}>
        <div className={styles.meta}>
          <Avatar
            size={40}
            src={author.image}
            onClick={() => navigate(`/profile/${author?.username}`)}
            style={{ cursor: "pointer" }}
          />
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
        {error && <h1>Error</h1>}
        <Button
          type="text"
          icon={
            liked ? <HeartFilled style={{ color: "red" }} /> : <HeartOutlined />
          }
          onClick={handleFavorite}
        >
          ({count})
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
