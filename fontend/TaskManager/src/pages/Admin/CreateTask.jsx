import React, { useState } from 'react'
import DashBoardLayout  from '../../components/layouts/DashBoardLayout'
import { PRIORITY_DATA } from '../../utils/data'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import toast from 'react-hot-toast'
import { useLocation,useNavigate } from 'react-router-dom'
import { formatDate,getOrdinalSuffix } from '../../utils/helper'
import { LuTrash2 } from 'react-icons/lu'
import { useEffect } from 'react'
import SelectDropDown from '../../components/inputs/SelectDropDown'
import SelectUser from '../../components/inputs/SelectUser'
import ToDoListInput from '../../components/inputs/ToDoListInput'
import AddAttachmentsInput from '../../components/inputs/AddAttachmentsInput'
import axiosInstanceFormData from '../../utils/axiosInstanceFormData'
import DeleteConfirmModal from '../../components/DeleteConfirmModal'
import moment from 'moment'
import Modal from '../../components/layouts/Modal'
import DeleteAlert from '../../components/inputs/DeleteAlert'
const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoCheckList: [],
    attachments: []
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // State cho việc thêm Todo mới
  const [newTodoText, setNewTodoText] = useState('');
  // State cho việc thêm AssignedTo mới
  const [newAssignedToName, setNewAssignedToName] = useState('');
  // State cho việc thêm Attachment mới
  const [newAttachment, setNewAttachment] = useState(null);
  const [todoList,setTodoList] = useState([])
  useEffect(() => {
    if (taskId) {
      setIsEditing(true);
      getTaskDetailsById(taskId);
    } else {
      setIsEditing(false);
      clearData();
    }
  }, [taskId]);

  const getTaskDetailsById = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(API_PATHS.TASK.GET_TASK_BY_ID(id));
      console.log(response.data.assignedTo)
      if (response) {
        const fetchedTask = response.data;
        const isoDate = new Date(fetchedTask.dueDate).toISOString(); 
        console.log(fetchedTask.assignedTo)
        const assignedToIds = fetchedTask.assignedTo 
          ? fetchedTask.assignedTo.map(user => user._id) 
          : [];
        console.log(assignedToIds)
        setTaskData({
          title: fetchedTask.title || "",
          description: fetchedTask.description || "",
          priority: fetchedTask.priority || "Low",
          dueDate: fetchedTask.dueDate ? moment(fetchedTask.dueDate).format("YYYY-MM-DD"): "",
          assignedTo: assignedToIds,
          todoCheckList: fetchedTask.todoCheckList || [],
          attachments: fetchedTask.attachments || []
        });
      } else {
        setError("Task not found or invalid data.");
        toast.error("Task not found or invalid data.");
      }
    } catch (err) {
      console.error("Error fetching task details:", err);
      setError("Failed to load task details.");
      toast.error("Failed to load task details.");
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key, value) => {
    console.log(value)
    setTaskData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoCheckList: [],
      attachments: []
    });
    setError("");
    setNewTodoText('');
    setNewAssignedToName('');
    setNewAttachment(null);
  };
