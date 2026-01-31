import React, { useState } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  const addTask = () => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      status: 'Pending',
    };
    setTasks(prev => [newTask, ...prev]);
    setTitle('');
    setDescription('');
  };

  const markComplete = id => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filtered = tasks.filter(t => {
    if (filter === 'All') return true;
    return filter === 'Completed' ? t.status === 'Completed' : t.status === 'Pending';
  });

  return (
    <div className="container mt-4">
      <h1>Task Manager</h1>

      <div className="mb-3">
        <label className="form-label">Task Title</label>
        <input
          className="form-control"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Task Description</label>
        <input
          className="form-control"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={addTask}>Add Task</button>
      </div>

      <div className="mb-3">
        <label className="form-label me-2">Show:</label>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="form-select w-auto d-inline-block">
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No tasks</td>
            </tr>
          )}
          {filtered.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>
                {task.status === 'Pending' && (
                  <button className="btn btn-sm btn-success me-2" onClick={() => markComplete(task.id)}>Complete</button>
                )}
                <button className="btn btn-sm btn-danger" onClick={() => deleteTask(task.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;