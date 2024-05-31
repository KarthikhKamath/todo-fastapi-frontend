import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${apiUrl}/`);
      setTodos(response.data.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/`, { 
        name: newTodo,
        description: "", 
        completed: false
      });
      setNewTodo('');
      await fetchTodos(); 
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const updatedTodo = { ...todos.find(todo => todo.id === id), completed: !completed };
      await axios.put(`${apiUrl}/${id}`, updatedTodo);
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };
  

  return (
    <div className="container">
      <h2 className="title">My Todo App</h2>
      <div className="grid-container">
        <div className="form-container">
          <form className='form' onSubmit={handleAddTodo}>
            <input
              className="todo-input"
              type="text"
              placeholder="Enter your todo..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button
              className="add-button"
              type="submit"
              disabled={!newTodo.trim()}
            >
              Add Todo
            </button>
          </form>
        </div>
        <div className="todo-list">
          {todos.map(todo => (
            <div className="each">
            <div key={todo.id} className={`todo-item${todo.completed ? ' completed' : ''}`}>
            <div className="todo-content">
                <input
                type="checkbox"
                className="toggle-complete"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id, todo.completed)}
                />
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                {todo.name}
                </span>
            </div>
            <button
                className="delete-button"
                onClick={() => handleDeleteTodo(todo.id)}
            >
                Delete
            </button>
            </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
