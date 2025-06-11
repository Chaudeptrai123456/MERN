import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstanceFormData = axios.create({
    baseURL: BASE_URL,
    timeout: 30300000, // tăng timeout nếu upload file nặng
    headers: {
        Accept: "application/json",
        
        // KHÔNG set 'Content-Type' ở đây! Axios/browser sẽ tự set khi gửi FormData.
    }
});

// Thêm token nếu có
axiosInstanceFormData.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.authorization = `Authorization ${accessToken}`;
        }
        // Nếu gửi FormData (có config.data là FormData), KHÔNG set Content-Type!
        // Axios sẽ tự set boundary đúng chuẩn.
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý response/error 
axiosInstanceFormData.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = "/login";
                console.log("status 401")
            } else if (error.response.status === 500) {
                console.log("Server error. Please try again later");
            }
        } else if (error.code === "ECONNABORTED") {
            console.log("Request timeout. Please try again later");
        }
        return Promise.reject(error);
    }
);

export default axiosInstanceFormData;