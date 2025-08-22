const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
            trim: true,       // 입력 앞뒤 공백 제거
        },
        isCompleted: {
            type: Boolean,
            default: false,   // 체크 여부
        },
        date: {
            type: Date,
            default: Date.now, // 등록 날짜
        },
    },
    {
        timestamps: true, // createdAt, updatedAt 자동 생성

    }
)


const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;