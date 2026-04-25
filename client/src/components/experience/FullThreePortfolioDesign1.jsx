import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, RoundedBox, Sparkles, Text } from "@react-three/drei";
import { ChevronLeft, ChevronRight, ExternalLink, MoveRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getProjectId, getProjectLiveUrl, getProjectTechStack } from "../../lib/projects";
import { emitSectionChange, isValidPortfolioSection, sectionLabels, sectionOrder } from "./threePortfolioShared";

const sectionBaseLayout = {
  home: { position: [0, 0.65, 0], size: [4.35, 2.45, 0.14], accent: "#3b82f6" },
  about: { position: [-3.4, 0.9, -1.8], size: [3.1, 2.05, 0.14], accent: "#22c55e" },
  skills: { position: [3.4, 0.9, -1.8], size: [3.1, 2.05, 0.14], accent: "#a855f7" },
  projects: { position: [0, -2.2, -0.9], size: [4.85, 2.8, 0.14], accent: "#06b6d4" },
  experience: { position: [-3.45, -5.15, -2], size: [3.05, 2.08, 0.14], accent: "#f97316" },
  education: { position: [3.45, -5.15, -2], size: [3.05, 2.08, 0.14], accent: "#38bdf8" },
  contact: { position: [0, -7.85, -0.35], size: [4.15, 2.1, 0.14], accent: "#f43f5e" }
};

const cameraOffsets = {
  home: [0, 0.12, 4.45],
  about: [0.42, 0.08, 3.95],
  skills: [-0.42, 0.08, 3.95],
  projects: [0, 0.12, 4.85],
  experience: [0.42, 0.08, 4.2],
  education: [-0.42, 0.08, 4.2],
  contact: [0, 0.12, 4.05]
};

function CameraRig({ activeSection, isMobile }) {
  const { camera, pointer } = useThree();
  const lookAtRef = useRef(new THREE.Vector3());

  useFrame(() => {
    const layout = sectionBaseLayout[activeSection] ?? sectionBaseLayout.home;
    const offset = cameraOffsets[activeSection] ?? cameraOffsets.home;
    const desiredPosition = new THREE.Vector3(
      layout.position[0] + offset[0] * (isMobile ? 0.65 : 1),
      layout.position[1] + offset[1] + (isMobile ? 0.1 : 0),
      layout.position[2] + offset[2] + (isMobile ? 0.75 : 0)
    );
    const lookAt = new THREE.Vector3(layout.position[0], layout.position[1], layout.position[2] - 0.55);
    const idleX = pointer.x * 0.12;
    const idleY = pointer.y * 0.08;

    camera.position.lerp(new THREE.Vector3(desiredPosition.x + idleX, desiredPosition.y + idleY, desiredPosition.z), 0.06);
    lookAtRef.current.lerp(lookAt, 0.08);
    camera.lookAt(lookAtRef.current);
  });

  return null;
}

