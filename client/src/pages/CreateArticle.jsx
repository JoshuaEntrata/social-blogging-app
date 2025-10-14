import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArticles } from "../contexts/ArticleContext";
import { Input } from "antd";
import styles from "../styles/pages/CreateArticle.module.css";

const { TextArea } = Input;

const CreateArticle = () => {
  const { createArticle } = useArticles();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    body: "",
    tagList: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const payload = {
        ...form,
        tagList: form.tagList
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const created = await createArticle(payload);
      navigate(`/article/${created.slug}`);
    } catch (err) {
      setError(err.message || "Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.body}>
      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Write a New Article</h1>
        <div className={styles.title}>
          <label htmlFor="title">Title</label>
          <Input
            type="text"
            id="title"
            name="title"
            placeholder="Enter your article title"
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
            placeholder="A short summary of your article"
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
            placeholder="Write your article content here.."
            value={form.body}
            onChange={handleChange}
            autoSize={{ minRows: 3 }}
            required
          />
        </div>
        <div className={styles.tags}>
          <label htmlFor="tagList">Tags</label>
          <Input
            type="text"
            id="tagList"
            name="tagList"
            placeholder="Add tags separated by commas (e.g. tech, design, startup)"
            value={form.tagList}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.buttonarea}>
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Article"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
