import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "../components/TaskForm";

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      setError("");

      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      setError("Unable to load tasks. Check your backend server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function saveTask(formData) {
    try {
      if (editingTask) {
        await axios.put(
          `${API_URL}/${editingTask._id}`,
          formData
        );

        setEditingTask(null);
      } else {
        await axios.post(API_URL, formData);
      }

      await fetchTasks();
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to save task"
      );
    }
  }

  async function deleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/${id}`);

      if (editingTask?._id === id) {
        setEditingTask(null);
      }

      await fetchTasks();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete task"
      );
    }
  }

  async function updateStatus(task, status) {
    try {
      await axios.put(`${API_URL}/${task._id}`, {
        status,
      });

      await fetchTasks();
    } catch (err) {
      alert("Unable to update task status");
    }
  }

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <p className="eyebrow">STAY ORGANIZED</p>
          <h1>My Tasks</h1>
          <p>Manage your work, one task at a time.</p>
        </div>
      </div>

      <div className="tasks-layout">
        <section>
          <h2>All Tasks ({tasks.length})</h2>

          {loading && <p>Loading tasks...</p>}

          {error && <p className="error-message">{error}</p>}

          {!loading && !error && tasks.length === 0 && (
            <div className="empty-state">
              <h3>No tasks yet!</h3>
              <p>Create your first task using the form.</p>
            </div>
          )}

          <div className="task-list">
            {tasks.map((task) => (
              <article className="task-card" key={task._id}>
                <div className="task-card-top">
                  <h3>{task.title}</h3>

                  <span
                    className={`priority priority-${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p className="task-description">
                  {task.description || "No description provided"}
                </p>

                <p className="due-date">
                  Due Date:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "Not set"}
                </p>

                <label className="status-label">
                  Status
                  <select
                    value={task.status}
                    onChange={(event) =>
                      updateStatus(task, event.target.value)
                    }
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </label>

                <div className="task-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingTask(task);
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside>
          <TaskForm
            onSave={saveTask}
            editingTask={editingTask}
            onCancel={() => setEditingTask(null)}
          />
        </aside>
      </div>
    </div>
  );
}

export default Tasks;