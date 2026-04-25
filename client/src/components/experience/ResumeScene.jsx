import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox, Sparkles, Text } from "@react-three/drei";
import * as THREE from "three";
import { sectionMeta } from "../../data/sectionMeta";

function CameraRig({ activeSection, positions }) {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // Smoothly lerp both the camera position and look-at point for cinematic transitions.
    const selected = positions[activeSection];
    const desiredPosition = new THREE.Vector3(selected[0], selected[1] + 1.5, selected[2] + 4);
    camera.position.lerp(desiredPosition, 0.06);
    targetRef.current.lerp(new THREE.Vector3(selected[0], selected[1], selected[2]), 0.08);
    camera.lookAt(targetRef.current);
  });

  return null;
}

function CoreOrb() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.25;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <Float speed={1.6} rotationIntensity={0.45} floatIntensity={0.7}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.75, 2]} />
        <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.24} metalness={0.4} roughness={0.18} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.01, 12, 80]} />
        <meshBasicMaterial color="#93c5fd" transparent opacity={0.45} />
      </mesh>
    </Float>
  );
}

function ProjectSatellites({ projects }) {
  return projects.slice(0, 3).map((project, index) => (
    <Float
      key={project._id || project.url}
      speed={1.5 + index * 0.25}
      rotationIntensity={0.35}
      floatIntensity={0.8}
      position={[2.4 + index * 0.75, 1.8 - index * 0.55, -1.3 + index * 0.4]}
    >
      <RoundedBox args={[1.05, 0.45, 0.16]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color="#1d2a44" emissive="#24487d" emissiveIntensity={0.18} />
      </RoundedBox>
      <Text position={[0, 0, 0.11]} fontSize={0.12} color="#eef4ff" maxWidth={0.9} anchorX="center" anchorY="middle">
        {project.title.slice(0, 16)}
      </Text>
    </Float>
  ));
}

function SectionNode({ item, position, isActive, onSelect }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    const scale = isActive ? 1.08 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      isActive ? Math.sin(state.clock.elapsedTime * 0.7) * 0.15 : 0,
      0.08
    );
  });

  return (
    <group ref={groupRef} position={position}>
      <Float speed={1.3} rotationIntensity={0.16} floatIntensity={0.45}>
        <RoundedBox
          args={[1.55, 0.92, 0.28]}
          radius={0.08}
          smoothness={4}
          onClick={() => onSelect(item.key)}
          onPointerOver={(event) => {
            event.stopPropagation();
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <meshStandardMaterial
            color={item.color}
            metalness={0.18}
            roughness={0.38}
            emissive={isActive ? "#2563eb" : "#111827"}
            emissiveIntensity={isActive ? 0.22 : 0.03}
          />
        </RoundedBox>
        <Text
          position={[0, 0.02, 0.2]}
          fontSize={0.16}
          color="#f8fbff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.25}
        >
          {item.label}
        </Text>
      </Float>
    </group>
  );
}

function SceneContent({ activeSection, onSelect, projects }) {
  const positions = useMemo(
    () => ({
      about: [-3.4, 1.2, -1.5],
      skills: [-1.65, -0.55, 1.05],
      projects: [1.35, 1.1, -0.45],
      education: [3.35, -0.65, 0.8],
      contact: [0, -1.85, -2.15]
    }),
    []
  );

  return (
    <>
      <color attach="background" args={["#091120"]} />
      <fog attach="fog" args={["#091120", 8, 15]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 6, 4]} intensity={1.8} color="#ffffff" />
      <pointLight position={[0, 0.6, 0]} intensity={7} color="#60a5fa" />
      <Sparkles count={38} scale={7} size={2.2} speed={0.18} color="#ffffff" />
      <CoreOrb />
      <ProjectSatellites projects={projects} />
      {sectionMeta.map((item) => (
        <SectionNode
          key={item.key}
          item={item}
          position={positions[item.key]}
          isActive={item.key === activeSection}
          onSelect={onSelect}
        />
      ))}
      <mesh position={[0, -3.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7.5, 64]} />
        <meshStandardMaterial color="#101826" metalness={0.18} roughness={0.82} />
      </mesh>
      <CameraRig activeSection={activeSection} positions={positions} />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.9} minPolarAngle={Math.PI / 3} />
    </>
  );
}

function ResumeScene({ activeSection, onSelect, projects, isMobile }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.5, isMobile ? 8.5 : 7.2], fov: isMobile ? 50 : 42 }}
      className="rounded-[2.5rem]"
    >
      <SceneContent activeSection={activeSection} onSelect={onSelect} projects={projects} />
    </Canvas>
  );
}

export default ResumeScene;
