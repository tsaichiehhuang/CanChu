import React, { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Login from '../components/Login'
import ProtectedPage from '../components/ProtectedPage.js'

const apiUrl = process.env.API_DOMAIN

const LoginPage = () => {
  const router = useRouter()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      router.replace('/Home/home') // 已登入，重定向到其他頁面
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault() //阻止表單的預設提交行為，避免頁面重新載入。

    //從 emailRef 和 passwordRef 取得輸入欄位的值，並將其存儲在 email 和 password 變數中。
    const email = emailRef.current?.value
    const password = passwordRef.current?.value

    // 檢查是否不為空
    if (!email || !password) {
      console.error('電子郵件和密碼為必填字段')
      return
    }

    const requestBody = {
      provider: 'native',
      email,
      password
    }

    try {
      //使用 fetch 函式發送 POST 請求到指定的 API 端點，並傳遞 requestBody 作為請求體。
      const response = await fetch(`${apiUrl}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
      //使用 await 等待網路請求的回應，並將回應轉換為 JSON 格式的數據
      const responseData = await response.json()

      if (response.ok) {
        // 登入成功，儲存token
        console.log(responseData)
        localStorage.setItem('accessToken', responseData.data.access_token)
        router.push('/') // 導去首頁
      } else if (response.status === 403) {
        //403 Forbidden 狀態碼，表示用戶認證失敗
        console.error(responseData.error)
      } else {
        console.error(responseData.error)
      }
    } catch (error) {
      console.error('網路請求錯誤', error)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Login
          statusLogin={true}
          emailRef={emailRef}
          passwordRef={passwordRef}
        />
      </form>
    </div>
  )
}

export default LoginPage
