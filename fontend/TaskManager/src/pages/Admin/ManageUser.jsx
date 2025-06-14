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
  const handleDonwloadReport = async()=>{}
  return (
    <DashBoardLayout activeMenu="Team Members" > 
      <div className='mt-5 mb-10'>
              <div className='flex items-center justify-between gap-3'>
                <h2 className='text-xl md:text-xl font-medium'>My Tasks</h2>
                  <button
                    className='lg:flex download-btn'
                    onClick={handleDonwloadReport}
                  >
                    Download Report
                  </button>
              </div>
        <div className=''>

        </div>
      </div>

    </DashBoardLayout>
  )
}

export default ManageUser