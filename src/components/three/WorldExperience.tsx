"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";

const landmarks = [
  { label: "WORK", href: "#work", position: [-8, 0, -8] as [number, number, number], color: "#ff6b35" },
  { label: "ABOUT", href: "#about", position: [8, 0, -5] as [number, number, number], color: "#e8c547" },
  { label: "STACK", href: "#stack", position: [-7, 0, 8] as [number, number, number], color: "#38bdf8" },
  { label: "CONTACT", href: "#contact", position: [8, 0, 8] as [number, number, number], color: "#a78bfa" },
];

function Ground() {
  const blocks = useMemo(() => {
    const out: { position: [number, number, number]; size: [number, number, number]; color: string }[] = [];
    const colors = ["#17181c", "#1d2026", "#24272d", "#121419"];
    for (let x = -16; x <= 16; x += 2) {
      for (let z = -16; z <= 16; z += 2) {
        const edge = Math.abs(x) > 11 || Math.abs(z) > 11;
        if (edge && (x + z) % 3 !== 0) continue;
        out.push({
          position: [x, -0.22, z],
          size: [1.92, 0.35, 1.92],
          color: colors[Math.abs(x * 7 + z * 3) % colors.length],
        });
      }
    }
    return out;
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.42, 0]}>
        <planeGeometry args={[42, 42]} />
        <meshStandardMaterial color="#0c0d10" roughness={0.92} />
      </mesh>
      {blocks.map((block, index) => (
        <mesh key={index} position={block.position}>
          <boxGeometry args={block.size} />
          <meshStandardMaterial color={block.color} roughness={0.8} />
        </mesh>
      ))}
      <gridHelper args={[40, 40, "#343840", "#191b20"]} position={[0, -0.03, 0]} />
    </group>
  );
}

function Car({ position, rotation }: { position: React.MutableRefObject<THREE.Vector3>; rotation: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Mesh[]>([]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.position.lerp(position.current, 1 - Math.pow(0.001, delta));
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rotation.current, 1 - Math.pow(0.001, delta));
    wheels.current.forEach((wheel) => {
      if (wheel) wheel.rotation.x -= delta * 5;
    });
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[1.5, 0.38, 2.45]} />
        <meshStandardMaterial color="#f25f3a" roughness={0.32} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.8, 0.15]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.12, 0.38, 1.05]} />
        <meshStandardMaterial color="#f47c59" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.83, 0.16]}>
        <boxGeometry args={[0.9, 0.22, 0.78]} />
        <meshStandardMaterial color="#13202b" roughness={0.12} metalness={0.6} />
      </mesh>
      {([[-0.78, 0.28, -0.75], [0.78, 0.28, -0.75], [-0.78, 0.28, 0.75], [0.78, 0.28, 0.75]] as [number, number, number][]).map((pos, index) => (
        <mesh key={index} ref={(node) => { if (node) wheels.current[index] = node; }} position={pos} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.16, 16]} />
          <meshStandardMaterial color="#08090b" roughness={0.7} />
        </mesh>
      ))}
      <pointLight position={[0, 0.45, -1.3]} color="#ffb38a" intensity={3} distance={4} />
    </group>
  );
}

function Landmark({ landmark }: { landmark: (typeof landmarks)[number] }) {
  return (
    <group position={landmark.position}>
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[3.2, 1.6, 0.18]} />
        <meshStandardMaterial color="#111318" roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.15, -0.11]}>
        <planeGeometry args={[2.9, 1.3]} />
        <meshBasicMaterial color={landmark.color} transparent opacity={0.12} />
      </mesh>
      <Text position={[0, 1.22, -0.22]} fontSize={0.42} color={landmark.color} anchorX="center" anchorY="middle">
        {landmark.label}
      </Text>
      <Html position={[0, 1.15, -0.28]} center>
        <a href={landmark.href} className="pointer-events-auto block px-5 py-2 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white">
          Enter
        </a>
      </Html>
      <mesh position={[-1.25, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 2.3, 8]} />
        <meshStandardMaterial color="#363942" />
      </mesh>
      <mesh position={[1.25, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 2.3, 8]} />
        <meshStandardMaterial color="#363942" />
      </mesh>
      <pointLight position={[0, 1.2, 1]} color={landmark.color} intensity={3} distance={5} />
    </group>
  );
}

