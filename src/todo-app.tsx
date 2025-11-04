import { createElement, useState } from "./jsx-runtime";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Simple storage using a module-level variable that persists during the session
let persistedTodos: Todo[] = [];
let hasLoadedFromLocalStorage = false;

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [getInput] = useState<any>({ currentValue: "" });
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [loaded, setLoaded] = useState(false);

  // Load todos from localStorage on mount
  const loadTodos = () => {
    if (!hasLoadedFromLocalStorage) {
      try {
        const saved = localStorage.getItem('todos');
        if (saved) {
          persistedTodos = JSON.parse(saved);
          setTodos(persistedTodos);
        }
      } catch (error) {
        console.log('Could not load todos');
      }
      hasLoadedFromLocalStorage = true;
    } else {
      setTodos(persistedTodos);
    }
    setLoaded(true);
  };

  // Save todos to localStorage
  const saveTodos = (newTodos: Todo[]) => {
    persistedTodos = newTodos;
    try {
      localStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  };

  // Load on first render
  if (!loaded()) {
    loadTodos();
  }

  const handleAdd = () => {
    const text = (getInput as any).currentValue?.trim() || "";
    if (!text) return;
    const newTodos = [...todos(), { id: Date.now(), text, completed: false }];
    setTodos(newTodos);
    saveTodos(newTodos);
    (getInput as any).currentValue = "";
    const inputEl = (getInput as any).ref;
    if (inputEl) inputEl.value = "";
  };

  const handleToggle = (id: number) => {
    const newTodos = todos().map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const handleDelete = (id: number) => {
    const newTodos = todos().filter((t) => t.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete all todos?')) {
      setTodos([]);
      saveTodos([]);
    }
  };

  const filteredTodos =
    filter() === "active"
      ? todos().filter((t) => !t.completed)
      : filter() === "completed"
      ? todos().filter((t) => t.completed)
      : todos();

  const stats = {
    completed: todos().filter((t) => t.completed).length,
    total: todos().length,
  };

  return (
    <div
      style={{
        marginTop: "32px",
        padding: "20px",
        background: "#111827",
        borderRadius: "12px",
        boxShadow: "0 0 10px rgba(0,0,0,0.4)",
        color: "#f3f4f6",
      }}
    >
      <h2
        style={{
          marginBottom: "16px",
          color: "#e5e7eb",
          fontSize: "20px",
          textAlign: "center",
        }}
      >
        🧾 Todo Tracker (Dark)
      </h2>

      {/* input + button */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          alignItems: "center",
        }}
      >
        <input
          defaultValue=""
          ref={(el: any) => ((getInput as any).ref = el)}
          onInput={(e: any) => ((getInput as any).currentValue = e.target.value)}
          onKeyPress={(e: any) => {
            if (e.key === 'Enter') handleAdd();
          }}
          placeholder="Add a task..."
          style={{
            flex: 1,
            borderRadius: "6px",
            border: "1px solid #374151",
            background: "#1f2937",
            color: "#f9fafb",
            padding: "8px",
            fontSize: "14px",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <span style={{ color: "#9ca3af", fontSize: "13px" }}>
          ✅ {stats.completed} / {stats.total} done
        </span>

        <div style={{ display: "flex", gap: "6px" }}>
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              style={{
                background: filter() === type ? "#4f46e5" : "#1f2937",
                color: filter() === type ? "#fff" : "#d1d5db",
                border: "1px solid #374151",
                borderRadius: "6px",
                padding: "4px 10px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filteredTodos.length === 0 ? (
          <li
            style={{
              textAlign: "center",
              color: "#6b7280",
              padding: "10px 0",
            }}
          >
            Nothing here
          </li>
        ) : (
          filteredTodos.map((t) => (
            <li
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                background: "#1f2937",
                border: "1px solid #374151",
              }}
            >
              <span
                onClick={() => handleToggle(t.id)}
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  color: t.completed ? "#6b7280" : "#f9fafb",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                {t.text}
              </span>
              <button
                onClick={() => handleDelete(t.id)}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
      {todos().length > 0 && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <button
            onClick={handleClearAll}
            style={{
              background: "#374151",
              color: "#9ca3af",
              border: "1px solid #4b5563",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export { TodoApp };
