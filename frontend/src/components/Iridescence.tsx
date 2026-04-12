import { useEffect, useRef } from 'react';

const Iridescence = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      time += 0.008; // Slightly faster for more vibrancy
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const index = (y * width + x) * 4;
          
          // Brighter iridescent effect using sine waves
          const r = Math.sin(x * 0.006 + time) * 155 + 100;
          const g = Math.sin(y * 0.006 + time + 2.1) * 155 + 100;
          const b = Math.sin((x + y) * 0.006 + time + 4.2) * 155 + 100;
          
          // Brighter pastel tones for light mode (higher opacity)
          data[index] = r * 0.5 + 80;      // R
          data[index + 1] = g * 0.4 + 100; // G  
          data[index + 2] = b * 0.6 + 80;  // B
          data[index + 3] = 35; // Higher opacity - more visible in light mode
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(animate);
    };
    
    window.addEventListener('resize', resize);
    resize();
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    />
  );
};

export default Iridescence;