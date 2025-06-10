import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment';
import TaskDataTooltip from './TaskDataTooltip';
import { formatDate } from '../../utils/helper';
import TaskDetailModal from './TaskDetailModal';
// const TaskListTable = ({tableData,alltasks}) => {
//     const getStatusBadgeColor = (status) => {
//         switch (status) {
//         case 'Completed':
//             return 'bg-green-100 text-green-500 border border-green-200';
//         case 'Pending':
//             return 'bg-purple-100 text-purple-500 border border-purple-200';
//         case 'In Progress':
//             return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
//         default:
//             return 'bg-gray-100 text-gray-500 border border-gray-200';
//         } 
//     }
//     const getPriorityBadgeColor = (priority) => {
//         switch (priority) {
//             case 'High':
//                 return 'bg-red-100 text-red-500 border border-red-200';
//             case 'Medium':
//                 return 'bg-orange-100 text-orange-500 border border-orange-200';
//             case 'Low':
//                 return 'bg-green-100 text-green-500 border border-green-200';
//             default:
//                 return 'bg-gray-100 text-gray-500 border border-gray-200';
//         }
//     }
//     return (
//         // Thêm padding và shadow cho container chính
//         <div>
//              <div className='bg-white rounded-lg shadow-md overflow-hidden'> {/* overflow-hidden để bo tròn góc của bảng */}
//                 <div className='flex justify-between items-center px-6 py-4 border-b border-gray-200'>
//                     {/* Nút See All và Icon, tạm thời chưa có chức năng */}

//                 </div>

//                 <div className='overflow-x-auto'> {/* Đảm bảo bảng cuộn được nếu quá rộng */}
//                     <table className='min-w-full divide-y divide-gray-200'>
//                         <thead className='bg-gray-50'>
//                             <tr>
//                                 <th className='px-6 py-3 text-left text-xs font-bold text-black-500 uppercase tracking-wider'>Name</th>
//                                 <th className='px-6 py-3 text-left text-xs font-bold text-black-500 uppercase tracking-wider'>Status</th>
//                                 <th className='px-6 py-3 text-left text-xs font-bold text-black-500 uppercase tracking-wider'>Priority</th>
//                                 <th className='px-6 py-3 text-left text-xs font-bold text-black-500 uppercase tracking-wider'>Create on</th>
//                             </tr>
//                         </thead>
//                         <tbody className='bg-white divide-y divide-gray-200'>
//                             {tableData.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="4" className='px-6 py-4 text-center text-sm text-gray-500'>
//                                         No tasks found.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 tableData.map((task) => (
//                                     <tr key={task._id} className='hover:bg-gray-50'>
//                                         <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{task.title}</td>
//                                         <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
//                                             <span className={`px-2 py-1 text-xs rounded-full inline-block ${getStatusBadgeColor(task.status)}`}>
//                                                 {task.status}
//                                             </span>
//                                         </td>
//                                         <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
//                                             <span className={`px-2 py-1 text-xs rounded-full inline-block ${getPriorityBadgeColor(task.priority)}`}>
//                                                 {task.priority}
//                                             </span>
//                                         </td>
//                                         <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
//                                             <span className=''>
//                                                 {task.dueDate ? moment(task.dueDate).format('Do MMM YYYY') : "N/A"} {/* Định dạng ngày tháng năm */}
//                                             </span>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }



const TaskListTable = ({ tableData, alltasks }) => { 
  const [hoveredFullTaskId, setHoveredFullTaskId] = useState(null); 
  const [selectedTaskForModal, setSelectedTaskForModal] = useState(null);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  
  // State để lưu task chi tiết đầy đủ khi hover
  const [fullTaskDetailsOnHover, setFullTaskDetailsOnHover] = useState(null);
  // useEffect để tìm task chi tiết đầy đủ từ alltasks khi hoveredFullTaskId thay đổi
  useEffect(() => {
    if (hoveredFullTaskId && alltasks && alltasks.length > 0) {
      const foundTask = alltasks.find(task => task._id === hoveredFullTaskId);
      setFullTaskDetailsOnHover(foundTask);
    } else {
      setFullTaskDetailsOnHover(null);
    }
  }, [hoveredFullTaskId, alltasks]); 

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-500 border border-green-200';
      case 'Pending':
        return 'bg-purple-100 text-purple-500 border border-purple-200';
      case 'In Progress':
        return 'bg-cyan-100 text-cyan-500 border border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-500 border border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-500 border border-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-500 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  const handleTaskNameClick = (task) => {
    // Khi click, tìm task chi tiết từ alltasks để đảm bảo modal có đầy đủ data
    const fullTask = alltasks.find(t => t._id === task._id);
    setSelectedTaskForModal(fullTask || task); // Fallback về task từ tableData nếu không tìm thấy
    setShowTaskDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowTaskDetailModal(false);
    setSelectedTaskForModal(null);
  };

  return (
    <div>
      <div className='bg-white rounded-lg shadow-md overflow-hidden'>
        <div className='flex justify-between items-center px-6 py-4 border-b border-gray-200'>
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-bold text-black-500 uppercase tracking-wider'>Name</th>
                <th className='px-6 py-3 text-left text-xs font-bold text-black-500 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-3 text-left text-xs font-bold text-black-500 uppercase tracking-wider'>Priority</th>
                <th className='px-6 py-3 text-left text-xs font-bold text-black-500 uppercase tracking-wider'>Create on</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan="4" className='px-6 py-4 text-center text-sm text-gray-500'>
                    No tasks found.
                  </td>
                </tr>
              ) : (
                tableData.map((task) => (
                  <tr key={task._id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      <div
                        className="relative inline-block" 
                        onMouseEnter={() => setHoveredFullTaskId(task._id)} 
                        onMouseLeave={() => setHoveredFullTaskId(null)}    
                      >
                        <span
                          className="cursor-pointer text-blue-600 hover:underline"
                          onClick={() => handleTaskNameClick(task)}
                        >
                          {task.title}
                        </span>
                        {/* Truyền fullTaskDetailsOnHover vào TaskDataTooltip */}
                        {hoveredFullTaskId === task._id && fullTaskDetailsOnHover && (
                          <TaskDataTooltip task={fullTaskDetailsOnHover} /> 
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span className={`px-2 py-1 text-xs rounded-full inline-block ${getStatusBadgeColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span className={`px-2 py-1 text-xs rounded-full inline-block ${getPriorityBadgeColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span className=''>
                        {formatDate(task.dueDate)} 
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conditional rendering cho TaskDetailModal */}
      {showTaskDetailModal && selectedTaskForModal && (
        <TaskDetailModal
          task={selectedTaskForModal} 
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
export default TaskListTable