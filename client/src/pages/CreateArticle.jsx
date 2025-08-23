import { useState } from "react";
import styles from "../styles/pages/CreateArticle.module.css";

const CreateArticle = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    tags: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(form);
  };

  return (
    <div className={styles.body}>
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
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            placeholder="Lorem ipsum dolor sit amet"
            value={form.content}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>
        <div className={styles.tags}>
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder="Lorem, ipsum, dolor, sit, amet"
            value={form.tags}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.buttonarea}>
          <button type="submit">Create Article</button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;
