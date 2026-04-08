import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';

function ParticleSystem() {
  const ref = useRef<any>(null);
  
  // Generate random positions for 5000 particles
  const particlesPosition = random.inSphere(new Float32Array(5000), { radius: 1.5 });
  
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particlesPosition as any} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#6366f1"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function ThreeDBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleSystem />
      </Canvas>
    </div>
  );
}