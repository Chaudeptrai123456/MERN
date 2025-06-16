export const BASE_URL = "http://localhost:9999";
// export const BASE_URL = "http://backend:9999";

export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        GET_PROFILE: "/api/auth/profile",
        UPLOAD_PROFILEURL: "/api/auth/upload-single",
    },
    USER:{
        GET_ALL_USERS: "/api/users",
        GET_USER_BY_ID:(userId)=>`/api/users/${userId}`,
        CREATE_USER: "/api/user",
        UPDATE_USER: (userId)=>`/api/users/${userId}`,
        DELETE_USER: (userId)=>`/api/users/${userId}`
    },

    TASK:{
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
        GET_USER_DASHBOARD_DATA:   '/api/tasks/user-dashboard-data',
        GET_ALL_TASK: "/api/tasks",
        GeT_TASK_STATUS: (status)=>`/api/tasks?status=${status}`,
        GET_TASK_BY_ID: (taskId)=>`/api/tasks/${taskId}`,
        CREATE_TASK: "/api/tasks/create-task",
        UPDATE_TASK: (taskId)=>`/api/tasks/${taskId}`,
        DELETE_TASK: (taskId)=>`/api/tasks/${taskId}`,
        UPDATE_TASK_STATUS: (taskId)=>`/api/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKlIST: (taskId)=>`/api/tasks/${taskId}/todo`,
        UPLOAD_FILE : (taskId)=>`/api/tasks/${taskId}/uploadFile`
    },
    REPORT:{
        EXPORT_TASKS:"/api/report/export/tasks",
        EXPORT_USER:"/api/report/export/users",
    }
}