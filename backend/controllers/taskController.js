const Task = require("../models/Task")
const { translateAliases } = require("../models/User")
const getDashboardData= async(req,res)=>{
    try {
        // get statistics
        const totalTask = await Task.countDocuments();
        const pendingTask = await Task.countDocuments({status:"Pending"})
        const inProcessTask = await Task.countDocuments({status:"In Progress"})
        const completeTask = await Task.countDocuments({status:"Completed"})
        const overdueTask = await Task.countDocuments({
            status:{$ne: "Completed"},
            dueDate:{$lt: new Date()}
        })
        const taskStatues = ["Pending","In Progress","Completed"]
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {$sum:1}
                }
            }
        ])
        const taskDistribution = taskStatues.reduce((acc,status)=>{
            const formattedKey = status.replace(/\s+/g,"")
            //Toán tử "Logical OR" (||). Nếu kết quả trước đó là undefined (hoặc null, false, 0, NaN, ''), thì nó sẽ gán giá trị 0
            acc[formattedKey] = taskDistributionRaw.find((item)=>item._id === status)?.count || 0
            return acc;
        },{})
        taskDistribution["All"] = totalTask 
        const taskProrities = ["Low","Medium","High"]
        const taskProritiesLevelsRaw = await Task.aggregate([
            {
                $group:{
                    _id:"$priority",
                    count:{$sum:1}
                }
            }
        ])
        // const taskProritiesLevels = taskProritiesLevelsRaw.reduce((acc,priority)=>{
        //     acc[priority._id] = taskProritiesLevelsRaw.find((item)=>item._id===priority)?.count || 0;
        //     return acc;
        // },{});
        const taskProritiesLevels = {};  
        taskProrities.forEach(p => {  
                taskProritiesLevels[p] = 0; 
        });
        taskProritiesLevelsRaw.forEach(item => {  
            if (taskProritiesLevels.hasOwnProperty(item._id)) { 
                taskProritiesLevels[item._id] = item.count;  
            }
        });
        const recentTasks = await Task.find().sort({createdAt:-1}).limit(10).select("title status priority dueDate createAt");
        res.status(200).json({
            statistics: {
                totalTask,
                pendingTask,
                inProcessTask,
                completeTask,
                overdueTask,
            },
            charts:{
                taskDistribution,
                taskProritiesLevels
            },
            recentTasks 
        })
    }catch(err) {
        return res.status(500).json({ message: "Server error", error: err.message }); // Sửa typo và thêm return
    }
}
const getTaskByUserId= async(req,res)=>{
    try {
        // const userId = req.user._id;
        console.log(userId)
        // const tasks = await Task.find({assignee:userId}).select("title status priority dueDate createAt").lean();
        // if (!result) {return res.status(404).json({message:"No task"})}
        // return res.status(200).json({tasks});
    } catch(error) {
        return res.status(500).json({ message: "Server error", error: err.message }); // Sửa typo và thêm return
    }
}
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Thu thập số liệu thống kê cơ bản cho người dùng được chỉ định
        const totalTask = await Task.countDocuments({ assignedTo: userId });
        const pendingTask = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
        const inProcessTask = await Task.countDocuments({ assignedTo: userId, status: "In Progress" });
        const completedTask = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const overdueTask = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() } // Sử dụng $lt (less than) cho quá hạn
        });

        // 2. Chuẩn bị mảng trạng thái
        const taskStatues = ["Pending", "In Progress", "Completed"]; // Chỉ giữ lại 1 dòng này

        // 3. Lấy phân phối công việc theo trạng thái bằng Aggregation
        const taskDistributionRaw = await Task.aggregate([
            {
                $match: { // Lọc theo người dùng trước khi nhóm
                    assignedTo: userId
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // 4. Định dạng lại phân phối trạng thái
        const taskDistribution = taskStatues.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTask; // Sửa All thành "All"

        // 5. Lấy phân phối công việc theo độ ưu tiên bằng Aggregation
        const taskProrities = ["Low", "Medium", "High"]; // Chú ý: nếu schema là priority, thì tên biến cũng nên là priorities
        const taskProritiesLevelsRaw = await Task.aggregate([
            {
                $match: { // Lọc theo người dùng trước khi nhóm
                    assignedTo: userId
                }
            },
            {
                $group: {
                    _id: "$priority", // Đã chính xác là "$priority"
                    count: { $sum: 1 }
                }
            }
        ]);

        // 6. Định dạng lại phân phối ưu tiên
        const taskProritiesLevels = {};
        taskProrities.forEach(p => {
            taskProritiesLevels[p] = 0;
        });
        taskProritiesLevelsRaw.forEach(item => {
            if (taskProritiesLevels.hasOwnProperty(item._id)) {
                taskProritiesLevels[item._id] = item.count;
            }
        });

        // 7. Lấy các công việc gần đây được giao cho người dùng
        const recentTasks = await Task.find({ assignedTo: userId }) // Lọc theo userId ở đây
                                .sort({ createAt: -1 })
                                .limit(10)
                                .select("title status priority dueDate createAt"); // Đảm bảo 'createAt' khớp với Schema

        // 8. Trả về phản hồi JSON
        res.status(200).json({
            statistics: {
                totalTask,
                pendingTask,
                inProcessTask,
                completedTask,
                overdueTask, // Đã bao gồm
            },
            charts: {
                taskDistribution,
                taskProritiesLevels
            },
            recentTasks // Đã bao gồm
        });
    } catch (err) {
        // Xử lý lỗi và trả về phản hồi
        console.error("Error in getUserDashboardData:", err); // Log lỗi chi tiết
        return res.status(500).json({ message: "Server error", getTaskserror: err.message }); // Sửa typo và thêm return
    }
};
const getTasks= async(req,res)=>{
    try {
        const { status } = req.query;
        let filter = {}
        if (status) {
            filter.status = status
        }
        let tasks;
        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }else {
            tasks = await Task.find({...filter,assignedTo:req.user._id}).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }
        tasks = await Promise.all(
            tasks.map(async(task)=>{
                const completedCount = task.todoCheckList.filter(
                    (item)=>item.completed === true
                ).length;
                return {...task._doc,completedCount:completedCount}
            })
        )
        const allTask = await Task.countDocuments(
            req.user.role==="admin" ? {} : {assignedTo:req.user._id}
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status:"Pending",
            ...(req.user.role !== "admin") && {assignedTo:req.user._id}
        })

        const inProcessTasks = await Task.countDocuments({
            ...filter,
            status:"In Progress",
            ...(req.user.role !== "admin") && {assignedTo:req.user._id}
        })
        
        const completedTasks = await Task.countDocuments({
            ...filter,
            status:"Completed",
            ...(req.user.role !== "admin") && {assignedTo:req.user._id}
        })
            res.json({
            tasks,
            statusSummary: {
                all: allTask,
                pendingTasks,
                inProcessTasks,
                completedTasks
            }
        })
    }catch(err) {
        return res.status(500).json({ message: "Server error", error: err.message }); // Sửa typo và thêm return
    }
}
const getTaskById= async(req,res)=>{
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );
        if (!task) return res.status(404).json({message:"Task not found"})
        res.status(200).json(task)

    }catch(err) {
        return res.status(500).json({ message: "Server error", error: err.message }); // Sửa typo và thêm return
    }
}
const createTask= async(req,res)=>{
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList
        } = req.body;
        console.log("create task " +JSON.stringify(req.body))
        if (!Array.isArray(assignedTo)) return res.status(400).json({ message: "Assigned to must be an array" });
        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoCheckList,
            progress:0,
            createBy: req.user._id
        });
        res.status(201).json({message:"Task has created",task})
    }catch(err) {
        console.log("test " + err.message)
        return res.status(500).json({ message: "Server error", error: err.message }); // Sửa typo và thêm return
    }
}
const updateTask= async(req,res)=>{
    try {
        const task = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({message:"Task not found"})
        task.title = req.body.title || task.title
        task.description = req.body.description || task.description
        task.priority = req.body.priority || task.priority
        task.dueDate = req.body.dueDate || task.dueDate
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList
        task.attachments = req.body.attachments || task.attachments
        const countCompletedTodo =    task.todoCheckList.filter(
                    (item)=>item.completed === true
                ).length
        task.process = countCompletedTodo/task.todoCheckList.length*100;
        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({message:"assignedTo must be an array"})
            }
            task.assignedTo = req.body.assignedTo
        }
        const updateTask = await task.save()
        res.status(200).json({message: "Task has been updated successfully",updateTask})
    }catch(err) {
        console.log(err.message)
        return res.status(500).json({ message: "Server error", error: err.message }); // Sửa typo và thêm return
    }
}
const deleteTask= async(req,res)=>{
    try {
        const task  = await Task.findById(req.params.id)
        if (!task) return res.status(404).json({message:"Task not found"})
        await task.deleteOne()
        res.status(200).json({message:"Task has been deleted successfully"})
    }catch(err) {
        return res.status(500).json({ message: "Server error", error: err.message }); // Sửa typo và thêm return
    }
}
const updateTaskStatus= async(req,res)=>{
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({message:"Task not found"})
       // kiểm tra có ít nhất 1 userId trong assignTo có phải là user hiện tại không ??
        const isAssignedTo = task.assignedTo.some(
        (userId) => userId.toString() === req.user._id.toString()
        );
        console.log(req.user.role + " " +isAssignedTo)
        console.log(!isAssignedTo && req.user.role === "admin")
        if (!isAssignedTo && req.user.role !== "admin") {return res.status(403).json({message:"No authorized"})}
        task.status = req.body.status || task.status
        if (task.status === "Completed") {
            task.todoCheckList.forEach(element => {
                element.completed = true ;
            });
            task.process = 100;
        } else if (task.status === "In Progress") { //  
            const totalTodos = task.todoCheckList.length;
            const completedTodos = task.todoCheckList.filter(todo => todo.completed).length;
            if (totalTodos > 0) {
                task.process = (completedTodos / totalTodos) * 100; 
            } else {
                task.process = 0;  
            }
        } 
        await task.save()
        return res.status(200).json({message:"Task has been updated ",task})
    }catch(err) {
        return res.status(500).json({ message: "Server error", error: err.message }); // Sửa typo và thêm return
    }
}
const updateTaskCheckList= async(req,res)=>{
    try {
        const {todoCheckList} = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({message:"Task not found"})
        console.log(task)
        console.log("userId " + req.user._id)
        const isAssignedToTask = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );
        if (!isAssignedToTask && req.user.role !== "admin") return res.status(403).json({message:"No authorized"})
        task.todoCheckList = todoCheckList;    
        const totalTodos = task.todoCheckList.length;
        const completedTodos = task.todoCheckList.filter(todo => todo.completed).length;
            if (totalTodos > 0) {
                task.process = (completedTodos / totalTodos) * 100; 
            } else {
                task.process = 0;  
            }        if (task.process == 100) {
            task.status = "Completed"
        }else if (task.process > 0 ) {
            task.status = "In Progress"
        } else {
            task.status = "Pending"
        }
        await task.save()
        const updateTask = await  Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        )
        return res.status(200).json({message:"Task has been updated successfully",task:updateTask})
    }catch(err) {
        return res.status(500).json({ message: "Server error", error: err.message }); // Sửa typo và thêm return
    }
}
const uploadFile = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Không có file tài liệu được tải lên hoặc định dạng không hợp lệ.' });
    }

    try {
        const uploadedFiles = req.files.map(file => {
            const downloadUrl = `https://res.cloudinary.com/tienanh/raw/upload/${file.filename}?fl_attachment=${encodeURIComponent(file.originalname)}`;
            return {
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                publicId: file.filename,
                downloadUrl
            };
        });

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Không tìm thấy task" });
        }

        // Nếu attachments là array string trước đó, thì vẫn giữ lại rồi merge
        const existing = Array.isArray(task.attachments) ? task.attachments : [];

        task.attachments = [...existing, ...uploadedFiles];

        await task.save();

        return res.status(201).json({
            message: "Đã upload tài liệu và lưu vào task thành công",
            task
        });

    } catch (err) {
        console.error('Lỗi khi xử lý file:', err);
        res.status(500).json({ message: 'Lỗi máy chủ khi xử lý file', error: err.message });
    }
};

module.exports = {uploadFile,getDashboardData,getUserDashboardData,getTasks,getTaskById,createTask,updateTask,deleteTask,updateTaskStatus,updateTaskCheckList,getTaskByUserId}

