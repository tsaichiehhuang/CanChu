import React from 'react'
import Login from '../components/Login'

export default function LoginPage() {
  return (
    <div>
      <Login statusLogin={true} showImage={true} showEditIcon={false} />
    </div>
  )
}
