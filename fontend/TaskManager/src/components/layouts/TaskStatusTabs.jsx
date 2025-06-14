import React from 'react'

const TaskStatusTabs = ({tabs,activeTab,setActiveTab}) => {
  return (
    <div className='my-2'>
        {/* Removed JSON.stringify(tabs) */}
        <div className='flex'>
          {tabs.map((tab)=>{
            // Ensure you return the JSX for each button
            return (
              <button
                key={tab.name} // Use tab.name as the key
                className={`relative px-3 md:px-4 py-2 text-sm font-medium ${
                  // Compare activeTab with tab.name
                  activeTab === tab.name ? 'text-primary':'text-gray-500 hover:text-gray-700'
                } cursor-pointer`}
                onClick={()=>setActiveTab(tab.name)} // Set activeTab to tab.name
              >
                <div className=''>
                  <span className='text-xs'>{tab.name}</span> {/* Use tab.name for the label */}
                  <span
                    className={`text-xs ml-2 px-2 py-0.5 rounded-full ${
                      // Compare activeTab with tab.name
                      activeTab === tab.name ? "bg-primary text-white":"bg-gray-200/70 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
                {
                  // Compare activeTab with tab.name
                  activeTab === tab.name && (
                    <div className='absolute bottom-0 left-0 w-full h-0.5 bg-primary'>
                    </div>
                  )
                }
              </button>
            )
          })}
        </div>
    </div>
  )
}

export default TaskStatusTabs