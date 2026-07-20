'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

export default function Model() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF('/sugardaddy.glb');

  // A gentle breathing animation to make the avatar feel alive
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]} scale={1.5} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/sugardaddy.glb');
