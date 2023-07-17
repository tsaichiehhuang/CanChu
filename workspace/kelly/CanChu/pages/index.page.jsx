import React from 'react'
import Home from './Home'
import LoginPage from './login/index.page'
import Cookies from 'js-cookie'

const accessToken = Cookies.get('accessToken')
const isLoggedIn = Boolean(accessToken)
export default function Index() {
  if (isLoggedIn) {
    return <Home />
  } else {
    return <LoginPage />
  }
}
