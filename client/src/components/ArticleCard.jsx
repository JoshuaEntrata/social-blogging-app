import { Avatar, Button, Tag } from "antd";
import { HeartOutlined, HeartFilled, CommentOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useArticles } from "../contexts/ArticleContext";
import { useComments } from "../contexts/CommentContext";
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
  const { getComments } = useComments();
  const [commentsCount, setCommentsCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLiked(favorited);
  }, [favorited]);

  useEffect(() => {
    setCount(favoritesCount);
  }, [favoritesCount]);

  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const comments = await getComments(slug);
        setCommentsCount(comments.length);
      } catch (err) {
        console.log(err);
        setCommentsCount(0);
      }
    };
    fetchCommentsCount();
  }, [slug, getComments]);

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
      {error && <h1>Error</h1>}
      <div className={styles.articleText}>
        <h1 className={styles.title}>{title}</h1>
        <h3 className={styles.description}>{description}</h3>
      </div>
      <div className={styles.authorDetails}>
        <Avatar
          size={32}
          src={author.image}
          onClick={() => navigate(`/profile/${author?.username}`)}
          style={{ cursor: "pointer" }}
        />
        <p className={styles.author}>{author?.username} </p>
        <div className={styles.dot} />
        <span className={styles.datePosted}>
          {new Date(createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <div className={styles.tags}>
        {tagList.map((tag, idx) => (
          <Tag key={idx} className={styles.tag}>
            {tag}
          </Tag>
        ))}
      </div>
      <div className={styles.endRow}>
        <div className={styles.metrics}>
          <Button
            type="text"
            icon={
              liked ? (
                <HeartFilled style={{ color: "red" }} size={16} />
              ) : (
                <HeartOutlined size={16} />
              )
            }
            className={styles.metricButton}
            onClick={handleFavorite}
          >
            {count} Likes
          </Button>
          <Link to={`/article/${slug}`} className={styles.readMore}>
            <Button
              type="text"
              icon={<CommentOutlined size={16} />}
              className={styles.metricButton}
            >
              {commentsCount} Comments
            </Button>
          </Link>
        </div>
        <Link to={`/article/${slug}`} className={styles.readMore}>
          Read more...
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
