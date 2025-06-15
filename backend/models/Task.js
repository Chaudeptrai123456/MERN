const mongoose = require("mongoose")
const todoSchema = new mongoose.Schema({
      _id: { type: String }, // 👈 Cho phép dùng string ID
    text:{type:String,required:true},
    completed:{type:Boolean,default:false},
    // assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Thêm trường này
} )
  
const TaskSchema = new mongoose.Schema({
        title:{type:String,required:true},
        description:{type:String},
        priority:{type:String,enum:["Low","Medium","High"],default:"Medium"},
        status:{type:String,enunm:["Pending","In Progress","Completed"],default:"Pending"},
        dueDate:{type: Date,required:true},
        assignedTo:[{type:mongoose.Schema.Types.ObjectId,ref: "User"}],
        createBy:{type:mongoose.Schema.Types.ObjectId,ref: "User"},
        // attachments:[{type:String}],
        attachments: [{ type: mongoose.Schema.Types.Mixed }],
        todoCheckList: [todoSchema],
        process:{type: Number,default: 0}
    },{timestamps:true}
)
module.exports = mongoose.model("Task", TaskSchema)