// components/modals/DeleteConfirmModal.jsx
import React from 'react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30'>
      <div className='bg-white p-6 rounded-lg shadow-md w-[90%] max-w-sm'>
        <h2 className='text-lg font-semibold text-gray-800'>Xác nhận xoá Task</h2>
        <p className='text-sm text-gray-600 mt-2'>
          Bạn có chắc chắn muốn xoá task này không? Hành động này không thể hoàn tác.
        </p>

        <div className='mt-4 flex justify-end gap-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-100'
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 text-sm rounded text-white bg-rose-500 hover:bg-rose-600'
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
