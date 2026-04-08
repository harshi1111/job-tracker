import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import Lenis from '@studio-freight/lenis';

// Animated floating career paths
function CareerPath() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const positions = [
    { title: "Student", color: "#06b6d4", pos: [0, 0, 0], size: 0.6 },
    { title: "Intern", color: "#d946ef", pos: [2, 1, -2], size: 0.7 },
    { title: "Junior", color: "#f59e0b", pos: [4, 1.5, -4], size: 0.8 },
    { title: "Senior", color: "#06b6d4", pos: [6, 1, -5], size: 0.9 },
    { title: "Lead", color: "#d946ef", pos: [8, 0.5, -4], size: 1.0 },
    { title: "Principal", color: "#f59e0b", pos: [10, 0, -2], size: 1.1 },
  ];

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <Float key={i} speed={2} rotationIntensity={1} floatIntensity={2}>
          <group position={[pos.pos[0], pos.pos[1], pos.pos[2]]}>
            <Sphere args={[pos.size, 64, 64]}>
              <meshStandardMaterial color={pos.color} emissive={pos.color} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
            </Sphere>
          </group>
        </Float>
      ))}
    </group>
  );
}

function Particles() {
  const count = 2000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random() - 0.5) * 50;
    positions[i*3+1] = (Math.random() - 0.5) * 30;
    positions[i*3+2] = (Math.random() - 0.5) * 30 - 20;
  }
  
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#06b6d4" size={0.05} transparent opacity={0.4} />
    </points>
  );
}

export default function Immersive3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 45 }}
        style={{ background: '#0a0a0f' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#06b6d4" />
        <Environment preset="city" />
        <Particles />
        <CareerPath />
      </Canvas>
    </div>
  );
}