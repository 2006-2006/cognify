'use client';
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Sphere, MeshDistortMaterial, Float as DreiFloat } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useState, useRef, Suspense, useMemo, ComponentProps } from "react";
import * as THREE from 'three';

function StarField(props: ComponentProps<typeof Points>) {
    const ref = useRef<THREE.Points>(null);
    const [sphere] = useState(() => random.inSphere(new Float32Array(15000), { radius: 1.5 }) as Float32Array);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 50;
            ref.current.rotation.y -= delta / 60;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#00D1FF"
                    size={0.0015}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

function NeuralNetwork() {
    const groupRef = useRef<THREE.Group>(null);
    const lineRef = useRef<THREE.LineSegments>(null);

    const { points, lines } = useMemo(() => {
        const p = [];
        for (let i = 0; i < 60; i++) {
            p.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.9,
                (Math.random() - 0.5) * 0.9,
                (Math.random() - 0.5) * 0.9
            ));
        }

        const l = [];
        for (let i = 0; i < p.length; i++) {
            for (let j = i + 1; j < p.length; j++) {
                if (p[i].distanceTo(p[j]) < 0.3) {
                    l.push(p[i].x, p[i].y, p[i].z);
                    l.push(p[j].x, p[j].y, p[j].z);
                }
            }
        }
        return { points: p, lines: new Float32Array(l) };
    }, []);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
            groupRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
        }
        if (lineRef.current) {
            const material = lineRef.current.material as THREE.LineBasicMaterial;
            material.opacity = 0.2 + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {points.map((p, i) => (
                <mesh key={i} position={p}>
                    <sphereGeometry args={[0.006, 8, 8]} />
                    <meshStandardMaterial color="#00D1FF" emissive="#00D1FF" emissiveIntensity={10} />
                </mesh>
            ))}
            <lineSegments ref={lineRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[lines, 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial color="#0ea5e9" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
            </lineSegments>
        </group>
    );
}

function CentralCore() {
    const meshRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    const pulseRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = t * 0.1;
            meshRef.current.rotation.y = t * 0.15;
            meshRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
        }
        if (innerRef.current) {
            innerRef.current.rotation.z = -t * 0.4;
            innerRef.current.scale.setScalar(0.8 + Math.cos(t * 3) * 0.05);
        }
        if (pulseRef.current) {
            pulseRef.current.scale.setScalar(1.2 + Math.sin(t * 2) * 0.2);
            const material = pulseRef.current.material as THREE.MeshStandardMaterial;
            material.opacity = 0.1 * (0.5 + Math.sin(t * 2) * 0.5);
        }
    });

    return (
        <group>
            {/* Holographic Neural Sphere */}
            <Sphere args={[0.45, 64, 64]} ref={meshRef}>
                <MeshDistortMaterial
                    color="#0ea5e9"
                    speed={3}
                    distort={0.4}
                    radius={1}
                    emissive="#00D1FF"
                    emissiveIntensity={2}
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.6}
                />
            </Sphere>

            {/* Core Neural Pulse */}
            <Sphere args={[0.2, 32, 32]} ref={innerRef}>
                <meshStandardMaterial
                    color="#8b5cf6"
                    emissive="#a855f7"
                    emissiveIntensity={20}
                    transparent
                    opacity={0.9}
                />
                <pointLight intensity={10} distance={3} color="#a855f7" />
            </Sphere>

            {/* Outer Glow Pulse */}
            <Sphere args={[0.6, 32, 32]} ref={pulseRef}>
                <meshStandardMaterial
                    color="#22d3ee"
                    emissive="#22d3ee"
                    emissiveIntensity={2}
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                />
            </Sphere>

            <NeuralNetwork />
        </group>
    );
}

function FloatingParticles() {
    const ref = useRef<THREE.Points>(null);
    const [particles] = useState(() => random.inSphere(new Float32Array(2000), { radius: 2 }));

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y += 0.001;
            ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
        }
    });

    return (
        <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.005}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.15}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

export const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-0 bg-[#020617] overflow-hidden pointer-events-none">
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.08)_0%,transparent_70%)]" />

            <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full animate-float" />
            <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[150px] rounded-full" />

            <Canvas camera={{ position: [0, 0, 1.8], fov: 40 }} dpr={[1, 2]}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.4} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#00D1FF" />
                    <pointLight position={[-10, -10, -10]} intensity={1.5} color="#7928CA" />

                    <StarField />
                    <DreiFloat speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <CentralCore />
                    </DreiFloat>
                    <FloatingParticles />
                </Suspense>
            </Canvas>

            {/* Cinematic Scanlines or Noise could be added via CSS if needed */}
            <div className="absolute inset-0 noise-bg opacity-[0.03] pointer-events-none" />
        </div>
    )
}
