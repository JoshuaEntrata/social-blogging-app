import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useArticles } from "../contexts/ArticleContext";
import { useComments } from "../contexts/CommentContext";
import { Avatar, Button, Divider, Tag } from "antd";
import { CommentCard } from "../components";
import { CommentOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import styles from "../styles/pages/Article.module.css";

const Article = () => {
  const { slug } = useParams();
  const { getArticle } = useArticles();
  const { getComments } = useComments();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const a = await getArticle(slug);
        setArticle(a);
      } catch (err) {
        setError(err.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const c = await getComments(slug);
        setComments(c);
      } catch (err) {
        setError(err.message || "Failed to get comments");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    fetchComments();
  }, [slug, getArticle, getComments]);

  if (loading) return <p>Loading article...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!article) return <p>No article found</p>;
  console.log("article", article);
  console.log("comments", comments);
  return (
    <div className={styles.page}>
      <article className={styles.container}>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.description}>{article.description}</p>

        <div className={styles.meta}>
          <Avatar size={40} src={article.author.image} />
          <div>
            <span className={styles.author}>{article.author?.username}</span>
            <span className={styles.date}>
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className={styles.likeComment}>
          <Button
            type="link"
            size="large"
            icon={
              article.favorited ? (
                <HeartFilled style={{ color: "red" }} />
              ) : (
                <HeartOutlined />
              )
            }
          >
            {article.favoritesCount}
          </Button>
          <Button type="link" size="large" icon={<CommentOutlined />}>
            {comments?.length}
          </Button>
        </div>

        <div className={styles.body}>
          {article.body.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {article.tagList?.length > 0 && (
          <div className={styles.tags}>
            {article.tagList.map((tag, idx) => (
              <Tag key={idx} className={styles.tag}>
                {tag}
              </Tag>
            ))}
          </div>
        )}
      </article>

      <Divider />

      {comments?.length > 0 && (
        <div className={styles.comments}>
          {comments.map((comment, idx) => (
            <div key={idx}>
              <CommentCard comment={comment} />
              {idx !== comments.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Article;
