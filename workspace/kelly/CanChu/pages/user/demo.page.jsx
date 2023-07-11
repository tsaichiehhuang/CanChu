import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import styles from './Home.module.scss'

import Header from '../components/Header'
import Post from '../Post/post'
import homeData from './components/HomeData'

export default function Home() {
  const router = useRouter()

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.container}>
        <div className={styles.containerLeft}>
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
              <Image className={styles.postingPhoto} src="/個人照片.png" />

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
  )
}
