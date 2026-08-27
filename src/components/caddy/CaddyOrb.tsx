import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, Environment, ContactShadows } from "@react-three/drei";
import { useRef } from "react";
import type { Group, Mesh } from "three";

/**
 * Procedural 3D "Caddy" companion — a glass orb head with a care-teal core,
 * two floating eyes and an orbiting ring. Pure react-three-fiber, no model file.
 */
function CaddyBody({ calm }: { calm: boolean }) {
  const group = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);

  useFrame((state) => {
    if (calm) return;
    const t = state.clock.elapsedTime;
    const { x, y } = state.pointer;
    if (group.current) {
      group.current.rotation.y += (x * 0.5 - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (-y * 0.3 - group.current.rotation.x) * 0.04;
      const breathe = 1 + Math.sin(t * 1.4) * 0.035;
      group.current.scale.setScalar(breathe);
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.5;
      ring.current.rotation.x = Math.PI / 2.6 + Math.sin(t * 0.6) * 0.15;
    }
    if (core.current) {
      const p = 1 + Math.sin(t * 2.1) * 0.12;
      core.current.scale.setScalar(p);
    }
  });

  return (
    <Float
      speed={calm ? 0 : 1.4}
      rotationIntensity={calm ? 0 : 0.35}
      floatIntensity={calm ? 0 : 1.1}
    >
      <group ref={group}>
        <mesh castShadow>
          <sphereGeometry args={[1.15, 64, 64]} />
          <MeshTransmissionMaterial
            thickness={0.9}
            roughness={0.08}
            transmission={1}
            ior={1.35}
            chromaticAberration={0.35}
            anisotropy={0.3}
            distortion={0.25}
            distortionScale={0.4}
            temporalDistortion={0.1}
            color="#eaf7f8"
          />
        </mesh>

        <mesh ref={core}>
          <icosahedronGeometry args={[0.46, 1]} />
          <meshStandardMaterial
            color="#1fa3ad"
            emissive="#22b3bd"
            emissiveIntensity={1.4}
            roughness={0.25}
          />
        </mesh>

        {[-0.34, 0.34].map((x) => (
          <mesh key={x} position={[x, 0.18, 1.0]}>
            <sphereGeometry args={[0.11, 32, 32]} />
            <meshStandardMaterial color="#20303c" roughness={0.3} />
          </mesh>
        ))}

        <mesh ref={ring}>
          <torusGeometry args={[1.65, 0.045, 16, 128]} />
          <meshStandardMaterial
            color="#f0a44f"
            emissive="#e08c2e"
            emissiveIntensity={0.7}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function CaddyOrb({ calm = false }: { calm?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2.1} castShadow />
      <pointLight position={[-4, -2, -3]} intensity={12} color="#f0a44f" />
      <CaddyBody calm={calm} />
      <ContactShadows position={[0, -2, 0]} opacity={0.35} blur={3} scale={9} far={4} />
      <Environment preset="city" />
    </Canvas>
  );
}
