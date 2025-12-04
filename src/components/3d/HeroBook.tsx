"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, PerspectiveCamera, Environment, ContactShadows, Text } from "@react-three/drei"
import * as THREE from "three"

function Book({ ...props }) {
    const groupRef = useRef<THREE.Group>(null)
    const [hovered, setHover] = useState(false)

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Gentle rotation
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
            groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.1
        }
    })

    return (
        <group ref={groupRef} {...props}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Book Cover (Front) */}
                <mesh position={[0, 0, 0.26]}>
                    <boxGeometry args={[3, 4.5, 0.05]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.1} />
                </mesh>

                {/* Book Cover (Back) */}
                <mesh position={[0, 0, -0.26]}>
                    <boxGeometry args={[3, 4.5, 0.05]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.1} />
                </mesh>

                {/* Spine */}
                <mesh position={[-1.5, 0, 0]}>
                    <boxGeometry args={[0.1, 4.5, 0.56]} />
                    <meshStandardMaterial color="#fbbf24" roughness={0.3} metalness={0.2} />
                </mesh>

                {/* Pages */}
                <mesh position={[0.1, 0, 0]}>
                    <boxGeometry args={[2.9, 4.4, 0.45]} />
                    <meshStandardMaterial color="#f5f5dc" roughness={0.8} />
                </mesh>

                {/* Title Text */}
                <Text
                    position={[0, 1, 0.3]}
                    fontSize={0.4}
                    color="#fbbf24"
                    font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.woff"
                    anchorX="center"
                    anchorY="middle"
                >
                    The Library
                </Text>
                <Text
                    position={[0, 0.5, 0.3]}
                    fontSize={0.2}
                    color="#f8fafc"
                    anchorX="center"
                    anchorY="middle"
                >
                    of Dreams
                </Text>
            </Float>
        </group>
    )
}

export function HeroBook3D() {
    return (
        <div className="h-[600px] w-full">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#fbbf24" />

                <Book position={[0, 0, 0]} />

                <Environment preset="city" />
                <ContactShadows position={[0, -3, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
            </Canvas>
        </div>
    )
}
