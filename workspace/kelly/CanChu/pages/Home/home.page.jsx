import styles from "./Home.module.scss";
import React, { useState } from "react";
import Header from "../components/Header";
import Post from "../Post/post";
import HomeData from "./components/HomeData";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const friendList = () => {
    const friends = Array(6).fill("好朋友");

    const renderFriendSection = (icon, text) => (
      <div className={styles.friendListSection}>
        {icon ? (
          <div style={{ marginLeft: "1%" }}>{icon}</div>
        ) : (
          <div className={styles.friendListIcon}></div>
        )}
        <div>{text}</div>
      </div>
    );

    return (
      <div className={styles.friendList}>
        {renderFriendSection("", "你的名字")}
        {renderFriendSection("", "好友邀請")}
        <div
          style={{ width: "90%", background: "#D9D9D9", height: "1px" }}
        ></div>
        {renderFriendSection(<img src="/friends.png" />, "我的好友")}
        <div className={styles.friendListMyFriend}>
          {friends.map((friend, index) => (
            <div className={styles.friendListSection} key={index}>
              <div className={styles.friendListIcon}></div>
              <div>{friend}</div>
            </div>
          ))}
        </div>
        {renderFriendSection(<img src="/options.png" />, "查看全部")}
      </div>
    );
  };

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.container}>
        <div className={styles.containerLeft}>
          {friendList()}
          <div className={styles.copyright}>
            關於我們 · 隱私權條款 · Cookie 條款 · © 2023 CanChu, Inc.
          </div>
        </div>
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
            <Post
              showComments={false}
              showImage={false}
              key={data.id}
              data={data}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
