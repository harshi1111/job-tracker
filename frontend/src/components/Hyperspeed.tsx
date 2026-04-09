import { useEffect, useRef } from 'react';
import './Hyperspeed.css';

// Simplified version that actually works
const Hyperspeed = (_props: { effectOptions?: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple canvas animation instead of complex WebGL
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    container.appendChild(canvas);

    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;
    let animationId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const animate = () => {
      time += 0.02;
      
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);
      
      // Draw moving grid lines
      const gridSize = 40;
      const offset = (time * 50) % gridSize;
      
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      
      for (let x = -gridSize; x < width + gridSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, height);
        ctx.stroke();
      }
      
      for (let y = -gridSize; y < height + gridSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y + offset);
        ctx.lineTo(width, y + offset);
        ctx.stroke();
      }
      
      // Draw moving particles
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 100; i++) {
        const x = (i * 131) % width;
        const y = (time * 50 + i * 50) % height;
        ctx.fillStyle = `hsl(${180 + Math.sin(time + i) * 20}, 100%, 50%)`;
        ctx.fillRect(x, y, 2, 2);
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    window.addEventListener('resize', resize);
    resize();
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return <div ref={containerRef} className="hyperspeed-container" />;
};

export default Hyperspeed;