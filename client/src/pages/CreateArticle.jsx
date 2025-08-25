import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArticles } from "../contexts/ArticleContext";
import styles from "../styles/pages/CreateArticle.module.css";

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
        <h1>Create content</h1>
        <div className={styles.title}>
          <label htmlFor="title">Title of post</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Lorem ipsum dolor sit amet"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.description}>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Lorem ipsum dolor sit amet"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.content}>
          <label htmlFor="body">Content</label>
          <textarea
            id="body"
            name="body"
            placeholder="Lorem ipsum dolor sit amet"
            value={form.body}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>
        <div className={styles.tags}>
          <label htmlFor="tagList">Tags</label>
          <input
            type="text"
            id="tagList"
            name="tagList"
            placeholder="Lorem, ipsum, dolor, sit, amet"
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
