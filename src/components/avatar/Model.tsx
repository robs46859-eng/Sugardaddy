'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, Mesh } from 'three';

export default function Model() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF('/sugardaddy.glb');
  const amplitudeRef = useRef(0);

  useEffect(() => {
    const handleAmplitude = (e: any) => {
      amplitudeRef.current = e.detail.amplitude;
    };
    window.addEventListener('avatar-amplitude', handleAmplitude);
    return () => window.removeEventListener('avatar-amplitude', handleAmplitude);
  }, []);

  // A gentle breathing animation and Lip Sync
  useFrame((state) => {
    if (groupRef.current) {
      // Breathing
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      
      // Simple Amplitude-based Lip Sync
      // We look for a mesh with morph targets. In a real GLB from Trio3D,
      // you usually have a mesh named 'Wolf3D_Head' or similar with morph targets.
      scene.traverse((child) => {
        if ((child as Mesh).isMesh && (child as Mesh).morphTargetInfluences) {
          const mesh = child as Mesh;
          // Most standard avatars have a 'mouthOpen' or 'jawOpen' shape key.
          // Let's assume index 0 is mouthOpen, or we just apply it to the first few.
          // In a production app, we would search by name: mesh.morphTargetDictionary['mouthOpen']
          
          // Fallback: apply to the first morph target
          mesh.morphTargetInfluences[0] = amplitudeRef.current;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]} scale={1.5} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/sugardaddy.glb');
