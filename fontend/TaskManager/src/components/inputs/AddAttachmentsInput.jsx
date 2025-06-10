import React from 'react'
import { FaPlus} from 'react-icons/fa'
import { LuPaperclip } from 'react-icons/lu'
import { HiOutlineTrash } from 'react-icons/hi'
import { useState

 } from 'react'
const AddAttachmentsInput = ({attachments,setAttachments}) => {
    const [option,setOption]=useState("")
    const handleAddOption = ()=>{
        if (option.trim()) {
            setAttachments([...attachments,option.trim()])
            setOption("")
        }
    }
     const handleDeleteOption = (index)=>{
        const updatedArry = attachments.filter((_,idx)=>idx!==index)
        setAttachments(updatedArry)
    }     
    return (
        <div>
            {attachments.map((item,index)=>{
                return (
                    <div
                        key={index}
                        className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-1'
                    >
                        <div className='flex-1 flex items-center gap-3 border border-gray-100'>
                            <LuPaperclip className='text-gray-400'/>
                            <p className='text-xs text-black'>{item}</p>
                        </div>    
                        <button
                            className='cursor-pointer'
                            onClick={()=>{
                                handleDeleteOption(index)
                            }}
                        >
                            <HiOutlineTrash className='text-lg text-red-500' />
                        </button>
                    </div>
                )
            })}
            <div className='flex items-center gap-5 mt-4' >
                <div className='flex-1 flex item-center gap-3 border border-gray-100 rounded-md mb-3 mt-1'>
                    <LuPaperclip className='text-gray-400'/>
                    <input
                        type='text'
                        placeholder='add file link'
                        value={option}
                        onChange={({target})=>setOption(target.value)}
                        className='w-full text-[13px] text-black outline-none bg-white py-2'
                    />
                </div>
                <button
                    className='card-btn text-nowrap'
                    onClick={handleAddOption}
                >
                    <FaPlus className='text-lg'/>Add
                </button>
            </div>
        </div>
    )
}

export default AddAttachmentsInput