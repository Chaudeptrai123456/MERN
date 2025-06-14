import React, { useState } from 'react'
import { useContext } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector'
import Input from '../../components/inputs/Input.jsx'; // Không có dấu ngoặc nhọn {}
import { Link, useNavigate } from 'react-router-dom'; 
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosInstance.js';
import { API_PATHS } from '../../utils/apiPath.js';
import { UserContext } from '../../context/userContext.jsx';

const SignUp = () => {
  const [profilePic,setProfilePic] = useState(null)
  const [fullName,setFullName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [adminInviteToken,setAdminInviteToken] = useState("")
  const [error,setError] = useState("")
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext); 

  const handleSignup = async (e)=>{
      e.preventDefault();
      if (!validateEmail(email)){
        setError("Please enter a valid email address ")
        return;
      }
      if (!password) {
        setError("Please enter a password")
        return;
      }
      if (!fullName) {
        setError("Please enter fullname")
        return;
      }
      setError("")
      //SignUp Api
      try {
        const res = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
          name:fullName,
          email,
          password,
          adminInviteToken
        })
        const {token,role} = res.data;
        if (token) {
          if (profilePic) {
            let res =  await uploadImage(token); // Gọi hàm uploadImage với token
          } else {
            console.log("No profile picture selected, skipping upload.");
          }
          
          localStorage.setItem("token",token)
          updateUser(res.data)

        }
        if (role === "admin") {
            navigate("/admin/dashboard")
        } else {
            navigate("/user/dashboard")
        }
      } catch(error) {
        if (error.res && error.res.data.message) {
        setError(error.res.data.message)
      } else {
        setError("Something went wrong. Please try again later")
      }
      }
    }
  const uploadImage=async(token)=> {
    try {
      if (!profilePic) {
          setError("Please select a profile picture")
          return;
      }
      console.log("test upload image")
      const formData = new FormData();
      formData.append('image', profilePic); 
      await axiosInstance.post(API_PATHS.AUTH.UPLOAD_PROFILEURL,formData,       
      {               
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': `Authorization ${token}` // Common format is "Bearer YOUR_TOKEN"
        }
      }
    );
    }catch(error) {
      setError(error.message)
    }
  }
  return (
      <AuthLayout>
      <div className='lg:w-[100%] h-3/4 md:h-full flex flex-col justify-center'>
          <h3 className='text-xl font-semibold text-black'>Create An Account</h3>
          <p className='text-xs text-slate-700 mt-[5px] mb-6'>
            Join us today by entering your detail below
          </p>
          <form onSubmit={handleSignup}>
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>
            <div className='grid grid-cols-1 mg:grid-cols-2 gap-4'>
              <Input 
                value={fullName}
                onChange={({target})=>setFullName(target.value)}
                label = "Full Name"
                placeholder="Chau"
                type="text"
              />
              <Input 
                value={password}
                onChange={({target})=>setPassword(target.value)}
                label = "Password"
                placeholder="At least 8 characters"
                type="password"
              />
              <Input 
                value={email}
                onChange={({target})=>setEmail(target.value)}
                label = "Email"
                placeholder="test@gmail.com"
                type="text"
              />
              <Input 
                value={adminInviteToken}
                onChange={({target})=>setAdminInviteToken(target.value)}
                label = "Admin Invite Token"
                placeholder="6-12 digits"
                type="text"
              />  

            </div>
                     {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button type='submit' className='btn-primary'>
              SIGN UP
          </button>
          <p className='text-[13px] text-slate-800 mt-3 text-center w-full'> 
            You have an account ? 
            <Link className='font-medium text-primary underline' to="/login">
                LOGIN
            </Link>
          </p>
          </form>
    
      </div>
      </AuthLayout>
  )
}

export default SignUp