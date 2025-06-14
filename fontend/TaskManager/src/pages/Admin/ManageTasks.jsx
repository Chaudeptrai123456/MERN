import React, { useEffect, useState } from 'react'
import DashBoardLayout  from '../../components/layouts/DashBoardLayout'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { useNavigate } from 'react-router-dom'
import { LuFileSpreadsheet } from 'react-icons/lu'
import TaskStatusTabs from '../../components/layouts/TaskStatusTabs'
import TaskCard from '../../components/Cards/TaskCard'
const ManageTasks = () => {
  const [allTasks,setAllTasks] = useState([])
  const [tabs,setTabs] = useState([])
  const [filterStatus,setFilterStatus]= useState("All")
  const navigate = useNavigate()
  const [error,setError] = useState("")
  const STATUS_MAP = {
  "All": "",
  "Pending Tasks": "Pending",
  "In Process Tasks": "In Progress",
  "Completed Tasks": "Completed"
};

const getAllTask = async () => {
  try {
  const response = await axiosInstance.get(API_PATHS.TASK.GET_ALL_TASK, {
      params: {
        status: STATUS_MAP[filterStatus] ?? ""
      }
    });
    const tasks = (response.data?.tasks || []).map(task => {
        // Normalize checklist key
        const todoChecklist = task.todoCheckList || task.todoChecklist || []
        // Calculate completed count
        const completedTodoCount = Array.isArray(todoChecklist)
          ? todoChecklist.filter(todo => todo.completed).length
          : 0
        return {
          ...task,
          todoChecklist,           // always as array
          completedTodoCount       // always as number
        }
      })
    setAllTasks(tasks.length > 0 ? tasks : []);
    const statusSummary = response.data?.statusSummary || {};
    const statusArr = [
      { name: "All", count: statusSummary.all || 0 },
      { name: "Pending Tasks", count: statusSummary.pendingTasks || 0 },
      { name: "In Process Tasks", count: statusSummary.inProcessTasks || 0 },
      { name: "Completed Tasks", count: statusSummary.completedTasks || 0 },
    ];
    setTabs(statusArr);
  } catch (err) {
    setError(err.message || "Unknown error");
  }
};
  //taskData._id
  const handleClick= async(taskData)=>{
    navigate('/admin/createtask',{state:{taskId:taskData._id}});
  }
  const handleDownloadReport = async ()=>{
    
  }
useEffect(() => {
  getAllTask()
}, [filterStatus])
  return (
       <DashBoardLayout activeMenu="Manage Task" >
          <div className='my-5'>  
            <div className='flex flex-col lg:item-center justify-between'> 
              <div className='flex items-center justify-between gap-3'>
                <h2 className='text-xl md:text-xl font-medium'>My Tasks</h2>
                  <button
                    className='hidden lg:flex download-btn'
                    onClick={handleDownloadReport}
                  >
                    <LuFileSpreadsheet className='text-lg'/>
                    Download Report
                  </button>
              </div>

              {tabs?.[0]?.count  > 0 && (
                  <div className='flex items-center justify-between gap-3'>
                      <TaskStatusTabs
                      tabs={tabs}
                      activeTab={filterStatus}
                      setActiveTab = {setFilterStatus}
                      />
                      <button className='hidden mg:flex download-btn' onClick={handleDownloadReport}>
                        <LuFileSpreadsheet className='text-lg'/>
                        Donwload Report
                      </button>
                  </div>
              )}

            </div>  
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                          {allTasks?.map((item, index) => (
    <TaskCard
      key={item._id}
      title={item.title}
      description={item.description}
      priority={item.priority}
      status={item.status}
      progress={item.process}
      createdAt={item.createdAt}
      dueDate={item.dueDate}
      assignedTo={item.assignedTo?.map((assignee) => assignee.profileImageUrl)}
      attachmentCount={item.attachments?.length || 0}
      completedTodoCount={item.completedTodoCount || 0}
      todoChecklist={item.todoChecklist || []}
      onClick={() => {
        handleClick(item);
      }}
    />
  ))}
            </div>

          </div>

       </DashBoardLayout>
  )

}

export default ManageTasks