import React from 'react'

const UserCard = ({userInfo}) => {
  return (
    <div className='user-card p-2'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <img
                    src={userInfo?.profileImageUrl || 0}
                    alt={`Avatar`}
                    className='w-12 h-12 rounded-full border-2 border-white'
                />
                <div>
                    <p className='text-sm font-medium'>{userInfo?.name}</p>
                    <p className='text-xs text-gray-500'>{userInfo?.email}</p>
                </div>
            </div>
        </div>
        <div className='flex items-end gap-3 mt-5'>
            <StartCard
             label="Pending"
             count={userInfo?.pendingTasks || 0}
             status="Pending"
             />
                 <StartCard
             label="In Progress"
             count={userInfo?.inProcessTasks || 0}
             status="In Progress"
             />
                 <StartCard
             label="Completed"
             count={userInfo?.completeTasks || 0}
             status="Completed"
             />
        </div>
    </div>
  )
}

export default UserCard
const StartCard = ({label, count, status}) => {
  const getStatusTagColor= ()=>{
    switch(status) {
        case 'In Progress':
            return "text-cyan-500 bg-cyan-50 border border-cyan-500/10"        
        case 'Completed' :
            return "text-lime-500 bg-lime-50 border border-lime-500/10"
        default:
            return "text-violet-500 bg-violet-50 border border-violet-500/10"
    }
  }
  const getProrityTagColor = ()=>{
    switch(priority) {
        case 'Low':
            return 'text-emerald-500 bg-emerald-50 border border-emerald-500/10'
        case 'Medium' :
            return  'text-amber-500 bg-amber-50 border border-amber-500/10'
        default:
            return 'text-rose-500 bg-rose-50 border border-rose-500/10'
    }
  }
  return (
    <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
        <span className='text-[12px] font-semibold'>{count}</span><br />{label}
    </div>
  )
}