function World({ onSpeed }: { onSpeed: (speed: number) => void }) {
  const carPosition = useRef(new THREE.Vector3(0, 0, 2));
  const carRotation = useRef(0);
  const keys = useRef(new Set<string>());
  const camera = useThree((state) => state.camera);
  const target = useMemo(() => new THREE.Vector3(), []);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const down = (event: KeyboardEvent) => keys.current.add(event.key.toLowerCase());
    const up = (event: KeyboardEvent) => keys.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    const forward = keys.current.has("w") || keys.current.has("arrowup");
    const backward = keys.current.has("s") || keys.current.has("arrowdown");
    const left = keys.current.has("a") || keys.current.has("arrowleft");
    const right = keys.current.has("d") || keys.current.has("arrowright");
    const moving = forward || backward;
    const direction = forward ? 1 : backward ? -1 : 0;
    const velocity = direction * delta * 5.2;
    if (left) carRotation.current += delta * 1.8 * (direction || 1);
    if (right) carRotation.current -= delta * 1.8 * (direction || 1);
    carPosition.current.x += Math.sin(carRotation.current) * velocity;
    carPosition.current.z += Math.cos(carRotation.current) * velocity;
    carPosition.current.x = THREE.MathUtils.clamp(carPosition.current.x, -17, 17);
    carPosition.current.z = THREE.MathUtils.clamp(carPosition.current.z, -17, 17);
    const nextSpeed = moving ? Math.abs(velocity / delta) : 0;
    setSpeed((current) => THREE.MathUtils.lerp(current, nextSpeed, 0.12));
    onSpeed(nextSpeed);

    target.set(
      carPosition.current.x - Math.sin(carRotation.current) * 6,
      4.2,
      carPosition.current.z - Math.cos(carRotation.current) * 6
    );
    camera.position.lerp(target, 1 - Math.pow(0.002, delta));
    camera.lookAt(carPosition.current.x, 0.45, carPosition.current.z);
  });

  return (
    <>
      <color attach="background" args={["#090a0d"]} />
      <fog attach="fog" args={["#090a0d", 12, 32]} />
      <ambientLight intensity={1.3} />
      <directionalLight position={[5, 10, 3]} intensity={2.4} color="#fff2df" castShadow />
      <Ground />
      {landmarks.map((landmark) => <Landmark key={landmark.label} landmark={landmark} />)}
      <Car position={carPosition} rotation={carRotation} />
      <Text position={[0, 0.06, -2.8]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.45} color="#59606b" anchorX="center">
        NAUFAL ANANTA
      </Text>
      <Html fullscreen>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-5 top-5 max-w-[280px] text-white md:left-10 md:top-8">
            <p className="text-[10px] uppercase tracking-[0.45em] text-white/45">Naufal Ananta / 2025</p>
            <h1 className="mt-3 text-3xl font-black leading-none tracking-[-0.04em] md:text-5xl">BUILD<br /><span className="text-white/35">THE INVISIBLE</span></h1>
            <p className="mt-4 text-sm leading-relaxed text-white/55">A software engineer exploring the space between systems, people, and machines.</p>
          </div>
          <div className="absolute bottom-5 left-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/50 md:bottom-8 md:left-10">
            <span className="rounded border border-white/15 px-2 py-1">WASD</span><span>Drive to explore</span>
          </div>
          <div className="absolute bottom-5 right-5 text-right text-[10px] uppercase tracking-[0.25em] text-white/45 md:bottom-8 md:right-10">
            <p>Speed {Math.round(speed * 10)} km/h</p><p className="mt-1">Find the signs</p>
          </div>
        </div>
      </Html>
    </>
  );
}

export function WorldExperience() {
  const [speed, setSpeed] = useState(0);
  return (
    <section id="top" className="relative h-svh min-h-[620px] w-full overflow-hidden bg-[#090a0d]">
      <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <PerspectiveCamera makeDefault position={[0, 4.2, 8]} fov={48} />
        <World onSpeed={setSpeed} />
      </Canvas>
      <div className="pointer-events-none absolute right-5 top-5 hidden text-right md:right-10 md:top-8 md:block">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-white/40"><span className={`h-2 w-2 rounded-full ${speed > 0 ? "bg-orange-400" : "bg-emerald-400"}`} />{speed > 0 ? "Exploring" : "World ready"}</div>
      </div>
    </section>
  );
}
