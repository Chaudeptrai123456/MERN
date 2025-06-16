import React, { useContext } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Outlet,
    Navigate
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import PrivateRoute from "./routes/PrivateRoute"; // Đảm bảo PrivateRoute được định nghĩa đúng
import DashBoard from "./pages/Admin/DashBoard";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUser from "./pages/Admin/ManageUser";
import UserDashBoard from "./pages/User/UserDashBoard";
import MyTask from "./pages/User/MyTask";
import ViewTaskDetail from "./pages/User/ViewTaskDetail";
import { UserContext,UserProvider } from "./context/userContext"; // Import đúng cách
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <UserProvider>
            <div>
                <Router>
                    <Routes>
                        {/* Các route công khai */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signUp" element={<SignUp />} />

                        {/* Route gốc, điều hướng dựa trên vai trò hoặc trạng thái đăng nhập */}
                        <Route path="/" element={<Root />} />

                        {/* Nhóm các route Admin, sử dụng PrivateRoute làm element cho Route cha */}
                        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                            <Route path="/admin/dashboard" element={<DashBoard />} />
                            <Route path="/admin/tasks" element={<ManageTasks />} />
                            <Route path="/admin/users" element={<ManageUser />} />
                            <Route path="/admin/createtask" element={<CreateTask />} />
                        </Route>

                        {/* Nhóm các route User, sử dụng PrivateRoute làm element cho Route cha */}
                        {/* Lưu ý: Nếu user cũng là admin, thì allowedRoles={["admin", "user"]} hoặc tạo một PrivateRoute khác */}
                        {/* Hiện tại, PrivateRoute này chỉ cho phép admin, nên các route user sẽ không hoạt động nếu user không phải admin */}
                        <Route element={<PrivateRoute allowedRoles={["user", "admin"]} />}> {/* Sửa lại allowedRoles nếu user có thể truy cập */}
                            <Route path="/user/dashboard" element={<UserDashBoard />} />
                            <Route path="/user/my-tasks" element={<MyTask />} />
                            <Route path="/user/task-details/:id" element={<ViewTaskDetail />} />
                        </Route>
                    </Routes>
                </Router>
            </div>
            <Toaster 
                toastOptions={{
                    className:"",
                    style: {
                        fontSize:"13px"
                    }
                }}
            
            />
        </UserProvider>
    );
}

export default App;

const Root = () => {
    const { user, loading } = useContext(UserContext);
    console.log("Root component user:", user); // Log rõ ràng hơn
    
    // Nếu đang tải dữ liệu người dùng, hiển thị một placeholder hoặc loading indicator
    if (loading) {
        return <div>Loading user data...</div>; // Hoặc một component loading spinner
    }

    // Nếu không có người dùng (chưa đăng nhập), điều hướng về trang login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Nếu có người dùng, điều hướng dựa trên vai trò của họ
    return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />;
};
