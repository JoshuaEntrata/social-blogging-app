import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useArticles } from "../contexts/ArticleContext";
import { useComments } from "../contexts/CommentContext";
import { Avatar, Button, Divider, Input, Tag, Empty } from "antd";
import { CommentCard } from "../components";
import { CommentOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import styles from "../styles/pages/Article.module.css";

const { TextArea } = Input;

const Article = () => {
  const { user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getArticle, favorite, unfavorite } = useArticles();
  const { addComment, getComments, deleteComment } = useComments();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

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

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(slug, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const a = await getArticle(slug);
        setArticle(a);
        setLiked(a.favorited);
        setCount(a.favoritesCount);
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

  if (loading) return <p>Loading article...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!article) return <p>No article found</p>;

  return (
    <div className={styles.page}>
      {user?.username == article.author.username && (
        <Button onClick={() => navigate(`/article/${article.slug}/edit`)}>
          Edit Article
        </Button>
      )}

      <article className={styles.container}>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.description}>{article.description}</p>

        <div className={styles.articleDetails}>
          <div className={styles.meta}>
            <Avatar
              size={48}
              src={article.author.image}
              onClick={() => navigate(`/profile/${article.author?.username}`)}
              style={{ cursor: "pointer" }}
            />
            <div>
              <h4 className={styles.author}>{article.author?.username}</h4>
              <div className={styles.row}>
                <span className={styles.date}>
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {article.tagList && article.tagList.length > 0 && (
                  <div className={styles.tagList}>
                    {article.tagList.slice(0, 5).map((tag, idx) => (
                      <Tag key={idx} className={styles.tag}>
                        {tag}
                      </Tag>
                    ))}

                    {article.tagList.length > 5 && (
                      <Tag className={styles.tag}>
                        +{article.tagList.length - 5} more
                      </Tag>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
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
              {count}
            </Button>
            <Button
              type="text"
              icon={<CommentOutlined size={16} />}
              className={styles.metricButton}
              onClick={handleFavorite}
            >
              {comments?.length}
            </Button>
          </div>
        </div>

        <div className={styles.body}>
          {article.body.split("\n").map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </article>

      <Divider className={styles.divider} />

      <div className={styles.addComment}>
        <h1>Comments</h1>
        {user && (
          <div className={styles.newComment}>
            <div className={styles.row}>
              <Avatar size={40} src={user.image} />
              <TextArea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="What are your thoughts?"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </div>

            <Button
              type="primary"
              className={styles.postButton}
              disabled={submitting}
              onClick={handleAddComment}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        )}
      </div>

      {comments?.length > 0 && (
        <div className={styles.comments}>
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentCard comment={comment} onDelete={handleDeleteComment} />
              {comment.id !== comments.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      )}

      {!user && comments?.length === 0 && <Empty />}
    </div>
  );
};

export default Article;
