import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef();
  
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x += delta * 0.05;
    ref.current.rotation.y += delta * 0.075;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#3b82f6"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
        />
      </Points>
    </group>
  );
}

function Grid() {
  return (
    <gridHelper 
      args={[100, 100, "#1e1e24", "#0f0f12"]} 
      rotation={[Math.PI / 2, 0, 0]} 
      position={[0, 0, -5]}
      opacity={0.1}
      transparent
    />
  );
}

const Background3D = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#0a0a0c]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ambientLight intensity={0.5} />
        <ParticleField />
        <Grid />
      </Canvas>
    </div>
  );
};

export default Background3D;
