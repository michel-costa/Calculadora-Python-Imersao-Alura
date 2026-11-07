import React, { useState } from 'react';
import { BookOpen, Laptop, Trophy, HelpCircle, CheckCircle, XCircle, ArrowRight, Atom, Calculator, Cpu, ShieldCheck } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/pythonCode';

export const LearningGuide: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setShowResults((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          <BookOpen className="w-4 h-4" />
          <span>Guia do Iniciante</span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-500 dark:text-slate-400">Conceitos, Diferenças & Fixação</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          Ela é Científica? Entenda as Diferenças
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
          Descubra o que separa uma calculadora aritmética de uma calculadora científica e como o Python lida com cada uma.
        </p>
      </div>

      {/* Comparison: Básica vs Científica */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          Comparativo: Calculadora Básica vs Calculadora Científica
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Básica */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center gap-1.5 font-mono">
                <Calculator className="w-3.5 h-3.5" />
                Calculadora Básica (Aritmética)
              </span>
              <span className="text-xs text-slate-400">4 Operações</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Focada nas quatro operações essenciais do dia a dia e ideal para quem está escrevendo as primeiras linhas de código em Python:
            </p>

            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-sky-500 font-bold">•</span>
                <span><strong>Adição</strong> (<code className="font-mono">+</code>) e <strong>Subtração</strong> (<code className="font-mono">-</code>)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sky-500 font-bold">•</span>
                <span><strong>Multiplicação</strong> (<code className="font-mono">*</code>) e <strong>Divisão</strong> (<code className="font-mono">/</code>)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sky-500 font-bold">•</span>
                <span>Não requer bibliotecas externas ou módulos adicionais.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-sky-500 font-bold">•</span>
                <span>Foco em aprender variáveis, funções (<code className="font-mono">def</code>) e laços (<code className="font-mono">while</code>).</span>
              </li>
            </ul>
          </div>

          {/* Card Científica */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1.5 font-mono">
                <Atom className="w-3.5 h-3.5" />
                Calculadora Científica
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-mono font-semibold">import math</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Projetada para engenharia, física e matemática avançada. Em Python, utiliza o módulo embutido <code className="font-mono font-semibold">math</code>:
            </p>

            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>Potência & Raízes:</strong> <code className="font-mono">x^y</code> e <code className="font-mono">math.sqrt(x)</code></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>Trigonometria:</strong> Seno, Cosseno e Tangente (<code className="font-mono">sin</code>, <code className="font-mono">cos</code>, <code className="font-mono">tan</code>)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>Logaritmos & Fatoriais:</strong> <code className="font-mono">log10(x)</code>, <code className="font-mono">ln(x)</code> e <code className="font-mono">n!</code></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong>Constantes Universais:</strong> Pi (<code className="font-mono">math.pi ≈ 3.14159</code>) e Euler (<code className="font-mono">math.e ≈ 2.71828</code>)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3 Steps: Run on your PC */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Laptop className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          Como Rodar Qualquer uma Delas no Seu Computador
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Passo 1
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                Instale o Python
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Acesse o site oficial <strong className="text-slate-900 dark:text-slate-200">python.org</strong> e baixe a versão mais recente. O módulo <code className="font-mono">math</code> já vem incluído!
              </p>
              <div className="mt-3 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded text-[11px] text-amber-800 dark:text-amber-300">
                ⚠️ <strong>Atenção no Windows:</strong> Marque a caixinha <em>"Add Python to PATH"</em> no instalador.
              </div>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Passo 2
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                Salve o Arquivo .py
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Abra seu editor (como VS Code ou Bloco de Notas), cole o código e salve com a extensão <code className="font-mono">.py</code>:
              </p>
              <div className="mt-3 p-2 bg-slate-100 dark:bg-slate-950 rounded font-mono text-xs text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-slate-800">
                calculadora.py
              </div>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                Passo 3
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                Execute no Terminal
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Abra o terminal (Prompt de Comando, PowerShell ou Terminal do Mac) na mesma pasta e digite:
              </p>
              <div className="mt-3 p-2 bg-slate-900 text-emerald-400 rounded font-mono text-xs border border-slate-800">
                python calculadora.py
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Mini-Quiz de Fixação (Básica & Científica)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">4 Perguntas Rápidas</span>
        </div>

        <div className="space-y-4">
          {QUIZ_QUESTIONS.map((q) => {
            const selectedIdx = selectedAnswers[q.id];
            const isAnswered = showResults[q.id];
            const isCorrect = selectedIdx === q.correctIndex;

            return (
              <div
                key={q.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                    Pergunta {q.id}:
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {q.question}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedIdx === optIdx;
                    let btnStyle =
                      "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200";

                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnStyle =
                          "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          "border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`p-3 text-left text-xs rounded-lg border transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div
                    className={`mt-3 p-3 rounded-lg border text-xs flex items-start gap-2 ${
                      isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <strong>{isCorrect ? "Correto!" : "Atenção:"}</strong> {q.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
