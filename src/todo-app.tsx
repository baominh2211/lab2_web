/** @jsx createElement */
import { createElement, useState, ComponentProps } from './jsx-runtime';

// TypeScript interfaces
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoItemProps extends ComponentProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

interface AddTodoFormProps extends ComponentProps {
  onAdd: (text: string) => void;
}

// TodoItem component
const TodoItem = (props: TodoItemProps) => {
  const { todo, onToggle, onDelete } = props;
  
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
        {todo.text}
      </span>
      <button
        className="todo-delete"
        onClick={() => onDelete(todo.id)}
      >
        🗑️ Delete
      </button>
    </li>
  );
};

// AddTodoForm component
const AddTodoForm = (props: AddTodoFormProps) => {
  const { onAdd } = props;
  
  // State for input value
  const [getInputValue, setInputValue] = useState('');
  const inputValue = getInputValue();
  
  // Handle form submission
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };
  
  // Handle input change
  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  };
  
  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={inputValue}
        onInput={handleInput}
      />
      <button type="submit" className="btn-primary">
        ➕ Add Todo
      </button>
    </form>
  );
};

// Main TodoApp component
const TodoApp = () => {
  // State for todos array
  const [getTodos, setTodos] = useState<Todo[]>([]);
  const todos = getTodos();
  
  // Function to add a new todo
  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: Date.now()
    };
    setTodos([...todos, newTodo]);
  };
  
  // Function to toggle todo completion
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  // Function to delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Calculate statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  
  return (
    <div className="todo-app">
      <h2>✅ Todo List</h2>
      
      <AddTodoForm onAdd={addTodo} />
      
      {todos.length === 0 ? (
        <div className="empty-state">
          No todos yet. Add one above to get started!
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      )}
      
      <div className="todo-summary">
        <div>
          <div>Total</div>
          <strong>{totalTodos}</strong>
        </div>
        <div>
          <div>Completed</div>
          <strong>{completedTodos}</strong>
        </div>
        <div>
          <div>Active</div>
          <strong>{activeTodos}</strong>
        </div>
      </div>
    </div>
  );
};

export { TodoApp };