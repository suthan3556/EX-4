import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (err) {
        setError("Unable to load dashboard. Check your backend.");
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  const total = tasks.length;

  const pending = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const stats = [
    { title: "Total Tasks", value: total, icon: "📋" },
    { title: "Pending", value: pending, icon: "⏳" },
    { title: "In Progress", value: inProgress, icon: "⚡" },
    { title: "Completed", value: completed, icon: "✅" },
  ];

  if (loading) {
    return <p className="page-container">Loading dashboard...</p>;
  }

  return (
    <main className="page-container">
      <section className="welcome-banner">
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Manage your tasks smarter.</h1>
          <p>
            Organize your daily work and track your progress
            in one place.
          </p>

          <Link to="/tasks" className="primary-btn dashboard-link">
            + Create a Task
          </Link>
        </div>

        <div className="welcome-icon">🗂️</div>
      </section>

      {error && <p className="error-message">{error}</p>}

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.title}>
            <span className="stat-icon">{stat.icon}</span>
            <p>{stat.title}</p>
            <h2>{stat.value}</h2>
          </article>
        ))}
      </section>

      <section className="recent-section">
        <div className="section-heading">
          <div>
            <h2>Recent Tasks</h2>
            <p>Your latest tasks and their current status.</p>
          </div>

          <Link to="/tasks">View All →</Link>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <h3>Welcome to TaskFlow!</h3>
            <p>Start by creating your first task.</p>
          </div>
        ) : (
          <div className="recent-list">
            {tasks.slice(0, 5).map((task) => (
              <article className="recent-task" key={task._id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>
                    Priority: {task.priority}
                  </p>
                </div>

                <span className="status-badge">
                  {task.status}
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;