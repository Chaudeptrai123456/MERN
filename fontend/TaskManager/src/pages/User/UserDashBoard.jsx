import React from 'react'
import { useUserAuth } from '../../hooks/useUseAuth'

const UserDashBoard = () => {
  useUserAuth()
  return (
    <div>UserDashBoard</div>
  )
}

export default UserDashBoard