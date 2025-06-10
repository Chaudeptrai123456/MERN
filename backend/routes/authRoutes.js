const express = require("express")
const { registerUser, loginUser, getUserProfile, updateUserProfile, uploadUserProfileUrl } = require("../controllers/authController")
const { protect } = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")
const router = express.Router()

router.post("/register",upload.single('image'),registerUser)
router.post("/login",loginUser)
router.get("/profile",protect,getUserProfile)
router.put("/profile",protect,updateUserProfile)
router.post('/upload-single',protect ,upload.single('image'),uploadUserProfileUrl);
router.post('/upload-multiple', upload.array('images', 5), (req, res) => {
    // Nếu upload nhiều file, thông tin sẽ nằm trong req.files
    if (req.files && req.files.length > 0) {
        const uploadedImages = req.files.map(file => ({
            imageUrl: file.path,
            publicId: file.filename
        }));
        console.log('Files uploaded to Cloudinary:', uploadedImages);
        res.status(200).json({
            message: 'Images uploaded successfully!',
            images: uploadedImages
        });
    } else {
        res.status(400).json({ message: 'No images uploaded or invalid file types.' });
    }
});
// router.post("/upload-image",upload.single("image"),(req,res)=>{
    // upload to 
// })
module.exports = router