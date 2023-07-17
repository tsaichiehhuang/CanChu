// import React, { useEffect } from 'react'
// import { useRouter } from 'next/router'

// const ProtectedPage = ({ children }) => {
//   const router = useRouter()

//   useEffect(() => {
//     // 檢查是否有登入
//     const accessToken = localStorage.getItem('accessToken')
//     if (!accessToken) {
//       // 未登入，重新導向登入頁面
//       router.push('/login')
//     } else {
//       // 已登入，禁止返回登錄或註冊頁面
//       const currentPath = router.asPath
//       if (currentPath === '/login' || currentPath === '/signup') {
//         router.push('/Home/home') // 重定向到其他頁面，如主頁
//       }
//     }
//   }, [router])

//   return <>{children}</>
// }

// export default ProtectedPage
