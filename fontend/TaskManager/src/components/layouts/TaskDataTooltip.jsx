import React from 'react'
import { formatDate } from '../../utils/helper';
import { getOrdinalSuffix } from '../../utils/helper';
const TaskDataTooltip = ({ task }) => {
    if (!task) return null;
    
    const displayData = {
        "ID": task._id || 'N/A',
        "Title": task.title || 'N/A',
        "Status": task.status || 'N/A',
        "Priority": task.priority || 'N/A',
        "Description": task.description || 'N/A', // Thêm description vào đây
        "Due Date": task.dueDate ? formatDate(task.dueDate) : "N/A",
        "Created At": task.createdAt ? formatDate(task.createdAt) : "N/A",
        "Created By": task.createBy || 'N/A', // Thêm createdBy
        "Assigned To": task.assignedTo && task.assignedTo.length > 0 
                       ? task.assignedTo.map(member => member.name).join(', ') 
                       : 'None',
        "Todos Count": task.todoCheckList ? task.todoCheckList.length : 0,
        "Process": task.process ? `${task.process.toFixed(2)}%` : '0%', // Thêm process
        // "Attachments": task.attachments && task.attachments.length > 0 ? `${task.attachments.length} files` : 'None', // Nếu muốn hiển thị attachments
    };

    // return (
    //     <div className="absolute z-20 bg-white border border-gray-300 rounded-lg shadow-xl p-4 text-sm text-gray-700 mt-2 min-w-[300px] max-w-md left-0">
    //         <h6 className="font-bold text-base text-gray-900 mb-2">Task Details:</h6>
    //         <table className="w-full text-left">
    //             <tbody>
    //                 {Object.entries(displayData).map(([key, value]) => (
    //                     <tr key={key} className="border-b border-gray-100 last:border-b-0">
    //                         <td className="py-1.5 pr-2 font-medium text-gray-600">{key}:</td>
    //                         <td className="py-1.5 break-words">{value}</td> {/* break-words để xử lý text dài */}
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //     </div>
    // );
    return (
        <div className="fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 text-sm text-gray-700 min-w-[300px] max-w-md right-8 bottom-8 max-w-full w-[90vw]">
            <h6 className="font-bold text-base text-gray-900 mb-2">Task Details:</h6>
            <table className="w-full text-left">
                <tbody>
                    {Object.entries(displayData).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-100 last:border-b-0">
                            <td className="py-1.5 pr-2 font-medium text-gray-600">{key}:</td>
                            <td className="py-1.5 break-words">{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskDataTooltip