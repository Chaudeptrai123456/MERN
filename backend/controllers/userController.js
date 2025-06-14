const Task = require("../models/Task")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const getUserById = async(req,res)=>{
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({message:"User not found"});
        res.status(200).json({user,tokenAccess:req.token})
    }catch(error) {
        res.status(500).json({message:"Server error" ,error:error.message})
    }

}
const getProfile= async(req,res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) res.status(404).json({message:"User not found"})
        console.log(user)
        return res.status(200).json({user})
    }catch(error) {
        res.status(500).json({message:"Server error" ,error:error.message})
    }
}
const getUsers = async (req,res)=>{
    try {
        const users = await User.find({role:"member"}).select("-password");
        const usersWithTaskCount = await Promise.all(users.map(async (user) => {  
            const pendingTasks = await Task.countDocuments({assignedTo: user._id, status:"Pending"});
            const inProcessTasks = await Task.countDocuments({assignedTo: user._id, status:"In Progress"});
            const completeTasks = await Task.countDocuments({assignedTo: user._id, status:"Completed"});
            return {
                ...user._doc, 
                pendingTasks,
                inProcessTasks,
                completeTasks
            }
        }))
        return res.status(200).json(usersWithTaskCount)
    } catch(error) {
        res.status(500).json({message:"Server error" ,error:error.message})
    }
}
const deleteUserById= (req,res)=>{} 
module.exports = {getUserById,getUsers,deleteUserById,getProfile}