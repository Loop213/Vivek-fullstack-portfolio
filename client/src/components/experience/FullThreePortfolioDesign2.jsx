import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, RoundedBox, Sparkles, Text } from "@react-three/drei";
import { ChevronLeft, ChevronRight, MoveRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getProjectId, getProjectLiveUrl, getProjectTechStack } from "../../lib/projects";
import { emitSectionChange, isValidPortfolioSection, sectionLabels, sectionOrder } from "./threePortfolioShared";

const stageLayout = {
  home: { position: [0, 0.85, 0], size: [3.9, 2.1, 0.12], accent: "#60a5fa" },
  about: { position: [-4.15, 0.2, -2.3], size: [2.7, 1.8, 0.12], accent: "#2dd4bf" },
  skills: { position: [4.15, 0.2, -2.3], size: [2.7, 1.8, 0.12], accent: "#c084fc" },
  projects: { position: [0, -2.6, -1], size: [4.55, 2.6, 0.12], accent: "#22d3ee" },
  experience: { position: [-3.35, -5.2, -3.25], size: [2.65, 1.88, 0.12], accent: "#fb7185" },
  education: { position: [3.35, -5.2, -3.25], size: [2.65, 1.88, 0.12], accent: "#38bdf8" },
  contact: { position: [0, -7.75, -1.7], size: [3.75, 1.9, 0.12], accent: "#f59e0b" }
};

const cameraOffsets = {
  home: [0, 0.35, 5.25],
  about: [0.7, 0.1, 4.75],
  skills: [-0.7, 0.1, 4.75],
  projects: [0, 0.25, 5.4],
  experience: [0.55, 0.12, 4.95],
  education: [-0.55, 0.12, 4.95],
  contact: [0, 0.18, 4.7]
};

function CameraRig({ activeSection, isMobile }) {
  const { camera, pointer } = useThree();
  const lookAtRef = useRef(new THREE.Vector3());

  useFrame((state) => {
    const layout = stageLayout[activeSection] ?? stageLayout.home;
    const offset = cameraOffsets[activeSection] ?? cameraOffsets.home;
    const wobble = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    const pointerX = pointer.x * 0.16;
    const pointerY = pointer.y * 0.12;
    const desired = new THREE.Vector3(
      layout.position[0] + offset[0] + pointerX,
      layout.position[1] + offset[1] + pointerY,
      layout.position[2] + offset[2] + wobble + (isMobile ? 0.9 : 0)
    );
    const target = new THREE.Vector3(layout.position[0], layout.position[1], layout.position[2] - 0.95);

    camera.position.lerp(desired, 0.055);
    lookAtRef.current.lerp(target, 0.08);
    camera.lookAt(lookAtRef.current);
  });

  return null;
}

