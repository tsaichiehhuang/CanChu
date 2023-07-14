import React, { useRef, useEffect, useState } from 'react'
import ProtectedPage from '../../components/ProtectedPage'
import styles from './user.module.scss'
import Header from '../../components/Header'
import Post from '../Post'
import homeData from '../Home/HomeData'
import userData from './userData'
import Copyright from '../../components/Copyright'
import PostCreator from '../../components/PostCreator'

export default function User() {
  const user = userData()[0]
  const tags = user.tags
  const tagList = tags.split(',')
  const tagRefs = useRef([])

  useEffect(() => {
    const setTagWidth = () => {
      tagRefs.current.forEach((tagRef) => {
        const { width } = window.getComputedStyle(tagRef)
        tagRef.style.width = width
      })
    }

    tagRefs.current.forEach((tagRef) => {
      const text = tagRef.textContent
      const fontSize = '16px' // 标签文本的字体大小
      const fontFamily = 'Outfit' // 标签文本的字体
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      context.font = `${fontSize} ${fontFamily}`
      const width = context.measureText(text).width + 4
      tagRef.style.width = `${width}px`
    })

    setTagWidth()
  }, [])

  const Profile = () => (
    <div className={styles.profileSquare}>
      <button className={styles.profileButton}>編輯個人檔案</button>

      <div className={styles.profileContent}>
        <div className={styles.profileContentTitle}>自我介紹</div>
        <div className={styles.profileContentText}>{user.introduction}</div>
      </div>
      <div className={styles.profileContent}>
        <div className={styles.profileContentTitle}>興趣</div>
        <div className={styles.profileContentTag}>
          {tagList.map((tag, index) => (
            <div
              key={index}
              className={styles.tag}
              ref={(el) => {
                tagRefs.current[index] = el
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <ProtectedPage>
      <div className={styles.body}>
        <style global jsx>{`
          body {
            background: #f9f9f9;
            margin: 0;
          }
        `}</style>
        <Header />
        <div className={styles.allContainer}>
          <div className={styles.cover}>
            <div className={styles.coverTop}>
              <div className={styles.userHeadshotWrapper}>
                <img className={styles.userHeadshot} src={user.picture} />
              </div>
              <div className={styles.coverTopRight}>
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userFriendCount}>
                  {user.friend_count}位朋友
                </div>
              </div>
            </div>
            <div
              style={{ width: '80%', height: '1px', background: '#C8C8C8' }}
            ></div>
            <div className={styles.coverFunction}>
              <div className={styles.coverFunctionText}>貼文</div>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.containerLeft}>
              <Profile />
              <div style={{ width: '274px', marginLeft: '10%' }}>
                <Copyright />
              </div>
            </div>
            <div className={styles.containerRight}>
              <PostCreator />

              {homeData().map((data) => (
                <Post
                  showComments={false}
                  showImage={false}
                  showEditIcon={true}
                  key={data.id}
                  data={data}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  )
}
