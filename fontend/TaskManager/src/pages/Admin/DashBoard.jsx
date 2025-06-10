import React, { useContext, useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUseAuth'
import { UserContext } from '../../context/userContext'
import DashBoardLayout  from '../../components/layouts/DashBoardLayout'
import { data, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import moment from 'moment' // Import default export
import InfoCards from '../../components/Cards/InfoCards'
import { IoMdCar } from 'react-icons/io'; // <-- Thêm dòng này
import { addThousandsSeparator } from '../../utils/helper'
import TaskListTable from '../../components/layouts/TaskListTable'
import CustomPieChart from '../../components/Charts/CustomPieChart'
import CustomBarChart from '../../components/Charts/CustomBarChart'
const COLORS = ["#8D51FF","#00B8DB","#7BCE00","#FF0000"]
import { formatDate } from '../../utils/helper';
import { getOrdinalSuffix } from '../../utils/helper';
const DashBoard = () => {
  useUserAuth()
  const {user} = useContext(UserContext)
  const navigate = useNavigate()
  const [dashBoardData,setDashBoardData] = useState(null)
  const [pieChartData, setPieChartData] = useState([]);
  const [barCharttData, setBarCharData] = useState([])
  const [tasks,setTasks] = useState([{}])
  // const [member,setMember] = useState([])
  const getDashBoardData = async() =>{
    try{
      const response = await axiosInstance.get(API_PATHS.TASK.GET_DASHBOARD_DATA);
      if (response) {
        setDashBoardData(response.data)
        prepareChartData(response.data?.charts || null)
      }
      getAllTask()
    } catch(error){
      console.log(error)
    }
  }
  const getAllTask = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASK.GET_ALL_TASK);
      setTasks(res.data.tasks); 
    } catch (err) {
      console.log("Error fetching all tasks:", err);
    }
  };

