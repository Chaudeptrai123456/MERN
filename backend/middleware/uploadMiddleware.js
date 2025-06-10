// file: middlewares/uploadImage.js (hoặc file tương ứng)

const cloudinary = require('cloudinary').v2; // Import Cloudinary v2
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Import CloudinaryStorage
const multer = require('multer');
require('dotenv').config(); // Để load biến môi trường từ .env

// 1. Cấu hình Cloudinary
// Đảm bảo các biến này có trong file .env của bạn
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cấu hình Cloudinary Storage cho Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Instance Cloudinary đã cấu hình
    params: {
        folder: 'task-manage', // Thư mục trên Cloudinary để lưu ảnh (tùy chọn)
        format: async (req, file) => 'png', // Định dạng ảnh sau khi upload (ví dụ: png, jpg)
        public_id: (req, file) => `${file.fieldname}_${Date.now()}`, // Tên file trên Cloudinary
        resource_type: 'auto' // 'image', 'video', 'raw', hoặc 'auto'
    },
});

// 3. File filter (giữ nguyên hoặc tùy chỉnh)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        // Trả về lỗi nếu không phải là định dạng ảnh cho phép
        cb(new Error("Only .jpeg, .png, .jpg are allowed"), false);
    }
};

// 4. Khởi tạo Multer với Cloudinary Storage
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn kích thước file 5MB (tùy chọn)
});

module.exports = upload;