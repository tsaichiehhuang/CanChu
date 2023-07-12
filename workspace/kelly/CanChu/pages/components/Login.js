import React from 'react'
import { useRouter } from 'next/router'
import styles from './login.module.scss'
import Link from 'next/link'

export default function Login({ statusLogin = true }) {
  const inputInfo = (title, text) => (
    <div className={styles.inputGroup}>
      <div className={styles.inputTitle}>{title}</div>
      <div className={styles.inputText}>{text}</div>
    </div>
  )
  return (
    <div className={styles.body}>
      <div className={!statusLogin ? styles.signupSquare : styles.loginSquare}>
        <div
          className={
            !statusLogin ? styles.signupSquareLeft : styles.loginSquareLeft
          }
        >
          <div className={styles.logo}>CanChu</div>
          {statusLogin ? (
            <div className={styles.title}>會員登入</div>
          ) : (
            <div className={styles.title}>會員註冊</div>
          )}
          {statusLogin ? (
            <div className={styles.inputSquare}>
              {inputInfo('電子郵件', '例: shirney@appworks.tw')}
              {inputInfo('密碼', '')}
            </div>
          ) : (
            <div className={styles.inputSquare}>
              {inputInfo('使用者名稱', '例: Chou Chou Hu')}
              {inputInfo('電子郵件', '例: shirney@appworks.tw')}
              {inputInfo('密碼', '')}
              {inputInfo('再次輸入密碼', '')}
            </div>
          )}
          {statusLogin ? (
            <button className={styles.loginButton}>登入</button>
          ) : (
            <button className={styles.loginButton}>註冊</button>
          )}
          {statusLogin ? (
            <div>
              尚未成為會員?{' '}
              <Link
                href='/signup'
                style={{ color: '#5458F7', textDecoration: 'none' }}
              >
                會員註冊
              </Link>
            </div>
          ) : (
            <div>
              已經是會員了?{' '}
              <Link
                href='/login'
                style={{ color: '#5458F7', textDecoration: 'none' }}
              >
                會員登入
              </Link>
            </div>
          )}
        </div>
        <div
          className={
            !statusLogin ? styles.signupSquareRight : styles.loginSquareRight
          }
        ></div>
      </div>
    </div>
  )
}
