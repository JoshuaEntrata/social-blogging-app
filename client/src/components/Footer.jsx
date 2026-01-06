import styles from "../styles/components/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <h1>© 2026 Social Blogging. All rights reserved.</h1>
      </div>
      <div className={styles.items}>
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
      </div>
    </footer>
  );
};

export default Footer;
