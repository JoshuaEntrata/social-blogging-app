import { Tag } from "antd";
import styles from "../styles/components/TagBox.module.css";

const TagBox = ({ tags }) => (
  <div className={styles.tagBox}>
    <h3 className={styles.tagBox__header}>Popular Tags</h3>
    <div className={styles.tagBox__list}>
      {tags.map((tag, idx) => (
        <Tag key={idx} className={styles.tag}>
          {tag}
        </Tag>
      ))}
    </div>
  </div>
);

export default TagBox;
