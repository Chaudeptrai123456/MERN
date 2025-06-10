import React, { useEffect, useState } from 'react'
import DashBoardLayout  from '../../components/layouts/DashBoardLayout'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
const ManageTasks = () => {
 
  return (
       <DashBoardLayout activeMenu="Manage Task" >
          Manage Tasks  
       </DashBoardLayout>
  )

}

export default ManageTasks