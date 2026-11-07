import React, { useState } from 'react';
import {
  Gauge,
  Wind,
  Compass,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Activity,
  Layers,
  Flag,
  RotateCcw
} from 'lucide-react';
import { Interlagos3D } from './Interlagos3D';

interface F1TelemetryGCCDProps {
  darkMode: boolean;
}

export const F1TelemetryGCCD: React.FC<F1TelemetryGCCDProps> = ({ darkMode }) => {
  // Input parameters (Fase G - Governança)
  const [velocidadeKmh, setVelocidadeKmh] = useState<number>(315);
  const [curvaRaioM, setCurvaRaioM] = useState<number>(85); // Raio típico do S do Senna
  const [asaDownforceCl, setAsaDownforceCl] = useState<number>(3.6);
  const [coefArrastoCd, setCoefArrastoCd] = useState<number>(0.92);
  const [localPista, setLocalPista] = useState<string>('S do Senna (Curva 1 e 2)');

  // Preset scenarios in Interlagos
  const carregarCenario = (nome: string, vel: number, raio: number, cl: number) => {
    setLocalPista(nome);
    setVelocidadeKmh(vel);
    setCurvaRaioM(raio);
    setAsaDownforceCl(cl);
  };

  // -------------------------------------------------------------
  // FASE C: CÁLCULO CIENTÍFICO (Fórmulas da Dinâmica Veicular de F1)
  // -------------------------------------------------------------
  const densidadeArInterlagos = 1.18; // kg/m³ a 800m de altitude em São Paulo
  const areaAsa = 1.5; // m²
  const massaCarro = 798; // kg regulamento FIA
  const vMs = velocidadeKmh / 3.6;

  // Pressão dinâmica q = 0.5 * rho * v²
  const pressaoDinamica = 0.5 * densidadeArInterlagos * (vMs ** 2);
  const forcaDownforceN = pressaoDinamica * asaDownforceCl * areaAsa;
  const forcaArrastoN = pressaoDinamica * coefArrastoCd * areaAsa;
  const pesoEquivalenteKg = forcaDownforceN / 9.80665;
  const razaoEficiencia = asaDownforceCl / coefArrastoCd;

  // Força Centrípeta e Força G
  const aceleracaoCentripeta = (vMs ** 2) / curvaRaioM;
  const forcaGLateral = aceleracaoCentripeta / 9.80665;
  const cargaPescocoKg = forcaGLateral * 6.5; // Cabeça + Capacete ~ 6.5 kg

  // -------------------------------------------------------------
  // FASE C: CONFERÊNCIA ANALÍTICA & LIMITES DA FIA
  // -------------------------------------------------------------
  const limiteFiaAprovado = forcaGLateral <= 6.0;
  const confiancaCientifica = limiteFiaAprovado ? 'Conforme FIA (100%)' : 'Alerta G-Force (> 6G)';

  return (
    <div className="space-y-4">
      {/* Top Banner F1 GP do Brasil - Compact & Welcoming */}
      <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Flag className="w-3.5 h-3.5 text-amber-500" />
            <span>F1 GP do Brasil · Autódromo de Interlagos</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400">Ciclo Metodológico GCCD</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Calculadora de Telemetria & Aerodinâmica
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Cálculo analítico de downforce, força G e dinâmica veicular para o traçado de Interlagos (altitude de 800m).
          </p>
        </div>

        {/* Quick Location Presets in Interlagos */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto text-xs">
          <button
            onClick={() => carregarCenario('S do Senna (Curva 1 e 2)', 140, 75, 4.2)}
            className={`px-2.5 py-1 rounded-lg border font-medium text-xs transition-colors ${
              localPista.startsWith('S do Senna')
                ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            S do Senna
          </button>
          <button
            onClick={() => carregarCenario('Reta Oposta (Zona DRS)', 335, 350, 2.8)}
            className={`px-2.5 py-1 rounded-lg border font-medium text-xs transition-colors ${
              localPista.startsWith('Reta Oposta')
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            Reta Oposta
          </button>
          <button
            onClick={() => carregarCenario('Curva do Laranjinha', 245, 110, 3.8)}
            className={`px-2.5 py-1 rounded-lg border font-medium text-xs transition-colors ${
              localPista.startsWith('Curva do Laranjinha')
                ? 'bg-emerald-600 text-white border-emerald-500 font-bold shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            Laranjinha
          </button>
          <button
            onClick={() => carregarCenario('Subida dos Boxes', 310, 280, 3.2)}
            className={`px-2.5 py-1 rounded-lg border font-medium text-xs transition-colors ${
              localPista.startsWith('Subida dos Boxes')
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            Subida dos Boxes
          </button>
        </div>
      </div>

      {/* Main Grid: Telemetry Workbench (7 cols) + 3D Visualizer (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: GCCD 3-Step Pipeline */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* FASE G: GOVERNANÇA DE TELEMETRIA */}
          <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center font-mono border border-emerald-300 dark:border-emerald-700">
                  G
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Fase G: Governança de Dados & Parâmetros
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                800m altitude (ρ = 1.18 kg/m³)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Velocidade */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Velocidade:</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    {velocidadeKmh} km/h ({(vMs).toFixed(1)} m/s)
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="360"
                  step="5"
                  value={velocidadeKmh}
                  onChange={(e) => setVelocidadeKmh(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5"
                />
              </div>

              {/* Raio da Curva */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Raio da Curva (R):</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                    {curvaRaioM} metros
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="400"
                  step="5"
                  value={curvaRaioM}
                  onChange={(e) => setCurvaRaioM(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5"
                />
              </div>

              {/* Coeficiente de Downforce Cl */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Downforce (Cl):</span>
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                    {asaDownforceCl.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.1"
                  value={asaDownforceCl}
                  onChange={(e) => setAsaDownforceCl(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5"
                />
              </div>

              {/* Coeficiente de Arrasto Cd */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Arrasto (Cd):</span>
                  <span className="font-mono text-sky-700 dark:text-sky-400 font-bold">
                    {coefArrastoCd.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={coefArrastoCd}
                  onChange={(e) => setCoefArrastoCd(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer h-1.5"
                />
              </div>
            </div>
          </div>

          {/* FASE C1: CÁLCULO CIENTÍFICO */}
          <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center font-mono border border-purple-300 dark:border-purple-700">
                  C
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Fase C: Cálculo Numérico & Aerodinâmica
                </h3>
              </div>
              <span className="text-[11px] font-mono text-purple-700 dark:text-purple-300 font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
                FastAPI Engine
              </span>
            </div>

            {/* Results Grid - Welcoming Colors & Crisp Typography */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 bg-emerald-50/60 dark:bg-slate-950/60 rounded-lg border border-emerald-200/80 dark:border-emerald-900/50">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold uppercase block">
                  Downforce (F_d):
                </span>
                <span className="text-base sm:text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                  {Math.round(forcaDownforceN).toLocaleString()} N
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  +{Math.round(pesoEquivalenteKg)} kg pressão
                </span>
              </div>

              <div className="p-2.5 bg-amber-50/60 dark:bg-slate-950/60 rounded-lg border border-amber-200/80 dark:border-amber-900/50">
                <span className="text-[10px] text-amber-800 dark:text-amber-400 font-semibold uppercase block">
                  Força G Lateral:
                </span>
                <span
                  className={`text-base sm:text-lg font-bold font-mono mt-0.5 block ${
                    limiteFiaAprovado
                      ? 'text-amber-700 dark:text-amber-300'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {forcaGLateral.toFixed(2)} G
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  {aceleracaoCentripeta.toFixed(1)} m/s²
                </span>
              </div>

              <div className="p-2.5 bg-sky-50/60 dark:bg-slate-950/60 rounded-lg border border-sky-200/80 dark:border-sky-900/50">
                <span className="text-[10px] text-sky-800 dark:text-sky-400 font-semibold uppercase block">
                  Arrasto (Drag):
                </span>
                <span className="text-base sm:text-lg font-bold font-mono text-sky-700 dark:text-sky-300 mt-0.5 block">
                  {Math.round(forcaArrastoN).toLocaleString()} N
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Eficiência: {razaoEficiencia.toFixed(2)}
                </span>
              </div>

              <div className="p-2.5 bg-purple-50/60 dark:bg-slate-950/60 rounded-lg border border-purple-200/80 dark:border-purple-900/50">
                <span className="text-[10px] text-purple-800 dark:text-purple-400 font-semibold uppercase block">
                  Carga no Pescoço:
                </span>
                <span className="text-base sm:text-lg font-bold font-mono text-purple-700 dark:text-purple-300 mt-0.5 block">
                  {cargaPescocoKg.toFixed(1)} kg
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Piloto sob aceleração
                </span>
              </div>
            </div>

            {/* Formula Box - Compact */}
            <div className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto space-y-0.5">
              <div className="text-[10px] text-slate-400 uppercase font-sans">
                Equações da Dinâmica dos Fluidos:
              </div>
              <div className="text-emerald-400 font-semibold truncate">
                F_downforce = 0.5 · ρ · v² · Cl · A = 0.5 · 1.18 · ({vMs.toFixed(1)})² · {asaDownforceCl} · {areaAsa} = {Math.round(forcaDownforceN)} N
              </div>
              <div className="text-amber-400 font-semibold truncate">
                a_centripeta = v² / R = ({vMs.toFixed(1)})² / {curvaRaioM} = {aceleracaoCentripeta.toFixed(2)} m/s² ({forcaGLateral.toFixed(2)} G)
              </div>
            </div>
          </div>

          {/* FASE C2: CONFERÊNCIA ANALÍTICA */}
          <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center font-mono border border-amber-300 dark:border-amber-700">
                  C
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Fase C: Conferência & Segurança FIA
                </h3>
              </div>
              <div
                className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border ${
                  limiteFiaAprovado
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800'
                    : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{confiancaCientifica}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-0.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Sustentação Negativa</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  Carga vertical de {Math.round(pesoEquivalenteKg)} kg supera o peso estático do carro, garantindo estabilidade no asfalto de Interlagos.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-0.5 flex items-center gap-1.5">
                  {limiteFiaAprovado ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  <span>Limite Fisiológico G</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  {limiteFiaAprovado
                    ? `Carga de ${forcaGLateral.toFixed(2)}G perfeitamente tolerada pelo piloto com apoio de capacete e HANS.`
                    : `Atenção: ${forcaGLateral.toFixed(2)}G ultrapassa o limite seguro de fadiga contínua sem risco de grayout!`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: FASE D - DEMONSTRAÇÃO 3D INTERATIVA (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center font-mono border border-amber-300 dark:border-amber-700">
                  D
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  Fase D: Demonstração Espacial em 3D
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                Three.js WebGL
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Modelo 3D do monoposto e traçado de Interlagos respondendo em tempo real aos cálculos.
            </p>

            {/* 3D Scene Viewport (Compact: h-[250px] sm:h-[285px]) */}
            <Interlagos3D
              darkMode={darkMode}
              velocidadeKmh={velocidadeKmh}
              downforceN={forcaDownforceN}
              gLateral={forcaGLateral}
            />

            {/* Live Telemetry HUD Strip */}
            <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1 text-center">
              <div className="p-2 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-sans">Setor:</span>
                <span className="font-bold text-slate-800 dark:text-white truncate block mt-0.5">
                  {localPista.split(' ')[0]}
                </span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-sans">Carga:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {Math.round(forcaDownforceN)} N
                </span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-200/70 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-sans">G-Force:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                  {forcaGLateral.toFixed(2)} G
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
