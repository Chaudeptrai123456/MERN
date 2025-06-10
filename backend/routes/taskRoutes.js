const express = require("express")
const {adminOnly,protect} = require("../middleware/authMiddleware")
const router = express.Router()
const {getTaskByUserId,getDashboardData,getUserDashboardData,getTasks,getTaskById,createTask,updateTask,deleteTask,updateTaskStatus,updateTaskCheckList} = require("../controllers/taskController")
const  {uploadDocument,findDocument,deleteDocument} = require('../middleware/uploadDocument'); // <== Dòng này là nguyên nhân của lỗi

router.get("/dashboard-data",protect,getDashboardData)
router.get("/user-dashboard-data",protect,getUserDashboardData) 
router.get("/",protect,getTasks)
router.get("/:id",protect,getTaskById)
router.post("/create-task",protect,adminOnly,createTask)
router.put("/:id",protect,adminOnly,updateTask)
router.delete("/:id",protect,adminOnly,deleteTask)
router.put("/:id/status",protect,updateTaskStatus)
router.put("/:id/todo",protect,updateTaskCheckList)
router.post('/upload/document', uploadDocument.single('documentFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Không có file tài liệu được tải lên hoặc định dạng không hợp lệ.' });
    }

    // req.file chứa thông tin của tài liệu đã upload lên Cloudinary
    console.log('Tài liệu đã tải lên:', req.file);

    try {
        // TODO: Lưu thông tin tài liệu vào database của bạn
        // Bao gồm publicId (req.file.filename) để sau này có thể xóa hoặc tìm kiếm
        const docInfo = {
            url: req.file.path,
            publicId: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
            // Thêm các trường khác cần thiết cho DB (ví dụ: taskId, uploadedBy, v.v.)
        };
        // await YourDocumentModel.create(docInfo); // Ví dụ lưu vào DB

        res.status(200).json({
            message: 'Tài liệu đã được tải lên Cloudinary thành công!',
            data: docInfo
        });
    } catch (dbError) {
        // Xử lý lỗi nếu không lưu được vào DB
        console.error('Lỗi khi lưu thông tin tài liệu vào DB:', dbError);
        // Có thể xóa file trên Cloudinary nếu lưu DB thất bại để tránh file rác
        await deleteDocument(req.file.filename);
        res.status(500).json({ message: 'Đã tải lên Cloudinary nhưng lỗi khi lưu vào database.', error: dbError.message });
    }
});

// --- Route để xóa tài liệu ---
router.delete('/document/:publicId', async (req, res) => {
    const { publicId } = req.params; // Lấy publicId từ URL

    try {
        // Xóa tài liệu trên Cloudinary
        const cloudinaryResult = await deleteDocument(publicId);

        if (cloudinaryResult.result === 'not found') {
            return res.status(404).json({ message: 'Tài liệu không tìm thấy trên Cloudinary.' });
        }
        if (cloudinaryResult.result !== 'ok') {
            throw new Error(`Cloudinary trả về kết quả không mong muốn: ${cloudinaryResult.result}`);
        }

        // TODO: Xóa bản ghi tài liệu tương ứng trong database của bạn
        // Ví dụ: await YourDocumentModel.deleteOne({ cloudinaryPublicId: publicId });

        res.status(200).json({ message: `Tài liệu với publicId ${publicId} đã được xóa thành công.`, cloudinaryResult });
    } catch (error) {
        console.error('Lỗi khi xóa tài liệu:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa tài liệu.', error: error.message });
    }
});

// --- Route để tìm kiếm/lấy thông tin chi tiết tài liệu ---
router.get('/document/:publicId', async (req, res) => {
    const { publicId } = req.params; // Lấy publicId từ URL

    try {
        // Lấy thông tin chi tiết từ Cloudinary
        const documentInfo = await findDocument(publicId);

        // TODO: (Tùy chọn) Lấy thêm thông tin từ database của bạn nếu cần
        // Ví dụ: const dbRecord = await YourDocumentModel.findOne({ cloudinaryPublicId: publicId });

        res.status(200).json({
            message: `Thông tin tài liệu với publicId ${publicId}.`,
            data: documentInfo
            // dbRecord: dbRecord // Nếu có lấy từ DB
        });
    } catch (error) {
        // Cloudinary.api.resource sẽ throw lỗi nếu không tìm thấy
        if (error.message.includes('not found')) {
            return res.status(404).json({ message: 'Tài liệu không tìm thấy trên Cloudinary.' });
        }
        console.error('Lỗi khi tìm tài liệu:', error);
        res.status(500).json({ message: 'Lỗi server khi tìm tài liệu.', error: error.message });
    }
});
module.exports = router

