import React, { useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'; 
import Input from '../../components/inputs/Input.jsx'; // Không có dấu ngoặc nhọn {}
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPath.js';
import { UserContext } from '../../context/userContext.jsx';
const Login = () => {
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const handleLogin= async (e) =>{
    e.preventDefault();
    if (!validateEmail(email)){
      setError("Please enter a valid email address ")
      return;
    }
    if (!password) {
      setError("Please enter a password")
      return;
    }
    setError("");
    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,password
      })
      const {tokenAccess , role} = res.data;
      if (tokenAccess) {
        localStorage.setItem("token",tokenAccess)
        console.log(res.data)
        updateUser(res.data)
      }
      if (role === "admin") {
        navigate("/admin/dashboard")
      } else {
        navigate("/user/dashboard")
      }
    }catch(error) {
      if (error.res && error.res.data.message) {
        setError(error.res.data.message)
      } else {
        setError("Something went wrong. Please try again later")
      }
    }
  }
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>WelCome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] md-6'>TaskMager
            Please enter your email and password to login
        </p>
        <form onSubmit={handleLogin}>
          <Input 
            value={email}
            onChange={({target})=>setEmail(target.value)}
            label="Email Address"
            placeholder="test@gmail.com"
            type="text"
          />
          <Input 
            value={password}
            onChange={({target})=>setPassword(target.value)}
            label="Password"
            placeholder="At least 8 characters"
            type="password"
          />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary'>
              LOGIN
          </button>
          <p className='text-[13px] text-slate-800 mt-3 text-center w-full'> 
            Don't have an account ? 
            <Link className='font-medium text-primary underline' to="/signup">
              SIGN UP
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login