const prepareChartData = (data) => {
  const taskDistribution = data?.taskDistribution || null;
  const taskPriorityLevels = data?.taskProritiesLevels || null;
  const taskDistributionData = [
    { status: "Pending", count: taskDistribution?.Pending || 0 },
    { status: "In Progress", count: taskDistribution?.InProgress || 0 },
    { status: "Completed", count: taskDistribution?.Completed || 0 },
    { status : "Over Due" , count: dashBoardData?.statistics?.overdueTask ||0}
  ];

  setPieChartData(taskDistributionData);
  const PriorityLevelData = [
    { priority: "Low", count: taskPriorityLevels?.Low || 0 },
    { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
    { priority: "High", count: taskPriorityLevels?.High || 0 },
  ];

  setBarCharData(PriorityLevelData);
};
  // useEffect(() => {
  //   console.log("Tasks state after update:", tasks);
  // }, [tasks]); 

  useEffect(()=>{
    getDashBoardData();
    return ()=>{};
  },[])
  const onSeeMore = ()=>{
    navigate('/admin/tasks')
  }
//   return (
//     <DashBoardLayout activeMenu="DashBoard" > 
//         {/* {JSON.stringify(user.name)} */}
//       <div className='card my-5'>
//         <div className=''>
//           <div className='col-span-3'>
//             <h2 className='text-xl md:text-2xl'>Morning! {user?.name || ""}</h2>
//             <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
//                 {moment().format("dddd Do MMM YYYY")}
//            </p>
//           </div>
//         </div>
//         <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5'>
//           <InfoCards
//           icon={<IoMdCar />}
//           label = "Total Task"
//           value = {addThousandsSeparator(
//             dashBoardData?.charts?.taskDistribution?.All || 0
//           )}
//           color="bg-primary"
//           />
//           <InfoCards
//           icon={<IoMdCar />}
//           label = "Pending Tasks"
//           value = {addThousandsSeparator(
//             dashBoardData?.charts?.taskDistribution?.Pending || 0
//           )}
//           color="bg-violet-500"
//           />
//           <InfoCards
//           icon={<IoMdCar />}
//           label = "In grogress Tasks"
//           value = {addThousandsSeparator(
//             dashBoardData?.charts?.taskDistribution?.InProgress || 0
//           )}
//           color="bg-cyan-500"
//           />
//                     <InfoCards
//           icon={<IoMdCar />}
//           label = "Completed Tasks"
//           value = {addThousandsSeparator(
//             dashBoardData?.charts?.taskDistribution?.Completed || 0
//           )}
//           color="bg-lime-500"
//           />
//         </div>
//       </div>
//       <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6  ' >
//         <div>
//           <div className='card'>
//             <div className='flex items-center justify-between'>
//               <h5 className='font-medium'>Task Distribution</h5>
//             </div>
//             <CustomPieChart 
//               data={pieChartData}
//               label="Total Balance"
//               colors = {COLORS}
//             />
//           </div>
//         </div>
//         <div>
//           <div className='card'>
//             <div className='flex items-center justify-between'>
//               <h5 className='font-medium'>Task Priority Levels</h5>
//             </div>
//             <CustomBarChart
//               data={barCharttData}
//             />
//           </div>
//         </div>


//         <div className='md:col-span-2 h-100vh'>
//           <div className='card'>
//             <div className='flex items-center justify-between'>
//               <h5 className='text-lg'>
//                 Recent Task
//               </h5>
//               {/* <button className='card-btn' onClick={onSeeMore}>
//                 See All <LuSquareArrowRight className='text-base'/>
//               </button> */}
//               <button className='flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer' onClick={onSeeMore}>
//                   See All
//                 <svg className='ml-1 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'></path></svg>
//               </button>
//             </div>
//             <TaskListTable tableData={dashBoardData?.recentTasks || []} alltasks = {tasks}/>
//           </div>
//         </div>
//       </div>
//     </DashBoardLayout>
//   )
// }
return(
   <DashBoardLayout activeMenu="DashBoard" > 
    {/* {JSON.stringify(dashBoardData)} */}
      <div className='card my-5'>
        <div>
          <div className='col-span-3'>
            <h2 className='text-xl md:text-2xl'>Morning! {user?.name || ""}</h2>
            <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
               {formatDate(new Date())} {/* Sử dụng hàm formatDate cho ngày hiện tại */}
            </p>
          </div>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3 md:gap-6 mt-5'>
          {/* Lưu ý: Nếu react-icons/io không được cài đặt, lỗi sẽ xuất hiện. */}
          {/* Để tránh lỗi, có thể thay thế icon bằng <span>&#9733;</span> hoặc đảm bảo cài đặt react-icons */}
          <InfoCards
            icon={<IoMdCar />} 
            label = "Total Task"
            value = {addThousandsSeparator(
              dashBoardData?.statistics?.totalTask || 0 
            )}
            color="bg-primary"
          />
          <InfoCards
            icon={<IoMdCar />}
            label = "Pending Tasks"
            value = {addThousandsSeparator(
              dashBoardData?.statistics?.pendingTask || 0 
            )}
            color="bg-violet-500"
          />
          <InfoCards
            icon={<IoMdCar />}
            label = "In progress Tasks"
            value = {addThousandsSeparator(
            dashBoardData?.statistics?.inProcessTask || 0 

            )}
            color="bg-cyan-500"
          />
  
          <InfoCards
            icon={<IoMdCar />}
            label = "Completed Tasks"
            value = {addThousandsSeparator(
              dashBoardData?.statistics?.completeTask || 0 
            )}
            color="bg-lime-500"
          />
          <InfoCards
            icon={<IoMdCar />}
            label = "Overdue Task"
            value = {addThousandsSeparator(
            dashBoardData?.statistics?.overdueTask || 0 

            )}
            color="bg-red-500"
          />
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>
        <div>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='font-medium'>Task Distribution</h5>
            </div>
            <CustomPieChart 
              data={pieChartData}
              label="Total Balance"
              colors = {COLORS}
            />
          </div>
        </div>
        <div>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='font-medium'>Task Priority Levels</h5>
            </div>
            <CustomBarChart
              data={barCharttData}
            />
          </div>
        </div>

        <div className='md:col-span-2'>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='text-lg'>
                Recent Task
              </h5>
              <button className='flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer' onClick={onSeeMore}>
                  See All
                <svg className='ml-1 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'></path></svg>
              </button>
            </div>
            {/* Thay thế dashBoardData?.recentTasks || [] bằng tasks để hiển thị tất cả task */}
            <TaskListTable tableData={tasks} alltasks={tasks}/>
          </div>
        </div>
      </div>
    </DashBoardLayout>
  )
}

export default DashBoard