import React from 'react'
import Post from '../Post'
import MockData from '../Post/mockData'
import Header from '../../components/Header'

export default function Demo() {
  return (
    <div>
      <Header />
      <Post
        data={MockData[0]}
        showComments={true}
        showImage={true}
        showEditIcon={false}
      />
    </div>
  )
}

export async function getServerSideProps(context) {
  const { req, res } = context
  const accessToken = req.cookies.accessToken

  // 如果未登入，重定向到登入頁面
  if (!accessToken) {
    res.writeHead(302, { Location: '/login' })
    res.end()
    return { props: {} }
  }

  // 如果已登入，可以在這裡執行其他操作，例如獲取用戶資料或其他資料

  return {
    props: {}
  }
}
