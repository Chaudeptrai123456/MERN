import React from 'react'
import Progress from '../layouts/Progress'
import AvatarGroup from '../layouts/AvatarGroup'
import { formatDate } from '../../utils/helper';
import { LuPaperclip } from 'react-icons/lu';

const TaskCard = (  { 
    title,              
    description,       
    priority,           
    status,            
    progress,      
    createdAt,      
    dueDate,           
    assignedTo,         
    attachmentCount,    
    completedTodoCount,  
    todoChecklist,      
    onClick,
  }) => {
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
  const handleSetProgress= ()=>{

  }
  return (
        <div 
            className='bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50 cursor-pointer'
            onClick={onClick}
        >
            <div className='flex items-end gap-3 px-4'>
                <div className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`} >
                    {status}
                </div>
                <div className={`text-[11px] font-medium ${getProrityTagColor()} px-4 py-0.5 rounded`}>
                    {priority} Priority
                </div>
            </div>
            <div className={`px-4 border-l-[3px] 
                ${
                    status === 'In Progress' ? 'border-cyan-500' : status === 'Completed' ? 'border-indigo-500' : 'border-violet-500'
                }
            `}>
                <p className='text-sm font-medium text-gray-800 mt-4 line-camp-2'>
                    {title}
                </p>
                <p className='text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]'>
                    {description}
                </p>
                <div className='text-[13px] text-gray-700/80 font-medium  mt-2 mb-2  leading-[18px]'>
                    Task Done : {""}
                    <span className='font-semibold text-gray-700'>
                        {completedTodoCount} / {todoChecklist.length || 0}
                    </span>
                    <Progress  progress={progress} status={status}/>
                </div>
            </div>
            <div className='px-4'>
                <div className='flex items-center justify-between my-1'>
                    <div>
                        <label className='text-xs text-gray-500'>Start Date</label>
                        <p className='text-[13px] font-medium text-gray-900'>
                            {formatDate(createdAt)}
                        </p>
                    </div>
                    <div>
                        <label className='text-xs text-gray-500'>Due Date</label>
                        <p className='text-[13px] font-medium text-gray-900'>
                            {formatDate(dueDate)}
                        </p>
                    </div>
                </div>
                <div className='flex items-center justify-between mt-3'>
                    <AvatarGroup avatars={assignedTo || []}/>
                    {attachmentCount>0&&(
                        <div className='flex items-center gap-2 bg-blue-50  px-2.5 py-1.5 rounded-lg'>
                            <LuPaperclip className='text-primary'/>{""}
                            <span className='text-xs text-gray-900'></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskCard


// import React from 'react';
// import Progress from '../layouts/Progress';
// import AvatarGroup from '../layouts/AvatarGroup';
// import { formatDate } from '../../utils/helper';
// import { LuPaperclip } from 'react-icons/lu';
// import PropTypes from 'prop-types'; // Import PropTypes để kiểm tra kiểu dữ liệu

// const TaskCard = ({
//     title,
//     description,
//     priority,
//     status,
//     progress,
//     createdAt,
//     dueDate,
//     assignedTo,
//     attachmentCount,
//     completedTodoCount,
//     todoChecklist,
//     onClick,
// }) => {
//     // Hàm lấy màu sắc cho tag Status
//     const getStatusTagColor = () => {
//         switch (status) {
//             case 'In Progress':
//                 return 'text-cyan-600 bg-cyan-50 border border-cyan-200';
//             case 'Completed':
//                 return 'text-lime-600 bg-lime-50 border border-lime-200';
//             case 'Todo': // Thêm case 'Todo' nếu có
//                 return 'text-violet-600 bg-violet-50 border border-violet-200';
//             default:
//                 return 'text-gray-600 bg-gray-50 border border-gray-200'; // Fallback an toàn
//         }
//     };

//     // Hàm lấy màu sắc cho tag Priority
//     const getPriorityTagColor = () => { // Đã sửa lỗi chính tả từ Prority thành Priority
//         switch (priority) {
//             case 'Low':
//                 return 'text-emerald-600 bg-emerald-50 border border-emerald-200';
//             case 'Medium':
//                 return 'text-amber-600 bg-amber-50 border border-amber-200';
//             case 'High': // Thêm case 'High' nếu có
//                 return 'text-rose-600 bg-rose-50 border border-rose-200';
//             default:
//                 return 'text-gray-600 bg-gray-50 border border-gray-200'; // Fallback an toàn
//         }
//     };

//     const hasChecklist = todoChecklist && todoChecklist.length > 0;
//     const hasAttachments = attachmentCount > 0;
//     const hasAssignedTo = assignedTo && assignedTo.length > 0;

//     return (
//         <div
//             className="
//                 flex flex-col md:flex-row gap-4 p-5 rounded-lg shadow-md border border-gray-100 bg-white
//                 cursor-pointer transition-all duration-200 ease-in-out
//                 hover:shadow-lg hover:border-blue-200
//             "
//             onClick={onClick}
//         >
//             {/* Phần 1: Status & Priority Tags */}
//             <div className="flex flex-row md:flex-col gap-2 mb-3 md:mb-0 md:pr-4">
//                 <div
//                     className={`
//                         text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full
//                         flex-shrink-0 text-center ${getStatusTagColor()}
//                     `}
//                 >
//                     {status}
//                 </div>
//                 <div
//                     className={`
//                         text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full
//                         flex-shrink-0 text-center ${getPriorityTagColor()}
//                     `}
//                 >
//                     {priority} Priority
//                 </div>
//             </div>

//             {/* Phần 2: Task Details (Title, Description, Progress) */}
//             <div
//                 className={`
//                     flex-1 px-4 border-l-4
//                     ${status === 'In Progress' ? 'border-cyan-500' : status === 'Completed' ? 'border-lime-500' : 'border-violet-500'}
//                 `}
//             >
//                 <h3 className="text-lg font-bold text-gray-800 mb-1 leading-tight">
//                     {title}
//                 </h3>
//                 <p className="text-sm text-gray-600 mb-3 line-clamp-2">
//                     {description || 'No description provided.'}
//                 </p>
//                 <Progress progress={progress} status={status} />
//             </div>

//             {/* Phần 3: Dates, Assignees & Attachments */}
//             <div className="flex flex-col justify-between items-start md:items-end text-left md:text-right gap-3 md:pl-4 min-w-[150px]">
//                 {/* Start Date */}
//                 <div>
//                     <label className="text-xs text-gray-500 block mb-0.5">Start Date</label>
//                     <p className="text-sm font-medium text-gray-700">
//                         {formatDate(createdAt)}
//                     </p>
//                 </div>

//                 {/* Due Date (hiển thị nếu có) */}
//                 {dueDate && (
//                     <div>
//                         <label className="text-xs text-gray-500 block mb-0.5">Due Date</label>
//                         <p className="text-sm font-medium text-red-500"> {/* Màu đỏ để nổi bật */}
//                             {formatDate(dueDate)}
//                         </p>
//                     </div>
//                 )}

//                 {/* Assigned To (hiển thị nếu có người được giao) */}
//                 {hasAssignedTo && (
//                     <div className="flex items-center gap-2 mt-auto"> {/* mt-auto đẩy xuống dưới */}
//                         <label className="text-xs text-gray-500">Assigned:</label>
//                         <AvatarGroup avatars={assignedTo} />
//                     </div>
//                 )}

//                 <div className="flex flex-row md:flex-col items-center md:items-end gap-3 mt-auto">
//                     {/* Attachments (hiển thị nếu có) */}
//                     {hasAttachments && (
//                         <div className="flex items-center text-gray-500 text-sm">
//                             <LuPaperclip className="mr-1 text-base" /> {attachmentCount}
//                         </div>
//                     )}

//                     {/* Checklist (hiển thị nếu có) */}
//                     {hasChecklist && (
//                         <div className="text-sm text-gray-600">
//                             {completedTodoCount}/{todoChecklist.length} tasks
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// // Định nghĩa PropTypes cho các props
// TaskCard.propTypes = {
//     title: PropTypes.string.isRequired,
//     description: PropTypes.string,
//     priority: PropTypes.oneOf(['Low', 'Medium', 'High']).isRequired,
//     status: PropTypes.oneOf(['Todo', 'In Progress', 'Completed']).isRequired,
//     progress: PropTypes.number.isRequired,
//     createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
//     dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
//     assignedTo: PropTypes.arrayOf(PropTypes.shape({ // Giả định assignedTo là mảng các object có id, avatar, name
//         id: PropTypes.string,
//         name: PropTypes.string,
//         avatar: PropTypes.string,
//     })),
//     attachmentCount: PropTypes.number,
//     completedTodoCount: PropTypes.number,
//     todoChecklist: PropTypes.array, // Hoặc PropTypes.arrayOf(PropTypes.object) nếu checklist có cấu trúc cụ thể
//     onClick: PropTypes.func,
// };

// // Giá trị mặc định cho các props không bắt buộc
// TaskCard.defaultProps = {
//     description: '',
//     dueDate: null,
//     assignedTo: [],
//     attachmentCount: 0,
//     completedTodoCount: 0,
//     todoChecklist: [],
//     onClick: () => {},
// };

// export default TaskCard;