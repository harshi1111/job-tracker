import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, Float } from '@react-three/drei';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

// Career Stage Component
function CareerStage({ position, title, color, icon, isActive }: any) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={[position.x, position.y, position.z]}>
        <mesh>
          <sphereGeometry args={[0.5, 64, 64]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={isActive ? 0.8 : 0.2} 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
        <Html position={[0, 0.8, 0]} center>
          <div className={`text-white text-sm font-bold whitespace-nowrap px-3 py-1 rounded-full backdrop-blur-sm transition-all duration-300 ${isActive ? 'bg-cyan-500/50 scale-110' : 'bg-black/50'}`}>
            {icon} {title}
          </div>
        </Html>
      </group>
    </Float>
  );
}

// Camera Controller - Optimized version
function CameraController({ progress }: { progress: number }) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 2, 12));
  
  // Define camera positions at different scroll stages
  const positions = [
    { x: 0, y: 2, z: 12 },    // 0% - Student
    { x: 1, y: 2.5, z: 8 },   // 20% - Intern
    { x: 2, y: 3, z: 6 },     // 40% - Junior
    { x: 3, y: 2.5, z: 5 },   // 60% - Senior
    { x: 4, y: 2, z: 4 },     // 80% - Tech Lead
    { x: 5, y: 1.5, z: 3 },   // 100% - Principal
  ];
  
  // Calculate target position based on progress
  const getTargetPosition = (p: number) => {
    const index = Math.min(Math.floor(p * 5), 4);
    const t = (p * 5) - index;
    const start = positions[index];
    const end = positions[index + 1] || positions[index];
    
    return {
      x: start.x + (end.x - start.x) * t,
      y: start.y + (end.y - start.y) * t,
      z: start.z + (end.z - start.z) * t,
    };
  };
  
  useFrame(() => {
    const target = getTargetPosition(progress);
    targetPosition.current.set(target.x, target.y, target.z);
    
    // Smooth camera movement
    camera.position.lerp(targetPosition.current, 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Main Component
export default function CareerOdyssey({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    
    return () => lenis.destroy();
  }, []);
  
  const careerStages = [
    { title: "Student", position: { x: 0, y: 0, z: 0 }, color: "#00E5FF", icon: "🎓" },
    { title: "Intern", position: { x: 2, y: 1, z: -2 }, color: "#00B4D8", icon: "💻" },
    { title: "Junior", position: { x: 4, y: 1.5, z: -4 }, color: "#8B00FF", icon: "⚡" },
    { title: "Senior", position: { x: 6, y: 1, z: -6 }, color: "#00E5FF", icon: "🚀" },
    { title: "Tech Lead", position: { x: 8, y: 0.5, z: -8 }, color: "#FF6B6B", icon: "👑" },
    { title: "Principal", position: { x: 10, y: 0, z: -10 }, color: "#00B4D8", icon: "🏆" },
  ];
  
  return (
    <div ref={containerRef} style={{ height: '300vh', position: 'relative' }}>
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#00E5FF" />
          <Environment preset="city" />
          <CameraController progress={scrollProgress} />
          {careerStages.map((stage, i) => (
            <CareerStage
              key={i}
              position={stage.position}
              title={stage.title}
              color={stage.color}
              icon={stage.icon}
              isActive={scrollProgress > i * 0.15 && scrollProgress < (i + 1) * 0.15}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
}