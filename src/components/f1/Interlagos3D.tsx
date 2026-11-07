import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RefreshCw, Eye, Maximize2, Minimize2, Sparkles, Flag, Compass } from 'lucide-react';

export type F1SceneMode = 'carro' | 'circuito' | 'aerodinamica';

interface Interlagos3DProps {
  darkMode: boolean;
  velocidadeKmh: number;
  downforceN: number;
  gLateral: number;
}

export const Interlagos3D: React.FC<Interlagos3DProps> = ({
  darkMode,
  velocidadeKmh = 290,
  downforceN = 12000,
  gLateral = 3.8
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sceneMode, setSceneMode] = useState<F1SceneMode>('carro');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const activeGroupRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Mouse Orbit Dragging
  const isDraggingRef = useRef<boolean>(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraDistanceRef = useRef<number>(10.5);

  // Detect Software WebGL
  const isSoftwareGl = (() => {
    if (typeof document === 'undefined') return true;
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  })();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. SCENE INITIALIZATION (Warm & Welcoming Colors)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const bgColor = !darkMode ? 0xf8fafc : 0x0f172a;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, 14, 38);

    // 2. CAMERA SETUP
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 280;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 10.5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = darkMode ? 1.15 : 1.05;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. BALANCED LIGHTING RIG (Formula 1 GP do Brasil)
    const hemiLight = new THREE.HemisphereLight(
      !darkMode ? 0xf1f5f9 : 0x009c3b, // Greenish/light sky reflection
      !darkMode ? 0xe2e8f0 : 0x1e293b, // Soft slate ground reflection
      darkMode ? 1.1 : 0.95
    );
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, darkMode ? 2.4 : 2.0);
    sunLight.position.set(8, 14, 10);
    if (!isSoftwareGl) {
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 30;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);

    // Interlagos Circuit Asphalt Floor
    const asphaltGeom = new THREE.PlaneGeometry(26, 26);
    const asphaltMat = new THREE.MeshStandardMaterial({
      color: !darkMode ? 0xdfe5eb : 0x1e293b,
      roughness: 0.8,
      metalness: 0.2
    });
    const asphaltMesh = new THREE.Mesh(asphaltGeom, asphaltMat);
    asphaltMesh.rotation.x = -Math.PI / 2;
    asphaltMesh.position.y = -1.5;
    asphaltMesh.receiveShadow = !isSoftwareGl;
    scene.add(asphaltMesh);

    // Track Kerb Grid Lines (Zebras Verde e Amarelo de Interlagos)
    const kerbGrid = new THREE.GridHelper(
      22,
      22,
      0x009c3b, // Verde Bandeira
      darkMode ? 0xffdf00 : 0xd97706 // Amarelo Canário
    );
    kerbGrid.position.y = -1.48;
    scene.add(kerbGrid);

    // 5. SUBJECT MODEL GROUP (Composite 3 to 12 parts)
    const modelGroup = new THREE.Group();
    activeGroupRef.current = modelGroup;
    scene.add(modelGroup);

    rebuildModel(sceneMode, modelGroup, {
      isWireframe,
      darkMode,
      velocidadeKmh,
      downforceN,
      gLateral
    });

    // 6. ANIMATION TICK LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Wind tunnel stream particle update
      if (particlesRef.current && isPlaying) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const count = positions.length / 3;
        const speed = (velocidadeKmh / 100) * 0.15;

        for (let i = 0; i < count; i++) {
          positions[i * 3 + 2] -= speed;
          if (positions[i * 3 + 2] < -6) {
            positions[i * 3 + 2] = 6;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Gentle auto-rotation when user is not manually orbiting
      if (!isDraggingRef.current && isPlaying && modelGroup) {
        modelGroup.rotation.y += 0.005;
        // Subtle banking angle responding to G-Force
        modelGroup.rotation.z = Math.sin(elapsed * 1.5) * (gLateral * 0.02);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [darkMode]);

  // Update model when mode, wireframe or parameters change
  useEffect(() => {
    if (activeGroupRef.current) {
      while (activeGroupRef.current.children.length > 0) {
        activeGroupRef.current.remove(activeGroupRef.current.children[0]);
      }
      rebuildModel(sceneMode, activeGroupRef.current, {
        isWireframe,
        darkMode,
        velocidadeKmh,
        downforceN,
        gLateral
      });
    }
  }, [sceneMode, isWireframe, velocidadeKmh, downforceN, gLateral, darkMode]);

  // Model Builder function
  const rebuildModel = (
    mode: F1SceneMode,
    group: THREE.Group,
    params: {
      isWireframe: boolean;
      darkMode: boolean;
      velocidadeKmh: number;
      downforceN: number;
      gLateral: number;
    }
  ) => {
    const { isWireframe, downforceN } = params;

    // Paleta Realista e Acolhedora do GP do Brasil (Verde, Amarelo, Azul, Carbono)
    const primaryChassisMat = new THREE.MeshStandardMaterial({
      color: 0x009c3b, // Verde Bandeira Brasileiro vibrante
      roughness: 0.25,
      metalness: 0.65,
      wireframe: isWireframe
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xffdf00, // Amarelo Canário solar
      roughness: 0.2,
      metalness: 0.55,
      wireframe: isWireframe
    });

    const metallicMat = new THREE.MeshStandardMaterial({
      color: 0x002776, // Azul Velocidade Brasileiro
      roughness: 0.2,
      metalness: 0.8,
      wireframe: isWireframe
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Grafite escuro limpo
      roughness: 0.7,
      metalness: 0.25,
      wireframe: isWireframe
    });

    const tyreMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.9,
      metalness: 0.05
    });

    if (mode === 'carro' || mode === 'aerodinamica') {
      // -------------------------------------------------------------
      // MONOPOSTO F1 PROCEDURAL GP DO BRASIL (10 Partes)
      // -------------------------------------------------------------
      const carGroup = new THREE.Group();

      // Part 1: Main Monocoque Chassis (Nose & Cockpit)
      const chassisGeom = new THREE.BoxGeometry(0.95, 0.45, 4.4);
      const chassisMesh = new THREE.Mesh(chassisGeom, primaryChassisMat);
      chassisMesh.position.set(0, 0, 0);
      carGroup.add(chassisMesh);

      // Part 2: Aerodynamic Nose Cone (Bico)
      const noseGeom = new THREE.ConeGeometry(0.48, 1.6, 16);
      const noseMesh = new THREE.Mesh(noseGeom, accentMat);
      noseMesh.rotation.x = Math.PI / 2;
      noseMesh.position.set(0, -0.05, 2.6);
      carGroup.add(noseMesh);

      // Part 3: Front Wing Assembly (Asa Dianteira em Carbono com flap)
      const frontWingGeom = new THREE.BoxGeometry(3.0, 0.08, 0.65);
      const frontWingMesh = new THREE.Mesh(frontWingGeom, carbonMat);
      frontWingMesh.position.set(0, -0.22, 2.7);
      carGroup.add(frontWingMesh);

      // Front Wing Endplates
      const endplateGeom = new THREE.BoxGeometry(0.06, 0.35, 0.68);
      const leftEndplate = new THREE.Mesh(endplateGeom, accentMat);
      leftEndplate.position.set(1.5, -0.1, 2.7);
      const rightEndplate = new THREE.Mesh(endplateGeom, accentMat);
      rightEndplate.position.set(-1.5, -0.1, 2.7);
      carGroup.add(leftEndplate);
      carGroup.add(rightEndplate);

      // Part 4: Rear Wing Assembly & DRS Flap (Asa Traseira)
      const rearWingGeom = new THREE.BoxGeometry(2.1, 0.35, 0.45);
      const rearWingMesh = new THREE.Mesh(rearWingGeom, primaryChassisMat);
      rearWingMesh.position.set(0, 0.75, -2.1);
      carGroup.add(rearWingMesh);

      // Rear Wing DRS Flap Indicator
      const drsFlapGeom = new THREE.BoxGeometry(2.0, 0.08, 0.25);
      const drsFlapMesh = new THREE.Mesh(drsFlapGeom, accentMat);
      drsFlapMesh.position.set(0, 0.95, -2.15);
      carGroup.add(drsFlapMesh);

      // Part 5: Halo Cockpit Safety Device (Titanium / Carbon Halo)
      const haloTorusGeom = new THREE.TorusGeometry(0.38, 0.05, 12, 24, Math.PI);
      const haloMesh = new THREE.Mesh(haloTorusGeom, metallicMat);
      haloMesh.rotation.x = -Math.PI / 2;
      haloMesh.position.set(0, 0.4, 0.3);
      carGroup.add(haloMesh);

      // Part 6: Sidepods (Radiadores Laterais)
      const sidepodGeom = new THREE.BoxGeometry(0.65, 0.4, 2.2);
      const leftSidepod = new THREE.Mesh(sidepodGeom, primaryChassisMat);
      leftSidepod.position.set(0.78, -0.02, -0.2);
      const rightSidepod = new THREE.Mesh(sidepodGeom, primaryChassisMat);
      rightSidepod.position.set(-0.78, -0.02, -0.2);
      carGroup.add(leftSidepod);
      carGroup.add(rightSidepod);

      // Part 7: Engine Cover Shark Fin (Barbatana de Tubarão)
      const finGeom = new THREE.BoxGeometry(0.06, 0.6, 1.6);
      const finMesh = new THREE.Mesh(finGeom, accentMat);
      finMesh.position.set(0, 0.55, -0.8);
      carGroup.add(finMesh);

      // Part 8, 9, 10, 11: Slick Tyres com Aro de Titânio
      const tyreGeom = new THREE.CylinderGeometry(0.48, 0.48, 0.42, 24);
      const rimGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.44, 16);
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8, // Titanium silver rim
        metalness: 0.85,
        roughness: 0.2
      });

      const makeWheel = (x: number, y: number, z: number) => {
        const wheelGroup = new THREE.Group();
        const tyre = new THREE.Mesh(tyreGeom, tyreMat);
        const rim = new THREE.Mesh(rimGeom, rimMat);
        wheelGroup.add(tyre);
        wheelGroup.add(rim);
        wheelGroup.rotation.z = Math.PI / 2;
        wheelGroup.position.set(x, y, z);
        return wheelGroup;
      };

      carGroup.add(makeWheel(1.4, -0.2, 1.8));   // Dianteiro Direito
      carGroup.add(makeWheel(-1.4, -0.2, 1.8));  // Dianteiro Esquerdo
      carGroup.add(makeWheel(1.4, -0.2, -1.8));  // Traseiro Direito
      carGroup.add(makeWheel(-1.4, -0.2, -1.8)); // Traseiro Esquerdo

      // Downforce Force Indicator Vector (Seta Vertical de Pressão Aerodinâmica)
      const downforceArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 2.2, -0.5),
        Math.min(3.5, Math.max(1.0, downforceN / 4000)),
        0x10b981, // Emerald Green Downforce Arrow
        0.4,
        0.25
      );
      carGroup.add(downforceArrow);

      group.add(carGroup);

      // In aerodinamica mode: add wind tunnel velocity stream particles
      if (mode === 'aerodinamica') {
        const particleCount = 180;
        const particleGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 4.5;
          positions[i * 3 + 1] = Math.random() * 2.2 - 0.3;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
        }

        particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
          color: darkMode ? 0x38bdf8 : 0x0284c7,
          size: 0.12,
          transparent: true,
          opacity: 0.75
        });
        const particles = new THREE.Points(particleGeom, particleMat);
        particlesRef.current = particles;
        group.add(particles);
      }
    } else if (mode === 'circuito') {
      // -------------------------------------------------------------
      // TRAÇADO 3D INTERATIVO DE INTERLAGOS COM ELEVAÇÃO REAL (4.309m)
      // -------------------------------------------------------------
      const trackPoints = [
        new THREE.Vector3(0, 0.4, 4.0),     // Reta dos Boxes (Largada)
        new THREE.Vector3(1.5, 0.2, 3.8),   // Entrada S do Senna
        new THREE.Vector3(2.8, -0.3, 2.8),  // Curva 1 (Descida íngreme)
        new THREE.Vector3(2.2, -0.7, 1.8),  // Curva 2
        new THREE.Vector3(3.2, -0.9, 0.5),  // Curva do Sol (Aceleração)
        new THREE.Vector3(4.2, -1.1, -2.5), // Reta Oposta (Ponto mais baixo)
        new THREE.Vector3(2.5, -1.0, -3.8), // Descida do Lago (Curva 4)
        new THREE.Vector3(1.0, -0.8, -3.2), // Ferradura
        new THREE.Vector3(-0.5, -0.6, -2.6),// Laranjinha (Curva de alta)
        new THREE.Vector3(-1.8, -0.4, -2.0),// Pinheirinho (Curva 9)
        new THREE.Vector3(-2.6, -0.2, -1.0),// Bico de Pato (Hairpin lento)
        new THREE.Vector3(-3.2, 0.0, 0.2),  // Mergulho
        new THREE.Vector3(-2.8, 0.3, 1.8),  // Junção (Início da Subida dos Boxes)
        new THREE.Vector3(-1.5, 0.6, 3.2),  // Subida dos Boxes (Subida forte)
        new THREE.Vector3(0, 0.4, 4.0)      // Fecha a volta
      ];

      const curve = new THREE.CatmullRomCurve3(trackPoints);
      curve.closed = true;

      // Track Asphalt Ribbon Geometry
      const tubeGeom = new THREE.TubeGeometry(curve, 100, 0.22, 12, true);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.7,
        metalness: 0.2,
        wireframe: isWireframe
      });
      const trackMesh = new THREE.Mesh(tubeGeom, tubeMat);
      group.add(trackMesh);

      // Kerbs along the curve (Brazilian Emerald & Gold Kerb)
      const kerbCurveGeom = new THREE.TubeGeometry(curve, 100, 0.26, 6, true);
      const kerbMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        wireframe: true
      });
      const kerbMesh = new THREE.Mesh(kerbCurveGeom, kerbMat);
      group.add(kerbMesh);

      // Finish Line Marker
      const finishGeom = new THREE.BoxGeometry(0.8, 0.08, 0.3);
      const finishMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b
      });
      const finishMesh = new THREE.Mesh(finishGeom, finishMat);
      finishMesh.position.set(0, 0.5, 4.0);
      group.add(finishMesh);

      // S do Senna 3D Marker Pin
      const pinGeom = new THREE.ConeGeometry(0.2, 0.8, 12);
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xff1801 });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.set(2.8, 0.5, 2.8);
      pinMesh.rotation.x = Math.PI;
      group.add(pinMesh);
    }
  };

  // Mouse Drag Camera Orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !activeGroupRef.current) return;
    const deltaX = e.clientX - mousePosRef.current.x;
    const deltaY = e.clientY - mousePosRef.current.y;

    activeGroupRef.current.rotation.y += deltaX * 0.008;
    activeGroupRef.current.rotation.x += deltaY * 0.008;

    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const zoomDelta = e.deltaY * 0.005;
    cameraDistanceRef.current = Math.min(24, Math.max(4, cameraDistanceRef.current + zoomDelta));
    cameraRef.current.position.setLength(cameraDistanceRef.current);
  };

  const resetCamera = () => {
    if (!cameraRef.current || !activeGroupRef.current) return;
    cameraDistanceRef.current = 11;
    cameraRef.current.position.set(0, 4.5, 11);
    cameraRef.current.lookAt(0, 0, 0);
    activeGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-slate-200/90 dark:border-slate-800 transition-all ${
        isExpanded ? 'fixed inset-3 z-50 shadow-2xl bg-slate-950' : 'h-[250px] sm:h-[285px]'
      }`}
    >
      {/* 3D WebGL Canvas */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Left Telemetry Tag (Welcoming & Compact) */}
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/95 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/60 shadow-xs flex items-center gap-1">
          <Flag className="w-3 h-3 text-amber-500" />
          <span>Interlagos 3D</span>
        </span>
        <span className="px-2 py-0.5 text-[10px] font-bold font-mono rounded-md bg-white/95 dark:bg-slate-900/90 text-amber-700 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 shadow-xs">
          {velocidadeKmh} km/h
        </span>
      </div>

      {/* Mode Switcher Tabs (Carro | Circuito | Aerodinâmica) - Compact */}
      <div className="absolute top-2.5 right-2.5 flex items-center p-0.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
        <button
          onClick={() => setSceneMode('carro')}
          className={`px-2 py-0.5 rounded text-xs transition-colors font-medium ${
            sceneMode === 'carro'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Carro F1
        </button>
        <button
          onClick={() => setSceneMode('circuito')}
          className={`px-2 py-0.5 rounded text-xs transition-colors font-medium ${
            sceneMode === 'circuito'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Pista 3D
        </button>
        <button
          onClick={() => setSceneMode('aerodinamica')}
          className={`px-2 py-0.5 rounded text-xs transition-colors font-medium ${
            sceneMode === 'aerodinamica'
              ? 'bg-emerald-600 text-white font-bold shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Túnel de Vento
        </button>
      </div>

      {/* Unified Bottom Control Dock - Glassmorphism & Reflective Border */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 backdrop-blur-md border border-white/10 shadow-xl text-xs">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-200 transition-colors"
          title={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setIsWireframe(!isWireframe)}
          className={`px-2 py-1 rounded-lg transition-all font-mono text-[11px] ${
            isWireframe
              ? 'bg-emerald-500 text-zinc-950 font-bold shadow-[0_0_12px_rgba(34,197,94,0.4)]'
              : 'hover:bg-zinc-800 text-zinc-200'
          }`}
          title="Modo Malha Wireframe"
        >
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>Malha</span>
          </span>
        </button>

        <button
          onClick={resetCamera}
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-200 transition-colors"
          title="Resetar Câmera"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-200 transition-colors"
          title={isExpanded ? 'Reduzir' : 'Expandir'}
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="absolute bottom-3 right-3 hidden sm:block text-[10px] text-slate-400 select-none pointer-events-none">
        Arraste para girar · Scroll para zoom
      </div>
    </div>
  );
};
