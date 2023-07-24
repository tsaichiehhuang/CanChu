import React from 'react'
import App from 'next/app'
import fetchPostsData from '../api/fetchPostsData'
import '../styles/globals.css'

class MyApp extends App {
  static async getInitialProps(appContext) {
    // 在這裡處理自訂的預取數據
    const appProps = await App.getInitialProps(appContext)
    const apiUrl = process.env.API_DOMAIN
    const postData = await fetchPostsData() // 處理主頁的貼文數據

    return {
      ...appProps,
      apiUrl,
      postData
    }
  }

  render() {
    const { Component, pageProps, apiUrl, postData } = this.props
    return <Component {...pageProps} apiUrl={apiUrl} postData={postData} />
  }
}

export default MyApp
