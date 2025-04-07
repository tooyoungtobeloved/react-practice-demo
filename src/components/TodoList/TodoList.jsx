import { useState } from 'react'
export default function TodoList() {
  const [todoList, setTodoList] = useState([])
  const [todo, setTodo] = useState('')
  function handleAdd() {
    setTodoList(pre => [...pre, { id: new Date().getTime(), content: todo }])
    setTodo('')
  }
  function handleDelete (id) {
    setTodoList(pre => pre.filter(item => item.id !== id))
  }
  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input value={todo} onChange={(e) => setTodo(e.target.value)} required type="text" placeholder="Add your task" />
        <div>
          <button onClick={handleAdd}>Submit</button>
        </div>
      </div>
      <ul style={{listStyle: 'none'}}>
        {
            todoList.map(item => {
                return (
                    <li key={item.id}>
                        <span>{item.content}</span>
                        <button onClick={() => handleDelete(item.id)}>delete</button>
                    </li>
                )
            })
        }
      </ul>
    </div>
  );
}
