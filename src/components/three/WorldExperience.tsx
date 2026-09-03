"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

/* ============================================================
   WEBGL DETECTION
============================================================ */
function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

/* ============================================================
   WORLD DATA
============================================================ */
export type LandmarkData = {
  id: string;
  label: string;
  index: string;
  title: string;
  description: string;
  href: string;
  position: [number, number, number];
  color: string;
  accent: string;
};

const landmarks: LandmarkData[] = [
  {
    id: "work",
    label: "PROJECTS",
    index: "01",
    title: "Featured Works",
    description:
      "High-Throughput Microservice Benchmark, QRIS Gateway, and Londri POS.",
    href: "#work",
    position: [-6.8, 0, 7.8],
    color: "#8b5cf6",
    accent: "border-violet-500/40 bg-violet-600/10 text-violet-300",
  },
  {
    id: "about",
    label: "ABOUT",
    index: "02",
    title: "About Naufal",
    description:
      "S1 RPL Telkom Purwokerto (GPA 3.52) & Backend Architecture.",
    href: "#about",
    position: [6.8, 0, 7.8],
    color: "#38bdf8",
    accent: "border-sky-500/40 bg-sky-600/10 text-sky-300",
  },
  {
    id: "stack",
    label: "STACK",
    index: "03",
    title: "Tech Arsenal",
    description:
      "NestJS, TypeScript, Python FastAPI, Docker, Prometheus & Grafana.",
    href: "#stack",
    position: [-7.8, 0, -8.2],
    color: "#10b981",
    accent: "border-emerald-500/40 bg-emerald-600/10 text-emerald-300",
  },
  {
    id: "contact",
    label: "CONTACT",
    index: "04",
    title: "Get in Touch",
    description: "Email, LinkedIn, GitHub, & verified Curriculum Vitae.",
    href: "#contact",
    position: [7.8, 0, -8.2],
    color: "#f59e0b",
    accent: "border-amber-500/40 bg-amber-600/10 text-amber-300",
  },
];

const ROAD_START = 3.1;
const ROAD_END_OFFSET = 2.4;
const PLAZA_R = 3.1;
const BOUND = 38.0;
const CAR_R = 1.05;
const MAX_SPEED = 14.5;

/* ---------- Obstacle & decor positions (pure data, module scope) ---------- */
const CRATE_SPOTS: Array<[number, number, number]> = [
  // [x, z, rotY] - placed outside track limits
  [-15.0, 4.0, 0.4],
  [15.0, -4.0, -0.7],
  [-14.0, -10.0, 0.9],
  [14.0, 10.0, -0.3],
];

const CONE_SPOTS: Array<[number, number]> = [
  [-1.8, 4.0],
  [1.8, 4.0],
  [-1.8, 7.5],
  [1.8, 7.5],
];

const GATE_PILLAR_OFFSET = 2.2;

type Obstacle = { x: number; z: number; r: number; bouncy: boolean };

function buildObstacles(): Obstacle[] {
  const out: Obstacle[] = [];
  for (const lm of landmarks) {
    const [x, , z] = lm.position;
    // the billboard board itself
    out.push({ x, z, r: 2.1, bouncy: false });
    // side pillars of the gate
    const ang = Math.atan2(-x, -z);
    const px = Math.cos(ang) * GATE_PILLAR_OFFSET;
    const pz = -Math.sin(ang) * GATE_PILLAR_OFFSET;
    out.push({ x: x + px, z: z + pz, r: 0.3, bouncy: false });
    out.push({ x: x - px, z: z - pz, r: 0.3, bouncy: false });
  }
  for (const [cx, cz] of CRATE_SPOTS) {
    out.push({ x: cx, z: cz, r: 0.72, bouncy: false });
  }
  for (const [cx, cz] of CONE_SPOTS) {
    out.push({ x: cx, z: cz, r: 0.26, bouncy: true });
  }
  // big gate pillars removed from road
  return out;
}

const OBSTACLES: Obstacle[] = buildObstacles();

