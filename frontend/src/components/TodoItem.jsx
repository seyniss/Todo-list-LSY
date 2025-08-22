import React, { useState, useEffect } from 'react'
import "./TodoItem.css"
const TodoItem = ({ todo, onDelete, onUpdateChecked, onUpdateTodo }) => {

  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(todo.text)
  const isCompleted = !!todo.isCompleted

  const toYmd = (d) => new Date(d).toISOString().slice(0, 10)//yyyy-mm-dd
  const pickDate = (t) => t?.date ?? t?.createdAt ?? new Date()

  const [dateStr, setDateStr] = useState(toYmd(pickDate(todo)))

  useEffect(() => {
    if (!editing) {
      setText(todo.text)
      setDateStr(toYmd(pickDate(todo)))
    }

  }, [todo, editing])

  const startEdit = () => {
    setText(todo.text)
    setDateStr(toYmd(pickDate(todo)))
    setEditing(true)
  }
  const cancleEdit = () => {
    setText(todo.text)
    setEditing(false)
  }

  const saveEdit = async () => {
    const next = text.trim()
    const prevYmd = toYmd(pickDate(todo))

    if (!next || next === todo.text && prevYmd === dateStr) {
      return setEditing(false)
    }

    const nextDateISO = new Date(`${dateStr}T00:00:00`).toISOString()

    await onUpdateTodo(todo._id, {
      text: next,
      date: nextDateISO
    })

    setEditing(false)
  }

  const handleKeyDown = () => {
    if (e.key == 'Enter') saveEdit()
    if (e.key == 'Escape') cancleEdit()
  }


  return (
    <div className={`TodoItem ${isCompleted ? 'isCompleted' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onUpdateChecked(todo._id, !todo.isCompleted)}
        readOnly />
      {editing ? (
        <div className="edit-wrap">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='수정할 내용을 입력하세요'
          />

          <div className="date">
            <input 
            type="date" 
            value={dateStr}
            onChange={(e)=>setDateStr(e.target.value)}
            />
          </div>
          <div className="btn-wrap">
            <button className="updateBtn" onClick={saveEdit}>저장하기</button>
            <button className="deleteBtn"
              onClick={cancleEdit}
            >취소</button>
          </div>
        </div>
      ) : (
        <div className="content-wrap">

          <div className="content">{todo.text}</div>
          <div className="date">{new Date(`${todo.date}`).toLocaleDateString()}</div>
          <div className="btn-wrap">
            <button className="updateBtn" onClick={startEdit}>수정</button>
            <button className="deleteBtn"
              onClick={() => onDelete(todo._id)}
            >삭제</button>
          </div>
        </div>)}


    </div>
  )
}

export default TodoItem