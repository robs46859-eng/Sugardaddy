'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import Model from './Model';

export default function AvatarStage() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 relative">
      <Canvas shadows camera={{ position: [0, 0, 3], fov: 50 }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          
          <group position={[0, -1, 0]}>
            <Model />
            <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#000000" />
          </group>
          
          {/* We lock the orbit controls to mostly focus on the upper body/face */}
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            minPolarAngle={Math.PI / 2.5} 
            maxPolarAngle={Math.PI / 2} 
            minAzimuthAngle={-Math.PI / 4} 
            maxAzimuthAngle={Math.PI / 4} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
