
import './App.css'
import React, { useEffect, useState } from "react";
import axios from "axios";

import Header from './components/Header'
import TodoEditor from './components/TodoEditor'
import TodoList from './components/TodoList'
import { api, ensureGuestAuth } from './lib/api';   // <-- 추가
function App() {
  const API = '/api/todos'; // baseURL에 붙습니다.

  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // 1) 게스트 인증(쿠키 발급)
        await ensureGuestAuth();

        const res = await api.get(API);
        const data = Array.isArray(res.data) ? res.data : res.data.todos ?? [];
        setTodos(data);
        console.log(data); // (선택) 디버깅
      } catch (error) {
        console.log("가져오기 실패", error);
      }
    };
    fetchTodos();
  }, []);



  const onCreate = async (todoText) => {
    // (a) 입력 검증
    if (!todoText?.trim()) return;

    try {
      // (b) 서버로 전송
      const res = await api.post(API, { text: todoText.trim() });

      // (c) 응답 정규화(단일 문서 or { todos: [] })
      const created = res.data?.todo ?? res.data;

      // (d) 상태 갱신
      if (Array.isArray(res.data?.todos)) {
        setTodos(res.data.todos);
      } else {
        setTodos(prev => [created, ...prev]);
      }
    } catch (error) {
      // (e) 실패 처리
      console.log("추가 실패", error);
    }
  };
  // 1) 토글 핸들러
  const onUpdatedChecked = async (id, next) => {
    try {
      const { data } = await api.patch(`${API}/${id}/check`, { isCompleted: next });

      if (Array.isArray(data?.todos)) {
        // 서버가 전체 배열을 돌려주는 경우
        setTodos(data.todos);
      } else {
        // 서버가 단일 문서를 돌려주는 경우
        const updated = data?.todo ?? data;
        setTodos(prev => prev.map(t => (t._id === updated._id ? updated : t)));
      }
    } catch (error) {
      console.error("체크 상태 업데이트 실패", error);
    }
  };
  const updatedText = async (id, next) => {

    const value = next?.trim()
    if (!value) return
    try {
      const { data } = await api.patch(`${API}/${id}/text`, { text: value })


      if (Array.isArray(data?.todos)) {
        setTodos(data.todos)
      }
      else {
        const updated = data?.todo ?? data;
        setTodos((prev) => prev.map(t => (t._id === updated._id ? updated : t)))
      }
    } catch (error) {
      console.error(" 체크 상태 업데이트 실패", error)
    }
  }
  const putTodo = async (id, partial) => {
    const current = Array.isArray(todos) ? todos.find(t => t._id === id) : null;
    if (!current) throw new Error('해당 ID의 todo를 찾을 수 없습니다.');

    const payload = { ...current, ...partial }; // 전체 교체 대비
    const { data } = await api.put(`/api/todos/${id}`, payload);
    const updated = data?.updated ?? data?.todo ?? data;

    setTodos(prev => prev.map(t => (t._id === updated._id ? updated : t)));
    return updated;
  };
  const onUpdateTodo = async (id, partial) => {
    try {
      await putTodo(id, partial); // { text, date } 등
    } catch (e) {
      console.error('텍스트/날짜 업데이트 실패', e);
    }
  };
  const onDelete = async (id) => {
    try {
      const { data } = await api.delete(`${API}/${id}`);

      // 1) 서버가 남은 목록을 내려주는 경우
      if (Array.isArray(data?.todos)) {
        setTodos(data.todos);
        return;
      }

      // 2) 서버가 삭제된 id(혹은 단일 문서)만 내려주는 경우
      const deletedId = data?.deletedId ?? data?.todo?._id ?? data?._id ?? id;

      setTodos((prev) => prev.filter((t) => t._id !== deletedId));
    } catch (error) {
      console.error("삭제 실패", error);
    }
  };

  return (
    <div className='App'>
      <Header />
      <TodoEditor onCreate={onCreate} />
      <TodoList
        todos={Array.isArray(todos) ? todos : []}
        updatedChecked={onUpdatedChecked}
        onDelete={onDelete}
        onUpdateTodo={onUpdateTodo}
      />
    </div>
  )
}

export default App
