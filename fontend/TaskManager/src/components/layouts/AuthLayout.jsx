import React from 'react'
import UI_backgroud from "../../assets/backendgroudnLoginPage.png"
import backgroundLelf  from "../../assets/backendgroudnLoginPage.png"
const AuthLayout = ({children}) => {
  return (
    <div className='flex'>
      <div className='w-screen h-screen md:w-[50vw] px-12 pt-8 pb-12 flex'
      >
        <h2 className='text-lg font-medium text-black'>TaskMager</h2>
        <div className='w-[60vh] h-[10h] pt-8 pd-8 space-y-6'>
          {children}
        </div>
      </div>
      {/* Thay đổi ở đây: Sử dụng ảnh làm background cho div */}
      <div
        className='hidden md:flex w-[vw] h-screen items-center justify-center bg-no-repeat bg-center overflow-hidden'
      >
          <img className='w-screen lg:w-[90%]' src = {backgroundLelf}>
          </img>
      </div>
    </div>
  )
}

export default AuthLayout