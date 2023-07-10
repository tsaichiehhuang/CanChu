import styles from "./Home.module.scss";
import React, { useState } from "react";
import Header from "./components/Header";
import PostNotComments from "./components/PostNotComments";
import HomeData from "./components/HomeData";

export default function Home() {
  const friendList = () => {
    const friends = [
      "好朋友",
      "好朋友",
      "好朋友",
      "好朋友",
      "好朋友",
      "好朋友"
    ];

    return (
      <div className={styles.friendList}>
        <div className={styles.friendListSection}>
          <div className={styles.friendListIcon}></div>
          <div>你的名字</div>
        </div>
        <div className={styles.friendListSection}>
          <div className={styles.friendListIcon}></div>
          <div>好友邀請</div>
        </div>

        <div className={styles.friendListSection}>
          <img src="/friends.png" />
          我的好友
        </div>

        <div className={styles.friendListMyFriend}>
          {friends.map((friend, index) => (
            <div className={styles.friendListSection} key={index}>
              <div className={styles.friendListIcon}></div>
              <div>{friend}</div>
            </div>
          ))}
        </div>
        <div className={styles.friendListSection}>
          <img src="/options.png" />
          查看全部
        </div>
      </div>
    );
  };
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        {friendList()}
        <div className={styles.containerRight}>
          <div className={styles.posting}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <img className={styles.postingPhoto} src="/個人照片.png" />
              <div className={styles.postingText}>說點什麼嗎？</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-end"
              }}
            >
              <button className={styles.postingButton}>發布貼文</button>
            </div>
          </div>
          {HomeData().map(data => (
            <PostNotComments key={data.id} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
}
