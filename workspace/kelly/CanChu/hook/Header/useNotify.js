import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

const apiUrl = process.env.API_DOMAIN

function useNotify() {
  const [notifyData, setNotifyData] = useState([])

  useEffect(() => {
    const fetchNotify = async () => {
      try {
        const accessToken = Cookies.get('accessToken')
        const res = await fetch(`${apiUrl}/events`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          }
        })
        const data = await res.json()
        setNotifyData(data?.data?.events || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchNotify()
  }, [])
  return { notifyData, setNotifyData }
}

export default useNotify
