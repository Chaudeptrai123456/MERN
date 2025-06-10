import React from 'react'
import { formatDate } from '../../utils/helper';
import { getOrdinalSuffix } from '../../utils/helper';
const TaskDetailModal = ({ task, onClose }) => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Dữ liệu đã có sẵn trong task, không cần loading state
  const [error, setError] = useState(null); // Không cần error state nếu dữ liệu có sẵn

  useEffect(() => {
    if (task && task.todoCheckList) {
      setTodos(task.todoCheckList);
    } else {
      setTodos([]); // Đảm bảo rỗng nếu không có todo list
    }
  }, [task]); // Cập nhật khi task thay đổi

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Task Details: {task?.title}</h3>
        <p className="text-gray-600 mb-4">{task?.description || "No description available."}</p>

        <h4 className="text-xl font-semibold text-gray-700 mb-3">Todo List:</h4>
        {/* Do dữ liệu đã có sẵn trong task, không cần isLoading ở đây nữa */}
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : todos.length === 0 ? (
          <p className="text-gray-500">No todo items for this task.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map(todo => (
              // Backend trả về _id cho todo item
              <li key={todo._id} className="flex items-center text-gray-700">
                <span className={`w-3 h-3 rounded-full mr-2 ${
                  // Backend trả về 'completed' là boolean
                  todo.completed ? 'bg-green-500' : 'bg-gray-400'
                }`}></span>
                {todo.text} - <span className="font-medium ml-1">{todo.completed ? 'Completed' : 'Pending'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal