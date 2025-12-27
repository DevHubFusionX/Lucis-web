'use client'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Float } from '@react-three/drei'

function FloatingPhoto({ position, imageUrl, rotation = [0, 0, 0] }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    meshRef.current.rotation.y += 0.005
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.3
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} rotation={rotation}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial>
          <Image url={imageUrl} transparent opacity={0.9} />
        </meshStandardMaterial>
      </mesh>
    </Float>
  )
}

export default function PhotoGallery3D({ images }) {
  const positions = [
    [-4, 2, -2], [4, -1, -1], [-3, -2, -3], 
    [3, 3, -2], [0, -3, -4], [-5, 0, -1]
  ]

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.6} />
        {images.slice(0, 6).map((img, i) => (
          <FloatingPhoto 
            key={i} 
            position={positions[i]} 
            imageUrl={img}
            rotation={[(Math.random() - 0.5) * 0.3, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.2]}
          />
        ))}
      </Canvas>
    </div>
  )
}