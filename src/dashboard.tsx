import { createElement, useState } from "./jsx-runtime";
import { useEffect } from "./hooks";
import { 
  Card, 
  StatCard, 
  Button, 
  Input, 
  Badge, 
  ProgressBar,
  NavItem 
} from "./components";
import { BarChart, LineChart, PieChart, Sparkline } from "./charts";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Storage helpers
let persistedTodos: Todo[] = [];
let persistedCounterHistory: number[] = [];
let hasLoadedFromLocalStorage = false;

const Dashboard = () => {
  // State management
  const [todos, setTodos] = useState<Todo[]>([]);
  const [getInput] = useState<any>({ currentValue: "" });
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [loaded, setLoaded] = useState(false);
  const [counter, setCounter] = useState(0);
  const [counterHistory, setCounterHistory] = useState<number[]>([]);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load data from localStorage
  const loadData = () => {
    if (!hasLoadedFromLocalStorage) {
      try {
        const savedTodos = localStorage.getItem('todos');
        const savedCounter = localStorage.getItem('counter');
        const savedHistory = localStorage.getItem('counterHistory');
        
        if (savedTodos) {
          persistedTodos = JSON.parse(savedTodos);
          setTodos(persistedTodos);
        }
        
        if (savedCounter) {
          setCounter(parseInt(savedCounter, 10));
        }
        
        if (savedHistory) {
          persistedCounterHistory = JSON.parse(savedHistory);
          setCounterHistory(persistedCounterHistory);
        } else {
          setCounterHistory([0]);
        }
      } catch (error) {
        console.log('Could not load data');
      }
      hasLoadedFromLocalStorage = true;
    } else {
      setTodos(persistedTodos);
      setCounterHistory(persistedCounterHistory);
    }
    setLoaded(true);
  };

  // Save data to localStorage
  const saveTodos = (newTodos: Todo[]) => {
    persistedTodos = newTodos;
    try {
      localStorage.setItem('todos', JSON.stringify(newTodos));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  };

  const saveCounter = (value: number, history: number[]) => {
    try {
      localStorage.setItem('counter', value.toString());
      localStorage.setItem('counterHistory', JSON.stringify(history));
      persistedCounterHistory = history;
    } catch (error) {
      console.error('Failed to save counter:', error);
    }
  };

  // Load on first render
  if (!loaded()) {
    loadData();
  }

  // Todo handlers
  const handleAddTodo = () => {
    const text = (getInput as any).currentValue?.trim() || "";
    if (!text) return;
    const newTodos = [...todos(), { id: Date.now(), text, completed: false }];
    setTodos(newTodos);
    saveTodos(newTodos);
    (getInput as any).currentValue = "";
    const inputEl = (getInput as any).ref;
    if (inputEl) inputEl.value = "";
  };

  const handleToggleTodo = (id: number) => {
    const newTodos = todos().map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const handleDeleteTodo = (id: number) => {
    const newTodos = todos().filter((t) => t.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const handleClearAllTodos = () => {
    if (confirm('Are you sure you want to delete all todos?')) {
      setTodos([]);
      saveTodos([]);
    }
  };

  // Counter handlers
  const updateCounter = (newValue: number) => {
    setCounter(newValue);
    const newHistory = [...counterHistory(), newValue].slice(-20); // Keep last 20 values
    setCounterHistory(newHistory);
    saveCounter(newValue, newHistory);
  };

  const incrementCounter = () => updateCounter(counter() + 1);
  const decrementCounter = () => updateCounter(counter() - 1);
  const resetCounter = () => updateCounter(0);

  // Computed values
  const filteredTodos =
    filter() === "active"
      ? todos().filter((t) => !t.completed)
      : filter() === "completed"
      ? todos().filter((t) => t.completed)
      : todos();

  const todoStats = {
    total: todos().length,
    completed: todos().filter((t) => t.completed).length,
    active: todos().filter((t) => !t.completed).length,
    completionRate: todos().length > 0 
      ? Math.round((todos().filter((t) => t.completed).length / todos().length) * 100)
      : 0,
  };

  // Chart data
  const todoChartData = [
    { label: "Completed", value: todoStats.completed, color: "#10b981" },
    { label: "Active", value: todoStats.active, color: "#f59e0b" },
  ];

  const todoPieData = [
    { label: "Completed", value: todoStats.completed, color: "#10b981" },
    { label: "Active", value: todoStats.active, color: "#f59e0b" },
  ];

  const counterLineData = counterHistory().map((value, index) => ({
    label: `${index + 1}`,
    value: value,
  }));

  const activityData = [
    { label: "Mon", value: Math.abs(counterHistory()[0] || 0) },
    { label: "Tue", value: Math.abs(counterHistory()[1] || 0) },
    { label: "Wed", value: Math.abs(counterHistory()[2] || 0) },
    { label: "Thu", value: Math.abs(counterHistory()[3] || 0) },
    { label: "Fri", value: Math.abs(counterHistory()[4] || 0) },
    { label: "Sat", value: Math.abs(counterHistory()[5] || 0) },
    { label: "Sun", value: Math.abs(counterHistory()[6] || 0) },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed() ? 'sidebar-collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">📊</span>
            {!sidebarCollapsed() && <span className="logo-text">Dashboard</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed())}
          >
            {sidebarCollapsed() ? '→' : '←'}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <NavItem 
            icon="🏠" 
            label={sidebarCollapsed() ? "" : "Dashboard"}
            active={activeNav() === "dashboard"}
            onClick={() => setActiveNav("dashboard")}
          />
          <NavItem 
            icon="✅" 
            label={sidebarCollapsed() ? "" : "Tasks"}
            active={activeNav() === "tasks"}
            onClick={() => setActiveNav("tasks")}
          />
          <NavItem 
            icon="📈" 
            label={sidebarCollapsed() ? "" : "Analytics"}
            active={activeNav() === "analytics"}
            onClick={() => setActiveNav("analytics")}
          />
          <NavItem 
            icon="⚙️" 
            label={sidebarCollapsed() ? "" : "Settings"}
            active={activeNav() === "settings"}
            onClick={() => setActiveNav("settings")}
          />
        </nav>
        
        {!sidebarCollapsed() && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">👤</div>
              <div className="user-details">
                <div className="user-name">John Doe</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">
              {activeNav() === "dashboard" && "Dashboard Overview"}
              {activeNav() === "tasks" && "Task Management"}
              {activeNav() === "analytics" && "Analytics & Reports"}
              {activeNav() === "settings" && "Settings"}
            </h1>
            <p className="page-subtitle">Welcome back! Here's your overview</p>
          </div>
          <div className="header-right">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search..." 
                className="search-input"
              />
            </div>
            <button className="notification-btn">
              🔔
              <span className="notification-badge">{todos().length}</span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeNav() === "dashboard" && (
          <div className="dashboard-content">
            {/* Stats Cards */}
            <div className="stats-grid">
              <StatCard
                title="Total Tasks"
                value={todoStats.total}
                icon="📋"
                trend="+12%"
                trendUp={true}
                color="#3b82f6"
              />
              <StatCard
                title="Completed"
                value={todoStats.completed}
                icon="✅"
                trend="+8%"
                trendUp={true}
                color="#10b981"
              />
              <StatCard
                title="Active Tasks"
                value={todoStats.active}
                icon="⏳"
                trend="-5%"
                trendUp={false}
                color="#f59e0b"
              />
              <StatCard
                title="Counter Value"
                value={counter()}
                icon="🔢"
                color="#8b5cf6"
              />
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
              <Card className="chart-card">
                <BarChart 
                  data={todoChartData}
                  title="Task Status Distribution"
                  height={280}
                />
              </Card>
              
              <Card className="chart-card">
                <PieChart 
                  data={todoPieData}
                  title="Task Completion Ratio"
                  size={280}
                />
              </Card>
            </div>

            <div className="charts-grid">
              <Card className="chart-card full-width">
                <LineChart 
                  data={counterLineData}
                  title="Counter Activity Timeline"
                  height={280}
                  color="#8b5cf6"
                />
              </Card>
            </div>

            {/* Counter Widget */}
            <Card title="Counter Control" className="counter-widget">
              <div className="counter-display">
                <div className="counter-value">{counter()}</div>
                <div className="counter-label">Current Count</div>
              </div>
              <div className="counter-sparkline">
                <Sparkline data={counterHistory()} color="#8b5cf6" height={60} />
              </div>
              <div className="counter-actions">
                <Button onClick={decrementCounter} variant="secondary">−</Button>
                <Button onClick={incrementCounter} variant="primary">+</Button>
                <Button onClick={resetCounter} variant="danger">Reset</Button>
              </div>
            </Card>

            {/* Progress Card */}
            <Card title="Task Completion Progress">
              <div className="progress-info">
                <span>Overall Progress</span>
                <span className="progress-percentage">{todoStats.completionRate}%</span>
              </div>
              <ProgressBar 
                value={todoStats.completed} 
                max={todoStats.total}
                color="#10b981"
              />
              <div className="progress-stats">
                <div className="progress-stat">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value">{todoStats.completed}</span>
                </div>
                <div className="progress-stat">
                  <span className="stat-label">Remaining</span>
                  <span className="stat-value">{todoStats.active}</span>
                </div>
                <div className="progress-stat">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">{todoStats.total}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tasks View */}
        {activeNav() === "tasks" && (
          <div className="dashboard-content">
            <Card title="Task Management" className="tasks-card">
              {/* Add Todo Input */}
              <div className="task-input-group">
                <Input
                  placeholder="Add a new task..."
                  ref={(el: any) => ((getInput as any).ref = el)}
                  onInput={(e: any) => ((getInput as any).currentValue = e.target.value)}
                  onKeyPress={(e: any) => {
                    if (e.key === 'Enter') handleAddTodo();
                  }}
                  className="task-input"
                />
                <Button onClick={handleAddTodo} variant="primary">Add Task</Button>
              </div>

              {/* Filter Buttons */}
              <div className="task-filters">
                <div className="filter-buttons">
                  {["all", "active", "completed"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilter(type as any)}
                      className={`filter-btn ${filter() === type ? 'filter-btn-active' : ''}`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="task-stats-mini">
                  <Badge variant="info">{todoStats.total} total</Badge>
                  <Badge variant="success">{todoStats.completed} done</Badge>
                </div>
              </div>

              {/* Task List */}
              <div className="task-list">
                {filteredTodos.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No tasks found</p>
                  </div>
                ) : (
                  filteredTodos.map((todo) => (
                    <div key={todo.id} className="task-item">
                      <div className="task-checkbox">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => handleToggleTodo(todo.id)}
                        />
                      </div>
                      <span
                        className={`task-text ${todo.completed ? 'task-completed' : ''}`}
                        onClick={() => handleToggleTodo(todo.id)}
                      >
                        {todo.text}
                      </span>
                      <Button
                        onClick={() => handleDeleteTodo(todo.id)}
                        variant="danger"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {todos().length > 0 && (
                <div className="task-actions">
                  <Button onClick={handleClearAllTodos} variant="secondary" size="sm">
                    Clear All Tasks
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Analytics View */}
        {activeNav() === "analytics" && (
          <div className="dashboard-content">
            <div className="charts-grid">
              <Card className="chart-card">
                <BarChart 
                  data={activityData}
                  title="Weekly Activity"
                  height={300}
                />
              </Card>
              <Card className="chart-card">
                <PieChart 
                  data={todoPieData}
                  title="Task Distribution"
                  size={300}
                />
              </Card>
            </div>
            <Card className="full-width">
              <LineChart 
                data={counterLineData}
                title="Counter Trend Analysis"
                height={350}
                color="#3b82f6"
              />
            </Card>
          </div>
        )}

        {/* Settings View */}
        {activeNav() === "settings" && (
          <div className="dashboard-content">
            <Card title="Settings" className="settings-card">
              <div className="settings-section">
                <h3>General Settings</h3>
                <p>Configure your dashboard preferences</p>
                <div className="settings-options">
                  <div className="setting-item">
                    <span>Dark Mode</span>
                    <Badge variant="primary">Coming Soon</Badge>
                  </div>
                  <div className="setting-item">
                    <span>Notifications</span>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                  <div className="setting-item">
                    <span>Auto-save</span>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export { Dashboard };
