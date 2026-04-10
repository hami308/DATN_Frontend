import styles from "./verify.module.css";

export default function VerifyEmailContent() {
  return (
    <div className={styles.content}>
      <h2 className={styles.title}>Xác thực Email</h2>

      <p className={styles.desc}>
        Chúng tôi đã gửi một email xác minh đến emailaddress@gmail.com để xác
        thực địa chỉ email và kích hoạt tài khoản của bạn.
      </p>

      <input type="text" placeholder="Mã xác thực" className={styles.input} />

      <button className={styles.button}>Xác thực tài khoản của tôi</button>

      <p className={styles.resend}>
        Không nhận được mã xác thực <span>Gửi lại</span>
      </p>
    </div>
  );
}
