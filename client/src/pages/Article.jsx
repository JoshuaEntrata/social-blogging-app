import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useArticles } from "../contexts/ArticleContext";
import { useComments } from "../contexts/CommentContext";
import { Avatar, Button, Divider, Input, Tag } from "antd";
import { CommentCard } from "../components";
import { CommentOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import styles from "../styles/pages/Article.module.css";

const { TextArea } = Input;

const Article = () => {
  const { user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getArticle } = useArticles();
  const { addComment, getComments } = useComments();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      console.warning("Please enter a comment before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const newComment = await addComment(slug, commentText.trim());
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
    } catch (err) {
      console.error(err.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className={styles.page}>
      {user.username == article.author.username && (
        <Button onClick={() => navigate(`/article/${article.slug}/edit`)}>
          Edit Article
        </Button>
      )}

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

      <Divider className={styles.divider} />

      {user && (
        <div className={styles.addComment}>
          <div className={styles.userDetails}>
            <Avatar size={40} src={user.image} />
            <p>{user.username}</p>
          </div>

          <TextArea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="What are your thoughts?"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
          <Button
            type="primary"
            disabled={submitting}
            onClick={handleAddComment}
          >
            {submitting ? "Adding..." : "Add Comment"}
          </Button>
        </div>
      )}

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
