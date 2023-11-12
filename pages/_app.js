import React from 'react'
import App from 'next/app'

import '../styles/globals.css'
import '../styles/quill-custom-style.css'

class MyApp extends App {
  static async getInitialProps(appContext) {
    // 在這裡處理自訂的預取數據
    const appProps = await App.getInitialProps(appContext)
    const apiUrl = process.env.API_DOMAIN

    return {
      ...appProps,
      apiUrl
    }
  }

  render() {
    const { Component, pageProps, apiUrl } = this.props
    return <Component {...pageProps} apiUrl={apiUrl} />
  }
}

export default MyApp
