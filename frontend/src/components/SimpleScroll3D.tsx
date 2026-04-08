import { useEffect, useRef } from 'react';

export default function Simple3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    containerRef.current.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);

    // Animated gradient particles
    let particles: { x: number; y: number; radius: number; alpha: number; speedX: number; speedY: number }[] = [];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      });
    }
    
    let time = 0;
    
    function animate() {
      if (!ctx || !canvas) return;
      
      time += 0.01;
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0a0f');
      gradient.addColorStop(0.5, '#0f0f1a');
      gradient.addColorStop(1, '#0a0a0f');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw floating particles
      for (let p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha + Math.sin(time) * 0.1})`;
        ctx.fill();
        
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resize);
      if (containerRef.current && canvas) {
        containerRef.current.removeChild(canvas);
      }
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
}