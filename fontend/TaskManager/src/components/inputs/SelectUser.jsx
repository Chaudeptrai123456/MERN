import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import { LuUsers } from 'react-icons/lu';
import Modal from '../layouts/Modal';

const SelectUser = ({ selectedUser, setSelectedUsers }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUser, setTempSelectedUser] = useState([]);

  const handleCancel = () => {
    setTempSelectedUser([]);
    setSelectedUsers([]);
    setIsModalOpen(false);
  };

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

  const toggleUserSelection = (userId) => {
    setTempSelectedUser((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleAssign = () => {
    setIsModalOpen(false);
    setSelectedUsers(tempSelectedUser);
  };

  const selectedUserAvatars = allUsers
    .filter((user) => selectedUser.includes(user._id))
    .slice(0, 5)
    .map((user) => user.profileImageUrl);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setTempSelectedUser(selectedUser ? [...selectedUser] : []);
  }, [selectedUser, isModalOpen]);

  return (
    <div className='space-y-4 mt-2'>
      <button
        className='card-btn whitespace-nowrap'
        onClick={() => setIsModalOpen(true)}
      >
        <LuUsers className='text-sm' /> Add Member
      </button>

      {selectedUser.length > 0 && (
        <div className="flex items-center space-x-2 mt-2">
          {selectedUser.map((avatarUrl, index) => (
            <img
              key={index}
              src={avatarUrl || "https://placehold.co/32x32"}
              alt={`Selected Member ${index + 1}`}
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
          ))}
          {selectedUser.length > 5 && (
            <span className="text-gray-500 text-sm">+{selectedUser.length - 5} others</span>
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
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
                src={user.profileImageUrl || "https://placehold.co/28x28"}
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