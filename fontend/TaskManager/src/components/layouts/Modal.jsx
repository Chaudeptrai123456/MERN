import React from 'react';

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null; // Quan trọng: Nếu modal không mở, trả về null ngay lập tức

  return (
    // Lớp overlay (nền mờ)
    <div
    className="fixed inset-0 z-10 flex items-center justify-center  bg-opacity-30 backdrop-blur-xs"
      onClick={onClose} // Đóng modal khi click ra ngoài overlay
    >
      {/* Container chính của modal */}
      <div
        className='relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow-xl overflow-hidden'
        onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện click lan truyền ra ngoài overlay
      >
        {/* Modal Header */}
        <div className='flex items-center justify-between p-4 border-b rounded-t'>
          <h3 className='text-xl font-semibold text-gray-900'>
            {title}
          </h3>
          {/* Nút đóng */}
          <button
            type='button'
            className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center'
            onClick={onClose}
          >
            <svg
              className='w-3 h-3'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 14'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
              />
            </svg>
            <span className='sr-only'>Close modal</span> {/* Để tăng khả năng tiếp cận */}
          </button>
        </div>

        {/* Modal Body (chứa children) */}
        <div className='p-4 space-y-4'>
          {children}
        </div>

        {/* Modal Footer (có thể thêm các nút như Save/Cancel nếu cần) */}
        {/* <div className='flex items-center p-4 border-t rounded-b'>
          <button type='button' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>I accept</button>
          <button type='button' className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'>Decline</button>
        </div> */}
      </div>
    </div>
  );
};

export default Modal;