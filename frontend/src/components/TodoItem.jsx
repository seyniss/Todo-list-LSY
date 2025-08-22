import './TodoItem.css'
import { useEffect, useState } from 'react';

const TodoItem = ({ todo, updatedChecked, onUpdateTodo, onDelete }) => {
  const isCompleted = !!todo.isCompleted;
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(todo.text);

  // ✅ date를 우선 사용하고, 없으면 createdAt
  const toYmd = (d) => new Date(d).toISOString().slice(0, 10);
  const pickDate = (t) => t?.date ?? t?.createdAt ?? new Date();

  const [dateStr, setDateStr] = useState(toYmd(pickDate(todo)));

  // ✅ 외부 todo가 갱신되면(서버 업데이트 반영) 편집 중이 아닐 때 동기화
  useEffect(() => {
    if (!editing) {
      setText(todo.text);
      setDateStr(toYmd(pickDate(todo)));
    }
  }, [todo, editing]);

  const startEdit = () => {
    setText(todo.text);
    setDateStr(toYmd(pickDate(todo))); // ✅ 편집 시작값도 date 우선
    setEditing(true);
  };
  const cancelEdit = () => {
    setText(todo.text);
    setDateStr(toYmd(pickDate(todo)));
    setEditing(false);
  };

  const saveEdit = async () => {
    const nextText = text.trim();
    const prevYmd = toYmd(pickDate(todo));

    if (!nextText || (nextText === todo.text && prevYmd === dateStr)) {
      return setEditing(false);
    }

    // 날짜 문자열 → ISO (서버가 Date로 캐스팅)
    const nextDateISO = new Date(`${dateStr}T00:00:00`).toISOString();

    await onUpdateTodo(todo._id, { text: nextText, date: nextDateISO });
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  };

  return (
    <div className={`TodoItem ${isCompleted ? 'is-completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => updatedChecked(todo._id, !todo.isCompleted)}
      />

      {editing ? (
        <div className='edit-wrap'>
          <input
            className="edit-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="수정할 내용을 입력하세요"
          />
          <div className="date">
            <input
              className="edit-date"
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
            />
          </div>
          <div className="btn-wrap">
            <button className="updateBtn" onClick={saveEdit} disabled={!text.trim()}>
              저장하기
            </button>
            <button className="deleteBtn" onClick={cancelEdit}>취소</button>
          </div>
        </div>
      ) : (
        <div className="content-wrap">
          <div className="content">{todo.text}</div>
          <div className="date">
            {/* ✅ 표시도 date를 우선 사용 */}
            {new Date(pickDate(todo)).toLocaleDateString("sv-SE")}
          </div>
          <div className="btn-wrap">
            <button className="updateBtn" onClick={startEdit}>수정</button>
            <button className="deleteBtn" onClick={() => onDelete(todo._id)}>삭제</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
