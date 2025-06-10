import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { LuUsers } from 'react-icons/lu';
import Modal from '../layouts/Modal';

const SelectUser = ({ selectedUser, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Ban đầu đặt là false
  const [tempSelectedUser, setTempSelectedUser] = useState([]);
  const handleCancel = () => {
    setTempSelectedUser([]); // Xóa hết tất cả các lựa chọn tạm thời
    setSelectedUsers([]); // Vui lòng xem lại comment ở đây trong phản hồi trước để quyết định có nên giữ dòng này không.
    setIsModalOpen(false);
  };
  // Lấy tất cả người dùng từ API
  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USER.GET_ALL_USERS);
      if (response.data && response.data.length > 0) {
        setAllUsers(response.data);
      }
    } catch (err) {
      console.error("Error getting all users:", err);
    }
  };

  // Hàm xử lý khi tick/untick checkbox người dùng
  const toggleUserSelection = (userId) => {
    setTempSelectedUser((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Hàm xử lý khi người dùng nhấn "Assign" trong modal
  const handleAssign = () => {
    setIsModalOpen(false); // Đóng modal
    setSelectedUsers(tempSelectedUser); // Cập nhật danh sách người dùng được chọn chính thức
  };

  // Lấy URL avatar của những người dùng đã được chọn (từ props selectedUser)
  // và chỉ lấy tối đa 5 người đầu tiên
  const selectedUserAvatars = allUsers
    .filter((user) => selectedUser.includes(user._id))
    .slice(0, 5) // Chỉ lấy 5 người đầu tiên
    .map((user) => user.profileImageUrl);

  // useEffect để gọi API khi component mount
  useEffect(() => {
    getAllUsers();
  }, []);

  // useEffect để đồng bộ tempSelectedUser khi selectedUser từ props thay đổi
  // hoặc khi modal được mở (để đảm bảo trạng thái checkbox là đúng)
  useEffect(() => {
    // Luôn khởi tạo tempSelectedUser dựa trên selectedUser khi modal mở
    // hoặc khi selectedUser bên ngoài thay đổi.
    setTempSelectedUser(selectedUser ? [...selectedUser] : []);
  }, [selectedUser, isModalOpen]);

  return (
    <div className='space-y-4 mt-2'>
      {/* Nút "Add Member" - luôn hiển thị */}
      <button
        className='card-btn whitespace-nowrap' // Đảm bảo class này có whitespace-nowrap
        onClick={() => setIsModalOpen(true)} // Mở modal khi click
      >
        <LuUsers className='text-sm' /> Add Member
      </button>

      {/* Khu vực hiển thị avatar của người dùng đã chọn */}
      {selectedUserAvatars.length > 0 && (
        <div className="flex items-center space-x-2 mt-2">
          {selectedUserAvatars.map((avatarUrl, index) => (
            <img
              key={index} // Sử dụng index làm key tạm thời nếu _id không tiện (nhưng _id của user tốt hơn)
              src={avatarUrl || "https://placehold.co/32x32"} // Placeholder nếu ảnh không tồn tại
              alt={`Selected Member ${index + 1}`}
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
          ))}
          {selectedUser.length > 5 && (
            <span className="text-gray-500 text-sm">+{selectedUser.length - 5} others</span>
          )}
        </div>
      )}


      {/* Modal để chọn người dùng */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Quan trọng: Nếu người dùng đóng modal mà không nhấn Assign,
          // thì các thay đổi tạm thời trong tempSelectedUser phải được hủy bỏ
          // để modal lần sau mở ra đúng với trạng thái selectedUser chính thức
          setTempSelectedUser(selectedUser ? [...selectedUser] : []);
        }}
        title="Select Users"
      >
        <div className='space-y-4 h-[60vh] overflow-y-auto'>
          {allUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 py-3 border-b last:border-none cursor-pointer"
              onClick={() => toggleUserSelection(user._id)}
            >
              {/* Avatar */}
              <img
                src={user.profileImageUrl || "https://placehold.co/28x2828"}
                alt={user.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              {/* Thông tin tên + email */}
              <div className="flex flex-col flex-1">
                <span className="font-semibold">{user.name}</span>
                <span className="text-gray-500 text-sm">{user.email}</span>
              </div>
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={tempSelectedUser.includes(user._id)}
                // onChange cần được giữ lại để đảm bảo accessibility và hoạt động chuẩn của checkbox
                onChange={() => toggleUserSelection(user._id)}
                className="w-4 h-4 accent-blue-600"
              />
            </div>
          ))}
        </div>

        {/* Thêm nút "Assign" ở chân modal */}
        <div className='flex justify-end p-4 border-t gap-4'>
             <button
        className='px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2'
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
            onClick={handleAssign}
          >
            Assign
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUser;