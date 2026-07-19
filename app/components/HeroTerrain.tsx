"use client";

/**
 * Interactive 3D hero — "site scan" terrain.
 *
 * A wireframe landscape displaced by layered simplex noise (GLSL), drawn as
 * contour lines in both directions with depth fog and height-graded Signal
 * Cyan color. A scan sweep passes through periodically, lighting survey
 * points as it goes. A second, dimmer ridge layer sits behind for parallax
 * depth. Bloom + vignette + grain give the premium finish; the camera eases
 * toward the cursor. Desktop-only — the video hero remains the fallback.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

type PointerRef = React.MutableRefObject<{ x: number; y: number }>;

// ── Shared GLSL ───────────────────────────────────────────────────────────────

// Ashima 2D simplex noise
const SNOISE = /* glsl */ `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
float terrainHeight(vec2 p, float t) {
  float h = 0.0;
  h += snoise(p * 0.055 + vec2(t * 0.016, 0.0)) * 2.6;
  h += snoise(p * 0.16  - vec2(0.0, t * 0.022)) * 0.9;
  h += snoise(p * 0.42  + vec2(t * 0.03, t * 0.01)) * 0.28;
  h += sin(p.x * 0.08 + t * 0.05) * 0.5;
  return h;
}
`;

const LINE_VERT = /* glsl */ `
uniform float uTime;
uniform float uScan;
uniform float uReveal;
varying float vFade;
varying float vGlow;
varying float vHeight;
${SNOISE}
void main() {
  vec3 pos = position;
  float h = terrainHeight(pos.xz, uTime);
  pos.y += h;

  // Depth fade: far rows dissolve into the fog
  float depth = clamp((pos.z + 26.0) / 26.0, 0.0, 1.0); // 0 far -> 1 near
  vFade = pow(depth, 1.4);

  // Reveal wipe from left to right on load
  float reveal = smoothstep(0.0, 1.0, uReveal * 1.35 - (pos.x + 18.0) / 36.0 * 0.35);
  vFade *= reveal;

  // Scan sweep glow (gaussian around the moving scan plane)
  float d = pos.x - uScan;
  vGlow = exp(-d * d * 0.18);

  vHeight = clamp(h * 0.22 + 0.5, 0.0, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const LINE_FRAG = /* glsl */ `
uniform vec3 uColorDeep;
uniform vec3 uColorBright;
uniform vec3 uColorScan;
uniform float uOpacity;
varying float vFade;
varying float vGlow;
varying float vHeight;
void main() {
  vec3 col = mix(uColorDeep, uColorBright, vHeight);
  col = mix(col, uColorScan, vGlow * 0.85);
  float alpha = uOpacity * vFade * (0.6 + vHeight * 0.4 + vGlow * 1.6);
  gl_FragColor = vec4(col, alpha);
}
`;

const POINT_VERT = /* glsl */ `
uniform float uTime;
uniform float uScan;
uniform float uReveal;
attribute float aSeed;
varying float vAlpha;
${SNOISE}
void main() {
  vec3 pos = position;
  pos.y += terrainHeight(pos.xz, uTime) + 0.06;

  float depth = clamp((pos.z + 26.0) / 26.0, 0.0, 1.0);
  float d = pos.x - uScan;
  float scanGlow = exp(-d * d * 0.12);
  // Points stay faintly lit after the scan passes, then decay
  float trail = exp(-max(uScan - pos.x, 0.0) * 0.12);
  float twinkle = 0.6 + 0.4 * sin(uTime * 2.0 + aSeed * 40.0);
  vAlpha = depth * uReveal * (scanGlow * 1.4 + trail * 0.35) * twinkle;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (2.4 + scanGlow * 3.2) * (140.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const POINT_FRAG = /* glsl */ `
uniform vec3 uColorScan;
varying float vAlpha;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float m = smoothstep(0.5, 0.05, length(uv));
  gl_FragColor = vec4(uColorScan, vAlpha * m);
}
`;

// ── Geometry builders ─────────────────────────────────────────────────────────

const W = 36; // world width (x)
const D = 26; // world depth (z)

/** Line grid: rows (along x) + columns (along z), as LineSegments pairs. */
function buildGridGeometry(rows: number, cols: number, rowRes: number, colRes: number) {
  const verts: number[] = [];
  for (let r = 0; r < rows; r++) {
    const z = (r / (rows - 1)) * D - D; // z in [-D, 0], camera looks toward -z
    for (let i = 0; i < rowRes; i++) {
      const x0 = (i / rowRes) * W - W / 2;
      const x1 = ((i + 1) / rowRes) * W - W / 2;
      verts.push(x0, 0, z, x1, 0, z);
    }
  }
  for (let c = 0; c < cols; c++) {
    const x = (c / (cols - 1)) * W - W / 2;
    for (let i = 0; i < colRes; i++) {
      const z0 = (i / colRes) * D - D;
      const z1 = ((i + 1) / colRes) * D - D;
      verts.push(x, 0, z0, x, 0, z1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  return geo;
}

function buildSurveyPoints(count: number) {
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  let s = 1;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = rand() * W - W / 2;
    pos[i * 3 + 1] = 0;
    pos[i * 3 + 2] = rand() * D - D;
    seed[i] = rand();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  return geo;
}

// ── Scene ─────────────────────────────────────────────────────────────────────

const SCAN_PERIOD = 13; // seconds per sweep cycle

function makeLineUniforms(bright: number) {
  return {
    uTime: { value: 0 },
    uScan: { value: -W },
    uReveal: { value: 0 },
    uOpacity: { value: bright },
    uColorDeep: { value: new THREE.Color("#0e7490") },
    uColorBright: { value: new THREE.Color("#22d3ee") },
    uColorScan: { value: new THREE.Color("#a5f3fc") },
  };
}

function Terrain({ pointerRef }: { pointerRef: PointerRef }) {
  const { camera } = useThree();

  const mainGeo = useMemo(() => buildGridGeometry(36, 28, 92, 34), []);
  const farGeo = useMemo(() => buildGridGeometry(16, 12, 48, 16), []);
  const pointsGeo = useMemo(() => buildSurveyPoints(360), []);

  const mainUniforms = useMemo(() => makeLineUniforms(0.85), []);
  const farUniforms = useMemo(() => makeLineUniforms(0.28), []);
  const pointUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScan: { value: -W },
      uReveal: { value: 0 },
      uColorScan: { value: new THREE.Color("#a5f3fc") },
    }),
    []
  );

  // THREE.ShaderMaterial CLONES the uniforms passed to its constructor, so we
  // must mutate the live uniforms on the material instances, not our templates.
  const mainMat = useRef<THREE.ShaderMaterial>(null);
  const farMat = useRef<THREE.ShaderMaterial>(null);
  const pointMat = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const reveal = Math.min(t / 2.2, 1);
    // Scan waits for the reveal, then sweeps on a loop with a rest between passes
    const cycle = ((t - 1.5) % SCAN_PERIOD) / SCAN_PERIOD;
    const scan =
      t < 1.5 || cycle > 0.62 ? -W : -W / 2 + (cycle / 0.62) * W * 1.25;

    for (const ref of [mainMat, farMat, pointMat]) {
      const u = ref.current?.uniforms;
      if (!u) continue;
      u.uTime.value = t;
      u.uScan.value = scan;
      u.uReveal.value = reveal;
    }

    // Cursor parallax: ease the camera, keep it aimed at the horizon
    const p = pointerRef.current;
    camera.position.x += (p.x * 1.6 - camera.position.x) * 0.03;
    camera.position.y += (4.6 - p.y * 0.8 - camera.position.y) * 0.03;
    camera.lookAt(0, 0.4, -12);
  });

  return (
    <>
      {/* Distant ridge layer for depth */}
      <group position={[0, -1.6, -9]} scale={[1.6, 1.0, 1]}>
        <lineSegments geometry={farGeo}>
          <shaderMaterial
            ref={farMat}
            vertexShader={LINE_VERT}
            fragmentShader={LINE_FRAG}
            uniforms={farUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      </group>

      {/* Main terrain — held low so the headline keeps clear dark space */}
      <lineSegments geometry={mainGeo} position={[0, -2.1, 0]}>
        <shaderMaterial
          ref={mainMat}
          vertexShader={LINE_VERT}
          fragmentShader={LINE_FRAG}
          uniforms={mainUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Survey points lit by the scan */}
      <points geometry={pointsGeo} position={[0, -2.1, 0]}>
        <shaderMaterial
          ref={pointMat}
          vertexShader={POINT_VERT}
          fragmentShader={POINT_FRAG}
          uniforms={pointUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

// ── Canvas wrapper ────────────────────────────────────────────────────────────

// Static film-grain tile (SVG turbulence) — replaces the per-frame Noise pass.
const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='128' height='128' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E";

export default function HeroTerrain() {
  // Canvas is pointer-events:none behind the hero content — track the cursor
  // at window level instead of relying on canvas events.
  const pointerRef = useRef({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Stop rendering entirely once the hero is scrolled out of view —
  // otherwise the GPU keeps burning 60fps for the whole session.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.02 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        flat
        frameloop={inView ? "always" : "never"}
        dpr={[1, 1.25]}
        camera={{ position: [0, 4.6, 7.5], fov: 50, near: 0.1, far: 60 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        style={{ pointerEvents: "none" }}
        aria-hidden
        onCreated={({ scene }) => {
          scene.fog = new THREE.Fog("#10151c", 10, 30);
        }}
      >
        <color attach="background" args={["#10151c"]} />
        <Terrain pointerRef={pointerRef} />
        {/* Bloom only, at reduced internal resolution — vignette and grain
            moved to free CSS overlays below */}
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.6} luminanceThreshold={0.18} mipmapBlur radius={0.7} height={300} />
        </EffectComposer>
      </Canvas>

      {/* CSS vignette (free) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(16,21,28,0.6) 100%)",
        }}
        aria-hidden
      />
      {/* CSS film grain (free, static tile) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: `url("${GRAIN_URI}")` }}
        aria-hidden
      />
    </div>
  );
}
