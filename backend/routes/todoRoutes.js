const express = require("express")
const router = express.Router();
const mongoose = require("mongoose");
const Todo=require("../models/todo")

const ensureObjectId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "유효하지 않은 ID 형식입니다." });
    return false;
  }
  return true;
};


// ➤ 할 일 추가
router.post("/", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (err) {
    res.status(400).json({ error: "할 일을 저장하지 못했습니다." });
  }
});


router.get("/",async(req,res)=>{
    try {
        const todos=await Todo.find().sort({createdAt:-1})
        res.json(todos)
    } catch (error) {
        res.status(500).json({message:"데이터를 불러오지 못했습니다.",error})
    }
})

// 한개 불러오기
router.get("/:id", async (req, res) => {
  try {
    // 1) 파라미터에서 id 추출
    const { id } = req.params;

    // 2) ObjectId 형식 검증
   if (!ensureObjectId(id, res)) return;

    // 3) 단건 조회
    const todo = await Todo.findById(id);
     console.log(todo)

    // 4) 결과 없을 때 404
    if (!todo) {
      return res.status(404).json({ message: "해당 ID의 todo가 없습니다." });
    }

    // 5) 성공 응답
    return res.status(200).json({ message: "1개 todo 불러오기 성공.", todo });
  } catch (error) {
    // 6) 예외 처리
    return res.status(500).json({ message: "데이터를 불러오지 못했습니다.", error });
  }
});


// 한개 수정하기
router.put("/:id", async (req, res) => {
  try {
    // 1) 파라미터/바디 추출
    const { id } = req.params;
    const updateData = req.body;

    // 2) ObjectId 형식 검증
  if (!ensureObjectId(id, res)) return;

    // 3) 업데이트 실행
    const updated = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,           // 갱신된 문서 반환
      runValidators: true, // 스키마 검증
    });

    // 4) 결과 검증
    if (!updated) {
      return res.status(404).json({ message: "해당 ID의 todo가 없습니다." });
    }

    // 5) 성공 응답
    return res.status(200).json({ message: "1개 수정하기 성공.", todo: updated });
  } catch (error) {
    // 6) 예외 처리
    return res.status(500).json({ message: "데이터를 불러오지 못했습니다.", error });
  }
});



// 한개 삭제하기
router.delete("/:id", async (req, res) => {
  try {
    // 1) 파라미터에서 id 추출
    const { id } = req.params;

    // 2) ObjectId 형식 검증
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "유효하지 않은 ID 형식입니다." });
    }

    // 3) 삭제 실행
    const deleted = await Todo.findByIdAndDelete(id);

    // 4) 대상 없음 처리
    if (!deleted) {
      return res.status(404).json({ message: "해당 ID의 todo가 없습니다." });
    }

    // 5) 남은 목록 재조회(최신순)
    const remaining = await Todo.find().sort({ createdAt: -1 });

    // 6) 성공 응답
    return res.status(200).json({
      message: "1개 삭제하기 성공.",
      deletedId: deleted._id,
      todos: remaining,
    });
  } catch (error) {
    // 7) 예외 처리
    return res.status(500).json({ message: "데이터를 불러오지 못했습니다.", error });
  }
});

//  체크만 수정
router.patch("/:id/check", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ensureObjectId(id, res)) return;

    const { isCompleted } = req.body;
    if (typeof isCompleted !== "boolean") {
      return res.status(400).json({ message: "isCompleted는 boolean이어야 합니다." });
    }

    const updated = await Todo.findByIdAndUpdate(
      id,
      { isCompleted },
      { new: true, runValidators: true, context: "query" }
    );

    if (!updated) {
      return res.status(404).json({ message: "해당 ID의 todo가 없습니다." });
    }
    return res.status(200).json({ message: "체크상태 수정 성공", todo: updated });
  } catch (error) {
    return res.status(500).json({ message: "수정중 오류가 발생", error });
  }
});
router.patch("/:id/text", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ensureObjectId(id, res)) return;

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "text는 필수 입니다." });
    }

    const updated = await Todo.findByIdAndUpdate(
      id,
      { text: text.trim() },
      { new: true, runValidators: true, context: "query" }
    );

    if (!updated) {
      return res.status(404).json({ message: "해당 ID의 todo가 없습니다." });
    }
    return res.status(200).json({ message: "텍스트 수정 성공", todo: updated });
  } catch (error) {
    return res.status(500).json({ message: "수정중 오류가 발생", error });
  }
});


module.exports = router;