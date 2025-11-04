/** @jsx createElement */
import { createElement, mount } from './jsx-runtime';
import { Counter } from './counter';
import { TodoApp } from './todo-app';

// Main App component
const App = () => {
  return (
    <div>
      <div className="app-header">
        <h1>🚀 JSX Without React</h1>
        <p>Custom JSX Runtime Implementation - Lab 2</p>
      </div>
      
      <div className="app-container">
        <Counter initialCount={0} />
        <TodoApp />
      </div>
    </div>
  );
};

// Mount the app
const root = document.getElementById('root');
if (root) {
  mount(<App />, root);
} else {
  console.error('Root element not found');
}