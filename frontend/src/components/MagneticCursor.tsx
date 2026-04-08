import { useEffect, useRef } from 'react';

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      
      setTimeout(() => {
        if (followerRef.current) {
          followerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
      }, 50);
      
      // Particle trail
      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 500);
    };

    window.addEventListener('mousemove', onMouseMove);
    
    const interactive = document.querySelectorAll('a, button, input, select, textarea');
    const handleMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.transform += ' scale(1.5)';
      if (followerRef.current) followerRef.current.style.transform += ' scale(0.5)';
    };
    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(1.5)', '');
      if (followerRef.current) followerRef.current.style.transform = followerRef.current.style.transform.replace(' scale(0.5)', '');
    };
    
    interactive.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactive.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[200] transition-transform duration-75"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={followerRef}
        className="fixed w-6 h-6 border border-cyan-400/50 rounded-full pointer-events-none z-[199] transition-transform duration-150"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <style>{`
        .cursor-particle {
          position: fixed;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, #06b6d4, #d946ef);
          border-radius: 50%;
          pointer-events: none;
          z-index: 198;
          animation: particleFade 0.5s ease-out forwards;
        }
        @keyframes particleFade {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
      `}</style>
    </>
  );
}