import React, { useState } from 'react';
import { Layers, ShieldCheck, Cpu, Box, Sparkles, CheckCircle2, ArrowRight, BookOpen, Terminal, Code } from 'lucide-react';

export const GccdMethodologyTab: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const gccdSteps = [
    {
      letter: 'G',
      name: 'Governança & Geração de Dados',
      title: 'Fase G: Definição de Domínio, Parâmetros e Validação Prévia',
      badge: 'Governança (Inputs)',
      color: 'sky',
      description:
        'A fase de Governança garante que nenhuma operação matemática seja iniciada com dados corrompidos, fora de escala ou fora do domínio físico-matemático de definição.',
      principles: [
        'Inspeção e tipagem estrita de dados (conversão segura de string para float/int).',
        'Validação de fronteira de domínio (ex: x >= 0 para raízes reais, x > 0 para logaritmos, divisor != 0).',
        'Normalização de unidades de medida (graus para radianos, Kelvin para Celsius).'
      ],
      pythonSample: `# -------------------------------------------------------------
# FASE G: GOVERNANÇA E GERAÇÃO DE PARÂMETROS
# -------------------------------------------------------------
def governar_parametros(base, expoente):
    # Verificação de tipo
    try:
        b = float(base)
        exp = float(expoente)
    except ValueError:
        raise TypeError("Parâmetros devem ser numéricos")

    # Verificação de fronteira de domínio
    if b == 0 and exp <= 0:
        raise ValueError("Governança: Base 0 com expoente <= 0 é indefinido")

    return b, exp`
    },
    {
      letter: 'C',
      name: 'Cálculo Científico',
      title: 'Fase C (1): Modelagem Matemática e Execução Algorítmica',
      badge: 'Cálculo (Processamento)',
      color: 'purple',
      description:
        'A fase de Cálculo traduz o modelo matemático em código limpo, modular e de alta precisão numérica, recorrendo às bibliotecas otimizadas em C do Python (como o módulo math).',
      principles: [
        'Funções puras e sem efeitos colaterais (cada função recebe entradas e devolve saídas limpas).',
        'Uso de algoritmos cientificamente consagrados (Euclides para MDC, Taylor/CORDIC para trigonometria).',
        'Manutenção de precisão de ponto flutuante de 64 bits (padrão IEEE 754).'
      ],
      pythonSample: `# -------------------------------------------------------------
# FASE C: CÁLCULO CIENTÍFICO E ALGORÍTMICO
# -------------------------------------------------------------
import math

def calcular_onda_senoidal(amplitude, frequencia, tempo, fase=0.0):
    # Equação física: y(t) = A * sin(omega * t + phi)
    theta = frequencia * tempo + fase
    resultado = amplitude * math.sin(theta)
    return resultado`
    },
    {
      letter: 'C',
      name: 'Conferência Analítica',
      title: 'Fase C (2): Verificação Reversa, Prova Real & Tolerâncias',
      badge: 'Conferência (Validação)',
      color: 'emerald',
      description:
        'A fase de Conferência aplica teoremas e identidades matemáticas conhecidas para atestar que o valor computado é analiticamente correto antes de ser entregue ao usuário.',
      principles: [
        'Prova real e cálculo de funções inversas (ex: se r = √x, conferir se |r² - x| < ε).',
        'Identidades invariantes (ex: sin²(θ) + cos²(θ) ≡ 1 para qualquer ângulo).',
        'Controle de erro residual de arredondamento em float com margem de tolerância (epsilon = 1e-9).'
      ],
      pythonSample: `# -------------------------------------------------------------
# FASE C: CONFERÊNCIA ANALÍTICA E PROVA REAL
# -------------------------------------------------------------
def conferir_raiz(x, resultado_raiz, tolerancia=1e-9):
    # Prova real: o quadrado da raiz deve reconstituir o radicando original
    quadrado = resultado_raiz ** 2
    erro = abs(quadrado - x)
    
    assert erro < tolerancia, f"Conferência falhou! Erro residual: {erro}"
    return {
        "aprovado": True,
        "erro_residual": erro,
        "confianca": "100% (Verificado)"
    }`
    },
    {
      letter: 'D',
      name: 'Demonstração 3D & Espacial',
      title: 'Fase D: Visualização Interativa Tridimensional e Relatório',
      badge: 'Demonstração (Visualização)',
      color: 'amber',
      description:
        'A fase de Demonstração encerra o ciclo traduzindo números abstratos em representações espaciais 3D (Three.js), superfícies de onda, campos vetoriais e saídas gráficas intuitivas.',
      principles: [
        'Mapeamento dos resultados matemáticos para deformações geométricas no espaço 3D.',
        'Visualização acessível para cientistas, engenheiros e estudantes sem perda de rigor.',
        'Relatórios claros com notação científica e visualização em tempo real.'
      ],
      pythonSample: `# -------------------------------------------------------------
# FASE D: DEMONSTRAÇÃO E EXPORTAÇÃO DE DADOS
# -------------------------------------------------------------
def demonstrar_resultado_3d(resultado, parametros):
    payload_3d = {
        "geometria": "superficie_onda_3d",
        "amplitude_malha": resultado["amplitude"],
        "frequencia_angular": resultado["frequencia"],
        "coordenadas_vertices": [ ... ]
    }
    # Alimentação direta do pipeline Three.js / WebGL
    return payload_3d`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 via-emerald-400/40 to-transparent" />
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
          <Layers className="w-4 h-4" />
          <span>Engenharia de Software Científico</span>
          <span className="text-slate-300 dark:text-zinc-700">·</span>
          <span className="text-slate-500 dark:text-zinc-400">Ciclo Metodológico</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          A Metodologia GCCD em Cálculos Científicos
        </h2>
        <p className="text-sm text-slate-600 dark:text-zinc-400 mt-0.5">
          Conheça os 4 pilares rigorosos da metodologia: <strong>G</strong>overnança de Entradas, <strong>C</strong>álculo Numérico, <strong>C</strong>onferência Analítica e <strong>D</strong>emonstração Espacial em 3D.
        </p>
      </div>

      {/* Interactive GCCD Phase Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {gccdSteps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-2xl border text-left transition-all backdrop-blur-md relative overflow-hidden ${
                isActive
                  ? 'bg-white dark:bg-zinc-900 border-purple-500/80 dark:border-purple-400/80 shadow-md dark:shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/20'
                  : 'bg-white/70 dark:bg-zinc-900/50 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`w-7 h-7 rounded-lg font-bold font-mono text-xs flex items-center justify-center ${
                    step.letter === 'G'
                      ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                      : step.letter === 'C' && idx === 1
                      ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                      : step.letter === 'C' && idx === 2
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                      : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                  }`}
                >
                  {step.letter}
                </span>
                <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">0{idx + 1}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{step.name}</h4>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 block">
                {step.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Phase Deep Dive */}
      <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 p-6 space-y-5 shadow-sm dark:shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-white/10">
          <div>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {gccdSteps[activeStep].badge}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
              {gccdSteps[activeStep].title}
            </h3>
          </div>
          <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">Etapa {activeStep + 1} de 4</span>
        </div>

        <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          {gccdSteps[activeStep].description}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Principles Bullet points (5 cols) */}
          <div className="lg:col-span-5 space-y-3 bg-slate-50 dark:bg-zinc-950/90 p-5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              Diretrizes Fundamentais
            </div>
            <ul className="space-y-2.5 text-xs text-slate-700 dark:text-zinc-300">
              {gccdSteps[activeStep].principles.map((pr, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-purple-500 dark:text-purple-400 font-bold leading-none mt-0.5">•</span>
                  <span>{pr}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Python Implementation Pattern (7 cols) */}
          <div className="lg:col-span-7 bg-zinc-950 rounded-2xl p-5 border border-white/10 text-xs font-mono text-zinc-200 overflow-x-auto shadow-inner">
            <div className="text-[11px] text-zinc-500 mb-2 uppercase tracking-wider font-sans flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-sky-400" />
              Padrão de Código em Python para Esta Fase:
            </div>
            <pre className="text-sky-300 whitespace-pre leading-relaxed">
              {gccdSteps[activeStep].pythonSample}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
