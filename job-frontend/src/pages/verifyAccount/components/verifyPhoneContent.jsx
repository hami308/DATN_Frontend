import styles from "./verify.module.css";

export default function VerifyPhoneContent() {
  return (
    <div className={styles.content}>
      <h2 className={styles.title}>Xác thực số điện thoại</h2>

      <p className={styles.desc}>
        Chúng tôi đã gửi mã OTP đến số điện thoại của bạn.
      </p>

      <input type="text" placeholder="Nhập mã OTP" className={styles.input} />

      <button className={styles.button}>Xác thực số điện thoại</button>

      <p className={styles.resend}>
        Không nhận được mã <span>Gửi lại</span>
      </p>
    </div>
  );
}
