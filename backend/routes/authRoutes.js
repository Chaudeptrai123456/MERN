const express = require("express")
const { registerUser, loginUser, getUserProfile, updateUserProfile, uploadUserProfileUrl } = require("../controllers/authController")
const { protect, adminOnly } = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware")
const router = express.Router()

router.post("/register",upload.single('image'),registerUser)
router.post("/login",loginUser)
router.get("/profile",protect,getUserProfile)
router.put("/profile",protect,updateUserProfile)
router.post('/upload-single',protect ,upload.single('image'),uploadUserProfileUrl);

// router.post("/upload-image",upload.single("image"),(req,res)=>{
    // upload to 
// })
module.exports = router