import { createElement } from "./jsx-runtime";

// Card Component
interface CardProps {
  title?: string;
  children?: any;
  className?: string;
  style?: any;
}

export const Card = ({ title, children, className = "", style = {} }: CardProps) => (
  <div className={`card ${className}`} style={style}>
    {title && <h3 className="card-title">{title}</h3>}
    <div className="card-content">{children}</div>
  </div>
);

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export const StatCard = ({ title, value, icon, trend, trendUp, color = "#3b82f6" }: StatCardProps) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <div className="stat-icon" style={{ background: color }}>
        {icon}
      </div>
      {trend && (
        <span className={`stat-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </span>
      )}
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-title">{title}</div>
  </div>
);

// Button Component
interface ButtonProps {
  onClick?: () => void;
  children?: any;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export const Button = ({ 
  onClick, 
  children, 
  variant = "primary", 
  size = "md",
  disabled = false,
  className = ""
}: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-${variant} btn-${size} ${className}`}
  >
    {children}
  </button>
);

// Input Component
interface InputProps {
  value?: string;
  placeholder?: string;
  onInput?: (e: any) => void;
  onKeyPress?: (e: any) => void;
  type?: string;
  ref?: any;
  defaultValue?: string;
  className?: string;
}

export const Input = ({ 
  placeholder, 
  onInput, 
  onKeyPress,
  type = "text",
  ref,
  defaultValue = "",
  className = ""
}: InputProps) => (
  <input
    type={type}
    placeholder={placeholder}
    onInput={onInput}
    onKeyPress={onKeyPress}
    ref={ref}
    defaultValue={defaultValue}
    className={`input ${className}`}
  />
);

// Badge Component
interface BadgeProps {
  children?: any;
  variant?: "primary" | "success" | "warning" | "danger" | "info";
}

export const Badge = ({ children, variant = "primary" }: BadgeProps) => (
  <span className={`badge badge-${variant}`}>{children}</span>
);

// Progress Bar Component
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({ value, max = 100, color = "#3b82f6", showLabel = true }: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div 
          className="progress-bar-fill" 
          style={{ 
            width: `${percentage}%`,
            background: color
          }}
        />
      </div>
      {showLabel && (
        <span className="progress-bar-label">{Math.round(percentage)}%</span>
      )}
    </div>
  );
};

// Sidebar Nav Item Component
interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export const NavItem = ({ icon, label, active = false, onClick }: NavItemProps) => (
  <div 
    className={`nav-item ${active ? 'nav-item-active' : ''}`}
    onClick={onClick}
  >
    <span className="nav-icon">{icon}</span>
    <span className="nav-label">{label}</span>
  </div>
);
