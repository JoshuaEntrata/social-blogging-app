import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useArticles } from "../contexts/ArticleContext";
import { Button, Input, message } from "antd";
import styles from "../styles/pages/CreateArticle.module.css";
import "antd/dist/reset.css";

const { TextArea } = Input;

const EditArticle = () => {
  const { user } = useAuth();
  const { getArticle, updateArticle, deleteArticle } = useArticles();
  const { slug } = useParams();
  const navigate = useNavigate();
  console.log("slug", slug);

  const [form, setForm] = useState({
    title: "",
    description: "",
    body: "",
  });
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleError, setArticleError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setArticleLoading(true);
    const fetchArticle = async () => {
      try {
        const a = await getArticle(slug);

        if (user?.username !== a.author?.username) {
          alert("You are not allowed to edit this article.");
          navigate(`/article/${slug}`, { replace: true });
        }

        setForm({
          title: a.title || "",
          description: a.description || "",
          body: a.body || "",
        });
        setArticle(a);
      } catch (err) {
        setArticleError(err.message || "Failed to load article");
      } finally {
        setArticleLoading(false);
      }
    };

    fetchArticle();
  }, [slug, getArticle, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updated = await updateArticle(article.slug, form);
      navigate(`/article/${updated.slug}`);
    } catch (err) {
      setError(err.message || "Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteArticle(article.slug);
      message.success("Article deleted successfully!");
      navigate("/");
    } catch (err) {
      message.error(err.message || "Failed to delete article");
    } finally {
      setDeleting(false);
    }
  };

  if (articleLoading) return <p>Loading article...</p>;
  if (articleError) return <p className={styles.error}>{error}</p>;
  if (!article) return <p>No article found</p>;

  return (
    <div className={styles.body}>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Update Article</h1>
        <div className={styles.title}>
          <label htmlFor="title">Title</label>
          <Input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.description}>
          <label htmlFor="description">Description</label>
          <Input
            type="text"
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.content}>
          <label htmlFor="body">Content</label>
          <TextArea
            id="body"
            name="body"
            value={form.body}
            onChange={handleChange}
            autoSize={{ minRows: 3 }}
            required
          />
        </div>
        <div className={styles.buttonarea}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginRight: "1rem" }}
          >
            Update Article
          </Button>

          <Button
            danger
            htmlType="button"
            onClick={handleDelete}
            loading={deleting}
          >
            Delete Article
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
