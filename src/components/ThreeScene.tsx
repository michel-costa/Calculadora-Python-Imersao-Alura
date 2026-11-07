import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Pause, Play, Eye, Maximize2, Minimize2, Sparkles, RefreshCw } from 'lucide-react';
import { Model3DType } from '../types/scientific';

interface ThreeSceneProps {
  modelType: Model3DType;
  darkMode: boolean;
  amplitude?: number;
  frequency?: number;
  phase?: number;
  colorHint?: string;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  modelType,
  darkMode,
  amplitude = 2.0,
  frequency = 2.5,
  phase = 0.0,
  colorHint = '#38bdf8'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // References to keep animation loop and scene objects accessible
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const activeMeshGroupRef = useRef<THREE.Group | null>(null);
  const waveGeometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const originalPositionsRef = useRef<Float32Array | null>(null);

  // Mouse drag rotation state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0.002, y: 0.005 });
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cameraDistanceRef = useRef<number>(10);

  // Detect Software WebGL safely
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

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const bgColor = darkMode ? 0x090d16 : 0xf8fafc;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.Fog(bgColor, 12, 35);

    // 2. CAMERA SETUP
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = darkMode ? 1.2 : 1.0;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. LIGHTING RIG (Balanced 3-point Studio Lighting)
    const hemiLight = new THREE.HemisphereLight(
      darkMode ? 0x60a5fa : 0xdbeafe,
      darkMode ? 0x0f172a : 0x475569,
      darkMode ? 0.9 : 0.8
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, darkMode ? 2.2 : 2.0);
    keyLight.position.set(6, 12, 8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 30;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    fillLight.position.set(-8, 4, -4);
    scene.add(fillLight);

    // Subtle Ground Grid
    const gridHelper = new THREE.GridHelper(
      16,
      24,
      darkMode ? 0x38bdf8 : 0x0284c7,
      darkMode ? 0x1e293b : 0xe2e8f0
    );
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // 5. ASSEMBLE PROCEDURAL 3D SUBJECTS (3 to 12 parts)
    const subjectGroup = new THREE.Group();
    activeMeshGroupRef.current = subjectGroup;
    scene.add(subjectGroup);

    buildModel(modelType, subjectGroup, {
      amplitude,
      frequency,
      phase,
      colorHint,
      isWireframe,
      darkMode
    });

    // 6. ANIMATION TICK LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Dynamic wave deformation if wave model is active
      if (modelType === 'onda' && waveGeometryRef.current && originalPositionsRef.current && isPlaying) {
        const geom = waveGeometryRef.current;
        const posAttr = geom.attributes.position;
        const orig = originalPositionsRef.current;
        const count = posAttr.count;

        for (let i = 0; i < count; i++) {
          const u = orig[i * 3];
          const v = orig[i * 3 + 1];
          const dist = Math.sqrt(u * u + v * v);
          const z =
            (amplitude * 0.4) *
            Math.sin(dist * frequency * 0.5 - elapsed * 2.5 + phase) *
            Math.cos(u * 0.5);
          posAttr.setZ(i, z);
        }
        posAttr.needsUpdate = true;
        geom.computeVertexNormals();
      }

      // Gentle auto-rotation when user is not manually dragging
      if (!isDraggingRef.current && isPlaying && subjectGroup) {
        subjectGroup.rotation.y += rotationVelocityRef.current.y;
        subjectGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. RESIZE LISTENER
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [modelType, darkMode]);

  // Re-build or update model when props change
  useEffect(() => {
    if (activeMeshGroupRef.current) {
      // Clear previous children
      while (activeMeshGroupRef.current.children.length > 0) {
        const obj = activeMeshGroupRef.current.children[0];
        activeMeshGroupRef.current.remove(obj);
      }
      buildModel(modelType, activeMeshGroupRef.current, {
        amplitude,
        frequency,
        phase,
        colorHint,
        isWireframe,
        darkMode
      });
    }
  }, [amplitude, frequency, phase, colorHint, isWireframe, modelType, darkMode]);

  // Procedural Model Builder Function
  const buildModel = (
    type: Model3DType,
    group: THREE.Group,
    params: {
      amplitude: number;
      frequency: number;
      phase: number;
      colorHint: string;
      isWireframe: boolean;
      darkMode: boolean;
    }
  ) => {
    const { amplitude, colorHint, isWireframe, darkMode } = params;
    const accentCol = new THREE.Color(colorHint);

    if (type === 'onda') {
      // 1. SCIENTIFIC 3D WAVE SURFACE (Plane deformed dynamically)
      const segments = 48;
      const planeGeom = new THREE.PlaneGeometry(8, 8, segments, segments);
      waveGeometryRef.current = planeGeom;
      originalPositionsRef.current = new Float32Array(planeGeom.attributes.position.array);

      const waveMat = new THREE.MeshStandardMaterial({
        color: accentCol,
        roughness: 0.25,
        metalness: 0.7,
        wireframe: isWireframe,
        side: THREE.DoubleSide
      });
      const waveMesh = new THREE.Mesh(planeGeom, waveMat);
      waveMesh.rotation.x = -Math.PI / 2.5;
      group.add(waveMesh);

      // Frame Boundary Wire
      const frameGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(8, 0.4, 8));
      const frameMat = new THREE.LineBasicMaterial({
        color: darkMode ? 0x60a5fa : 0x0284c7,
        linewidth: 2
      });
      const frameMesh = new THREE.LineSegments(frameGeom, frameMat);
      frameMesh.position.y = -1.2;
      group.add(frameMesh);
    } else if (type === 'torus') {
      // 2. PARAMETRIC SCIENTIFIC TORUS (V = 2π² R r²)
      const torusGeom = new THREE.TorusGeometry(2.8, Math.max(0.4, amplitude * 0.4), 28, 80);
      const torusMat = new THREE.MeshStandardMaterial({
        color: accentCol,
        roughness: 0.2,
        metalness: 0.85,
        wireframe: isWireframe
      });
      const torusMesh = new THREE.Mesh(torusGeom, torusMat);
      group.add(torusMesh);

      // Orbital Meridian Rings
      const ringGeom = new THREE.RingGeometry(3.6, 3.75, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: darkMode ? 0x38bdf8 : 0x0284c7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      group.add(ringMesh);

      // Central Harmonic Core Sphere
      const coreGeom = new THREE.SphereGeometry(0.8, 24, 24);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.9
      });
      group.add(new THREE.Mesh(coreGeom, coreMat));
    } else if (type === 'vetor') {
      // 3. 3D CARTESIAN SPACE & SPHERICAL BLOCH VECTOR
      // Semi-transparent unit reference sphere
      const sphereGeom = new THREE.SphereGeometry(2.5, 32, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: darkMode ? 0x1e293b : 0xe2e8f0,
        transparent: true,
        opacity: 0.25,
        wireframe: true
      });
      group.add(new THREE.Mesh(sphereGeom, sphereMat));

