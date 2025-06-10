import axios from "axios"
import { BASE_URL } from "./apiPath"

const axiosInstance  =axios.create({
    baseURL:BASE_URL,
    timeout: 1000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json",
    }
})
axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token")
        if (accessToken) {
            config.headers.authorization=`Authorization ${accessToken}`
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (res)=>{
        return res
    },
    (error)=>{
        if (error.response) {
            if (error.status === 401) {
                window.location.href="/login";
            }else if (error.status === 500) {
                console.log("Server error. Please try again later")
            }
        }else if (error.code === "ECONNABORTED") {
            console.log("Request timeout. Please try again later")
        }
        return Promise.reject(error)
    }
)
export default axiosInstance