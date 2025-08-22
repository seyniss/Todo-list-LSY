import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'
import Header from './components/Header'
import TodoEditor from './components/TodoEditor'
import TodoList from './components/TodoList'
import {api,ensureGuestAuth} from './lib/api'
function App() {

  const [todos, setTodos] = useState([])
  const API = `${import.meta.env.VITE_API_URL}/api/todos`

  useEffect(() => {
    const fetchTodos = async () => {
      try {

        await ensureGuestAuth()
        const res = await api.get(API)
        const data = Array.isArray(res.data) ?
          res.data : res.data.todos ?? []

        setTodos(data)
        console.log(data)

      } catch (error) {
        console.log("가져오기 실패", error)
      }
    }
    fetchTodos()
  }, [])



  const onCreate = async (todoText) => {
    if (!todoText.trim()) return

    try {

      const res = await api.post(API, { text: todoText.trim() })

      const created = res.data?.todo ?? res.data

      if (Array.isArray(res.data?.todos)) {
        setTodos(res.data.todos)
      } else {
        setTodos(prev => [created, ...prev])
      }

    } catch (error) {
      console.log("추가 실패", error)
    }
  }
  const onDelete = async (id) => {
    try {
      if (!confirm("정말 삭제할까요?")) return

      const { data } = await api.delete(`${API}/${id}`)

      if (Array.isArray(data?.todos)) {
        setTodos(data.todos)
        return
      }

      const deletedId = data?.deletedId ?? data?.todo?._id ?? data?._id ?? id
      setTodos((prev) => prev.filter((t) => t._id !== deletedId))
    } catch (error) {
      console.error("삭제 실패", error)
    }
  }
  const onUpdateChecked = async (id, next) => {

    try {

      const { data } = await api.patch(`${API}/${id}/check`, {
        isCompleted: next
      })

      if (Array.isArray(data?.todos)) {
        setTodos(data.todos)
      } else {
        const updated = data?.todo ?? data;
        setTodos(
          prev => prev.map(t => (t._id === updated._id ? updated : t))
        )
      }
    } catch (error) {
      console.error("체크 상태 업데이트 실패", error)
    }

  }
  const onUpdateText = async (id, next) => {
    const value = next?.trim()

    if (!value) return


    try {

      const { data } = await api.patch(`${API}/${id}/text`, {
        text: value
      })

      if (Array.isArray(data?.todos)) {
        setTodos(data.todos)
      } else {
        const updated = data?.todo ?? data;
        setTodos(
          prev => prev.map(t => (t._id === updated._id ? updated : t))
        )
      }
    } catch (error) {
      console.error("체크 상태 업데이트 실패", error)
    }

  }
  const onUpdate = async (id, next) => {
    try {
      const current = Array.isArray(todos) ? todos.find(t => t._id == id) : null
      if (!current) throw new Error("해당 ID의 todo가 없습니다.")

      const { data } = await api.put(`${API}/${id}`, next)

      const updated = data?.updated ?? data?.todo ?? data;
      setTodos(
        prev => prev.map(t => (t._id === updated._id ? updated : t))
      )

    } catch (error) {
      console.error("Todo update 실패", error)
    }
  }

  const onUpdateTodo = async (id, next) => {
    try {
      await onUpdate(id, next)

    } catch (error) {
      console.error("Todo update 실패", error)

    }
  }

  return (
    <div className='App'>
      <Header />
      <TodoEditor onCreate={onCreate} />
      <TodoList
        todos={Array.isArray(todos) ? todos : []}
        onUpdateChecked={onUpdateChecked}
        onUpdateTodo={onUpdateTodo}
        onDelete={onDelete} />
    </div>
  )
}

export default App
