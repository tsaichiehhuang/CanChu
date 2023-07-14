import React from 'react'
import App from 'next/app'

class MyApp extends App {
  static async getInitialProps(appContext) {
    const appProps = await App.getInitialProps(appContext)

    return {
      ...appProps,
      apiUrl: process.env.API_DOMAIN
    }
  }

  render() {
    const { Component, pageProps, apiUrl } = this.props

    return <Component {...pageProps} apiUrl={apiUrl} />
  }
}

export default MyApp
