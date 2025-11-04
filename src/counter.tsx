/** @jsx createElement */
import { createElement, useState, ComponentProps } from './jsx-runtime';

// ButtonProps interface
interface ButtonProps extends ComponentProps {
  onClick?: () => void;
  className?: string;
}

// Button component
const Button = (props: ButtonProps) => {
  const { onClick, children, className = '' } = props;
  
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

// CounterProps interface
interface CounterProps extends ComponentProps {
  initialCount?: number;
}

// Counter component with state management
const Counter = (props: CounterProps) => {
  const { initialCount = 0 } = props;
  
  // Use useState for count value
  const [getCount, setCount] = useState(initialCount);
  const count = getCount();
  
  // Handler functions
  const increment = () => {
    setCount(count + 1);
  };
  
  const decrement = () => {
    setCount(count - 1);
  };
  
  const reset = () => {
    setCount(initialCount);
  };
  
  const incrementBy5 = () => {
    setCount(count + 5);
  };
  
  // Return JSX structure
  return (
    <div className="counter">
      <h2>🔢 Counter Component</h2>
      <div className="count-display">{count}</div>
      <div className="buttons">
        <Button onClick={increment} className="btn-primary">
          ➕ Increment
        </Button>
        <Button onClick={decrement} className="btn-secondary">
          ➖ Decrement
        </Button>
        <Button onClick={incrementBy5} className="btn-success">
          ⚡ +5
        </Button>
        <Button onClick={reset} className="btn-danger">
          🔄 Reset
        </Button>
      </div>
    </div>
  );
};

export { Counter };