const express = require("express")
const { adminOnly, protect } = require("../middleware/authMiddleware")
const { getUsers ,getUserById,deleteUserById,getProfile } = require("../controllers/userController")
const { updateUserProfile } = require("../controllers/authController")
const router = express.Router()

router.get("/",protect,adminOnly,getUsers)
router.get("/profile",protect,getProfile)
router.get("/:id",protect,getUserById)
router.delete("/:id",protect,adminOnly,deleteUserById)
// router.put("/uploadProfileUrl",protect, updateUserProfile)
module.exports = router