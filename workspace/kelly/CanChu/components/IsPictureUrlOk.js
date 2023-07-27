import React, { useState, useEffect } from 'react'

const IsPictureUrlOk = ({ userState, className }) => {
  // 獲得資料之後再判斷圖片網址
  const [userDataLoaded, setUserDataLoaded] = useState(false) //用於標記是否已獲取用戶資料
  const [userPicture, setUserPicture] = useState('')

  useEffect(() => {
    if (userState.picture) {
      const img = new Image()
      img.onload = function imgOnLoad() {
        setUserPicture(userState.picture)
        setUserDataLoaded(true)
      }
      img.onerror = function imgOnError() {
        setUserPicture('/個人照片.png')
        setUserDataLoaded(true)
      }

      img.src = userState.picture
    } else {
      setUserPicture('/個人照片.png')
      setUserDataLoaded(true)
    }
  }, [userState.picture])

  return <img className={className} src={userPicture} alt='User' />
}

export default IsPictureUrlOk