const handleUploadFile = async (formData, id) => {
  try {
    for (let pair of formData.entries()) {
  console.log('🧾 FormData content:', pair[0], pair[1]);
}
    const res = await axiosInstance.post(API_PATHS.TASK.UPLOAD_FILE(id), formData,{
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
    if (res && res.data) {
      console.log("Uploaded documents:", res.data.data);
      toast.success("Tệp đính kèm đã được tải lên!");
    }
  } catch (err) {
    console.log("Upload error: ", err);
    toast.error("Lỗi khi tải tệp đính kèm.");
  }
};
  const createTask = async () => {
    setLoading(true); 

    setError("");
    try {
      const formData = new FormData();
      const oldAttachments = [];
      taskData.attachments.forEach(item => {
      if (typeof item === "string") {
        // Giữ lại link cũ
        oldAttachments.push(item);
      } else if (item instanceof File) {
          // File mới: append vào formData (KHÔNG giữ lại trong attachments)
          formData.append('attachments', item);
        } 
      });

// Gán lại attachments chỉ còn link cũ
      taskData.attachments = oldAttachments;
      const response = await axiosInstance.post(API_PATHS.TASK.CREATE_TASK, taskData);
      if (response && response.data) {
        toast.success("Task created successfully!");
        console.log("teststs create task " + response.data.task);
        handleUploadFile(formData,response.data.task._id)
        // clearData();
        // navigate('/admin/tasks');
      }
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task.");
      toast.error("Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

const updateTask = async () => {
  setLoading(true);
  setError("");
  try {
    const formData = new FormData();
    const oldAttachments = [];
    const isoDate = new Date(taskData.dueDate).toISOString(); 
    taskData.attachments.forEach(item => {
      if (typeof item === "string") {
        oldAttachments.push(item);
      } else if (item instanceof File) {
        formData.append('attachments', item);
      }
    });
    // Cập nhật lại taskData.attachments trước khi gửi request PUT
    const updatedTaskData = { ...taskData, attachments: oldAttachments };
    const response = await axiosInstance.put(API_PATHS.TASK.UPDATE_TASK(taskId), updatedTaskData).catch(err=>console.log(err.message));
    if (response && response.data) {
      // Chỉ upload file nếu có file mới
      if (formData.entries().next().done === false) { // Check if formData is not empty
         await handleUploadFile(formData, taskId); // Truyền taskId vào đây
      }
      toast.success("Task updated successfully!");
      // navigate('/admin/tasks');
    }
  } catch (err) {
    console.error("Error updating task:", err);
    setError("Failed to update task.");
    toast.error("Failed to update task.");
  } finally {
    setLoading(false);
  }
};
    const handleMouseLeaveAvatar = () => {
    setHoveredUser(null);
  };
  const handleMouseEnterAvatar = (user, event) => {
    setHoveredUser(user);
    // Tính toán vị trí của tooltip
    // Lấy tọa độ của avatar
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2, // Căn giữa tooltip theo chiều ngang của avatar
      y: rect.top - 10 // Đặt tooltip phía trên avatar, cách 10px
    });
  };
  const deleteTask = async () => {
    setOpenDeleteAlert(true)
    setError("");
    try {
      await axiosInstance.delete(API_PATHS.TASK.DELETE_TASK(taskId));
      toast.success("Task deleted successfully!");
      setOpenDeleteAlert(false);
      navigate('/admin/tasks');
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task.");
      toast.error("Failed to delete task.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) {
      setError("Task title is required.");
      toast.error("Task title is required.");
      return;
    }
    if (isEditing) {
      await updateTask();
    } else {
      await createTask();
    }
  };
  return (
    <DashBoardLayout activeMenu={isEditing ? "Edit Task" : "Create Task"}>
      <div className='mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-xl font-medium'>
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {
                taskId && (
                  <button
                    className='flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer'
                    onClick={() => setOpenDeleteAlert(true)}
                  >
                    <LuTrash2 className='text-base'/>
                  </button>
                )
              }
            </div>
            <div className='mt-4'>
                <label className='text-base font-medium text-slate-600'>
                  TaskTitle
                </label>
                <input 
                  placeholder='Create App UI'
                  className='form-input'
                  value = {taskData.title}
                  onChange={({target})=>{
                    handleValueChange("title",target.value)
                  }}
                />
            </div>
            <div className='mt-3'>
              <label className='text-base font-medium text-slate-600'>
                Description
              </label>
              <textarea
                placeholder='Describe Task'
                className='form-input'
                rows={4}
                value = {taskData.description}
                onChange={({target})=>{
                  handleValueChange("description", target.value)
                }}
              >

              </textarea>
            </div>
            <div className='grid grid-cols-12 gap-4 mt-2'>
              <div className='flex col-span-6 md:col-span-4'>
                  <div>
                    <label className='text-base font-medium text-slate-600'>
                      Priority
                    </label>
                    <SelectDropDown 
                    options={PRIORITY_DATA}
                    value={taskData.priority}
                    onChange={(target)=>{handleValueChange("priority",target)}}
                    placeholder="Select Priority"
                    />
                  </div>
           
              </div>
              <div className='col-span-6 md:col-span-4'>
                    <label className='text-base  font-medium text-slate-600 '>Due Date</label>
                    <input
                      placeholder='Create App UI'
                      className='form-input'
                      value={taskData.dueDate}
                      onChange={({target})=>{
                        handleValueChange("dueDate",target.value)
                      }}
                      type='date'
                    />
              </div>
              <div className=''>
                <label className='w-full'>Assigned To</label>

                <SelectUser 
                  selectedUser = {taskData.assignedTo}
                  setSelectedUsers = {(value)=>{
                    handleValueChange("assignedTo",value)
                  }}
                
                />
              </div>
              
              </div>
          </div>todoList
          <div className='form-card col-span-4 mt-3'>
            <label className='w-full'>ToDo List</label>
       <ToDoListInput 
        todoList={taskData?.todoCheckList}
        setTodoList={(updatedList) => {
        handleValueChange("todoCheckList", updatedList);
        }}
        listUser = {taskData.assignedTo}
      />
          </div>
          <div className='form-card col-span-4 mt-3'>
          <label className='w-full'>
            Add Attachments
          </label>
          <AddAttachmentsInput
            attachments={taskData?.attachments}
            setAttachments={(value)=>{
              handleValueChange("attachments",value)
            }}
          />
          {
            error && (
              <p className='text-xs font-medium text-red-500 mt-5'>{error}</p>
            )
          }
          <div className='flex justify-end mt-7'>
            <button
              className='add-btn'
              onClick={handleSubmit}
              disabled={loading}
            >
              {taskId ? "UPDATE TASK":"CREATE TASK"}
            </button>
          </div>
        </div>
        </div>
      </div>
        <Modal 
          isOpen={openDeleteAlert}
          onClose={()=>{setOpenDeleteAlert(false)}}
          title="Delete Task"
        >
          <DeleteAlert 
            content="Are you sure wanna  to delete this task ???"
            onDelete={()=>deleteTask()}
          />
        </Modal>
    </DashBoardLayout>

  );
}

export default CreateTask 