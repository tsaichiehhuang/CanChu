import React, { useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from './user.module.scss'
import Header from '../components/Header'
import Post from '../Post/post'
import homeData from '../Home/components/HomeData'
import userData from './components/userData'

export default function User() {
  const router = useRouter()
  const user = userData()[0]
  const tags = user.tags
  const tagList = tags.split(',')
  const tagRefs = useRef([])
  const getTextWidth = (text, fontSize, fontFamily) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    context.font = `${fontSize} ${fontFamily}`
    return context.measureText(text).width
  }

  const setTagWidth = () => {
    tagRefs.current.forEach((tagRef) => {
      const { width } = window.getComputedStyle(tagRef)
      tagRef.style.width = width
    })
  }

  useEffect(() => {
    tagRefs.current.forEach((tagRef) => {
      const text = tagRef.textContent
      const fontSize = '16px' // 标签文本的字体大小
      const fontFamily = 'Outfit' // 标签文本的字体
      const width = getTextWidth(text, fontSize, fontFamily)
      tagRef.style.width = `${width}px`
    })
  }, [])

  const Introduction = () => (
    <div className={styles.introductionSquare}>
      <button className={styles.introductionButton}>編輯個人檔案</button>

      <div className={styles.introductionContent}>
        <div className={styles.introductionContentTitle}>自我介紹</div>
        <div className={styles.introductionContentText}>
          {user.introduction}
        </div>
      </div>
      <div className={styles.introductionContent}>
        <div className={styles.introductionContentTitle}>興趣</div>
        <div className={styles.introductionContentTag}>
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
    <div className={styles.body}>
      <Header />
      <div className={styles.allContainer}>
        <div className={styles.cover}>
          <div className={styles.coverTop}>
            <img
              className={styles.userHeadshot}
              src={user.picture}
              alt='大頭貼'
            />
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
            <Introduction />
            <div className={styles.copyright}>
              關於我們 · 隱私權條款 · Cookie 條款 · © 2023 CanChu, Inc.
            </div>
          </div>
          <div className={styles.containerRight}>
            <div className={styles.posting}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <img className={styles.postingPhoto} src={user.picture} />
                <div className={styles.postingText}>說點什麼嗎？</div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end'
                }}
              >
                <button className={styles.postingButton}>發布貼文</button>
              </div>
            </div>
            {homeData().map((data) => (
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
    </div>
  )
}
