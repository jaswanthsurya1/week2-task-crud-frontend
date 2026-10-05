import { useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./services/api";

const emptyForm = {
  title: "",
  description: "",
};

function normalizeTasks(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.tasks)) return data.tasks;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadTasks() {
    setLoading(true);
    setError("");

    try {
      const data = await getTasks();
      setTasks(normalizeTasks(data));
    } catch (err) {
      setError(err.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title || "",
      description: task.description || "",
    });
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId !== null) {
        await updateTask(editingId, {
          title: form.title.trim(),
          description: form.description.trim(),
        });
        setSuccess("Task updated successfully.");
      } else {
        await createTask({
          title: form.title.trim(),
          description: form.description.trim(),
        });
        setSuccess("Task created successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Unable to save task.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      await deleteTask(id);
      setSuccess("Task deleted successfully.");
      await loadTasks();
    } catch (err) {
      setError(err.message || "Unable to delete task.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">WEEK 2 • CRUD FRONTEND</p>
          <h1>Task Manager</h1>
          <p className="subtitle">
            A React frontend connected to your Week 1 Task REST API.
          </p>
        </div>
        <button className="refresh-button" onClick={loadTasks} disabled={loading}>
          ↻ Refresh
        </button>
      </header>

      <main className="content">
        <section className="card form-card">
          <div className="section-heading">
            <div>
              <p className="section-label">{editingId !== null ? "EDIT" : "CREATE"}</p>
              <h2>{editingId !== null ? "Edit task" : "Add a new task"}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Complete assignment"
                disabled={saving}
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Add a short description..."
                rows="4"
                disabled={saving}
              />
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Task"
                  : "Create Task"}
              </button>

              {editingId !== null && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <p className="section-label">READ</p>
              <h2>Your tasks</h2>
            </div>
            <span className="count">{tasks.length}</span>
          </div>

          {loading ? (
            <div className="state">
              <div className="spinner" />
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>Create your first task using the form above.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <article className="task" key={task.id}>
                  <div className="task-info">
                    <h3>{task.title || "Untitled task"}</h3>
                    <p>{task.description || "No description"}</p>
                    <small>ID: {task.id}</small>
                  </div>

                  <div className="task-actions">
                    <button
                      className="edit-button"
                      onClick={() => startEdit(task)}
                      disabled={deletingId === task.id}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                    >
                      {deletingId === task.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        Week 2 Task CRUD • React + Vite • Backend: localhost:3000
      </footer>
    </div>
  );
}