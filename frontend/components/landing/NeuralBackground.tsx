'use client';
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, Float } from "@react-three/drei";
import { useState, useRef, Suspense, useMemo } from "react";
import * as THREE from 'three';
import * as random from "maath/random/dist/maath-random.esm";

function Particles({ count = 5000 }) {
    const points = useMemo(() => random.inSphere(new Float32Array(count), { radius: 1.5 }) as Float32Array, [count]);
    const ref = useRef<THREE.Points>(null);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 30;
            ref.current.rotation.y -= delta / 40;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#0ea5e9"
                    size={0.002}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                />
            </Points>
        </group>
    );
}

function DataCore() {
    const meshRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.2;
            meshRef.current.rotation.y = t * 0.3;
            meshRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.05);
        }
        if (ringRef.current) {
            ringRef.current.rotation.z = t * 0.1;
            ringRef.current.rotation.x = t * 0.05;
        }
    });

    return (
        <group>
            <Sphere args={[0.3, 64, 64]} ref={meshRef}>
                <meshStandardMaterial
                    color="#00D1FF"
                    emissive="#00D1FF"
                    emissiveIntensity={2}
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </Sphere>

            <group ref={ringRef}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                        <torusGeometry args={[0.5 + i * 0.1, 0.002, 16, 100]} />
                        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={5} />
                    </mesh>
                ))}
            </group>

            <pointLight position={[0, 0, 0]} intensity={5} color="#00D1FF" />
        </group>
    );
}

export const NeuralBackground = () => {
    return (
        <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
            {/* Deep Space Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1)_0%,transparent_70%)]" />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-float" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />

            <Canvas camera={{ position: [0, 0, 1.5], fov: 45 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.2} />
                    <Particles />
                    <Float speed={4} rotationIntensity={1} floatIntensity={1}>
                        <DataCore />
                    </Float>
                </Suspense>
            </Canvas>

            {/* Cinematic Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            <div className="absolute inset-0 opacity-[0.03] noise-bg pointer-events-none" />
        </div>
    );
};
