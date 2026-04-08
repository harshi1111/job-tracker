import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const careerStages = [
  { title: "Student", x: 0, y: 0, z: 0, color: "#06b6d4", icon: "🎓" },
  { title: "Intern", x: 2, y: 1, z: -2, color: "#d946ef", icon: "👨‍💻" },
  { title: "Junior Developer", x: 4, y: 1.5, z: -4, color: "#f59e0b", icon: "⚡" },
  { title: "Senior Developer", x: 6, y: 1, z: -5, color: "#06b6d4", icon: "🚀" },
  { title: "Tech Lead", x: 8, y: 0.5, z: -4, color: "#d946ef", icon: "👑" },
  { title: "Principal Engineer", x: 10, y: 0, z: -2, color: "#f59e0b", icon: "🏆" },
];

function CareerNodes() {
  return (
    <>
      {careerStages.map((stage, i) => (
        <group key={i} position={[stage.x, stage.y, stage.z]}>
          <mesh>
            <sphereGeometry args={[0.5, 64, 64]} />
            <meshStandardMaterial color={stage.color} emissive={stage.color} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
          </mesh>
          {i < careerStages.length - 1 && (
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, careerStages[i+1].x - stage.x, careerStages[i+1].y - stage.y, careerStages[i+1].z - stage.z]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial color={stage.color} opacity={0.5} transparent />
            </line>
          )}
          <Html position={[0, 0.8, 0]} center>
            <div className="text-center">
              <div className="text-2xl">{stage.icon}</div>
              <div className="text-white text-sm font-medium whitespace-nowrap bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                {stage.title}
              </div>
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 1500;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i*3] = (Math.random() - 0.5) * 30;
    positions[i*3+1] = (Math.random() - 0.5) * 15;
    positions[i*3+2] = (Math.random() - 0.5) * 20 - 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#06b6d4" size={0.05} transparent opacity={0.4} />
    </points>
  );
}

export default function CinematicCareerPath() {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !cameraGroupRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        invalidateOnRefresh: true
      }
    });

    tl.to(cameraGroupRef.current.position, {
      x: 5,
      y: 2,
      z: 3,
      duration: 1,
      ease: "power1.inOut"
    }, 0)
    .to(cameraGroupRef.current.position, {
      x: 8,
      y: 1,
      z: 2,
      duration: 1,
      ease: "power1.inOut"
    }, 1)
    .to(cameraGroupRef.current.position, {
      x: 10,
      y: 0.5,
      z: 1,
      duration: 1,
      ease: "power1.inOut"
    }, 2);

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 -z-10" style={{ height: "200vh" }}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        style={{ background: '#0a0a0f' }}
      >
        <group ref={cameraGroupRef}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#06b6d4" />
          <Environment preset="city" />
          <FloatingParticles />
          <CareerNodes />
        </group>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/80 pointer-events-none" />
    </div>
  );
}