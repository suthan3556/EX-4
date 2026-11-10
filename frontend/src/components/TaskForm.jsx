import { useEffect, useState } from "react";

function TaskForm({ onSave, editingTask, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "Pending",
        priority: editingTask.priority || "Medium",
        dueDate: editingTask.dueDate
          ? editingTask.dueDate.slice(0, 10)
          : "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
      });
    }
  }, [editingTask]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        dueDate: form.dueDate || null,
      });

      if (!editingTask) {
        setForm({
          title: "",
          description: "",
          status: "Pending",
          priority: "Medium",
          dueDate: "",
        });
      }
    } catch (error) {
      alert(error.message || "Unable to save task");
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? "Edit Task" : "Create New Task"}</h2>

      <label>Task Title *</label>
      <input
        type="text"
        name="title"
        placeholder="Enter task title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <label>Description</label>
      <textarea
        name="description"
        placeholder="Enter task description"
        value={form.description}
        onChange={handleChange}
      />

      <label>Status</label>
      <select
        name="status"
        value={form.status}
        onChange={handleChange}
      >
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>

      <label>Priority</label>
      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <label>Due Date</label>
      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
      />

      <div className="form-buttons">
        <button type="submit" className="primary-btn">
          {editingTask ? "Update Task" : "Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            className="secondary-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;