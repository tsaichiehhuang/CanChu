import React from 'react'
import ProtectedPage from '../components/ProtectedPage.js'
import Post from '../Post/post'
import MockData from '../Post/components/mockData'
import Header from '../components/Header'

export default function Demo() {
  return (
    <ProtectedPage>
      <div>
        <Header />
        <Post
          data={MockData[0]}
          showComments={true}
          showImage={true}
          showEditIcon={false}
        />
      </div>
    </ProtectedPage>
  )
}