function CinematicBackdrop() {
  const ringsRef = useRef();

  useFrame((state) => {
    if (!ringsRef.current) return;
    ringsRef.current.rotation.z = state.clock.elapsedTime * 0.035;
  });

  return (
    <group position={[0, -2.8, -8]}>
      <mesh scale={[22, 15, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#030712" />
      </mesh>
      <group ref={ringsRef}>
        <mesh position={[0, 2.5, 0.04]}>
          <ringGeometry args={[3.8, 4.05, 96]} />
          <meshBasicMaterial color="#1d4ed8" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 2.5, 0.05]} scale={[0.72, 0.72, 1]}>
          <ringGeometry args={[3.8, 4.05, 96]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh position={[-5.2, -0.4, 0.06]}>
        <circleGeometry args={[2.3, 48]} />
        <meshBasicMaterial color="#0f766e" transparent opacity={0.1} />
      </mesh>
      <mesh position={[5.4, -1.4, 0.08]}>
        <circleGeometry args={[2.8, 48]} />
        <meshBasicMaterial color="#1d4ed8" transparent opacity={0.08} />
      </mesh>
      <mesh position={[0, -5.4, 0.05]}>
        <circleGeometry args={[3.3, 48]} />
        <meshBasicMaterial color="#7c3aed" transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function StageFloor() {
  return (
    <group position={[0, -9.05, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <circleGeometry args={[7.8, 96]} />
        <meshStandardMaterial color="#08101c" roughness={0.78} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <ringGeometry args={[4.8, 5.1, 80]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.015]}>
        <ringGeometry args={[2.5, 2.6, 80]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.16} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function OrbitalConnectors() {
  const curvePoints = new Float32Array([
    ...stageLayout.about.position,
    ...stageLayout.home.position,
    ...stageLayout.skills.position,
    ...stageLayout.projects.position,
    ...stageLayout.contact.position,
    ...stageLayout.experience.position,
    ...stageLayout.projects.position,
    ...stageLayout.education.position
  ]);

  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute attach="attributes-position" args={[curvePoints, 3]} />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="#60a5fa" transparent opacity={0.14} />
    </line>
  );
}

function AccentHalo({ width, height, color, active }) {
  return (
    <mesh position={[0, 0, -0.08]}>
      <planeGeometry args={[width * 1.05, height * 1.05]} />
      <meshBasicMaterial color={color} transparent opacity={active ? 0.12 : 0.05} />
    </mesh>
  );
}

function Design2Card({ section, panel, activeSection, isMobile, children }) {
  const groupRef = useRef();
  const layout = stageLayout[section];
  const isActive = activeSection === section;

  useFrame((state) => {
    if (!groupRef.current) return;
    const bob = Math.sin(state.clock.elapsedTime * 0.7 + layout.position[0]) * 0.06;
    const scale = isActive ? 1 : 0.78;
    groupRef.current.position.lerp(
      new THREE.Vector3(layout.position[0], layout.position[1] + bob, layout.position[2] + (isActive ? 0.3 : -0.1)),
      0.08
    );
    groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, isActive ? 0 : layout.position[0] * -0.04, 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, isActive ? -0.015 : -0.035, 0.08);
  });

  return (
    <group ref={groupRef}>
      <Float speed={1} rotationIntensity={0.02} floatIntensity={0.12}>
        <group onClick={() => emitSectionChange(section)}>
          <AccentHalo width={layout.size[0]} height={layout.size[1]} color={layout.accent} active={isActive} />
          <RoundedBox
            args={layout.size}
            radius={0.16}
            smoothness={5}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "default";
            }}
          >
            <meshPhysicalMaterial
              color="#09111f"
              roughness={0.14}
              metalness={0.16}
              transmission={0.24}
              thickness={0.9}
              transparent
              opacity={0.93}
              clearcoat={1}
              clearcoatRoughness={0.12}
            />
          </RoundedBox>
          <mesh position={[0, layout.size[1] / 2 - 0.12, 0.065]}>
            <planeGeometry args={[layout.size[0] * 0.86, 0.045]} />
            <meshBasicMaterial color={layout.accent} transparent opacity={0.95} />
          </mesh>
          <Text
            position={[-layout.size[0] / 2 + 0.34, layout.size[1] / 2 - 0.24, 0.08]}
            anchorX="left"
            anchorY="middle"
            fontSize={0.11}
            letterSpacing={0.09}
            color={layout.accent}
          >
            {panel.eyebrow.toUpperCase()}
          </Text>
          <Html transform distanceFactor={isMobile ? 1.05 : 1.12} position={[0, 0, 0.08]} style={{ pointerEvents: isActive ? "auto" : "none" }}>
            <div className={`text-white ${isMobile ? panel.mobileContentClassName || "w-[210px] px-1 py-1" : panel.contentClassName || "w-[278px] px-1.5 py-1.5"}`}>
              {children}
            </div>
          </Html>
        </group>
      </Float>
    </group>
  );
}

function PanelContent({ panel, compact = false }) {
  const meta = panel.meta || [];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{panel.kicker || "Section detail"}</p>
        <h2 className={`${compact ? "text-[1.35rem]" : "text-[1.7rem]"} mt-2 font-bold leading-tight text-white`}>{panel.title}</h2>
      </div>
      <p className="text-[15px] leading-7 text-slate-300">{panel.body}</p>
      <div className="h-px w-full bg-gradient-to-r from-white/15 via-white/8 to-transparent" />
      {panel.items?.length ? (
        <div className="flex flex-wrap gap-2">
          {panel.items.slice(0, compact ? 4 : 6).map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-slate-200">
              {item}
            </span>
          ))}
        </div>
      ) : null}
      {meta.length ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {meta.map(({ label, value }) => (
            <div key={label} className="space-y-1 border-l border-white/10 pl-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</p>
              <p className="text-sm font-medium leading-6 text-slate-100">{value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProjectCarousel({ projects, projectIndex, onPrev, onNext, onOpenProject, isMobile }) {
  const project = projects[projectIndex];

  if (!project) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">Projects will appear here once they are available.</p>
      </div>
    );
  }

  const techStack = getProjectTechStack(project);
  const liveUrl = getProjectLiveUrl(project);
  const sourceLabel = project.source === "github" ? "GitHub synced" : "Manual entry";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-200">Curated project</p>
          <h2 className="mt-2 text-[2.02rem] font-bold leading-tight text-white">{project.title}</h2>
          <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-400">
            Orbital showcase · {projectIndex + 1} of {projects.length}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onPrev} className="icon-button h-9 w-9 border-white/10 bg-white/5 text-white hover:bg-white/10" aria-label="Previous project">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={onNext} className="icon-button h-9 w-9 border-white/10 bg-white/5 text-white hover:bg-white/10" aria-label="Next project">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className={`grid gap-5 ${isMobile ? "" : "md:grid-cols-[1.1fr_0.9fr]"}`}>
        <div className="space-y-4">
          <p className="text-[16px] leading-8 text-slate-300">{project.description || "Portfolio project case study with live and source details."}</p>
          <div className="h-px w-full bg-gradient-to-r from-cyan-400/30 via-white/10 to-transparent" />
          <div className="flex flex-wrap gap-2">
            {techStack.slice(0, isMobile ? 3 : 5).map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-slate-200">
                {item}
              </span>
            ))}
            {liveUrl ? <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-emerald-200">Live</span> : null}
          </div>
          <button type="button" onClick={() => onOpenProject(project)} className="primary-button !rounded-xl !px-5 !py-3.5 text-[15px]">
            Open project details
            <MoveRight size={16} />
          </button>
        </div>
        <div className="grid gap-3 self-start">
          <div className="border-l border-cyan-400/25 pl-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Source</p>
            <p className="mt-1.5 text-[15px] font-medium text-slate-100">{sourceLabel}</p>
          </div>
          <div className="border-l border-white/10 pl-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Flow</p>
            <p className="mt-1.5 text-[15px] font-medium leading-7 text-slate-100">Browse projects with arrows, then open the selected case study for full details.</p>
          </div>
          <div className="border-l border-white/10 pl-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Availability</p>
            <p className="mt-1.5 text-[15px] font-medium text-slate-100">{liveUrl ? "Live build available" : "Source exploration available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectArc({ projects, projectIndex, onOpenProject, isMobile }) {
  const base = stageLayout.projects.position;
  const visible = projects.slice(Math.max(0, projectIndex - 1), Math.max(0, projectIndex - 1) + 3);
  const startIndex = Math.max(0, projectIndex - 1);

  return visible.map((project, localIndex) => {
    const actualIndex = startIndex + localIndex;
    const delta = actualIndex - projectIndex;
    const angle = delta * 0.42;
    const radius = isMobile ? 2.2 : 2.55;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * -1.55;
    const y = -4.35 + Math.abs(delta) * 0.18;
    const techStack = getProjectTechStack(project);
    const liveUrl = getProjectLiveUrl(project);

    return (
      <Float key={getProjectId(project)} speed={1.05 + localIndex * 0.08} rotationIntensity={0.03} floatIntensity={0.14}>
        <group position={[base[0] + x, y, base[2] + z]}>
          <RoundedBox
            args={[isMobile ? 1.48 : 1.62, isMobile ? 1.05 : 1.12, 0.12]}
            radius={0.13}
            smoothness={5}
            onClick={() => onOpenProject(project)}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "default";
            }}
          >
            <meshPhysicalMaterial color="#08101c" roughness={0.12} metalness={0.16} transmission={0.2} thickness={0.68} transparent opacity={0.94} />
          </RoundedBox>
          <mesh position={[0, 0.39, 0.065]}>
            <planeGeometry args={[1.05, 0.045]} />
            <meshBasicMaterial color={liveUrl ? "#34d399" : "#60a5fa"} transparent opacity={0.9} />
          </mesh>
          <Html transform distanceFactor={0.96} position={[0, 0, 0.075]} style={{ pointerEvents: "none" }}>
            <div className={`rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/72 to-slate-900/45 p-3.5 text-white shadow-[0_20px_42px_rgba(2,6,23,0.28)] backdrop-blur-xl ${isMobile ? "w-[140px]" : "w-[156px]"}`}>
              <p className="line-clamp-2 text-sm font-semibold leading-5 text-white">{project.title}</p>
              <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-300">{project.description || "Open details"}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {techStack.slice(0, 2).map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-slate-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Html>
        </group>
      </Float>
    );
  });
}

function ProjectGlow({ activeSection, isMobile }) {
  const groupRef = useRef();
  const lightRef = useRef();
  const base = stageLayout.projects.position;

  useFrame((state) => {
    if (!groupRef.current || !lightRef.current) return;
    const t = state.clock.elapsedTime;
    const targetX = base[0] + (isMobile ? 1.55 : 2.3) + Math.sin(t * 0.38) * 0.42 + Math.cos(t * 0.21) * 0.16;
    const targetY = base[1] - 1.38 + Math.cos(t * 0.48) * 0.24;
    const targetZ = base[2] + 1.18 + Math.sin(t * 0.31) * 0.2;
    const pulse = 1 + Math.sin(t * 0.8) * 0.09;

    groupRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.06);
    groupRef.current.scale.lerp(new THREE.Vector3(pulse, pulse, pulse), 0.06);
    lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, activeSection === "projects" ? 7.9 : 4.8, 0.08);
  });

  return (
    <group ref={groupRef} position={[base[0] + 2.3, base[1] - 1.38, base[2] + 1.18]}>
      <pointLight ref={lightRef} color="#38bdf8" intensity={7.9} distance={4.8} decay={1.85} />
      <mesh>
        <sphereGeometry args={[isMobile ? 0.5 : 0.6, 32, 32]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.36} />
      </mesh>
      <mesh scale={[3.8, 3.8, 3.8]}>
        <sphereGeometry args={[isMobile ? 0.34 : 0.42, 32, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.09} />
      </mesh>
      <mesh scale={[6.2, 6.2, 6.2]}>
        <sphereGeometry args={[isMobile ? 0.26 : 0.32, 32, 32]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

function SectionNavigator({ activeSection, onSelect }) {
  const currentIndex = sectionOrder.indexOf(activeSection);

  return (
    <>
      <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 lg:flex">
        <div className="rounded-full border border-white/10 bg-slate-950/46 p-2 backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            {sectionOrder.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => onSelect(section)}
                className={`h-2.5 w-2.5 rounded-full transition ${activeSection === section ? "bg-white shadow-[0_0_0_4px_rgba(34,211,238,0.18)]" : "bg-white/30 hover:bg-white/60"}`}
                aria-label={`Go to ${sectionLabels[section]}`}
                title={sectionLabels[section]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/44 px-3 py-3 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:px-4">
        <button
          type="button"
          onClick={() => onSelect(sectionOrder[(currentIndex - 1 + sectionOrder.length) % sectionOrder.length])}
          className="secondary-button !rounded-xl !border-white/10 !bg-white/5 !px-3 !py-2 text-sm !text-white hover:!bg-white/10"
        >
          <ChevronLeft size={16} />
          Prev
        </button>
        <div className="min-w-0 text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Current section</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">{sectionLabels[activeSection]}</p>
        </div>
        <button
          type="button"
          onClick={() => onSelect(sectionOrder[(currentIndex + 1) % sectionOrder.length])}
          className="secondary-button !rounded-xl !border-white/10 !bg-white/5 !px-3 !py-2 text-sm !text-white hover:!bg-white/10"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </>
  );
}

function Scene({ resume, projects, activeSection, onOpenProject, projectIndex, onPrevProject, onNextProject, isMobile }) {
  const panels = useMemo(
    () => ({
      home: {
        eyebrow: "Design 2",
        title: resume?.name || "Vivek Kumar",
        body: `${resume?.role || "Full Stack Developer"} crafting immersive interfaces, scalable APIs, and polished developer experiences.`,
        kicker: "Cinematic mode",
        meta: [
          { label: "Position", value: resume?.role || "Full Stack Developer" },
          { label: "Signature", value: "Interfaces with motion and clarity" }
        ]
      },
      about: {
        eyebrow: "About",
        title: "Minimal, cinematic, product-first",
        body: resume?.bio || "",
        kicker: "Perspective",
        meta: [
          { label: "Approach", value: "Design systems with real usability" },
          { label: "Priority", value: "Performance, maintainability, polish" }
        ]
      },
      skills: {
        eyebrow: "Skills",
        title: "Frontend + backend fluency",
        body: "Modern tools for shipping premium full-stack work.",
        items: resume?.skills || [],
        kicker: "Capabilities",
        meta: [
          { label: "Frontend", value: "React, interactive motion, Three.js" },
          { label: "Backend", value: "Node.js APIs and MongoDB data layers" }
        ]
      },
      projects: {
        eyebrow: "Projects",
        title: "Curated work",
        body: "Highlighted builds with source, demos, and implementation detail.",
        kicker: "Showcase",
        contentClassName: "w-[404px] px-2 py-1.5",
        mobileContentClassName: "w-[258px] px-1.5 py-1.5"
      },
      experience: {
        eyebrow: "Experience",
        title: resume?.experience?.[0]?.title || "Development experience",
        body: resume?.experience?.[0]?.highlights?.join(" ") || "Shipping interfaces, APIs, and admin systems.",
        kicker: "Delivery",
        meta: [
          { label: "Company", value: resume?.experience?.[0]?.company || "Freelance / Projects" },
          { label: "Timeline", value: resume?.experience?.[0]?.period || "Current focus" }
        ]
      },
      education: {
        eyebrow: "Education",
        title: resume?.education?.[0]?.degree || "Education",
        body: `${resume?.education?.[0]?.school || ""} ${resume?.education?.[0]?.year || ""}`.trim(),
        kicker: "Foundation",
        meta: [
          { label: "School", value: resume?.education?.[0]?.school || "University" },
          { label: "Years", value: resume?.education?.[0]?.year || "In progress" }
        ]
      },
      contact: {
        eyebrow: "Contact",
        title: "Open to the next build",
        body: `${resume?.contact?.email || ""} ${resume?.contact?.phone || ""} ${resume?.contact?.location || ""}`.trim(),
        kicker: "Connect",
        meta: [
          { label: "Email", value: resume?.contact?.email || "Available on request" },
          { label: "Base", value: resume?.contact?.location || "India" }
        ]
      }
    }),
    [resume]
  );

  return (
    <>
      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", 8.5, 18]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 6, 4]} intensity={1.55} color="#dbeafe" />
      <pointLight position={[0, 2.4, 1]} intensity={15} color="#3b82f6" distance={12} />
      <pointLight position={[-4, -0.5, -2]} intensity={9} color="#14b8a6" distance={10} />
      <pointLight position={[4, -0.5, -2]} intensity={9} color="#8b5cf6" distance={10} />
      <CinematicBackdrop />
      <StageFloor />
      <Sparkles count={34} scale={[12, 12, 7]} size={1.7} speed={0.16} color="#ffffff" opacity={0.7} />
      <OrbitalConnectors />
      <ProjectGlow activeSection={activeSection} isMobile={isMobile} />

      <Design2Card section="home" panel={panels.home} activeSection={activeSection} isMobile={isMobile}>
        <PanelContent panel={panels.home} />
      </Design2Card>

      {["about", "skills", "experience", "education", "contact"].map((section) => (
        <Design2Card key={section} section={section} panel={panels[section]} activeSection={activeSection} isMobile={isMobile}>
          <PanelContent panel={panels[section]} compact />
        </Design2Card>
      ))}

      <Design2Card section="projects" panel={panels.projects} activeSection={activeSection} isMobile={isMobile}>
        <ProjectCarousel
          projects={projects}
          projectIndex={projectIndex}
          onPrev={onPrevProject}
          onNext={onNextProject}
          onOpenProject={onOpenProject}
          isMobile={isMobile}
        />
      </Design2Card>

      <ProjectArc projects={projects} projectIndex={projectIndex} onOpenProject={onOpenProject} isMobile={isMobile} />

      <CameraRig activeSection={activeSection} isMobile={isMobile} />
    </>
  );
}

function FullThreePortfolioDesign2({ resume, projects, onOpenProject }) {
  const [activeSection, setActiveSection] = useState("home");
  const [projectIndex, setProjectIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const syncFromHash = () => {
      const nextSection = window.location.hash.replace("#", "");
      if (isValidPortfolioSection(nextSection)) {
        setActiveSection(nextSection);
      }
    };

    const syncFromCustom = (event) => {
      if (isValidPortfolioSection(event.detail)) {
        setActiveSection(event.detail);
        window.history.replaceState(null, "", `#${event.detail}`);
      }
    };

    const onResize = () => setIsMobile(window.innerWidth < 768);

    const onKeyDown = (event) => {
      if (event.key === "ArrowLeft" && activeSection === "projects" && projects.length) {
        setProjectIndex((current) => (current - 1 + projects.length) % projects.length);
        return;
      }
      if (event.key === "ArrowRight" && activeSection === "projects" && projects.length) {
        setProjectIndex((current) => (current + 1) % projects.length);
        return;
      }
      if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
      const currentIndex = sectionOrder.indexOf(activeSection);
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const next = sectionOrder[(currentIndex + direction + sectionOrder.length) % sectionOrder.length];
      setActiveSection(next);
      window.history.replaceState(null, "", `#${next}`);
      emitSectionChange(next);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    window.addEventListener("portfolio-section-change", syncFromCustom);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
      window.removeEventListener("portfolio-section-change", syncFromCustom);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeSection, projects.length]);

  useEffect(() => {
    if (!projects.length) {
      setProjectIndex(0);
      return;
    }
    setProjectIndex((current) => Math.min(current, projects.length - 1));
  }, [projects.length]);

  const handleSectionSelect = (section) => {
    setActiveSection(section);
    window.history.replaceState(null, "", `#${section}`);
    emitSectionChange(section);
  };

  return (
    <section id="home" className="relative h-[calc(100vh-74px)] min-h-[720px] overflow-hidden border-b border-white/10 bg-[#030712]">
      <div className="sr-only" aria-hidden="true">
        {sectionOrder.slice(1).map((key) => (
          <span key={key} id={key} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-[#030712] via-[#030712]/80 to-transparent" />
      <SectionNavigator activeSection={activeSection} onSelect={handleSectionSelect} />
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/42 px-4 py-3 text-xs text-slate-300 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:text-sm">
        <span>Design 2 uses a cinematic orbital layout with focused section cards.</span>
        <span>{activeSection === "projects" ? "Project arrows cycle projects." : "Use the on-screen controls or up / down arrows."}</span>
      </div>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1, isMobile ? 6.1 : 5.2], fov: isMobile ? 50 : 38 }} className="absolute inset-0">
        <Scene
          resume={resume}
          projects={projects}
          activeSection={activeSection}
          onOpenProject={onOpenProject}
          projectIndex={projectIndex}
          onPrevProject={() => setProjectIndex((current) => (current - 1 + projects.length) % projects.length)}
          onNextProject={() => setProjectIndex((current) => (current + 1) % projects.length)}
          isMobile={isMobile}
        />
      </Canvas>
    </section>
  );
}

export default FullThreePortfolioDesign2;
