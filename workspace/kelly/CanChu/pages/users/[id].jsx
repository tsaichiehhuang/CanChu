import React from 'react'
import Cookies from 'js-cookie'
import styles from './user.module.scss'
import Header from '@/components/Header'
import Post from '@/components/Post'
import Copyright from '@/components/Copyright'
import PostCreator from '@/components/PostCreator'
import Profile from '@/components/Profile'
import useFetchUserProfile from '@/hook/useFetchUserProfile'
import { useRouter } from 'next/router'
import useInfiniteScroll from '@/hook/useInfiniteScroll'
import useUserPost from '@/hook/User/useUserPost'
import PictureUpload from './PictureUpload'

const userId = Cookies.get('userId')

export default function User() {
  const router = useRouter()
  const { id } = router.query
  const isSelf = userId === id

  const { userState, updateUserState } = useFetchUserProfile(id)
  const { userState: user } = useFetchUserProfile(userId) //登入者本人
  const { postData, fetchNextUserPosts } = useUserPost(id)

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
            <PictureUpload
              userState={userState}
              updateUserState={updateUserState}
            />
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
              userState={userState}
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
