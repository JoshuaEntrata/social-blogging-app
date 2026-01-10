import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useArticles } from "../contexts/ArticleContext";
import { useProfile } from "../contexts/ProfileContext";
import { Alert, Avatar, Divider, Segmented, Spin, Tabs } from "antd";
import { Feed } from "../components";
import styles from "../styles/pages/Profile.module.css";

/** @typedef {"My Articles" | "Favorited Articles"} TabValue */

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { listArticles } = useArticles();
  const { getProfile, follow, unfollow } = useProfile();

  const [profileUser, setProfileUser] = useState(null);
  const [allMyArticles, setAllMyArticles] = useState([]);
  const [allFavoritedArticles, setAllFavoritedArticles] = useState([]);
  const [followed, setFollowed] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [myPage, setMyPage] = useState(1);
  const [favoritedPage, setFavoritedPage] = useState(1);
  const pageSize = 3;

  const [tabValue, setTabValue] = useState("My Articles");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const fetchedProfile = await getProfile(username);
        setProfileUser(fetchedProfile);
        setFollowed(fetchedProfile.following);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, getProfile]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { articles: authored } = await listArticles({
          author: username,
        });
        const { articles: favorited } = await listArticles({
          favorited: username,
        });
        setAllMyArticles(authored);
        setAllFavoritedArticles(favorited);
      } catch (err) {
        setError(err.message || "Failed to load articles");
      }
    };

    if (username) fetchArticles();
  }, [username, listArticles]);

  const handleFollow = async () => {
    try {
      if (followed) {
        await unfollow(username);
        setFollowed(false);
      } else {
        await follow(username);
        setFollowed(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const myArticles = allMyArticles.slice(
    (myPage - 1) * pageSize,
    myPage * pageSize
  );
  const favoritedArticles = allFavoritedArticles.slice(
    (favoritedPage - 1) * pageSize,
    favoritedPage * pageSize
  );

  const isMyProfile = currentUser?.username === profileUser?.username;

  return (
    <div className={styles.body}>
      <div className={styles.profileHeader}>
        <Avatar size={120} src={profileUser?.image} />
        <div className={styles.userDetails}>
          <h1>{profileUser?.username}</h1>
          {profileUser?.bio && <span>{profileUser?.bio}</span>}

          {isMyProfile ? (
            <button
              onClick={() => navigate("/settings")}
              className={styles.editBtn}
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={followed ? styles.followed : styles.unfollowed}
            >
              {followed ? "Followed" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <Divider className={styles.divider} />

      <div className={styles.feed}>
        {loading ? (
          <div className={styles.centered}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          <div className={styles.articles}>
            <Segmented
              value={tabValue}
              onChange={setTabValue}
              options={["My Articles", "Favorited Articles"]}
              classNames={styles.segmentedTabs}
            />
            {tabValue === "My Articles" ? (
              <Feed
                articles={myArticles}
                total={allMyArticles.length}
                page={myPage}
                onPageChange={setMyPage}
                pageSize={pageSize}
              />
            ) : (
              <Feed
                articles={favoritedArticles}
                total={allFavoritedArticles.length}
                page={favoritedPage}
                onPageChange={setFavoritedPage}
                pageSize={pageSize}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
