'use client'
import { useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, Box, Sphere } from '@react-three/drei'

function PortfolioCard({ position, title, onClick, isActive }) {
  const meshRef = useRef()
  const { viewport } = useThree()
  
  useFrame((state) => {
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    meshRef.current.scale.setScalar(isActive ? 1.1 : 1)
  })

  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      <Box args={[2, 1.2, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={isActive ? "#6366f1" : "#f8fafc"} 
          transparent 
          opacity={0.9}
        />
      </Box>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.2}
        color={isActive ? "white" : "#1e293b"}
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
      <Sphere args={[0.05]} position={[0.8, 0.4, 0.1]}>
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
      </Sphere>
    </group>
  )
}

export default function InteractivePortfolio({ portfolios = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const positions = [
    [-3, 1, 0], [0, 1, 0], [3, 1, 0],
    [-3, -1, 0], [0, -1, 0], [3, -1, 0]
  ]

  return (
    <div className="h-96 w-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        {portfolios.slice(0, 6).map((portfolio, i) => (
          <PortfolioCard
            key={i}
            position={positions[i]}
            title={portfolio.title || `Portfolio ${i + 1}`}
            isActive={i === activeIndex}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </Canvas>
    </div>
  )
}