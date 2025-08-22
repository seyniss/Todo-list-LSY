const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require('cookie-parser');

dotenv.config(); // .env의 MONGO_URI, PORT 등 로드
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin:process.env.FRONT_ORIGIN,
    credentials:true
}))

app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongodb연결 성공"))
  .catch((err) => console.log("연결 실패", err));


const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const todoRoutes = require("./routes/todoRoutes")
app.use("/api/todos",todoRoutes)




// 기본 라우트
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

// 서버 시작
app.listen(PORT, () => {
  console.log("Server is Running!~");
});
  