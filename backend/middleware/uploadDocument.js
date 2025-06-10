// middlewares/uploadDocument.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config(); // Đảm bảo biến môi trường được load

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình Cloudinary Storage cho tài liệu
const documentStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'task-manage/documents', // Thư mục dành riêng cho tài liệu
        public_id: (req, file) => `document_${Date.now()}_${file.originalname.split('.')[0].replace(/\s/g, '_')}`,
        resource_type: 'raw' // Rất quan trọng: dùng 'raw' cho tài liệu
    },
});

// File filter cho tài liệu
const documentFileFilter = (req, file, cb) => {
    const allowedDocumentTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword' // .doc
    ];
    if (allowedDocumentTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ chấp nhận các định dạng tài liệu: PDF, Excel (.xlsx, .xls), Word (.docx, .doc)."), false);
    }
};

// Middleware Multer cho tài liệu (ĐÃ DI CHUYỂN LÊN TRÊN CÁC HÀM KHÁC)
const uploadDocument = multer({
    storage: documentStorage,
    fileFilter: documentFileFilter,
    limits: { fileSize: 20 * 1024 * 1024 } // Giới hạn kích thước tài liệu (20MB, có thể điều chỉnh)
});

// --- Hàm xóa tài liệu trên Cloudinary ---
const deleteDocument = async (publicId) => {
    try {
        // resource_type phải là 'raw' vì chúng ta đã upload nó dưới dạng raw
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log(`Đã xóa tài liệu Cloudinary với public_id: ${publicId}`, result);
        return result;
    } catch (error) {
        console.error(`Lỗi khi xóa tài liệu Cloudinary với public_id: ${publicId}`, error);
        throw new Error(`Không thể xóa tài liệu trên Cloudinary: ${error.message}`);
    }
};

// --- Hàm tìm kiếm tài liệu trên Cloudinary (lưu ý: Cloudinary tìm kiếm dựa trên Public ID) ---
const findDocument = async (publicId) => {
    try {
        // resource_type phải là 'raw'
        const result = await cloudinary.api.resource(publicId, { resource_type: 'raw' });
        console.log(`Tìm thấy tài liệu Cloudinary với public_id: ${publicId}`, result);
        return result;
    } catch (error) {
        console.error(`Lỗi khi tìm tài liệu Cloudinary với public_id: ${publicId}`, error);
        throw new Error(`Không tìm thấy tài liệu trên Cloudinary: ${error.message}`);
    }
};

module.exports = {uploadDocument, findDocument, deleteDocument};