/* ============================================================
   CANVAS-TEXTURE HELPERS (crisp text, no font download)
============================================================ */
const textureCache = new Map<string, THREE.CanvasTexture>();

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function getLabelTexture(lm: LandmarkData): THREE.CanvasTexture {
  const key = `label-${lm.id}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const W = 768;
  const H = 384;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  // card background
  roundedRect(ctx, 14, 14, W - 28, H - 28, 40);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "rgba(16,19,28,0.96)");
  bg.addColorStop(1, "rgba(10,12,18,0.96)");
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = lm.color;
  ctx.stroke();

  // accent side bar
  roundedRect(ctx, 14, 14, 26, H - 28, 12);
  ctx.fillStyle = lm.color;
  ctx.fill();

  // index number top-right
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.font = "700 44px system-ui, 'Segoe UI', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(lm.index, W - 52, 84);

  // big label
  ctx.textAlign = "left";
  ctx.fillStyle = lm.color;
  ctx.font = "900 92px system-ui, 'Segoe UI', sans-serif";
  ctx.fillText(lm.label, 72, 186);

  // title
  ctx.fillStyle = "#f5f6fa";
  ctx.font = "600 40px system-ui, 'Segoe UI', sans-serif";
  ctx.fillText(lm.title, 74, 254);

  // divider
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.fillRect(74, 282, W - 160, 2);

  // call to action
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "500 30px system-ui, 'Segoe UI', sans-serif";
  ctx.fillText("DRIVE CLOSER TO ENTER  →", 74, 336);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  textureCache.set(key, tex);
  return tex;
}

function getPlazaTexture(): THREE.CanvasTexture {
  const key = "plaza";
  const cached = textureCache.get(key);
  if (cached) return cached;

  const W = 1024;
  const H = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(139,92,246,0.95)";
  ctx.font = "900 110px system-ui, 'Segoe UI', sans-serif";
  ctx.fillText("NAUFAL ANANTA", W / 2, H / 2 - 32);
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "700 42px system-ui, 'Segoe UI', sans-serif";
  ctx.fillText("SOFTWARE ENGINEER", W / 2, H / 2 + 58);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  textureCache.set(key, tex);
  return tex;
}

function getConcreteTexture(): THREE.CanvasTexture {
  const key = "concrete_light";
  const cached = textureCache.get(key);
  if (cached) return cached;

  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;

  // Smooth industrial concrete base
  ctx.fillStyle = "#1e2430";
  ctx.fillRect(0, 0, S, S);

  // Subtle clean concrete slab seam lines
  ctx.strokeStyle = "#161b24";
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, S, S);

  // Very subtle fine concrete grain (lightweight)
  ctx.fillStyle = "#273040";
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * S;
    const ry = Math.random() * S;
    ctx.fillRect(rx, ry, 1, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  textureCache.set(key, tex);
  return tex;
}

function getBlobTexture(): THREE.CanvasTexture {
  const key = "blob";
  const cached = textureCache.get(key);
  if (cached) return cached;

  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(S / 2, S / 2, 6, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(0,0,0,0.58)");
  grad.addColorStop(0.65, "rgba(0,0,0,0.28)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set(key, tex);
  return tex;
}

/* ============================================================
   GROUND + ROADS + PLAZA
============================================================ */
function GroundCity({ plazaTex }: { plazaTex: THREE.CanvasTexture }) {
  const concreteTex = useMemo(() => getConcreteTexture(), []);
  // Curvy serpentine drift track points
  const trackSpline = useMemo(() => {
    // Generate clean smooth oval-chicane closed loop track
    const pts = [
      new THREE.Vector3(0, 0, 18),
      new THREE.Vector3(14, 0, 20),
      new THREE.Vector3(26, 0, 10),
      new THREE.Vector3(25, 0, -6),
      new THREE.Vector3(12, 0, -18),
      new THREE.Vector3(0, 0, -24),
      new THREE.Vector3(-14, 0, -20),
      new THREE.Vector3(-25, 0, -8),
      new THREE.Vector3(-25, 0, 8),
      new THREE.Vector3(-14, 0, 18),
    ];
    return new THREE.CatmullRomCurve3(pts, true, "centripetal", 0.5);
  }, []);

  // Road segments: smooth clean segmented quads along spline (no mesh pinching)
  const roadSegments = useMemo(() => {
    const N = 120;
    const segs: Array<{
      center: THREE.Vector3;
      angle: number;
      len: number;
      curbL: THREE.Vector3;
      curbR: THREE.Vector3;
      color: string;
    }> = [];
    const roadW = 5.6;

    for (let i = 0; i < N; i++) {
      const u1 = i / N;
      const u2 = (i + 1) / N;
      const p1 = trackSpline.getPointAt(u1);
      const p2 = trackSpline.getPointAt(u2);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dir = new THREE.Vector3().subVectors(p2, p1);
      const len = dir.length();
      const angle = Math.atan2(dir.x, dir.z);
      const norm = new THREE.Vector3(-dir.z, 0, dir.x).normalize();

      const curbL = mid.clone().addScaledVector(norm, roadW * 0.5 + 0.35);
      const curbR = mid.clone().addScaledVector(norm, -roadW * 0.5 - 0.35);
      const color = i % 2 === 0 ? "#ef4444" : "#f8fafc";

      segs.push({ center: mid, angle, len, curbL, curbR, color });
    }
    return segs;
  }, [trackSpline]);

  return (
    <group>
      {/* Smooth Industrial Concrete Floor Outside Racetrack */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial map={concreteTex} roughness={0.65} metalness={0.15} />
      </mesh>

      {/* Clean Winding Serpentine Racing Tarmac Segments */}
      {roadSegments.map((s, i) => (
        <group key={`track-seg-${i}`} position={[s.center.x, 0.015, s.center.z]} rotation-y={s.angle}>
          {/* road asphalt plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[5.6, s.len * 1.08]} />
            <meshStandardMaterial color="#0f172a" roughness={0.35} metalness={0.4} />
          </mesh>
          {/* centerline marking */}
          {i % 2 === 0 && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
              <planeGeometry args={[0.2, s.len * 0.65]} />
              <meshBasicMaterial color="#e2e8f0" transparent opacity={0.75} />
            </mesh>
          )}
        </group>
      ))}

      {/* Double Side Raised 3D Racing Rumble Curbs (Alternating Red/White) */}
      {roadSegments.map((s, i) => (
        <group key={`curb-group-${i}`}>
          {/* Left curb */}
          <mesh
            position={[s.curbL.x, 0.025, s.curbL.z]}
            rotation={[-Math.PI / 2, 0, s.angle]}
          >
            <planeGeometry args={[0.65, s.len * 1.05]} />
            <meshBasicMaterial color={s.color} />
          </mesh>
          {/* Right curb */}
          <mesh
            position={[s.curbR.x, 0.025, s.curbR.z]}
            rotation={[-Math.PI / 2, 0, s.angle]}
          >
            <planeGeometry args={[0.65, s.len * 1.05]} />
            <meshBasicMaterial color={s.color} />
          </mesh>
        </group>
      ))}

      {/* Central Starting Pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[PLAZA_R, 48]} />
        <meshStandardMaterial color="#1a2030" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <ringGeometry args={[PLAZA_R - 0.12, PLAZA_R, 48]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI]} position={[0, 0.02, 0]}>
        <planeGeometry args={[5.6, 1.4]} />
        <meshBasicMaterial map={plazaTex} transparent depthWrite={false} />
      </mesh>

      {/* Pit Exit Link from Center Hub onto the Serpentine Circuit */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.016, 7]}>
        <planeGeometry args={[4.2, 12]} />
        <meshStandardMaterial color="#151924" roughness={0.82} />
      </mesh>
    </group>
  );
}

/* ============================================================
   DECOR WORLD (trees, lamps, crates, cones, gate pillars, orbs)
============================================================ */
function DecorWorld() {
  const orbs = useRef<THREE.Group>(null);

  const lampSpots = useMemo(() => {
    // Placed strictly along outer safety barrier, 0 lamps on track or roads
    return [
      { x: -30.0, z: 30.0 },
      { x: 30.0, z: 30.0 },
      { x: -30.0, z: -30.0 },
      { x: 30.0, z: -30.0 },
      { x: -32.0, z: 0 },
      { x: 32.0, z: 0 },
    ];
  }, []);

  useFrame((_, delta) => {
    if (orbs.current) orbs.current.rotation.y += delta * 0.25;
  });

  return (
    <group>
      {/* street lamps along roads */}
      {lampSpots.map((p, i) => (
        <group key={`lamp-${i}`} position={[p.x, 0, p.z]}>
          <mesh position={[0, 1.3, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 2.6, 8]} />
            <meshStandardMaterial color="#232836" roughness={0.6} metalness={0.5} />
          </mesh>
          <mesh position={[0, 2.66, 0]}>
            <sphereGeometry args={[0.13, 12, 12]} />
            <meshBasicMaterial color="#ffd98a" />
          </mesh>
          <mesh position={[0, 2.52, 0]}>
            <boxGeometry args={[0.16, 0.1, 0.16]} />
            <meshStandardMaterial color="#2c3242" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* glowing server crates (moved far outside track) */}
      {CRATE_SPOTS.map(([x, z, rot], i) => (
        <group key={`crate-${i}`} position={[x, 0, z]} rotation-y={rot}>
          <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.15, 0.84, 0.9]} />
            <meshStandardMaterial color="#161a24" roughness={0.5} metalness={0.45} />
          </mesh>
          {[0.2, 0.44, 0.68].map((y, j) => (
            <mesh key={j} position={[0, y, 0.453]}>
              <planeGeometry args={[0.9, 0.05]} />
              <meshBasicMaterial color={j % 2 === 0 ? "#8b5cf6" : "#38bdf8"} />
            </mesh>
          ))}
        </group>
      ))}

      {/* traffic cones (slalom) */}
      {CONE_SPOTS.map(([x, z], i) => (
        <group key={`cone-${i}`} position={[x, 0, z]}>
          <mesh position={[0, 0.3, 0]} castShadow>
            <coneGeometry args={[0.19, 0.6, 10]} />
            <meshStandardMaterial color="#f97316" roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <coneGeometry args={[0.13, 0.34, 10]} />
            <meshStandardMaterial color="#fff7ed" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.42, 0.05, 0.42]} />
            <meshStandardMaterial color="#1c202c" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* floating tech orbs above plaza */}
      <group ref={orbs} position={[0, 2.6, 0]}>
        {[
          { a: 0, c: "#8b5cf6" },
          { a: 2.1, c: "#38bdf8" },
          { a: 4.2, c: "#10b981" },
        ].map((o, i) => (
          <mesh
            key={i}
            position={[Math.cos(o.a) * 2.1, Math.sin(i * 1.7) * 0.3, Math.sin(o.a) * 2.1]}
          >
            <icosahedronGeometry args={[0.16, 0]} />
            <meshBasicMaterial color={o.c} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ============================================================
   STARS
============================================================ */
/* ============================================================
   RAIN SYSTEM & DRIFT TIRE SMOKE PARTICLES
============================================================ */
function getSmokeTexture(): THREE.CanvasTexture {
  const key = "smoke_puff";
  const cached = textureCache.get(key);
  if (cached) return cached;

  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(S / 2, S / 2, 4, S / 2, S / 2, S / 2);
  grad.addColorStop(0, "rgba(240, 243, 246, 0.85)");
  grad.addColorStop(0.35, "rgba(220, 226, 235, 0.6)");
  grad.addColorStop(0.7, "rgba(200, 210, 220, 0.2)");
  grad.addColorStop(1, "rgba(200, 210, 220, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);

  const tex = new THREE.CanvasTexture(canvas);
  textureCache.set(key, tex);
  return tex;
}

function DriftSmoke({
  carPosRef,
  carRotRef,
  isDriftingRef,
}: {
  carPosRef: React.MutableRefObject<THREE.Vector3>;
  carRotRef: React.MutableRefObject<number>;
  isDriftingRef: React.MutableRefObject<boolean>;
}) {
  const smokeTex = useMemo(() => getSmokeTexture(), []);
  const count = 64;
  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);
  const smokeState = useRef(
    Array.from({ length: count }, () => ({
      active: false,
      life: 1,
      scale: 0.2,
      vx: 0,
      vz: 0,
    }))
  );
  const poolIdx = useRef(0);

  useFrame((_, delta) => {
    // Spawn smoke puffs when turning or drifting
    if (isDriftingRef.current) {
      const rot = carRotRef.current;
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);

      for (let s = 0; s < 4; s++) {
        const idx = poolIdx.current;
        poolIdx.current = (poolIdx.current + 1) % count;

        const mesh = meshRefs.current[idx];
        const state = smokeState.current[idx];
        if (!mesh) continue;

        // Local tire offset: left and right rear tires
        const localX = (s % 2 === 0 ? -0.85 : 0.85) + (Math.random() - 0.5) * 0.15;
        const localZ = -1.25 + (Math.random() - 0.5) * 0.2;

        mesh.position.x = carPosRef.current.x + localX * cos - localZ * sin;
        mesh.position.y = 0.35 + Math.random() * 0.15;
        mesh.position.z = carPosRef.current.z + localX * sin + localZ * cos;

        // Billboarding towards sky/camera
        mesh.rotation.x = -Math.PI / 2.8;
        mesh.rotation.z = Math.random() * Math.PI * 2;

        state.active = true;
        state.life = 0;
        state.scale = 0.8;
        state.vx = (Math.random() - 0.5) * 0.5;
        state.vz = (Math.random() - 0.5) * 0.5;
        mesh.scale.set(0.8, 0.8, 0.8);
        mesh.visible = true;
      }
    }

    // Animate active smoke meshes
    for (let i = 0; i < count; i++) {
      const state = smokeState.current[i];
      const mesh = meshRefs.current[i];
      if (!state.active || !mesh) continue;

      state.life += delta * 1.6;
      mesh.position.y += delta * 0.85;
      mesh.position.x += state.vx * delta;
      mesh.position.z += state.vz * delta;

      state.scale += delta * 1.8;
      mesh.scale.set(state.scale, state.scale, state.scale);

      const mat = mesh.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, (1 - state.life) * 0.9);
      }

      if (state.life >= 1) {
        state.active = false;
        mesh.visible = false;
      }
    }
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          visible={false}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={smokeTex}
            transparent
            opacity={0.8}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ============================================================
   NISSAN SKYLINE GT-R R34 LBWK (LIBERTY WALK SUPER SILHOUETTE)
============================================================ */
/* ============================================================
   REAL 3D NISSAN SKYLINE (Loaded from OBJ) with Fallback Geometry
============================================================ */
function RealSkylineModel() {
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load(
      "/nissan-skyline.obj",
      (obj) => {
        // Find only the main car body mesh (Plane.001_Plane.006)
        // Discard the separate static wheel objects inside OBJ to avoid wheel duplication
        const cleanGroup = new THREE.Group();

        obj.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            // The OBJ has wheels named B.L, B.R, F.L, F.R; we use our own animated wheels
            if (mesh.name.startsWith("Plane")) {
              mesh.castShadow = true;
              mesh.receiveShadow = true;

              // Apply paint and trim colors
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => {
                  const mat = m as THREE.MeshStandardMaterial;
                  if (mat.name.includes("skyline") || mat.name.includes("Blue")) {
                    mat.color = new THREE.Color("#1d4ed8");
                    mat.metalness = 0.8;
                    mat.roughness = 0.2;
                  }
                });
              } else if (mesh.material) {
                const mat = mesh.material as THREE.MeshStandardMaterial;
                if (mat.name.includes("skyline") || mat.name.includes("Blue")) {
                  mat.color = new THREE.Color("#1d4ed8");
                  mat.metalness = 0.8;
                  mat.roughness = 0.2;
                }
              }
              cleanGroup.add(mesh.clone());
            }
          }
        });

        // Scale and align perfectly
        cleanGroup.scale.set(0.95, 0.95, 0.95);
        cleanGroup.position.set(0, 0.05, 0);
        setModel(cleanGroup);
      },
      undefined,
      (err) => console.warn("OBJ load failed:", err)
    );
  }, []);

  return model ? <primitive object={model} /> : null;
}

function Wheel({
  position,
  steerGroupRef,
  spinGroupRef,
  radius,
  isLeft,
}: {
  position: [number, number, number];
  steerGroupRef?: React.RefObject<THREE.Group | null>;
  spinGroupRef: React.RefObject<THREE.Group | null>;
  radius: number;
  isLeft: boolean;
}) {
  const rimX = isLeft ? -0.115 : 0.115;
  return (
    <group position={position} ref={steerGroupRef}>
      {/* Rotation group for wheel rolling around its axle */}
      <group ref={spinGroupRef}>
        {/* tire cylinder lying along X axis */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[radius, radius, 0.23, 24]} />
          <meshStandardMaterial color="#0a0c10" roughness={0.94} />
        </mesh>

        {/* Deep Dish Rim Lip */}
        <mesh position={[rimX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius * 0.72, radius * 0.78, 0.04, 24, 1, true]} />
          <meshStandardMaterial color="#e0e7ff" metalness={0.95} roughness={0.12} />
        </mesh>

        {/* 6-Spoke TE37 Style Wheels */}
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <group
            key={k}
            position={[rimX * 0.9, 0, 0]}
            rotation={[(k * Math.PI) / 3, 0, 0]}
          >
            <mesh position={[0, radius * 0.38, 0]}>
              <boxGeometry args={[0.04, radius * 0.58, 0.055]} />
              <meshStandardMaterial color="#c29b38" roughness={0.3} metalness={0.85} />
            </mesh>
          </group>
        ))}

        {/* Center Hub & Brembo Brake Caliper Accent */}
        <mesh position={[rimX * 0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius * 0.22, radius * 0.22, 0.05, 16]} />
          <meshStandardMaterial color="#1a1c23" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

function CyberCar({
  carRef,
  steerRef,
  tiltRef,
  isDriftingRef,
}: {
  carRef: React.MutableRefObject<{
    pos: THREE.Vector3;
    rot: number;
    speed: number;
  }>;
  steerRef: React.MutableRefObject<number>;
  tiltRef: React.MutableRefObject<{ roll: number; pitch: number }>;
  isDriftingRef: React.MutableRefObject<boolean>;
}) {
  const blobTex = useMemo(() => getBlobTexture(), []);
  const smokeTex = useMemo(() => getSmokeTexture(), []);

  const rootGroup = useRef<THREE.Group>(null);
  const chassisGroup = useRef<THREE.Group>(null);

  const flSteer = useRef<THREE.Group>(null);
  const frSteer = useRef<THREE.Group>(null);
  const flSpin = useRef<THREE.Group>(null);
  const frSpin = useRef<THREE.Group>(null);
  const rlSpin = useRef<THREE.Group>(null);
  const rrSpin = useRef<THREE.Group>(null);

  const spotRef = useRef<THREE.SpotLight>(null);
  const spotTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, 0.1, 10);
    return o;
  }, []);

  useEffect(() => {
    if (spotRef.current) spotRef.current.target = spotTarget;
  }, [spotTarget]);

  const smokeLRef = useRef<THREE.Mesh>(null);
  const smokeRRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const car = carRef.current;
    if (rootGroup.current) {
      rootGroup.current.position.set(car.pos.x, 0.02, car.pos.z);
      rootGroup.current.rotation.y = car.rot;
    }

    const isDrifting = isDriftingRef.current;
    if (smokeLRef.current && smokeRRef.current) {
      smokeLRef.current.visible = isDrifting;
      smokeRRef.current.visible = isDrifting;
      if (isDrifting) {
        const pulse = 0.4 + Math.sin(state.clock.elapsedTime * 28) * 0.12;
        smokeLRef.current.scale.set(pulse, pulse, pulse);
        smokeRRef.current.scale.set(pulse, pulse, pulse);
      }
    }
    if (chassisGroup.current) {
      chassisGroup.current.rotation.z = THREE.MathUtils.damp(
        chassisGroup.current.rotation.z,
        tiltRef.current.roll,
        8,
        delta
      );
      chassisGroup.current.rotation.x = THREE.MathUtils.damp(
        chassisGroup.current.rotation.x,
        tiltRef.current.pitch,
        8,
        delta
      );
    }

    // wheels spin around true axle (world X of car)
    const spinDelta = (car.speed * delta) / 0.32;
    if (flSpin.current) flSpin.current.rotation.x -= spinDelta;
    if (frSpin.current) frSpin.current.rotation.x -= spinDelta;
    if (rlSpin.current) rlSpin.current.rotation.x -= spinDelta;
    if (rrSpin.current) rrSpin.current.rotation.x -= spinDelta;
    // front steering
    if (flSteer.current) flSteer.current.rotation.y = steerRef.current;
    if (frSteer.current) frSteer.current.rotation.y = steerRef.current;
  });

  return (
    <group ref={rootGroup}>
      <group ref={chassisGroup}>
        {/* Load 3D Nissan Skyline OBJ model (Clean Body Only) */}
        <RealSkylineModel />

        {/* Headlight Spot Projector bound to car direction */}
        <spotLight
          ref={spotRef}
          position={[0, 0.65, 1.65]}
          angle={0.48}
          penumbra={0.5}
          intensity={32}
          distance={22}
          decay={1.4}
          color="#dbeafe"
        />
        <primitive object={spotTarget} />
      </group>

      {/* Animated TE37 Wheels on True Local Spin Axle */}
      <Wheel position={[-0.82, 0.32, 1.34]} steerGroupRef={flSteer} spinGroupRef={flSpin} radius={0.32} isLeft={true} />
      <Wheel position={[0.82, 0.32, 1.34]} steerGroupRef={frSteer} spinGroupRef={frSpin} radius={0.32} isLeft={false} />
      <Wheel position={[-0.82, 0.32, -1.26]} spinGroupRef={rlSpin} radius={0.32} isLeft={true} />
      <Wheel position={[0.82, 0.32, -1.26]} spinGroupRef={rrSpin} radius={0.32} isLeft={false} />

      {/* Dynamic Local Tire Smoke Puffs Directly Behind Rear Wheels */}
      <group position={[-0.82, 0.28, -1.45]}>
        <mesh ref={smokeLRef} visible={false}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={smokeTex}
            transparent
            opacity={0.8}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      <group position={[0.82, 0.28, -1.45]}>
        <mesh ref={smokeRRef} visible={false}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={smokeTex}
            transparent
            opacity={0.8}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* always-on blob shadow under car */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={[2.2, 4.4]} />
        <meshBasicMaterial map={blobTex} transparent depthWrite={false} opacity={0.85} />
      </mesh>
    </group>
  );
}

/* ============================================================
   LANDMARK BILLBOARD — faces arena center, readable text
============================================================ */
function LandmarkBillboard({
  landmark,
  isNearby,
}: {
  landmark: LandmarkData;
  isNearby: boolean;
}) {
  const labelTex = useMemo(() => getLabelTexture(landmark), [landmark]);
  const haloRef = useRef<THREE.Mesh>(null);

  const faceRotation = useMemo(() => {
    const [x, , z] = landmark.position;
    return Math.atan2(-x, -z);
  }, [landmark]);

  useFrame((state, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.9;
      haloRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <group position={landmark.position} rotation-y={faceRotation}>
      {/* ground pedestal ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[2.0, 2.22, 40]} />
        <meshBasicMaterial color={landmark.color} transparent opacity={isNearby ? 0.95 : 0.4} />
      </mesh>

      {/* legs */}
      <mesh position={[-1.55, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 1.24, 10]} />
        <meshStandardMaterial color="#2a3040" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[1.55, 0.62, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 1.24, 10]} />
        <meshStandardMaterial color="#2a3040" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* board frame */}
      <mesh position={[0, 1.86, 0]} castShadow>
        <boxGeometry args={[3.5, 1.78, 0.18]} />
        <meshStandardMaterial color="#10131c" roughness={0.45} metalness={0.5} />
      </mesh>

      {/* readable label — front face only, no mirroring */}
      <mesh position={[0, 1.86, 0.095]}>
        <planeGeometry args={[3.32, 1.62]} />
        <meshBasicMaterial map={labelTex} transparent toneMapped={false} />
      </mesh>
      {/* dark back face */}
      <mesh position={[0, 1.86, -0.095]} rotation-y={Math.PI}>
        <planeGeometry args={[3.32, 1.62]} />
        <meshBasicMaterial color="#0b0d14" />
      </mesh>

      {/* rotating halo above */}
      <mesh ref={haloRef} position={[0, 3.1, 0]} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[0.55, 0.035, 12, 40]} />
        <meshBasicMaterial color={landmark.color} />
      </mesh>

      {/* proximity beacon when nearby */}
      {isNearby && (
        <mesh position={[0, 4.0, 0]}>
          <sphereGeometry args={[0.12, 10, 10]} />
          <meshBasicMaterial color={landmark.color} />
        </mesh>
      )}
    </group>
  );
}

/* ============================================================
   WORLD SIMULATION — physics, collisions, chase camera, sun follow
============================================================ */
type MobileControls = {
  gas: boolean;
  brake: boolean;
  left: boolean;
  right: boolean;
  handbrake: boolean;
};

function World({
  onActiveLandmark,
  mobileControls,
}: {
  onActiveLandmark: (landmark: LandmarkData | null) => void;
  mobileControls: MobileControls;
}) {
  const camera = useThree((s) => s.camera);
  const plazaTex = useMemo(() => getPlazaTexture(), []);

  const carState = useRef({
    pos: new THREE.Vector3(0, 0, 1.6),
    rot: 0,
    speed: 0,
  });
  const isDriftingRef = useRef(false);
  const vel = useRef({ x: 0, z: 0 });
  const steerAngle = useRef(0);
  const tilt = useRef({ roll: 0, pitch: 0 });
  const keys = useRef(new Set<string>());
  const speedShown = useRef(-1);
  const nearbyId = useRef<string | null>(null);
  const camAnchor = useMemo(() => new THREE.Vector3(), []);
  const carPosExport = useRef(carState.current.pos);
  const carRotExport = useRef(0);

  // Orbit / Manual Camera Drag Offset
  const orbitAngle = useRef(0);
  const isDragging = useRef(false);
  const prevMouseX = useRef(0);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      // only drag if clicking canvas directly
      if ((e.target as HTMLElement).tagName === "CANVAS") {
        isDragging.current = true;
        prevMouseX.current = e.clientX;
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - prevMouseX.current;
        orbitAngle.current -= deltaX * 0.008;
        prevMouseX.current = e.clientX;
      }
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const sunRef = useRef<THREE.DirectionalLight>(null);
  const sunTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, 0, 0);
    return o;
  }, []);

  useEffect(() => {
    if (sunRef.current) sunRef.current.target = sunTarget;
    const down = (e: KeyboardEvent) => {
      if ([" ", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      keys.current.add(e.key.toLowerCase());
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [sunTarget]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const car = carState.current;

    /* ---- inputs ---- */
    const gas = keys.current.has("w") || keys.current.has("arrowup") || mobileControls.gas;
    const rev = keys.current.has("s") || keys.current.has("arrowdown") || mobileControls.brake;
    const left = keys.current.has("a") || keys.current.has("arrowleft") || mobileControls.left;
    const right = keys.current.has("d") || keys.current.has("arrowright") || mobileControls.right;
    const handbrake = keys.current.has(" ") || mobileControls.handbrake;

    /* ---- longitudinal physics ---- */
    const ACCEL = 9.0;
    const FRICTION = 3.6;
    const BRAKE = 15.0;

    let speed = car.speed;
    if (gas) speed = Math.min(MAX_SPEED, speed + ACCEL * delta);
    else if (rev) speed = Math.max(-5.0, speed - ACCEL * delta);
    else if (speed > 0) speed = Math.max(0, speed - FRICTION * delta);
    else if (speed < 0) speed = Math.min(0, speed + FRICTION * delta);

    if (handbrake) {
      if (speed > 0) speed = Math.max(0, speed - BRAKE * delta);
      else speed = Math.min(0, speed + BRAKE * delta);
    }

    /* ---- steering (rate scales with speed, reversed in reverse) ---- */
    const targetSteer = left ? 0.48 : right ? -0.48 : 0;
    steerAngle.current = THREE.MathUtils.damp(steerAngle.current, targetSteer, 12, delta);

    const speedRatio = Math.min(Math.abs(speed) / 3.8, 1);
    const dir = speed >= 0 ? 1 : -1;
    car.rot += steerAngle.current * 2.4 * speedRatio * dir * delta;

    /* ---- grip / drift velocity model ---- */
    // Trigger smoke and drift immediately whenever steering (left/right) or handbrake
    const isTurning = left || right || Math.abs(steerAngle.current) > 0.02;
    const isDrifting = handbrake || isTurning;
    isDriftingRef.current = isDrifting;
    carPosExport.current.copy(car.pos);
    carRotExport.current = car.rot;

    const grip = isDrifting ? 1.85 : 8.5;
    const fx = Math.sin(car.rot);
    const fz = Math.cos(car.rot);
    vel.current.x = THREE.MathUtils.damp(vel.current.x, fx * speed, grip, delta);
    vel.current.z = THREE.MathUtils.damp(vel.current.z, fz * speed, grip, delta);

    car.pos.x += vel.current.x * delta;
    car.pos.z += vel.current.z * delta;

    /* ---- collisions against world props ---- */
    for (const ob of OBSTACLES) {
      const dx = car.pos.x - ob.x;
      const dz = car.pos.z - ob.z;
      const minDist = ob.r + CAR_R;
      const d2 = dx * dx + dz * dz;
      if (d2 < minDist * minDist && d2 > 1e-8) {
        const d = Math.sqrt(d2);
        const nx = dx / d;
        const nz = dz / d;
        car.pos.x = ob.x + nx * minDist;
        car.pos.z = ob.z + nz * minDist;
        const vInNormal = vel.current.x * nx + vel.current.z * nz;
        if (vInNormal < 0) {
          const bounce = ob.bouncy ? 0.45 : 0.18;
          vel.current.x -= (1 + bounce) * vInNormal * nx;
          vel.current.z -= (1 + bounce) * vInNormal * nz;
          speed *= ob.bouncy ? 0.55 : 0.35;
        }
      }
    }

    /* ---- elastic arena walls ---- */
    if (Math.abs(car.pos.x) > BOUND) {
      const n = Math.sign(car.pos.x);
      car.pos.x = n * BOUND;
      if (vel.current.x * n > 0) vel.current.x *= -0.35;
      speed *= 0.6;
    }
    if (Math.abs(car.pos.z) > BOUND) {
      const n = Math.sign(car.pos.z);
      car.pos.z = n * BOUND;
      if (vel.current.z * n > 0) vel.current.z *= -0.35;
      speed *= 0.6;
    }

    car.speed = speed;

    /* ---- chassis feedback ---- */
    const velMag = Math.hypot(vel.current.x, vel.current.z);
    tilt.current.roll = -steerAngle.current * (speed / MAX_SPEED) * 0.22;
    tilt.current.pitch = THREE.MathUtils.clamp(-speed * 0.012 - velMag * 0.001, -0.09, 0.09);

    /* ---- Direct DOM HUD speed (0 React re-renders!) ---- */
    const shown = Math.round(velMag * 9);
    if (shown !== speedShown.current) {
      speedShown.current = shown;
      const valEl = document.getElementById("hud-speed-val");
      if (valEl) valEl.textContent = `${shown} KM/H`;
      const dotEl = document.getElementById("hud-speed-dot");
      if (dotEl) {
        if (shown > 5) {
          dotEl.className = "h-2 w-2 rounded-full bg-emerald-400 animate-pulse";
        } else {
          dotEl.className = "h-2 w-2 rounded-full bg-neutral-500";
        }
      }
    }

    /* ---- chase camera with smooth physics damping (no micro-stutter) ---- */
    const camDist = 7.2 + (velMag / MAX_SPEED) * 1.8;
    const camAngle = car.rot + orbitAngle.current;
    const camX = Math.sin(camAngle);
    const camZ = Math.cos(camAngle);

    camAnchor.set(car.pos.x - camX * camDist, 4.6 + velMag * 0.05, car.pos.z - camZ * camDist);
    // Smooth frame-rate independent damp
    camera.position.x = THREE.MathUtils.damp(camera.position.x, camAnchor.x, 8.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, camAnchor.y, 8.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, camAnchor.z, 8.5, delta);
    camera.lookAt(car.pos.x + fx * 1.6, 1.1, car.pos.z + fz * 1.6);

    /* ---- directional sun follows car => shadows always move ---- */
    if (sunRef.current) {
      sunRef.current.position.set(car.pos.x + 7, 13, car.pos.z + 5);
      sunTarget.position.set(car.pos.x, 0, car.pos.z);
      sunTarget.updateMatrixWorld();
    }

    /* ---- proximity zones ---- */
    let closest: LandmarkData | null = null;
    let minD = 3.9;
    for (const lm of landmarks) {
      const d = Math.hypot(car.pos.x - lm.position[0], car.pos.z - lm.position[2]);
      if (d < minD) {
        minD = d;
        closest = lm;
      }
    }
    if ((closest?.id ?? null) !== nearbyId.current) {
      nearbyId.current = closest?.id ?? null;
      onActiveLandmark(closest);
    }
  });

  return (
    <>
      <color attach="background" args={["#0f172a"]} />
      <fog attach="fog" args={["#0f172a", 28, 75]} />

      <hemisphereLight args={["#94a3b8", "#1e293b", 1.1]} />
      <directionalLight
        ref={sunRef}
        position={[12, 22, 8]}
        intensity={2.6}
        color="#f8fafc"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-near={2}
        shadow-camera-far={65}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
        shadow-bias={-0.0004}
      />
      <ambientLight intensity={0.4} color="#94a3b8" />

      <DriftSmoke
        carPosRef={carPosExport}
        carRotRef={carRotExport}
        isDriftingRef={isDriftingRef}
      />
      <GroundCity plazaTex={plazaTex} />
      <DecorWorld />

      {landmarks.map((lm) => (
        <LandmarkBillboard key={lm.id} landmark={lm} isNearby={nearbyId.current === lm.id} />
      ))}

      <CyberCar
        carRef={carState}
        steerRef={steerAngle}
        tiltRef={tilt}
        isDriftingRef={isDriftingRef}
      />
    </>
  );
}

/* ============================================================
   HERO WRAPPER — canvas, HUD, proximity modal, mobile controls
============================================================ */
function WorldHero() {
  const [activeLandmark, setActiveLandmark] = useState<LandmarkData | null>(null);
  const [mobileControls, setMobileControls] = useState<MobileControls>({
    gas: false,
    brake: false,
    left: false,
    right: false,
    handbrake: false,
  });

  const handleTouch = useCallback((key: keyof MobileControls, val: boolean) => {
    setMobileControls((prev) => ({ ...prev, [key]: val }));
  }, []);

  return (
    <div className="relative h-full w-full select-none">
      <Canvas
        shadows
        dpr={[1, 1.25]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 4.6, -7.2], fov: 48 }}
        className="absolute inset-0"
      >
        <World
          onActiveLandmark={setActiveLandmark}
          mobileControls={mobileControls}
        />
      </Canvas>

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-between p-5 md:p-8">
        <div className="max-w-[300px] text-white">
          <p className="text-[10px] uppercase tracking-[0.45em] text-violet-400">
            Interactive 3D Universe
          </p>
          <h1 className="mt-2 text-2xl font-black leading-none tracking-[-0.03em] md:text-4xl">
            NAUFAL ANANTA
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-neutral-400">
            Drive the cyber-car to explore projects, tech stack &amp; experience.
          </p>
        </div>

        <div className="hidden flex-col items-end gap-2 text-right md:flex">
          <div className="glass flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs text-neutral-300">
            <span
              id="hud-speed-dot"
              className="h-2 w-2 rounded-full bg-neutral-500"
            />
            <span id="hud-speed-val" className="font-mono">0 KM/H</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500">
            WASD / ARROWS &bull; SPACE TO DRIFT
          </span>
        </div>
      </div>

      {/* proximity modal */}
      {activeLandmark && (
        <div className="absolute inset-x-4 bottom-24 z-30 mx-auto max-w-sm rounded-3xl border border-white/15 bg-neutral-950/80 p-5 shadow-2xl backdrop-blur-xl md:bottom-12 md:max-w-md">
          <span
            className={`inline-block rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${activeLandmark.accent}`}
          >
            Nearby Zone {activeLandmark.index}
          </span>
          <h3 className="mt-2 text-lg font-bold text-white">{activeLandmark.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-neutral-400">
            {activeLandmark.description}
          </p>
          <a
            href={activeLandmark.href}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Jump to Section</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      )}

      {/* mobile touch controls */}
      <div className="absolute inset-x-4 bottom-4 z-20 flex justify-between md:hidden">
        <div className="flex gap-2">
          <button
            onPointerDown={() => handleTouch("left", true)}
            onPointerUp={() => handleTouch("left", false)}
            onPointerLeave={() => handleTouch("left", false)}
            className="glass flex h-14 w-14 items-center justify-center rounded-2xl active:bg-white/25"
            aria-label="Steer Left"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onPointerDown={() => handleTouch("right", true)}
            onPointerUp={() => handleTouch("right", false)}
            onPointerLeave={() => handleTouch("right", false)}
            className="glass flex h-14 w-14 items-center justify-center rounded-2xl active:bg-white/25"
            aria-label="Steer Right"
          >
            <ArrowRight className="h-6 w-6 text-white" />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onPointerDown={() => handleTouch("brake", true)}
            onPointerUp={() => handleTouch("brake", false)}
            onPointerLeave={() => handleTouch("brake", false)}
            className="glass flex h-14 w-14 items-center justify-center rounded-2xl active:bg-red-500/30"
            aria-label="Reverse or Brake"
          >
            <ArrowDown className="h-6 w-6 text-neutral-300" />
          </button>
          <button
            onPointerDown={() => handleTouch("gas", true)}
            onPointerUp={() => handleTouch("gas", false)}
            onPointerLeave={() => handleTouch("gas", false)}
            className="glass flex h-14 w-14 items-center justify-center rounded-2xl border-violet-500/40 bg-violet-600/30 active:bg-violet-600"
            aria-label="Drive Forward"
          >
            <ArrowUp className="h-6 w-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STATIC FALLBACK (no WebGL)
============================================================ */
function StaticFallback() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center bg-[#0b0e18] px-6 md:px-16">
      <div className="relative z-10 mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.45em] text-violet-400">
          Software Engineer &bull; Naufal Ananta
        </p>
        <h1 className="mt-4 text-5xl font-black leading-[0.85] tracking-[-0.04em] text-white md:text-8xl">
          BUILD
          <br />
          <span className="text-white/30">THE INVISIBLE</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-white/50 md:text-lg">
          Specializing in scalable backend architectures, high-throughput microservices, and
          automated fintech infrastructure.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {landmarks.map((lm) => (
            <a
              key={lm.id}
              href={lm.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-all hover:border-white/25 hover:bg-white/[0.06]"
            >
              <span
                className="relative text-sm font-bold uppercase tracking-[0.2em]"
                style={{ color: lm.color }}
              >
                {lm.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EXPORT
============================================================ */
export function WorldExperience() {
  const [mounted, setMounted] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMounted(true);
      setSupported(hasWebGL());
    }, 60);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="top" className="relative h-svh min-h-[620px] w-full overflow-hidden bg-[#0b0e18]">
      {!mounted ? (
        <div className="absolute inset-0 bg-[#0b0e18]" />
      ) : supported ? (
        <WorldHero />
      ) : (
        <StaticFallback />
      )}
    </section>
  );
}
