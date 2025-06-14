const Task = require("../models/Task")
const User = require("../models/User")
const excelJs = require("exceljs")
const exportTasksReport = async(req,res)=>{
    try {
        const tasks = await Task.find().populate("assignedTo","name email")
        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet("Task Report");
        worksheet.columns=[
            {header:"Task ID" , key : "_id", width : 25},
            {header:"Title" , key : "title", width : 30},
            {header:"Description" , key : "description", width : 50},
            {header:"Prority" , key : "priority", width : 15},
            {header:"Status" , key : "status", width : 20},
            {header:"Due Date" , key : "dueDate", width : 20},
            {header:"Assigned To" , key : "assignedTo", width : 30},
        ]
        tasks.forEach((task)=>{
            const assignedTo = task.assignedTo.map((user)=>`${user.name} (${user.email})`);
            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toString().split("T")[0],
                assignedTo: task.assignedTo.map(user => user.name).join(", ") || "Unassigned"
            })
        })
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="tasks_report.xlsx"'
        );
        return workbook.xlsx.write(res).then(()=>{
            res.end()
        });
    } catch(err) {
        return res.status(500).json({ message: "Server error", error: err.message }); 

    }
}
const exportUsersReport = async(req,res)=>{
    try {
        const users = await User.find().select("name emai _id").lean();
        const userTask = await Task.find().populate(
            "assignedTo",
            "name email _id"
        )
        const userTaskMap = {}
        users.forEach((user)=>{
            userTaskMap[user._id]={
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTask: 0,
                inProgressTask: 0,
                completedTask: 0,
            }
        })
        userTask.forEach((task=>{
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser)=>{
                    if (userTaskMap[assignedUser._id]) {
                        userTaskMap[assignedUser._id].taskCount +=1;
                        if (task.status==="Pending") {
                            userTaskMap[assignedUser._id].pendingTask +=1;
                        } else if (task.status==="In Progress") {
                            userTaskMap[assignedUser._id].inProgressTask +=1;
                        } else if (task.status==="Completed") {
                            userTaskMap[assignedUser._id].completedTask +=1;
                        }
                    }
                })
            }
        }))
        const workbook =new excelJs.Workbook();
        const worksheet = workbook.addWorksheet("User Task Report")
        worksheet.columns = [
            { header: "User Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Assigned Tasks", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTask", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTask", width: 20 },
            { header: "Completed Tasks", key: "completedTask", width: 20 },
        ]
        Object.values(userTaskMap).forEach((user)=>{
            worksheet.addRow(user)
        })
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            'attachment; filename="tasks_report.xlsx"'
        );
        return workbook.xlsx.write(res).then(()=>{
            res.end()
        });
    }catch(err) {
        return res.status(500).json({ message: "Server error", error: err.message }); 
    }
}

module.exports = {exportTasksReport,exportUsersReport}