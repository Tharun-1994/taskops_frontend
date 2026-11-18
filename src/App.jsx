
import { useEffect, useState } from "react";
import "./App.css";

const API = "/api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // GET /api/tasks
  useEffect(() => {
    fetch(API)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load tasks");
        return res.json();
      })
      .then(setTasks)
      .catch((err) => setError(err.message));
  }, []);

  // POST /api/tasks
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setError("");

      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) throw new Error("Unable to add task");

      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  };

  // PATCH /api/tasks/{id}/complete
  const completeTask = async (id) => {
    try {
      setError("");

      const response = await fetch(`${API}/${id}/complete`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Unable to complete task");

      const updated = await response.json();

      setTasks((prev) =>
        prev.map((task) => task.id === id ? updated : task)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="container">
      <h1>TaskOps V2</h1>
      <p>DevOps & SRE Learning Project- CACHE</p>

      <form onSubmit={addTask}>
        <input
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error">{error}</p>}

      <h2>Tasks</h2>

      {tasks.length === 0 && <p>No tasks found.</p>}

      {tasks.map((task) => (
        <div className="task" key={task.id}>
          <span>
            {task.completed ? "✅" : "⏳"} {task.title}
          </span>

          {!task.completed && (
            <button onClick={() => completeTask(task.id)}>
              Complete
            </button>
          )}
        </div>
      ))}
    </main>
  );
}
