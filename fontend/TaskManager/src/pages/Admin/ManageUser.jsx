import React, { useEffect, useState } from 'react'
import DashBoardLayout from '../../components/layouts/DashBoardLayout'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { LuFileSpreadsheet } from 'react-icons/lu'
import UserCard from '../../components/Cards/UserCard'
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
  const handleDonwloadReport = async()=>{
    try {
      const response = await axiosInstance.get(API_PATHS.REPORT.EXPORT_USER,{
        responseType:'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href=url
      link.setAttribute('download','users_details.xlsx')
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    }catch(err) {
      setError(err)
    }
  }

  return (
    <DashBoardLayout activeMenu="Team Members" > 
      <div className='mt-5 mb-10'>
              <div className='flex items-center justify-between gap-3'>
                <h2 className='text-xl md:text-xl font-medium'>My Tasks</h2>
                  <button
                    className='lg:flex download-btn'
                    onClick={handleDonwloadReport}
                  >
                    <LuFileSpreadsheet  className='text-lg'/>
                    Download Report
                  </button>
              </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4' >
            {allUser?.map((user)=>{
              return <UserCard key={user._id} userInfo={user}/>
            })}
        </div>
      </div>

    </DashBoardLayout>
  )
}

export default ManageUser