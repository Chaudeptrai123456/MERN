import React, { Children, useContext } from 'react'
import { UserContext } from '../../context/userContext'
import NarBar from './NarBar'
import SideMenu from './SideMenu'
const DashBoardLayout = ({children,activeMenu}) => {
  const {user} = useContext(UserContext)
    return (
    <div className=''>
        <NarBar activeMenu={activeMenu}/>
            {user && (
                <div className='flex'>
                    <div className='max-[1080px]:hidden'>
                        <SideMenu  activeMenu={activeMenu}/>
                    </div>
                    <div className='grow mx-5'>{children}</div>
                </div>
            )}
    </div>
  )
}

export default DashBoardLayout