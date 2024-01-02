import styles from "./footer.module.css";
// den paizei den mporw na to kanv me talliwind sticky footer
export const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>CM Web App</div>
      <div className={styles.text}>2024© All rights reserved.</div>
    </div>
  );
};

export default Footer