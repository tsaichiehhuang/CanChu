import React, { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Login from '@/components/Login'
import Cookies from 'js-cookie' // 導入 js-cookie

const apiUrl = process.env.API_DOMAIN

const LoginPage = () => {
  const router = useRouter()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault() //阻止表單的預設提交行為，避免頁面重新載入。

    // 從 emailRef 和 passwordRef 取得輸入欄位的值，並將其存儲在 email 和 password 變數中。
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
      // 使用 fetch 函式發送 POST 請求到指定的 API 端點，並傳遞 requestBody 作為請求體。
      const response = await fetch(`${apiUrl}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      // 使用 await 等待網路請求的回應，並將回應轉換為 JSON 格式的數據
      const responseData = await response.json()

      if (response.ok) {
        Cookies.set('accessToken', responseData.data.access_token)
        Cookies.set('userId', responseData.data.user.id) // 將使用者 ID 儲存在 Cookie 中

        router.push('/')
        window.location.reload() // 自動重新整理頁面
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

export async function getServerSideProps(context) {
  const { req, res } = context
  const accessToken = req.cookies.accessToken

  // 如果已登入，重回首頁
  if (accessToken) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return { props: {} }
  }

  // 如果未登入，允許訪問登入和註冊頁面
  return { props: {} }
}
