# Modern Dashboard - Mini JSX Framework

A professional, production-ready web dashboard built with TypeScript and a custom JSX mini-framework (no React). Features interactive charts, real-time data updates, and a modern UI/UX.

## ✨ Features

### Core Functionality
- **Custom JSX Runtime**: Lightweight framework with hooks (useState, useEffect, useRef)
- **Interactive Dashboard**: Multi-page layout with sidebar navigation
- **Real-time Charts**: Bar, Line, Pie, and Sparkline visualizations
- **Task Management**: Full CRUD operations for todos with local storage persistence
- **Counter System**: Interactive counter with history tracking
- **Responsive Design**: Mobile-first approach with smooth transitions

### UI/UX Features
- 🎨 Modern, clean design with professional aesthetics
- 🌊 Smooth animations and hover effects
- 📱 Fully responsive layout (desktop, tablet, mobile)
- 🔔 Notification system
- 🔍 Search functionality
- 📊 Real-time data visualization
- 💾 Local storage persistence
- ⚡ Fast performance with Vite

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Development Server**
```bash
npm run dev
```
The dashboard will open at `http://localhost:5173`

3. **Production Build**
```bash
npm run build
```
Built files will be in the `dist` folder

4. **Preview Production Build**
```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── main.tsx              # Application entry point
├── dashboard.tsx         # Main dashboard component
├── components.tsx        # Reusable UI components
├── charts.tsx           # Chart components (Bar, Line, Pie, Sparkline)
├── jsx-runtime.ts       # Custom JSX runtime
├── hooks.ts             # Custom hooks (useEffect, useRef)
├── style.css            # Global styles and animations
├── globals.d.ts         # TypeScript declarations
├── jsx.d.ts             # JSX type definitions
└── index.html           # HTML entry point
```

## 🎯 Key Components

### Dashboard Pages

1. **Overview (Dashboard)**
   - Statistics cards with trends
   - Interactive charts (Bar, Pie, Line)
   - Counter widget with sparkline
   - Progress tracking

2. **Tasks**
   - Add/edit/delete tasks
   - Mark tasks as complete
   - Filter by status (all, active, completed)
   - Task statistics

3. **Analytics**
   - Weekly activity charts
   - Task distribution visualization
   - Counter trend analysis

4. **Settings**
   - User preferences
   - System configuration

### UI Components

- **StatCard**: Animated statistics cards with icons and trends
- **Card**: Container component with title and content
- **Button**: Multiple variants (primary, secondary, danger, success)
- **Input**: Styled input fields with focus states
- **Badge**: Status indicators
- **ProgressBar**: Animated progress tracking
- **NavItem**: Sidebar navigation items

### Chart Components

- **BarChart**: Displays data as vertical bars
- **LineChart**: Shows trends over time
- **PieChart**: Visualizes proportions with legend
- **Sparkline**: Mini inline charts for quick trends

## 💡 How It Works

### JSX Runtime

The custom JSX runtime provides React-like functionality:

```tsx
import { createElement, useState } from "./jsx-runtime";
import { useEffect } from "./hooks";

const MyComponent = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log("Count changed:", count());
  }, [count()]);
  
  return <div onClick={() => setCount(count() + 1)}>Count: {count()}</div>;
};
```

### State Management

State is managed using the custom `useState` hook:
- Returns a getter function and setter function
- Automatically triggers re-renders on state changes
- Supports any data type

### Data Persistence

- Todos and counter data persist in localStorage
- Automatic save on every change
- Loads existing data on page refresh

### Real-time Updates

Charts automatically update when:
- Todos are added, completed, or deleted
- Counter value changes
- Filters are applied

## 🎨 Customization

### Colors

Edit CSS variables in `style.css`:

```css
:root {
  --primary-color: #3b82f6;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  /* ... more variables */
}
```

### Adding New Charts

1. Create a new chart component in `charts.tsx`
2. Import and use in `dashboard.tsx`
3. Pass data from dashboard state

### Adding New Pages

1. Add a new nav item in the sidebar
2. Create the page content in `dashboard.tsx`
3. Add conditional rendering based on `activeNav` state

## 📦 Build Configuration

The project uses Vite for fast development and optimized production builds:

- **TypeScript**: Full type safety
- **JSX**: Custom JSX transform
- **CSS**: Modern CSS with custom properties
- **Assets**: Optimized and bundled

## 🔧 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run type-check # TypeScript type checking
```

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Performance

- Initial load: < 50KB (gzipped)
- Fast re-renders with efficient DOM updates
- Smooth 60fps animations
- Optimized chart rendering with Canvas API

## 🎓 Learning Resources

This project demonstrates:
- Building a JSX runtime from scratch
- Custom React-like hooks implementation
- Canvas-based data visualization
- Modern CSS techniques
- TypeScript best practices
- State management patterns
- Component composition

## 📝 License

MIT License - feel free to use this project for learning or production!

---

Built with ❤️ using TypeScript and a custom JSX mini-framework
