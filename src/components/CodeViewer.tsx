import React, { useState } from 'react';
import { Check, Copy, Download, Code2, Sparkles, BookOpen, ChevronRight, Atom, Calculator } from 'lucide-react';
import {
  PYTHON_CALCULATOR_CODE,
  PYTHON_SCIENTIFIC_CALCULATOR_CODE,
  CODE_SECTIONS,
  CODE_SECTIONS_SCIENTIFIC,
  CalculatorMode
} from '../data/pythonCode';

interface CodeViewerProps {
  initialMode?: CalculatorMode;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ initialMode = 'basica' }) => {
  const [mode, setMode] = useState<CalculatorMode>(initialMode);
  const [copied, setCopied] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    initialMode === 'basica' ? 'funcoes' : 'import-math'
  );

  const currentCode = mode === 'basica' ? PYTHON_CALCULATOR_CODE : PYTHON_SCIENTIFIC_CALCULATOR_CODE;
  const currentSections = mode === 'basica' ? CODE_SECTIONS : CODE_SECTIONS_SCIENTIFIC;
  const lines = currentCode.split('\n');

  const handleModeChange = (newMode: CalculatorMode) => {
    setMode(newMode);
    setActiveSectionId(newMode === 'basica' ? 'funcoes' : 'import-math');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = mode === 'basica' ? 'calculadora.py' : 'calculadora_cientifica.py';
    const blob = new Blob([currentCode], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeSection = currentSections.find((s) => s.id === activeSectionId);

  // Syntax highlighting helper for clean presentation
  const highlightPythonLine = (line: string) => {
    if (line.trim().startsWith('#')) {
      return <span className="text-slate-400 dark:text-slate-500 italic">{line}</span>;
    }

    const parts = line.split('#');
    const codePart = parts[0];
    const commentPart = parts.slice(1).join('#');

    const formattedCode = codePart
      .replace(
        /\b(import|def|return|while|True|False|if|elif|else|try|except|break|continue|not in|in|isinstance|float|int|input|print)\b/g,
        '<span class="text-amber-600 dark:text-amber-400 font-semibold">$1</span>'
      )
      .replace(
        /(math\.pi|math\.e|math\.sqrt|math\.sin|math\.cos|math\.tan|math\.radians|math\.pow|math\.log10|math\.log|math\.factorial|is_integer)/g,
        '<span class="text-emerald-500 dark:text-emerald-300 font-semibold">$1</span>'
      )
      .replace(
        /(__name__|__main__|ValueError|math)/g,
        '<span class="text-purple-600 dark:text-purple-400">$1</span>'
      )
      .replace(
        /(".*?"|'.*?'|f".*?"|f'.*?')/g,
        '<span class="text-emerald-600 dark:text-emerald-400">$1</span>'
      )
      .replace(
        /\b(\d+(\.\d+)?)\b/g,
        '<span class="text-sky-600 dark:text-sky-400">$1</span>'
      );

    return (
      <>
        <span dangerouslySetInnerHTML={{ __html: formattedCode }} />
        {commentPart ? (
          <span className="text-slate-400 dark:text-slate-500 italic">#{commentPart}</span>
        ) : null}
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Mode Selector & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            <Code2 className="w-4 h-4" />
            <span>Código Fonte Oficial</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              {mode === 'basica' ? 'calculadora.py' : 'calculadora_cientifica.py'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400">Python 3.10+</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {mode === 'basica'
              ? 'Calculadora Aritmética Básica (4 Operações)'
              : 'Calculadora Científica (Módulo math, Raiz, Potência, Trig)'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {mode === 'basica'
              ? 'Perfeita para quem está começando: funções, variáveis, inputs e loops condicionais.'
              : 'Avançada: inclui módulo math nativo, trigonometria, raízes quadradas, logaritmos e constantes π e e.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Mode Switcher Segmented Control */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => handleModeChange('basica')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                mode === 'basica'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Básica</span>
            </button>
            <button
              onClick={() => handleModeChange('cientifica')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                mode === 'cientifica'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Científica</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Baixar .py</span>
          </button>
        </div>
      </div>

      {/* Grid: Code Viewer on Left (60%), Interactive Explanations on Right (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Code Block with line numbering */}
        <div className="lg:col-span-7 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-md overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-slate-300">
                {mode === 'basica' ? 'calculadora.py' : 'calculadora_cientifica.py'}
              </span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              {lines.length} linhas · Python 3.10+
            </div>
          </div>

          <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed max-h-[640px] overflow-y-auto">
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => {
                  const lineNumber = idx + 1;
                  const isHighlighted =
                    activeSection &&
                    lineNumber >= activeSection.lines[0] &&
                    lineNumber <= activeSection.lines[1];

                  return (
                    <tr
                      key={lineNumber}
                      className={`transition-colors ${
                        isHighlighted
                          ? 'bg-sky-500/15 border-l-2 border-sky-400 text-sky-100'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <td className="w-10 pr-4 text-right select-none text-slate-600 dark:text-slate-600 tabular-nums">
                        {lineNumber}
                      </td>
                      <td className="whitespace-pre">
                        {highlightPythonLine(line)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explanations Deck */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              {mode === 'basica' ? 'Componentes da Calculadora Básica' : 'Componentes Científicos Explicados'}
            </h3>
            <span className="text-xs text-slate-400">Clique para destacar</span>
          </div>

          <div className="space-y-2.5">
            {currentSections.map((sec) => {
              const isSelected = activeSectionId === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-sky-500 shadow-sm ring-1 ring-sky-500/20'
                      : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 font-semibold">
                          {sec.shortBadge}
                        </span>
                        <span className="text-xs text-slate-400">
                          Linhas {sec.lines[0]}–{sec.lines[1]}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                        {sec.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {sec.summary}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isSelected ? 'rotate-90 text-sky-600 dark:text-sky-400' : ''
                      }`}
                    />
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-3">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {sec.explanation}
                      </p>

                      <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800/80">
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Conceitos Chave
                        </div>
                        <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
                          {sec.keyConcepts.map((concept, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-sky-500 font-bold leading-none mt-0.5">•</span>
                              <span>{concept}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
