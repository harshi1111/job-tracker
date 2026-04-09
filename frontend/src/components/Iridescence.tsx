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
      time += 0.005;
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const index = (y * width + x) * 4;
          
          // Create iridescent effect using sine waves
          const r = Math.sin(x * 0.005 + time) * 128 + 127;
          const g = Math.sin(y * 0.005 + time + 2) * 128 + 127;
          const b = Math.sin((x + y) * 0.005 + time + 4) * 128 + 127;
          
          // Subtle pastel tones
          data[index] = r * 0.6 + 100;     // R
          data[index + 1] = g * 0.5 + 120; // G
          data[index + 2] = b * 0.7 + 100; // B
          data[index + 3] = 15; // Very low opacity (almost transparent)
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
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  );
};

export default Iridescence;