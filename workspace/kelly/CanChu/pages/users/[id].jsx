import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import styles from './user.module.scss'
import Header from '@/components/Header'
import Post from '@/components/Post'
import Copyright from '@/components/Copyright'
import PostCreator from '@/components/PostCreator'
import Profile from '@/components/Profile'
import useFetchUserProfile from '@/hook/useFetchUserProfile'
import IsPictureUrlOk from '@/components/IsPictureUrlOk'
import { useRouter } from 'next/router'
import useUpdateUserPicture from '@/hook/User/useUpdateUserPicture'
import useInfiniteScroll from '@/hook/useInfiniteScroll'
import useUserPost from '@/hook/User/useUserPost'

const userId = Cookies.get('userId')

export default function User() {
  const router = useRouter()
  const { id } = router.query
  // 獲取當前用戶是否為自己的個人頁面
  const isSelf = userId === id

  const { userState, updateUserState } = useFetchUserProfile(id)
  const { userState: user } = useFetchUserProfile(userId) //登入者本人
  const { setSelectedPicture, uploadPicture } = useUpdateUserPicture()
  const { postData, fetchNextUserPosts } = useUserPost(id)

  //上傳圖片
  const handlePictureUpload = async (event) => {
    const file = event.target.files[0]
    setSelectedPicture(file)
    const pictureUrl = await uploadPicture(file)
    if (pictureUrl) {
      // 更新用戶的圖片
      const updatedUser = { ...userState, picture: pictureUrl }
      updateUserState(updatedUser)
      // 更新頭像的 src 屬性
      const headshotImage = document.querySelector(`.${styles.userHeadshot}`)
      if (headshotImage) {
        headshotImage.src = pictureUrl
      }
      alert('圖片上傳成功')
    }
  }
  useInfiniteScroll(fetchNextUserPosts, 100)
  return (
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
              <IsPictureUrlOk
                className={styles.userHeadshot}
                userState={userState}
              />

              <div className={styles.userHeadshotText}>
                編輯大頭貼
                <input
                  style={{ cursor: 'pointer', fontSize: '0' }}
                  type='file'
                  accept='.png, .jpg, .jpeg'
                  className={styles.userHeadshotInput}
                  onChange={handlePictureUpload}
                />
              </div>
            </div>
            <div className={styles.coverTopRight}>
              <div className={styles.userName}>{userState.name}</div>

              <div className={styles.userFriendCount}>
                {userState.friend_count}位朋友
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
            <Profile
              updateUserState={updateUserState}
              userState={userState} // 將獲取到的 userState 傳遞給 Profile 元件
              isSelf={isSelf}
            />
            <div style={{ width: '274px', marginLeft: '10%' }}>
              <Copyright />
            </div>
          </div>
          <div className={styles.containerRight}>
            {isSelf && <PostCreator />}

            {postData.map((data) => (
              <Post
                userState={user}
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
  )
}
export async function getServerSideProps(context) {
  const { req, res } = context
  const accessToken = req.cookies.accessToken

  if (!accessToken) {
    res.writeHead(302, { Location: '/login' })
    res.end()
    return { props: {} }
  }

  return { props: {} }
}
