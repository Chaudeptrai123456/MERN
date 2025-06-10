import React from 'react'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, payload: fullData } = payload[0]
    const percent = fullData.percent ?? null // optional: nếu muốn truyền thêm %

    // Màu sắc theo trạng thái
    const statusColor = {
      "Pending": "text-purple-600",
      "In Progress": "text-blue-600",
      "Completed": "text-green-600"
    }

    return (
      <div className="bg-white shadow-lg rounded-xl px-4 py-3 border border-gray-200 min-w-[150px]">
        <p className={`text-sm font-bold mb-1 ${statusColor[name] || "text-gray-700"}`}>
          {name}
        </p>
        <p className="text-sm text-gray-500">
          Count:&nbsp;
          <span className="font-semibold text-gray-900">{value}</span>
        </p>
        {percent !== null && (
          <p className="text-sm text-gray-500">
            Percent:&nbsp;
            <span className="font-semibold text-gray-900">{percent}%</span>
          </p>
        )}
      </div>
    )
  }
  return null
}

export default CustomTooltip
