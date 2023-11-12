import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'

const apiUrl = process.env.API_DOMAIN

function useSearchUsers() {
  const searchUsers = async (keywords) => {
    try {
      const accessToken = Cookies.get('accessToken')
      const res = await fetch(`${apiUrl}/users/search?keyword=${keywords}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      const data = await res.json()
      return data.data.users
    } catch (error) {
      console.error('Error fetching search results:', error)
      return []
    }
  }

  return { searchUsers }
}

export default useSearchUsers
