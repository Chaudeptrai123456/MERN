const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn: "7d"});
}
const registerUser = async(req,res)=>{
    try {
        const {email,name,password,profileImageUrl,adminInviteToken} = req.body;
        const userExisted = await User.findOne({email}).catch(err=>console.log(err));
        if (userExisted) {
            return res.status(404).json({message:"User has existed"});
        }
        let role = "member";
        if (
            adminInviteToken && adminInviteToken === process.env.ADMIN_TOKEN
        ) {
            role = "admin"
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            name,email,password: hashedPassword,profileImageUrl,role
        })
        return res.status(200).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            profileImageUrl: newUser.profileImageUrl,
            token: generateToken(newUser._id)
        })
    }catch(error) {
        return res.status(500).json({message:"Server error",error : error.message})
    }
};
const loginUser = async(req,res)=>{
    try {
        console.log("test login ")
        const {email,password} = req.body;
        const user = await User.findOne({email}).catch(err=>console.log(err.message));
        if (!user) {
            return res.status(401).json({message:"User not found"});
        }
        const isValidPassword = await bcrypt.compare(password,user.password);
        if (isValidPassword) {
            let token = generateToken(user._id);
            return res.status(200).json({
                _id : user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImageUrl: user.profileImageUrl,
                tokenAccess:token
            });
        } else {
            return res.status(401).json({message:"username or password is wrong"})
        }
    }
    catch(error) {
        return res.status(500).json({message:"Server error",error : error.message})

    }
};
const getUserProfile = async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({message:"User not found"});
        }
        res.json({user})
    }catch(err) {
        res.status(500).json({message:"Server error",error : error.message})
    }
};
const updateUserProfile = async(req,res)=>{
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({message:"User not found"});
        }
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password,10);
        }
        const updateUser = await user.save();
        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role,
            token: generateToken(updateUser._id)
        })
    } catch(err) {
        res.status(500).json({message:"Server error",error : error.message})
    }
};
const uploadUserProfileUrl = async(req,res)=>{
    try {
        const user = await User.findById(req.user.id);
    
        // req.file.path
        if (!user) return res.status(404).json({message:"User not found"})
        user.profileImageUrl = req.file.path;
        await user.save();
        console.log("test upload image ")
        return res.status(200).json({
            message: 'Image uploaded successfully!',
            user,
            imageUrl: req.file.path,
            publicId: req.file.filename // Public ID của ảnh trên Cloudinary
        });
    } catch(err) {
        res.status(500).json({message:"Server error",error : err.message})
    }
}

module.exports = {registerUser,loginUser,getUserProfile,updateUserProfile,generateToken,uploadUserProfileUrl}