import { Avatar, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/components/CommentCard.module.css";

const CommentCard = ({ comment, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <Avatar
            size={40}
            src={comment.author.image}
            onClick={() => navigate(`/profile/${comment.author.username}`)}
            style={{ cursor: "pointer" }}
          />
          <div>
            <span className={styles.author}>{comment.author?.username}</span>
            <span className={styles.date}>
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
        {comment.author?.username == user?.username && (
          <Button onClick={() => onDelete(comment.id)} danger>
            X
          </Button>
        )}
      </div>

      <div className={styles.body}>{comment.body}</div>
    </div>
  );
};

export default CommentCard;
