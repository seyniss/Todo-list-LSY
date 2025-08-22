import React, { useState } from 'react'
import "./TodoEditor.css"
const TodoEditor = ({ onCreate }) => {
  const [text, setText] = useState("");
  const submit = (e) => {
    e.preventDefault();

       if (!text.trim()) return;
    onCreate(text.trim());   // ① 부모의 onCreate 호출
    setText("");      // ② 입력 초기화
  };

  return (
    <div  >
      <form onSubmit={submit} className="Editor">

      <input placeholder="새로운 Todo..." value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit" disabled={!text.trim()}>추가</button>
      </form>
    </div>
  )
}

export default TodoEditor