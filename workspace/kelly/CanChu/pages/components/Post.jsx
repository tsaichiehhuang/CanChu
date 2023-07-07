import styles from "./Post.module.scss";
import MockData from "./mockData";
import React, { useState } from "react";

function getTimeDiff(date) {
  const now = new Date();
  const diffInMilliseconds = now - date;
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays}天前`;
  } else if (diffInDays > 5) {
    return date;
  } else {
    return `${diffInHours}小時前`;
  }
}
function Comment({ comment }) {
  const createdAt = new Date(comment.created_at);
  return (
    <div className={styles.commentContainer}>
      <img
        className={styles.commentUserImage}
        src={comment.user.picture}
        alt="User"
      />
      <div className={styles.commentContent}>
        <div className={styles.commentContentSquare}>
          <div className={styles.commentUserName}>{comment.user.name}</div>
          <div className={styles.commentText}>{comment.content}</div>
        </div>
        <div className={styles.commentTime}>{getTimeDiff(createdAt)}</div>
      </div>
    </div>
  );
}
export default function Post() {
  const [isNameHovered, setIsNameHovered] = useState(false); // 新增狀態
  //header的個人選單
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const handleProfileMouseEnter = () => {
    setShowProfileOptions(true);
  };

  const handleProfileMouseLeave = () => {
    setShowProfileOptions(false);
  };
  const handlePhotoMouseEnter = () => {
    setIsNameHovered(true);
  };
  const handlePhotoMouseLeave = () => {
    setIsNameHovered(false);
  };
  const comments = MockData().comments;
  return (
    <div className={styles.body}>
      {/* // nav */}
      <div className={styles.header}>
        <div className={styles.logo}>CanChu</div>
        <div className={styles.search}>
          <img style={{ marginRight: "10px" }} src="/search.png" />
          搜尋
        </div>
        <div
          className={styles.profile}
          onMouseEnter={handleProfileMouseEnter}
          onMouseLeave={handleProfileMouseLeave}
        >
          <img className={styles.person} src="/個人照片.png" alt="photo" />
          {showProfileOptions && (
            <div className={styles.profileOptions}>
              <div
                className={`${styles.profileOption} ${styles.profileName}`}
                onMouseEnter={handlePhotoMouseEnter}
                onMouseLeave={handlePhotoMouseLeave}
              >
                <img
                  className={styles.profileOptionPhoto}
                  src={isNameHovered ? "/hover個人照片.png" : "/個人照片.png"}
                />
                你的名字
              </div>
              <div
                style={{
                  width: "90%",
                  height: "1px",
                  background: "#D1CACE",
                  margin: "0px 10px"
                }}
              ></div>
              <div className={styles.profileOption}>查看個人檔案</div>
              <div
                style={{
                  width: "90%",
                  height: "1px",
                  background: "#D1CACE",
                  margin: "0px 10px"
                }}
              ></div>
              <div
                className={`${styles.profileOption} ${styles.profileLogOut}`}
              >
                登出
              </div>
            </div>
          )}
        </div>
      </div>
      {/* // post */}
      <div className={styles.container}>
        <div className={styles.post}>
          <div className={`${styles.firstRow} ${styles.row}`}>
            <img className={styles.circle} src={MockData().picture} />
            <div className={styles.text}>
              <div className={styles.textOne}>{MockData().name}</div>
              <div className={styles.textTwo}>
                {getTimeDiff(new Date(MockData().created_at))}
              </div>
            </div>
          </div>
          <article className={styles.secondRow}>{MockData().context}</article>
          <div className={`${styles.thirdRow} ${styles.row}`}>
            <img className={styles.heartIcon} src="/notHeart.png" />
            <img className={styles.commentIcon} src="/comment.png" />
          </div>
          <div className={`${styles.fourRow} ${styles.row}`}>
            <div>{MockData().like_count}人喜歡這則貼文</div>
            <div>{MockData().comment_count}則留言</div>
          </div>
          <div style={{ borderTop: "1px solid #bfbfbf", width: "100%" }}></div>
          {/* 網友留言 */}
          <div className={styles.comments}>
            {comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>

          <div className={`${styles.fiveRow} ${styles.row}`}>
            <img className={styles.person} src="/個人照片.png" alt="photo" />
            <div className={styles.selfComment}>
              <div>留個言吧</div>
              <img src="/postButton.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