function SceneBackdrop() {
  const glowRef = useRef();

  useFrame((state) => {
    if (!glowRef.current) return;
    glowRef.current.rotation.z = state.clock.elapsedTime * 0.04;
  });

  return (
    <group position={[0, -2.25, -7.2]}>
      <mesh scale={[18, 12, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#07111f" />
      </mesh>
      <group ref={glowRef}>
        <mesh position={[-5.5, 3.6, 0.15]}>
          <circleGeometry args={[2.7, 48]} />
          <meshBasicMaterial color="#2563eb" transparent opacity={0.07} />
        </mesh>
        <mesh position={[4.8, -0.6, 0.12]}>
          <circleGeometry args={[2.1, 48]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.06} />
        </mesh>
        <mesh position={[0, -4.8, 0.1]}>
          <circleGeometry args={[2.9, 48]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.05} />
        </mesh>
      </group>
    </group>
  );
}

function SectionCard({ section, panel, activeSection, isMobile, children }) {
  const groupRef = useRef();
  const layout = sectionBaseLayout[section];
  const isActive = activeSection === section;

  useFrame((state) => {
    if (!groupRef.current) return;
    const pulse = isActive ? Math.sin(state.clock.elapsedTime * 1.1) * 0.03 : 0;
    const scale = isActive ? 1 : 0.74;

    groupRef.current.position.lerp(
      new THREE.Vector3(layout.position[0], layout.position[1] + pulse, layout.position[2] + (isActive ? 0.12 : -0.25)),
      0.08
    );
    groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.08);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, isActive ? -0.02 : -0.03, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      isActive ? Math.sin(state.clock.elapsedTime * 0.35) * 0.03 : layout.position[0] * 0.035,
      0.08
    );
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.05} rotationIntensity={0.04} floatIntensity={0.14}>
        <group onClick={() => emitSectionChange(section)}>
          <RoundedBox
            args={layout.size}
            radius={0.14}
            smoothness={5}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "default";
            }}
          >
            <meshPhysicalMaterial
              color="#08111d"
              roughness={0.2}
              metalness={0.1}
              transmission={0.2}
              thickness={0.8}
              transparent
              opacity={0.92}
              clearcoat={1}
              clearcoatRoughness={0.18}
            />
          </RoundedBox>
          <mesh position={[0, layout.size[1] / 2 - 0.14, layout.size[2] / 2 + 0.01]}>
            <planeGeometry args={[layout.size[0] * 0.9, 0.05]} />
            <meshBasicMaterial color={layout.accent} transparent opacity={isActive ? 0.9 : 0.5} />
          </mesh>
          <mesh position={[0, 0, -0.065]}>
            <planeGeometry args={[layout.size[0] * 0.94, layout.size[1] * 0.9]} />
            <meshBasicMaterial color={layout.accent} transparent opacity={isActive ? 0.08 : 0.03} />
          </mesh>
          <Text
            position={[-layout.size[0] / 2 + 0.45, layout.size[1] / 2 - 0.28, layout.size[2] / 2 + 0.02]}
            anchorX="left"
            anchorY="middle"
            fontSize={0.12}
            color={layout.accent}
            letterSpacing={0.08}
          >
            {panel.eyebrow.toUpperCase()}
          </Text>
          <Html
            transform
            distanceFactor={isMobile ? 1.12 : 1.22}
            position={[0, 0, layout.size[2] / 2 + 0.05]}
            style={{ pointerEvents: isActive ? "auto" : "none" }}
          >
            <div
              className={`text-white ${
                isMobile ? panel.mobileContentClassName || "w-[236px] px-1 py-1" : panel.contentClassName || "w-[316px] px-1.5 py-1.5"
              }`}
            >
              {children}
            </div>
          </Html>
        </group>
      </Float>
    </group>
  );
}

function HomeContent({ resume }) {
  return (
    <div className="space-y-4">
      <div className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-200">
        Premium interactive resume
      </div>
      <div>
        <h1 className="font-display text-[2rem] font-bold leading-[1.05] text-white">{resume?.name || "Vivek Kumar"}</h1>
        <p className="mt-3 text-sm font-medium uppercase tracking-[0.24em] text-blue-200">{resume?.role || "Full Stack Developer"}</p>
      </div>
      <p className="max-w-[28rem] text-[15px] leading-7 text-slate-300">
        Building responsive frontends, reliable Node APIs, and premium product experiences with modern JavaScript tools.
      </p>
      <div className="h-px w-full bg-gradient-to-r from-blue-400/35 via-white/10 to-transparent" />
      <div className="grid gap-3 text-sm leading-6 text-slate-200 sm:grid-cols-[1fr_auto_1fr] sm:items-start">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Core stack</p>
          <p className="mt-1.5 font-medium">{(resume?.skills || []).slice(0, 3).join(" • ") || "React • Node • MongoDB"}</p>
        </div>
        <div className="hidden h-full w-px bg-white/10 sm:block" />
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Focus</p>
          <p className="mt-1.5 font-medium">Product UX, admin systems, and scalable API work.</p>
        </div>
      </div>
    </div>
  );
}

