'use client'
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

function CameraIcon({ position, scale = 1 }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[0.8, 0.5, 0.3]} />
        <meshStandardMaterial color="#6366f1" opacity={0.7} transparent />
        <mesh position={[0.3, 0.1, 0.2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1]} />
          <meshStandardMaterial color="#4f46e5" />
        </mesh>
      </mesh>
    </Float>
  )
}

function ParticleField() {
  const cameras = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      ],
      scale: 0.3 + Math.random() * 0.4
    })), []
  )

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      {cameras.map((camera, i) => (
        <CameraIcon key={i} position={camera.position} scale={camera.scale} />
      ))}
    </>
  )
}

export default function CameraParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ParticleField />
      </Canvas>
    </div>
  )
}