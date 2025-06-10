// connect to mongose in dockerconst mongoose = require("mongoose");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Khi dùng Docker với root user, không cần thiết phải tạo user riêng trong app nữa
      // Nếu Châu muốn tạo user riêng cho app, cần thêm username/password vào URI hoặc options
    });
    console.log('MONGO_URI from env:', process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
  }
};

module.exports = connectDB;