import styles from "./formLayout.module.css";
import logo from "../../assets/image/logo.png";

export default function FormRegister({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <img src={logo} />
          <span>MyCV</span>
        </div>
        {children}
      </div>
    </div>
  );
}