      // Coordinate Axes (X: Red, Y: Green, Z: Blue)
      const makeAxis = (dir: THREE.Vector3, col: number, labelLen = 3.8) => {
        const arrow = new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), labelLen, col, 0.4, 0.2);
        group.add(arrow);
      };
      makeAxis(new THREE.Vector3(1, 0, 0), 0xef4444); // X
      makeAxis(new THREE.Vector3(0, 1, 0), 0x10b981); // Y
      makeAxis(new THREE.Vector3(0, 0, 1), 0x3b82f6); // Z

      // The Scientific Vector (Resultant vector)
      const vDir = new THREE.Vector3(1.2, 1.8, 1.4).normalize();
      const mainVector = new THREE.ArrowHelper(
        vDir,
        new THREE.Vector3(0, 0, 0),
        3.2,
        accentCol.getHex(),
        0.5,
        0.28
      );
      group.add(mainVector);

      // Equatorial latitude and meridian guide rings
      const eqGeom = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * 2.5, 0, Math.sin(theta) * 2.5));
      }
      eqGeom.setFromPoints(points);
      const eqLine = new THREE.Line(
        eqGeom,
        new THREE.LineBasicMaterial({ color: darkMode ? 0x38bdf8 : 0x0284c7 })
      );
      group.add(eqLine);
    } else if (type === 'calculadora') {
      // 4. PROCEDURAL 3D SCIENTIFIC CALCULATOR MODEL (Composite 3-12 parts)
      // Part 1: Main Ergonomic Chassis (Hull)
      const bodyGeom = new THREE.BoxGeometry(3.6, 5.2, 0.5);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: darkMode ? 0x1e293b : 0x334155,
        roughness: 0.35,
        metalness: 0.45
      });
      const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
      bodyMesh.castShadow = true;
      group.add(bodyMesh);

      // Part 2: Screen Bezel Inset
      const screenBezelGeom = new THREE.BoxGeometry(3.1, 1.3, 0.55);
      const bezelMat = new THREE.MeshStandardMaterial({
        color: darkMode ? 0x0f172a : 0x1e293b,
        roughness: 0.5
      });
      const bezelMesh = new THREE.Mesh(screenBezelGeom, bezelMat);
      bezelMesh.position.set(0, 1.6, 0.05);
      group.add(bezelMesh);

      // Part 3: Glowing LCD Screen Panel
      const lcdGeom = new THREE.PlaneGeometry(2.8, 0.95);
      const lcdMat = new THREE.MeshBasicMaterial({
        color: darkMode ? 0x0ea5e9 : 0x38bdf8
      });
      const lcdMesh = new THREE.Mesh(lcdGeom, lcdMat);
      lcdMesh.position.set(0, 1.6, 0.35);
      group.add(lcdMesh);

      // Part 4: Solar Photovoltaic Cell Panel
      const solarGeom = new THREE.PlaneGeometry(1.6, 0.35);
      const solarMat = new THREE.MeshStandardMaterial({
        color: 0x475569,
        roughness: 0.1,
        metalness: 0.95
      });
      const solarMesh = new THREE.Mesh(solarGeom, solarMat);
      solarMesh.position.set(0, 2.3, 0.28);
      group.add(solarMesh);

      // Part 5 to 10: Keypad Keys Grid (Scientific & Numeric Keys)
      const keyGroup = new THREE.Group();
      const rows = 4;
      const cols = 4;
      const keyW = 0.55;
      const keyH = 0.42;
      const keyGeom = new THREE.BoxGeometry(keyW, keyH, 0.2);

      const numKeyMat = new THREE.MeshStandardMaterial({
        color: darkMode ? 0x475569 : 0x64748b,
        roughness: 0.4,
        metalness: 0.2
      });
      const funcKeyMat = new THREE.MeshStandardMaterial({
        color: accentCol,
        roughness: 0.3,
        metalness: 0.6
      });

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const isFunc = r === 0 || c === cols - 1;
          const keyMesh = new THREE.Mesh(keyGeom, isFunc ? funcKeyMat : numKeyMat);
          const xPos = (c - (cols - 1) / 2) * 0.72;
          const yPos = 0.6 - r * 0.62;
          keyMesh.position.set(xPos, yPos, 0.3);
          keyGroup.add(keyMesh);
        }
      }
      group.add(keyGroup);

      // Part 11: Metallic Accent Side Trim
      const trimGeom = new THREE.BoxGeometry(3.7, 0.1, 0.52);
      const trimMat = new THREE.MeshStandardMaterial({
        color: accentCol,
        metalness: 0.9,
        roughness: 0.15
      });
      const trimMesh = new THREE.Mesh(trimGeom, trimMat);
      trimMesh.position.y = 0.95;
      group.add(trimMesh);

      // Tilt the calculator for nice isometric presentation
      group.rotation.x = -Math.PI / 4.5;
    }
  };

  // Mouse drag handlers for interactive camera/rotation inspection
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !activeMeshGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    activeMeshGroupRef.current.rotation.y += deltaX * 0.008;
    activeMeshGroupRef.current.rotation.x += deltaY * 0.008;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const zoomDelta = e.deltaY * 0.005;
    cameraDistanceRef.current = Math.min(22, Math.max(4, cameraDistanceRef.current + zoomDelta));
    cameraRef.current.position.setLength(cameraDistanceRef.current);
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !activeMeshGroupRef.current) return;
    cameraDistanceRef.current = 10;
    cameraRef.current.position.set(0, 5, 10);
    cameraRef.current.lookAt(0, 0, 0);
    activeMeshGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all ${
        isExpanded ? 'fixed inset-4 z-50 shadow-2xl bg-slate-950' : 'h-[380px] lg:h-[440px]'
      }`}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Floating Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <span className="px-2.5 py-1 text-[11px] font-mono font-semibold rounded bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>
            {modelType === 'onda'
              ? 'Superfície de Onda 3D (z = A·sin)'
              : modelType === 'torus'
              ? 'Torus Paramétrico 3D (2π²Rr²)'
              : modelType === 'vetor'
              ? 'Espaço Vetorial 3D (x, y, z)'
              : 'Calculadora Científica 3D'}
          </span>
        </span>
      </div>

      {/* Floating Bottom Control Bar (Adhering to Three.js Dock Guidelines) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 shadow-md backdrop-blur-sm text-xs">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300 transition-colors"
          title={isPlaying ? 'Pausar animação' : 'Iniciar animação'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setIsWireframe(!isWireframe)}
          className={`px-2 py-1 rounded transition-colors font-mono text-[11px] ${
            isWireframe
              ? 'bg-sky-500 text-white font-bold'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="Alternar modo wireframe / malha de polígonos"
        >
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>Malha</span>
          </span>
        </button>

        <button
          onClick={handleResetCamera}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300 transition-colors"
          title="Resetar visão da câmera"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300 transition-colors"
          title={isExpanded ? 'Reduzir' : 'Expandir'}
        >
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="absolute bottom-3 right-3 hidden sm:block text-[10px] text-slate-400 select-none pointer-events-none">
        Arraste para girar · Roda do mouse para zoom
      </div>
    </div>
  );
};
