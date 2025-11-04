import { createElement, useState } from "./jsx-runtime";
import { useEffect, useRef } from "./hooks";

// Bar Chart Component
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  height?: number;
}

export const BarChart = ({ data, title, height = 300 }: BarChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Find max value
    const maxValue = Math.max(...data.map(d => d.value), 1);
    
    // Draw bars
    const barWidth = chartWidth / data.length - 20;
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding + index * (chartWidth / data.length) + 10;
      const y = canvas.height - padding - barHeight;
      
      // Bar gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
      const color = item.color || "#3b82f6";
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, color + "80");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Label
      ctx.fillStyle = "#64748b";
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.label, x + barWidth / 2, canvas.height - padding + 20);
      
      // Value
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 10);
    });
    
    // Draw axes
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
  }, [data]);

  return (
    <div className="chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      <canvas 
        ref={canvasRef}
        width={600}
        height={height}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

// Line Chart Component
interface LineChartProps {
  data: { label: string; value: number }[];
  title?: string;
  height?: number;
  color?: string;
}

export const LineChart = ({ data, title, height = 300, color = "#10b981" }: LineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    const maxValue = Math.max(...data.map(d => d.value), 1);
    
    // Draw grid
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }
    
    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    
    ctx.beginPath();
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      const y = canvas.height - padding - (item.value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Draw points and labels
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      const y = canvas.height - padding - (item.value / maxValue) * chartHeight;
      
      // Point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // White center
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Label
      ctx.fillStyle = "#64748b";
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.label, x, canvas.height - padding + 20);
      
      // Value on hover would require more complex event handling
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 12px Inter, sans-serif";
      ctx.fillText(item.value.toString(), x, y - 15);
    });
    
    // Draw axes
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
  }, [data, color]);

  return (
    <div className="chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      <canvas 
        ref={canvasRef}
        width={600}
        height={height}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

// Pie Chart Component
interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
  size?: number;
}

export const PieChart = ({ data, title, size = 300 }: PieChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 20;
    const radius = Math.min(canvas.width, canvas.height) / 2 - 60;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    if (total === 0) {
      ctx.fillStyle = "#cbd5e1";
      ctx.font = "16px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("No data", centerX, centerY);
      return;
    }
    
    let currentAngle = -Math.PI / 2;
    
    data.forEach((item, index) => {
      const sliceAngle = (item.value / total) * Math.PI * 2;
      
      // Draw slice
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();
      
      currentAngle += sliceAngle;
    });
    
    // Draw legend
    const legendX = 20;
    let legendY = canvas.height - data.length * 25 - 10;
    
    data.forEach((item, index) => {
      const y = legendY + index * 25;
      
      // Color box
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 18, 18);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      ctx.strokeRect(legendX, y, 18, 18);
      
      // Label
      ctx.fillStyle = "#1e293b";
      ctx.font = "13px Inter, sans-serif";
      ctx.textAlign = "left";
      const percentage = ((item.value / total) * 100).toFixed(1);
      ctx.fillText(`${item.label}: ${percentage}%`, legendX + 25, y + 14);
    });
  }, [data]);

  return (
    <div className="chart-container">
      {title && <h4 className="chart-title">{title}</h4>}
      <canvas 
        ref={canvasRef}
        width={size}
        height={size}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};

// Mini Sparkline Chart
interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

export const Sparkline = ({ data, color = "#3b82f6", height = 40 }: SparklineProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 5;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    const maxValue = Math.max(...data, 1);
    const minValue = Math.min(...data, 0);
    const range = maxValue - minValue || 1;
    
    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1 || 1)) * chartWidth;
      const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Fill area
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, color + "40");
    gradient.addColorStop(1, color + "00");
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [data, color]);

  return (
    <canvas 
      ref={canvasRef}
      width={200}
      height={height}
      style={{ width: "100%", height: `${height}px` }}
    />
  );
};