function DefaultContent({ panel }) {
  const meta = panel.meta || [];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{panel.kicker || "Section overview"}</p>
        <h2 className="mt-2 text-[1.7rem] font-bold leading-tight text-white">{panel.title}</h2>
      </div>
      <p className="text-[15px] leading-7 text-slate-300">{panel.body}</p>
      <div className="h-px w-full bg-gradient-to-r from-white/15 via-white/8 to-transparent" />
      {panel.items?.length ? (
        <div className="flex flex-wrap gap-2">
          {panel.items.slice(0, 6).map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-slate-200"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
      {meta.length ? (
        <div className="grid gap-2.5 sm:grid-cols-2">
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
  const project = projects[projectIndex] ?? null;

  if (!project) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white">Featured projects</h2>
        <p className="mt-4 text-sm leading-7 text-slate-300">Projects will appear here when data is available.</p>
      </div>
    );
  }

  const techStack = getProjectTechStack(project);
  const liveUrl = getProjectLiveUrl(project);
  const sourceLabel = project.source === "github" ? "GitHub synced" : "Manual project";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="max-w-md">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">Project spotlight</p>
          <h2 className="mt-2 text-[2.08rem] font-bold leading-tight text-white">{project.title}</h2>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-400">
            Featured case study · {projectIndex + 1} of {projects.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onPrev} className="icon-button h-9 w-9 border-white/10 bg-white/5 text-white hover:bg-white/10" aria-label="Previous project">
            <ChevronLeft size={16} />
          </button>
          <button type="button" onClick={onNext} className="icon-button h-9 w-9 border-white/10 bg-white/5 text-white hover:bg-white/10" aria-label="Next project">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className={`grid gap-5 ${isMobile ? "" : "md:grid-cols-[1.15fr_0.85fr]"}`}>
        <div className="space-y-4">
          <p className="text-[16px] leading-8 text-slate-300">{project.description || "Interactive project case study available inside the portfolio."}</p>
          <div className="h-px w-full bg-gradient-to-r from-cyan-400/30 via-white/10 to-transparent" />
          <div className="flex flex-wrap gap-2">
            {techStack.slice(0, isMobile ? 3 : 5).map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-slate-200">
                {item}
              </span>
            ))}
            {liveUrl ? <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-emerald-200">Live demo</span> : null}
          </div>
          <button type="button" onClick={() => onOpenProject(project)} className="primary-button !rounded-xl !px-5 !py-3.5 text-[15px]">
            Open details
            <MoveRight size={16} />
          </button>
        </div>
        <div className="grid gap-3 self-start">
          <div className="border-l border-cyan-400/25 pl-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Source</p>
            <p className="mt-1.5 flex items-center gap-2 text-[15px] font-medium text-slate-100">
              {sourceLabel}
              {liveUrl ? <ExternalLink size={14} className="text-emerald-300" /> : null}
            </p>
          </div>
          <div className="border-l border-white/10 pl-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Navigation</p>
            <p className="mt-1.5 text-[15px] font-medium leading-7 text-slate-100">Use the arrows to browse more projects without leaving the section.</p>
          </div>
          <div className="border-l border-white/10 pl-3">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Status</p>
            <p className="mt-1.5 text-[15px] font-medium text-slate-100">{liveUrl ? "Live deployment available" : "Source-first project view"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionNavigator({ activeSection, onSelect }) {
  const currentIndex = sectionOrder.indexOf(activeSection);

  return (
    <>
      <div className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 lg:flex">
        <div className="rounded-full border border-white/10 bg-slate-950/50 p-2 backdrop-blur-xl">
          <div className="flex flex-col gap-2">
            {sectionOrder.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => onSelect(section)}
                className={`h-2.5 w-2.5 rounded-full transition ${activeSection === section ? "bg-white shadow-[0_0_0_4px_rgba(59,130,246,0.18)]" : "bg-white/30 hover:bg-white/60"}`}
                aria-label={`Go to ${sectionLabels[section]}`}
                title={sectionLabels[section]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/48 px-3 py-3 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:px-4">
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

function ProjectRail({ projects, activeSection, projectIndex, onOpenProject, isMobile }) {
  const railBase = sectionBaseLayout.projects.position;
  const start = Math.max(0, projectIndex - 1);
  const visibleProjects = projects.slice(start, start + 3);

  return visibleProjects.map((project, localIndex) => {
    const actualIndex = start + localIndex;
    const delta = actualIndex - projectIndex;
    const isCenter = delta === 0;
    const techStack = getProjectTechStack(project);
    const liveUrl = getProjectLiveUrl(project);

    return (
      <Float key={getProjectId(project)} speed={1 + localIndex * 0.08} rotationIntensity={0.04} floatIntensity={0.14}>
        <group position={[railBase[0] + delta * (isMobile ? 1.95 : 2.2), railBase[1] - 2.35, railBase[2] + (isCenter ? 0.92 : 0.2)]}>
          <RoundedBox
            args={[isMobile ? 1.58 : 1.75, isMobile ? 1.16 : 1.24, 0.12]}
            radius={0.12}
            smoothness={5}
            onClick={() => onOpenProject(project)}
            onPointerOver={() => {
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "default";
            }}
          >
            <meshPhysicalMaterial
              color={isCenter && activeSection === "projects" ? "#0b1829" : "#09121f"}
              roughness={0.18}
              metalness={0.12}
              transmission={0.18}
              thickness={0.65}
              transparent
              opacity={0.94}
            />
          </RoundedBox>
          <mesh position={[0, 0.44, 0.065]}>
            <planeGeometry args={[isMobile ? 1.1 : 1.28, 0.05]} />
            <meshBasicMaterial color={liveUrl ? "#34d399" : "#38bdf8"} transparent opacity={0.9} />
          </mesh>
          <Html transform distanceFactor={1.02} position={[0, 0, 0.075]} style={{ pointerEvents: "none" }}>
            <div className={`rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/72 to-slate-900/45 p-3.5 text-white shadow-[0_18px_40px_rgba(2,6,23,0.28)] backdrop-blur-xl ${isMobile ? "w-[150px]" : "w-[170px]"}`}>
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-sm font-semibold leading-5 text-white">{project.title}</p>
                {liveUrl ? <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200">Live</span> : null}
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-300">{project.description || "Open for more details."}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
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

function SectionConstellation() {
  return (
    <group>
      {Object.values(sectionBaseLayout).map((layout, index) => (
        <mesh key={`${layout.position.join("-")}-${index}`} position={[layout.position[0], layout.position[1], layout.position[2] - 0.8]}>
          <circleGeometry args={[0.04, 20]} />
          <meshBasicMaterial color="#93c5fd" transparent opacity={0.45} />
        </mesh>
      ))}
      <line>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                ...sectionBaseLayout.home.position,
                ...sectionBaseLayout.about.position,
                ...sectionBaseLayout.projects.position,
                ...sectionBaseLayout.contact.position,
                ...sectionBaseLayout.education.position,
                ...sectionBaseLayout.skills.position,
                ...sectionBaseLayout.home.position
              ]),
              3
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="#1d4ed8" transparent opacity={0.16} />
      </line>
    </group>
  );
}

function ProjectGlow({ activeSection, isMobile }) {
  const groupRef = useRef();
  const lightRef = useRef();
  const base = sectionBaseLayout.projects.position;

  useFrame((state) => {
    if (!groupRef.current || !lightRef.current) return;
    const t = state.clock.elapsedTime;
    const targetX = base[0] + (isMobile ? 1.35 : 2.05) + Math.sin(t * 0.42) * 0.38 + Math.sin(t * 0.19) * 0.14;
    const targetY = base[1] - 1.45 + Math.cos(t * 0.55) * 0.22;
    const targetZ = base[2] + 1.15 + Math.sin(t * 0.33) * 0.18;
    const pulse = 1 + Math.sin(t * 0.9) * 0.08;

    groupRef.current.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.06);
    groupRef.current.scale.lerp(new THREE.Vector3(pulse, pulse, pulse), 0.06);
    lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, activeSection === "projects" ? 7.2 : 4.5, 0.08);
  });

  return (
    <group ref={groupRef} position={[base[0] + 2.05, base[1] - 1.45, base[2] + 1.15]}>
      <pointLight ref={lightRef} color="#38bdf8" intensity={7.2} distance={4.4} decay={1.85} />
      <mesh>
        <sphereGeometry args={[isMobile ? 0.46 : 0.54, 32, 32]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.38} />
      </mesh>
      <mesh scale={[3.4, 3.4, 3.4]}>
        <sphereGeometry args={[isMobile ? 0.34 : 0.4, 32, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.09} />
      </mesh>
      <mesh scale={[5.8, 5.8, 5.8]}>
        <sphereGeometry args={[isMobile ? 0.26 : 0.3, 32, 32]} />
        <meshBasicMaterial color="#0ea5e9" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

function Scene({ resume, projects, activeSection, onOpenProject, projectIndex, onPrevProject, onNextProject, isMobile }) {
  const panels = useMemo(
    () => ({
      home: {
        eyebrow: "Portfolio",
        title: resume?.name || "Vivek Kumar",
        body: `${resume?.role || "Full Stack Developer"} with a product-first approach to full-stack development.`
      },
      about: {
        eyebrow: "About",
        title: "Clean builds, thoughtful UX",
        body: resume?.bio || "Building products with modern React, Node.js, and MongoDB.",
        kicker: "Product perspective",
        meta: [
          { label: "Approach", value: "Readable UI, stable backend, practical polish" },
          { label: "Goal", value: "Experiences that feel smooth and trustworthy" }
        ]
      },
      skills: {
        eyebrow: "Skills",
        title: "Modern engineering stack",
        body: "Focused on reliable backend architecture and polished frontend execution.",
        items: resume?.skills || [],
        kicker: "Tooling",
        meta: [
          { label: "Frontend", value: "React, motion, Three.js interfaces" },
          { label: "Backend", value: "Node.js, Express, MongoDB" }
        ]
      },
      projects: {
        eyebrow: "Projects",
        title: "Selected work",
        body: "Case studies with source, live links, and tech stack.",
        contentClassName: "w-[432px] px-2 py-1.5",
        mobileContentClassName: "w-[272px] px-1.5 py-1.5"
      },
      experience: {
        eyebrow: "Experience",
        title: resume?.experience?.[0]?.title || "Engineering experience",
        body: resume?.experience?.[0]?.highlights?.join(" ") || "Full-stack projects, API work, and interface systems.",
        kicker: "Execution",
        meta: [
          { label: "Mode", value: resume?.experience?.[0]?.company || "Freelance / Projects" },
          { label: "Period", value: resume?.experience?.[0]?.period || "Recent work" }
        ]
      },
      education: {
        eyebrow: "Education",
        title: resume?.education?.[0]?.degree || "Academic background",
        body: `${resume?.education?.[0]?.school || ""} ${resume?.education?.[0]?.year || ""}`.trim() || "Education details",
        kicker: "Foundation",
        meta: [
          { label: "School", value: resume?.education?.[0]?.school || "University" },
          { label: "Timeline", value: resume?.education?.[0]?.year || "Current program" }
        ]
      },
      contact: {
        eyebrow: "Contact",
        title: "Ready for the next build",
        body: `${resume?.contact?.email || ""} ${resume?.contact?.phone || ""} ${resume?.contact?.location || ""}`.trim(),
        kicker: "Reach out",
        meta: [
          { label: "Email", value: resume?.contact?.email || "Available on request" },
          { label: "Location", value: resume?.contact?.location || "India" }
        ]
      }
    }),
    [resume]
  );

  return (
    <>
      <color attach="background" args={["#050b14"]} />
      <fog attach="fog" args={["#050b14", 8.5, 16]} />
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 6, 5]} intensity={1.8} color="#dbeafe" />
      <pointLight position={[0, 2.4, 2.2]} intensity={18} color="#2563eb" distance={10} />
      <pointLight position={[0, -2.2, 2]} intensity={12} color="#06b6d4" distance={9} />
      <SceneBackdrop />
      <Sparkles count={26} scale={[10, 12, 7]} size={1.5} speed={0.18} color="#ffffff" opacity={0.75} />
      <SectionConstellation />
      <ProjectGlow activeSection={activeSection} isMobile={isMobile} />

      <SectionCard section="home" panel={panels.home} activeSection={activeSection} isMobile={isMobile}>
        <HomeContent resume={resume} />
      </SectionCard>

      {["about", "skills", "experience", "education", "contact"].map((section) => (
        <SectionCard key={section} section={section} panel={panels[section]} activeSection={activeSection} isMobile={isMobile}>
          <DefaultContent panel={panels[section]} />
        </SectionCard>
      ))}

      <SectionCard section="projects" panel={panels.projects} activeSection={activeSection} isMobile={isMobile}>
        <ProjectCarousel
          projects={projects}
          projectIndex={projectIndex}
          onPrev={onPrevProject}
          onNext={onNextProject}
          onOpenProject={onOpenProject}
          isMobile={isMobile}
        />
      </SectionCard>

      <ProjectRail
        projects={projects}
        activeSection={activeSection}
        projectIndex={projectIndex}
        onOpenProject={onOpenProject}
        isMobile={isMobile}
      />

      <CameraRig activeSection={activeSection} isMobile={isMobile} />
    </>
  );
}

function FullThreePortfolioDesign1({ resume, projects, onOpenProject }) {
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

  const handlePrevProject = () => {
    if (!projects.length) return;
    setProjectIndex((current) => (current - 1 + projects.length) % projects.length);
  };

  const handleNextProject = () => {
    if (!projects.length) return;
    setProjectIndex((current) => (current + 1) % projects.length);
  };

  const handleSectionSelect = (section) => {
    setActiveSection(section);
    window.history.replaceState(null, "", `#${section}`);
    emitSectionChange(section);
  };

  return (
    <section id="home" className="relative h-[calc(100vh-74px)] min-h-[700px] overflow-hidden border-b border-white/10 bg-[#050b14]">
      <div className="sr-only" aria-hidden="true">
        {sectionOrder.slice(1).map((key) => (
          <span key={key} id={key} />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#050b14] via-[#050b14]/85 to-transparent" />

      <SectionNavigator activeSection={activeSection} onSelect={handleSectionSelect} />

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-3xl -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/52 px-4 py-3 text-xs text-slate-300 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:text-sm">
        <span>Use the navbar to move through the 3D portfolio.</span>
        <span>{activeSection === "projects" ? "Project arrows change projects." : "Use the on-screen controls or up / down arrows."}</span>
      </div>

      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.7, isMobile ? 5.6 : 4.45], fov: isMobile ? 48 : 36 }} className="absolute inset-0">
        <Scene
          resume={resume}
          projects={projects}
          activeSection={activeSection}
          onOpenProject={onOpenProject}
          projectIndex={projectIndex}
          onPrevProject={handlePrevProject}
          onNextProject={handleNextProject}
          isMobile={isMobile}
        />
      </Canvas>
    </section>
  );
}

export default FullThreePortfolioDesign1;
