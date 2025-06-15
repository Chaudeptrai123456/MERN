import React, { useEffect, useState } from 'react';
import DashBoardLayout from '../../components/layouts/DashBoardLayout';
import { LuTrash2 } from 'react-icons/lu'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import moment from 'moment';
import SelectDropDown from '../../components/inputs/SelectDropDown'
import { PRIORITY_DATA } from '../../utils/data'
import SelectUser from '../../components/inputs/SelectUser'
import ToDoListInput from '../../components/inputs/ToDoListInput'
import AddAttachmentsInput from '../../components/inputs/AddAttachmentsInput'
const ViewTaskDetail = () => {
  const { id } = useParams(); // Lưu ý: phải gọi useParams()
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoCheckList: [],
    attachments: []
  });  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getTaskDetailsById = async (id) => {
    setLoading(true);
    setError("");
    try {
      console.log(id)
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
  useEffect(() => {
    if (id) {
      getTaskDetailsById(id);
    } else {
      clearData();
    }
  }, [id]);
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
  };
  const handeleSubmit =async ()=>{}
  return (
    <DashBoardLayout activeMenu="Task Detail">
        <div className='mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 mt-4'>
          <div className='form-card col-span-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl md:text-xl font-medium'>
                {id ? "Update Task" : "Create Task"}
              </h2>
              {
                id && (
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
              onClick={handeleSubmit}
              disabled={loading}
            >
              {id ? "UPDATE TASK":"CREATE TASK"}
            </button>
          </div>
        </div>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default ViewTaskDetail;
