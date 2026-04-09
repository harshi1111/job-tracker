import { useEffect, useRef } from 'react';

interface RippleGridProps {
  className?: string;
  color?: string;
  cellSize?: number;
  rippleSpeed?: number;
}

export default function RippleGrid({ 
  className = "", 
  color = "#6366f1",
  cellSize = 40,
  rippleSpeed = 0.02 
}: RippleGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<{ x: number; y: number; radius: number; alpha: number }[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      ripples.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        alpha: 0.5
      });
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid lines
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.3;
      
      for (let x = 0; x < width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = 0; y < height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Draw ripples
      for (let i = 0; i < ripples.current.length; i++) {
        const ripple = ripples.current[i];
        ripple.radius += rippleSpeed * 3;
        ripple.alpha -= 0.01;
        
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = ripple.alpha * 0.5;
        ctx.stroke();
        
        if (ripple.alpha <= 0 || ripple.radius > 200) {
          ripples.current.splice(i, 1);
          i--;
        }
      }
      
      animationRef.current = requestAnimationFrame(drawGrid);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    drawGrid();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [color, cellSize, rippleSpeed]);

  return <canvas ref={canvasRef} className={`w-full h-full absolute inset-0 pointer-events-none ${className}`} />;
}