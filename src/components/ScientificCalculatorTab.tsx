import React, { useState } from 'react';
import {
  Atom,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Box,
  Share2,
  FileCode2,
  Sliders,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { SCIENTIFIC_OPERATIONS } from '../data/scientificOperations';
import { ScientificOperation, Model3DType } from '../types/scientific';
import { ThreeScene } from './ThreeScene';

interface ScientificCalculatorTabProps {
  darkMode: boolean;
}

export const ScientificCalculatorTab: React.FC<ScientificCalculatorTabProps> = ({ darkMode }) => {
  const [selectedOpId, setSelectedOpId] = useState<string>(SCIENTIFIC_OPERATIONS[0].id);
  const currentOp = SCIENTIFIC_OPERATIONS.find((op) => op.id === selectedOpId) || SCIENTIFIC_OPERATIONS[0];

  // Parameters state initialized from current operation defaults
  const [paramValues, setParamValues] = useState<number[]>(currentOp.paramDefaults);
  const [selectedModel, setSelectedModel] = useState<Model3DType>(
    currentOp.id === 'geometria_torus'
      ? 'torus'
      : currentOp.id === 'vetor_espacial_3d' || currentOp.id === 'trigonometria_completa'
      ? 'vetor'
      : 'onda'
  );

  const handleSelectOp = (op: ScientificOperation) => {
    setSelectedOpId(op.id);
    setParamValues(op.paramDefaults);
    if (op.id === 'geometria_torus') setSelectedModel('torus');
    else if (op.id === 'vetor_espacial_3d' || op.id === 'trigonometria_completa') setSelectedModel('vetor');
    else setSelectedModel('onda');
  };

  const handleParamChange = (index: number, val: number) => {
    const updated = [...paramValues];
    updated[index] = val;
    setParamValues(updated);
  };

  const computation = currentOp.compute(paramValues);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Atom className="w-4 h-4" />
            <span>Módulo Científico Avançado</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400">Metodologia GCCD</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400">Renderização 3D</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Cálculo Científico com Metodologia GCCD & Modelos 3D
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Execute operações científicas avançadas seguindo o ciclo <strong>G</strong>overnança, <strong>C</strong>álculo, <strong>C</strong>onferência e <strong>D</strong>emonstração 3D.
          </p>
        </div>

        {/* 3D Model Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 self-start md:self-auto">
          <button
            onClick={() => setSelectedModel('onda')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
              selectedModel === 'onda'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Onda 3D</span>
          </button>
          <button
            onClick={() => setSelectedModel('torus')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
              selectedModel === 'torus'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Torus 3D</span>
          </button>
          <button
            onClick={() => setSelectedModel('vetor')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
              selectedModel === 'vetor'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Vetor 3D</span>
          </button>
          <button
            onClick={() => setSelectedModel('calculadora')}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
              selectedModel === 'calculadora'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Calculadora 3D</span>
          </button>
        </div>
      </div>

      {/* Operations Quick Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {SCIENTIFIC_OPERATIONS.map((op) => {
          const isSelected = op.id === selectedOpId;
          return (
            <button
              key={op.id}
              onClick={() => handleSelectOp(op)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className="font-mono">{op.symbol}</span>
              <span>·</span>
              <span>{op.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Two-Column Scientific Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: GCCD 4-Step Interactive Pipeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Phase G: Governança de Dados */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center font-mono">
                  G
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Fase G: Governança & Entrada de Parâmetros
                </h3>
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                  computation.gccdValidation.governancePassed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                }`}
              >
                {computation.gccdValidation.governancePassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                <span>
                  {computation.gccdValidation.governancePassed ? 'Domínio Válido' : 'Violação de Domínio'}
                </span>
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              {currentOp.description} <code className="font-mono text-purple-600 dark:text-purple-400 font-semibold">{currentOp.formula}</code>
            </p>

            {/* Parameter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentOp.paramNames.map((name, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span>{name}</span>
                    {currentOp.paramUnits?.[idx] && (
                      <span className="text-slate-400 font-mono text-[11px]">
                        [{currentOp.paramUnits[idx]}]
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="any"
                    value={paramValues[idx] ?? 0}
                    onChange={(e) => handleParamChange(idx, parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    {currentOp.paramDescriptions[idx]}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2 border border-slate-100 dark:border-slate-800">
              <Sliders className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <strong>Regras de Domínio GCCD:</strong> {currentOp.domainRules.join(' · ')}
              </div>
            </div>
          </div>

          {/* Phase C1: Cálculo Científico & Modelagem Numérica */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center font-mono">
                  C
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Fase C: Cálculo Científico & Resolução Analítica
                </h3>
              </div>
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold">
                Python math
              </span>
            </div>

            {/* Result Display Box */}
            <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-purple-800 dark:text-purple-300 block">
                  Resultado Científico Calculado:
                </span>
                <span className="text-lg font-bold font-mono text-purple-950 dark:text-purple-100">
                  {computation.result}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Confiança:</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {computation.gccdValidation.scientificConfidence}
                </span>
              </div>
            </div>

            {/* Step-by-Step Analytical Breakdown */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Etapas do Processamento Numérico:
              </span>
              <ul className="space-y-1 text-xs font-mono text-slate-700 dark:text-slate-300">
                {computation.steps.map((st, i) => (
                  <li key={i} className="p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800/80">
                    {st}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Phase C2: Conferência & Validação Analítica */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center font-mono">
                  C
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Fase C: Conferência & Validação de Consistência
                </h3>
              </div>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              {computation.gccdValidation.verificationNotes}
            </p>

            {/* Python Code Snippet */}
            <div className="bg-slate-950 rounded-lg p-3 text-xs font-mono text-slate-300 border border-slate-800 overflow-x-auto">
              <div className="text-[10px] text-slate-500 mb-1 font-sans uppercase tracking-wider">
                Script Python Equivalente com Validação GCCD:
              </div>
              <pre className="text-sky-300 whitespace-pre leading-relaxed">
                {currentOp.pythonEquivalent}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: Phase D - 3D Scientific Model Demonstration (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center font-mono">
                  D
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Fase D: Demonstração Espacial em 3D
                </h3>
              </div>
              <span className="text-[11px] font-mono text-sky-600 dark:text-sky-400">Three.js PBR</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              O modelo 3D responde diretamente aos parâmetros matemáticos computados. Interaja usando o mouse ou os controles abaixo:
            </p>

            {/* The 3D Scene Viewport */}
            <ThreeScene
              modelType={selectedModel}
              darkMode={darkMode}
              amplitude={computation.model3DParams.amplitude}
              frequency={computation.model3DParams.frequency}
              phase={computation.model3DParams.phase}
              colorHint={computation.model3DParams.colorHint}
            />

            {/* 3D Model Parameters Inspection */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Amplitude 3D:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {computation.model3DParams.amplitude.toFixed(2)}
                </span>
              </div>
              <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Frequência 3D:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {computation.model3DParams.frequency.toFixed(2)} rad/s
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
