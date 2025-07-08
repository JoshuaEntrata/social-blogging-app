import React from "react";
import Tag from "./Tag";
import styles from "./TagBox.module.css";

const TagBox = ({ tags }) => (
  <div className={styles.tagBox}>
    <h3 className={styles.tagBox__header}>Popular Tags</h3>
    <div className={styles.tagBox__list}>
      {Array.isArray(tags) &&
        tags.map((tag) => (
          <Tag key={tag.id} label={tag.name} onClick={() => {}} />
        ))}
    </div>
  </div>
);

export default TagBox;
