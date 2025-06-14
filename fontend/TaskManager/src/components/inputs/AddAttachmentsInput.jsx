// import React from 'react'
// import { FaPlus} from 'react-icons/fa'
// import { LuPaperclip } from 'react-icons/lu'
// import { HiOutlineTrash } from 'react-icons/hi'
// import { useState

//  } from 'react'
// const AddAttachmentsInput = ({attachments,setAttachments}) => {
//     const [option,setOption]=useState("")
//     const handleAddOption = ()=>{
//         if (option.trim()) {
//             setAttachments([...attachments,option.trim()])
//             setOption("")
//         }
//     }
//      const handleDeleteOption = (index)=>{
//         const updatedArry = attachments.filter((_,idx)=>idx!==index)
//         setAttachments(updatedArry)
//     }     
//     return (
//         <div>
//             {attachments.map((item,index)=>{
//                 return (
//                     <div
//                         key={index}
//                         className='flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-1'
//                     >
//                         <div className='flex-1 flex items-center gap-3 border border-gray-100'>
//                             <LuPaperclip className='text-gray-400'/>
//                             <p className='text-xs text-black'>{item}</p>
//                         </div>    
//                         <button
//                             className='cursor-pointer'
//                             onClick={()=>{
//                                 handleDeleteOption(index)
//                             }}
//                         >
//                             <HiOutlineTrash className='text-lg text-red-500' />
//                         </button>
//                     </div>
//                 )
//             })}
//             <div className='flex items-center gap-5 mt-4' >
//                 <div className='flex-1 flex item-center gap-3 border border-gray-100 rounded-md mb-3 mt-1'>
//                     <LuPaperclip className='text-gray-400'/>
//                     <input
//                         type='text'
//                         placeholder='add file link'
//                         value={option}
//                         onChange={({target})=>setOption(target.value)}
//                         className='w-full text-[13px] text-black outline-none bg-white py-2'
//                     />
//                 </div>
//                 <button
//                     className='card-btn text-nowrap'
//                     onClick={handleAddOption}
//                 >
//                     <FaPlus className='text-lg'/>Add
//                 </button>
//             </div>
//         </div>
//     )
// }

// export default AddAttachmentsInput



import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { LuPaperclip } from 'react-icons/lu';
import { HiOutlineTrash } from 'react-icons/hi';

// Accepts string (URL) or File (Word/Excel/PDF)

export default function AddAttachmentsInput({ attachments, setAttachments }) {
  const [input, setInput] = useState('');
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // For resetting file input

  const handleAddLink = () => {
    if (input.trim()) {

      setAttachments([...attachments, input.trim()]);
      setInput('');
    }
  };

  const handleDelete = (idx) => {
    setAttachments(attachments.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const allowed = [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/pdf', // .pdf
    ];
    const file = files[0];
    if (!allowed.includes(file.type)) {
      alert('Only Word, Excel, or PDF files allowed!');
      setFileInputKey(Date.now());
      return;
    }
    setAttachments([...attachments, file]);
    setFileInputKey(Date.now());
  };

  const showAttachment = (item) => {
  if (typeof item === 'string') {
    return (
      <a
        href={item}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 underline break-all"
      >
        {item}
      </a>
    );
  }

  // Nếu là File (chưa upload)
  if (item instanceof File) {
    return (
      <span className="text-xs text-black">
        {item.name} ({Math.round(item.size / 1024)} KB)
      </span>
    );
  }

  // Nếu là object có downloadUrl (đã upload xong)
  if (typeof item === 'object' && item.downloadUrl) {
    return (
      <a
        href={item.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 underline break-all"
      >
        {item.originalname || 'File đính kèm'}
      </a>
    );
  }

  return null;
};

  return (
    <div>

      {attachments.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-1"
        >
          <div className="flex-1 flex items-center gap-3 border border-gray-100">
            <LuPaperclip className="text-gray-400" />

            {showAttachment(item)}
          </div>
          <button className="cursor-pointer" onClick={() => handleDelete(idx)} type="button">
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-100 rounded-md mb-3 mt-1">
          <LuPaperclip className="text-gray-400" />
          <input
            type="text"
            placeholder="add file link"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full text-[13px] text-black outline-none bg-white py-2"
          />
        </div>
        <button className="card-btn text-nowrap" onClick={handleAddLink} type="button">
          <FaPlus className="text-lg" />Add
        </button>
        <input
          key={fileInputKey}
          type="file"
          accept=".doc,.docx,.xls,.xlsx,.pdf"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="card-btn text-nowrap cursor-pointer flex items-center gap-1">
          <FaPlus className="text-lg" />
          Upload
        </label>
      </div>
    </div>
  );
}