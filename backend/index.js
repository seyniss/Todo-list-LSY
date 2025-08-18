const express = require("express")
const mongoose=require("mongoose")
const dotenv =require("dotenv")
const cors=require("cors")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000


mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDB 연결 성공"))
    .catch((err)=>console.log("연결 실패",err))


app.get('/',(req, res)=>{
    res.send("Hello Express")
})

app.listen(PORT,()=>{
    console.log(`서버가 ${PORT}번 포트에서 실행 중...`)
})