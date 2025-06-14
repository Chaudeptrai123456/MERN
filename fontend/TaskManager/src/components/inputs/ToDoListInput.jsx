import React, { useState } from 'react';
import { HiOutlineTrash, HiPlus } from 'react-icons/hi';

const ToDoListInput = ({ todoList, setTodoList, listUser }) => {
  const [option, setOption] = useState(''); // State for the new todo item text

  const handleAddOption = () => {
    if (option.trim()) {
      // Ensure each new todo has a unique _id for better React key management and future operations
      setTodoList([...todoList, { _id: Date.now().toString(), text: option.trim(), completed: false }]);
      setOption(''); // Clear the input field after adding
    }
  };

  const handleDeleteOption = (idToDelete) => {
    // Filter by _id instead of index for more robust deletion
    const updatedArray = todoList.filter((item) => item._id !== idToDelete);
    setTodoList(updatedArray);
  };

  const handleToggleCompleted = (idToToggle) => {
    const updatedArray = todoList.map((item) =>
      item._id === idToToggle ? { ...item, completed: !item.completed } : item
    );
    setTodoList(updatedArray);
  };

  return (
    <div>
      {todoList.length === 0 && (
        <p className="text-gray-500 text-sm italic">No to-do items yet. Add one below!</p>
      )}

      {todoList.map((item) => {
        // Determine the text color based on completed status
        const textColorClass = item.completed ? 'text-green-600' : 'text-yellow-600'; // Green for completed, Yellow for not completed

        return (
          <div
            className='flex items-center justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2'
            key={item._id} // Use item._id as key for better performance and stability
          >
            <div className='flex items-center gap-2'>
              {/* Checkbox for completed status */}
              <input
                type='checkbox'
                checked={item.completed}
                onChange={() => handleToggleCompleted(item._id)}
                className='w-4 h-4 accent-blue-600 cursor-pointer'
              />
              {/* REMOVED: ${item.completed ? 'line-through' : ''} */}
              <p className={`text-xs ${textColorClass}`}>
                <span className='text-xs text-gray-400 font-semibold mr-2'>
                  {todoList.indexOf(item) < 9 ? `0${todoList.indexOf(item) + 1}` : todoList.indexOf(item) + 1}
                </span>
                {item.text}
              </p>
            </div>
            <button
              className='cursor-pointer p-1 rounded hover:bg-gray-200'
              onClick={() => { handleDeleteOption(item._id) }} // Pass item._id for deletion
            >
              <HiOutlineTrash className='text-lg text-red-500' />
            </button>
          </div>
        );
      })}

      <div className='flex items-center gap-5 mt-4'>
        <input
          type="text"
          placeholder='Enter Task'
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className='w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md'
          onKeyPress={(e) => { // Allow adding by pressing Enter key
            if (e.key === 'Enter') {
              handleAddOption();
            }
          }}
        />
        <button
          className='card-btn text-nowrap'
          onClick={handleAddOption}
        >
          <HiPlus className='text-lg' />Add
        </button>
      </div>
    </div>
  );
};

export default ToDoListInput;