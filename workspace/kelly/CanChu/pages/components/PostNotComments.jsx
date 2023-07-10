import styles from "./Post.module.scss";
import React from "react";
import getTimeDiff from "./getTimeDiff";

export default function PostNotComments({ data }) {
  return (
    <div className={styles.container}>
      <div className={styles.post}>
        <div className={`${styles.firstRow} ${styles.row}`}>
          <img className={styles.circle} src={data.picture} />
          <div className={styles.text}>
            <div className={styles.textOne}>{data.name}</div>
            <div className={styles.textTwo}>
              {getTimeDiff(new Date(data.created_at))}
            </div>
          </div>
        </div>
        <article className={styles.secondRow}>{data.context}</article>
        <div className={`${styles.thirdRow} ${styles.row}`}>
          <img className={styles.heartIcon} src="/notHeart.png" />
          <img className={styles.commentIcon} src="/comment.png" />
        </div>
        <div className={`${styles.fourRow} ${styles.row}`}>
          <div>{data.like_count}人喜歡這則貼文</div>
          <div>{data.comment_count}則留言</div>
        </div>
        <div style={{ borderTop: "1px solid #bfbfbf", width: "100%" }}></div>

        <div className={`${styles.fiveRow} ${styles.row}`}>
          <img className={styles.person} src="/個人照片.png" alt="photo" />
          <div className={styles.selfComment}>
            <div>留個言吧</div>
            <img src="/postButton.png" />
          </div>
        </div>
      </div>
    </div>
  );
}
