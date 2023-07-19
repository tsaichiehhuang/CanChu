import React from 'react'
import Post from '../Post'
import MockData from '../../data/mockData'
import Header from '../../components/Header'
import Cookies from 'js-cookie'

const apiUrl = process.env.API_DOMAIN

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

// export async function getServerSideProps(context) {
//   const accessToken = Cookies.get('accessToken')

//   // // 如果未登入，重定向到登入頁面
//   // if (!accessToken) {
//   //   return {
//   //     redirect: {
//   //       destination: '/login',
//   //       permanent: false
//   //     }
//   //   }
//   // }

//   // const { params } = context
//   // const { id } = params
//   const res = await fetch(`${apiUrl}/posts/${context.params.id}`, {
//     method: 'GET',
//     headers: {
//       Authorization: `Bearer ${accessToken}`
//     }
//   })
//   const data = await res.json()

//   return {
//     props: {
//       profile: data.data.post
//     }
//   }
// }
