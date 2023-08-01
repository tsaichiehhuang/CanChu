import React, { useState } from 'react'
import Cookies from 'js-cookie'
import styles from './Header.module.scss'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useNotify from '@/hook/Header/useNotify'
import getTimeDiff from '../getTimeDiff'

export default function Notification() {
  const { notifyData } = useNotify()
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [showProfileOptions, setShowProfileOptions] = useState(false)
  const handleProfileMouseEnter = () => {
    setShowProfileOptions(true)
  }

  const handleProfileMouseLeave = () => {
    setShowProfileOptions(false)
  }
  const handleShowAllNotifications = () => {
    setShowAllNotifications(!showAllNotifications)
  }
  return (
    <div
      className={styles.notification}
      onMouseEnter={handleProfileMouseEnter}
      onMouseLeave={handleProfileMouseLeave}
    >
      <img src='./通知.png' />
      {showProfileOptions && (
        <div className={styles.notifyOptions}>
          <div className={styles.notifyFirst}>
            <img src='./通知反白.png' />
            我的通知
          </div>
          <div
            className={`${showAllNotifications ? styles.notifyContainer : ''}`}
            // style={{ maxHeight: showAllNotifications ? '260px' : '108px' }}
          >
            {showAllNotifications
              ? Array.isArray(notifyData) &&
                notifyData.map((notification) => (
                  <>
                    <div
                      style={{
                        width: '90%',
                        height: '1px',
                        background: '#D1CACE',
                        margin: '0px 10px'
                      }}
                    ></div>
                    <div key={notification.id} className={styles.notifyOption}>
                      <div className={styles.notifyText}>
                        {' '}
                        {notification.summary}
                      </div>
                      <div className={styles.notifyTime}>
                        {getTimeDiff(new Date(notification.created_at))}
                      </div>
                    </div>
                  </>
                ))
              : Array.isArray(notifyData) &&
                notifyData.slice(0, 4).map((notification) => (
                  <>
                    <div
                      style={{
                        width: '90%',
                        height: '1px',
                        background: '#D1CACE',
                        margin: '0px 10px'
                      }}
                    ></div>
                    <div key={notification.id} className={styles.notifyOption}>
                      <div className={styles.notifyText}>
                        {' '}
                        {notification.summary}
                      </div>
                      <div className={styles.notifyTime}>
                        {getTimeDiff(new Date(notification.created_at))}
                      </div>
                    </div>
                  </>
                ))}
          </div>
          <div
            style={{
              width: '90%',
              height: '1px',
              background: '#D1CACE',
              margin: '0px 10px'
            }}
          ></div>
          <div
            className={styles.notifyLast}
            onClick={handleShowAllNotifications}
            style={{ textDecoration: 'underline' }}
          >
            {showAllNotifications ? '收起通知' : '查看全部通知'}
          </div>
        </div>
      )}
    </div>
  )
}
