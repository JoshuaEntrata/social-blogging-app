import styles from "./Tag.module.css";

const Tag = ({ label, onClick, className }) => (
  <span className={`${styles.tag} ${className || ""}`} onClick={onClick}>
    {label}
  </span>
);

export default Tag;
