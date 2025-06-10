import React, { useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';
import { FaPlus } from 'react-icons/fa';
import { HiOutlineTrash, HiPlus } from 'react-icons/hi';
import SelectUser from './SelectUser';

const ToDoListInput = ({ todoList, setTodoList,listUser}) => {
  const [option, setOption] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");

  const handleAddOption = ()=>{
    if (option.trim()) {
      setTodoList([...todoList, { text: option.trim(), completed: false }])      
      setOption("")
    }
  }
 const handleDeleteOption = (index)=>{
  const updatedArry = todoList.filter((_,idx)=>idx!==index)
  setTodoList(updatedArry)
 }
  return (
  <div >
    {todoList.map((item,index)=>{ 
      return (     
         <div className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2' key={item}>
          <p className='text-xs text-black'>
            <span className='text-xs  text-gray-400 font-semibold mr-2'>
              {index<9 ? `0${index+1}`:index+1}
            </span>
            {item.text}
          </p>
          <button
            className='cursor-pointer'
            onClick={()=>{handleDeleteOption(index)}}
          >
            <HiOutlineTrash  className='text-lg text-red-500'/>
          </button>
      </div>)

    })}  
    <div className='flex items-center gap-5 mt-4'>
      <input
        type="text"
        placeholder='Enter Task'
        value={option}
        onChange={({target})=>setOption(target.value)}
        className='w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2  rounded-md'
      />
      <button
        className='card-btn text-nowrap'
        onClick={handleAddOption}
      >
      <HiPlus className='text-lg'/>Add
      </button>
 
    </div>
  </div>
  );
};

export default ToDoListInput;
