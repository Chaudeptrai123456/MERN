import React, { useEffect, useState } from 'react'
import DashBoardLayout from '../../components/layouts/DashBoardLayout'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'

const ManageUser = () => {
  const [allUser,setAllUser] = useState([])
  const [error,setError] = useState("")
  const getAllUser= async()=>{
    try {
      const allUser = await axiosInstance.get(API_PATHS.USER.GET_ALL_USERS);
      if (allUser.data?.length >0) {
        setAllUser(allUser.data)
      }
    }catch(error) {
      setError(error)
    }
  }
  useEffect(()=>{
    getAllUser()
    return ()=>{}
  },[])
  return (
    <DashBoardLayout activeMenu="Team Members" > 
    {JSON.stringify(allUser)}
      ManageUsers       
    </DashBoardLayout>
  )
}

export default ManageUser