/// <reference path="../react-three-fiber.d.ts" />
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, RootState } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleProps {
  position: [number, number, number];
  index: number;
}

function Particle({ position, index }: ParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state: RootState) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5 + index) * 0.3;
      meshRef.current.position.x = position[0] + Math.cos(time * 0.3 + index) * 0.2;
    }
  });

  const color = useMemo(() => {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
    return colors[index % colors.length];
  }, [index]);

  return (
    // @ts-expect-error - React Three Fiber extends JSX with Three.js elements
    <mesh ref={meshRef} position={position}>
      {/* @ts-expect-error - React Three Fiber extends JSX with Three.js elements */}
      <sphereGeometry args={[0.08, 12, 12]} />
      {/* @ts-expect-error - React Three Fiber extends JSX with Three.js elements */}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.8}
      />
    {/* @ts-expect-error - React Three Fiber extends JSX with Three.js elements */}
    </mesh>
  );
}

function Particles() {
  const particles = useMemo(() => {
    const count = 120;
    const positions: [number, number, number][] = [];
    
    for (let i = 0; i < count; i++) {
      positions.push([
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15,
      ]);
    }
    
    return positions;
  }, []);

  return (
    <>
      {particles.map((pos, i) => (
        <Particle key={i} position={pos} index={i} />
      ))}
    </>
  );
}

export default function ParticleBackground() {
  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ 
          alpha: true, 
          antialias: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        {/* @ts-expect-error - React Three Fiber extends JSX with Three.js elements */}
        <ambientLight intensity={0.6} />
        {/* @ts-expect-error - React Three Fiber extends JSX with Three.js elements */}
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#667eea" />
        {/* @ts-expect-error - React Three Fiber extends JSX with Three.js elements */}
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#764ba2" />
        <Particles />
      </Canvas>
    </div>
  );
}

