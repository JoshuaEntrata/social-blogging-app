import { useState } from "react";
import styles from "./CreateArticle.module.css";

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
    <div className="create-article-page">
      <h2>Create New Article</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <input
            type="text"
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="tags">Tags:</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Create Article</button>
      </form>
    </div>
  );
};

export default CreateArticle;
