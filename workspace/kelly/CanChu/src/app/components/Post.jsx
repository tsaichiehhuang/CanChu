import styles from "./Post.module.scss";

export default function Post() {
  return (
    <div className={styles.outsideSquare}>
      <div className={`${styles.firstRow} ${styles.row}`}>
        <div className={styles.circle}></div>
        <div className={styles.text}>
          <div className={styles.textOne}>你的朋友</div>
          <div className={styles.textTwo}>一小時前</div>
        </div>
      </div>
      <div className={styles.secondRow}>
        動態動態動態動態動態動態，動態動態動態動態。
      </div>
      <div className={`${styles.thirdRow} ${styles.row}`}>
        <div className={styles.smallCircleOne}></div>
        <div className={styles.smallCircleTwo}></div>
      </div>
      <div className={`${styles.fourRow} ${styles.row}`}>
        <div>7 人喜歡這則貼文</div>
        <div>1 則留言</div>
      </div>
      <div className={`${styles.fiveRow} ${styles.row}`}>
        <img
          className={styles.person}
          src="https://img.onl/hm9XzQ"
          alt="photo"
        />
        <div className={styles.comment}>留個言吧</div>
      </div>
    </div>
  );
}
