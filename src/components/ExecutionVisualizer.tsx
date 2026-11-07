import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Layers, ArrowRight, Check, AlertCircle } from 'lucide-react';

export const ExecutionVisualizer: React.FC = () => {
  const [numA, setNumA] = useState<number>(18);
  const [numB, setNumB] = useState<number>(3);
  const [operation, setOperation] = useState<'add' | 'sub' | 'mul' | 'div'>('div');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const isZeroDivision = operation === 'div' && numB === 0;

  const steps = [
    {
      title: "1. Leitura da Opção do Menu",
      badge: "input() -> str",
      codeHighlight: "opcao = input('\\nDigite o número da sua opção: ').strip()",
      description: `O usuário digita no teclado. O Python armazena a escolha como texto na variável opcao = "${
        operation === 'add' ? '1' : operation === 'sub' ? '2' : operation === 'mul' ? '3' : '4'
      }".`,
      stateDetail: {
        variável: "opcao",
        tipo: "str (String)",
        valor: operation === 'add' ? "'1'" : operation === 'sub' ? "'2'" : operation === 'mul' ? "'3'" : "'4'"
      }
    },
    {
      title: "2. Conversão dos Números (Casting)",
      badge: "float()",
      codeHighlight: `num1 = float(input("..."))  # "${numA}" -> ${numA}.0\nnum2 = float(input("..."))  # "${numB}" -> ${numB}.0`,
      description: `O Python lê as strings digitadas e as converte em números decimais usando float(). Agora o computador pode efetuar cálculos matemáticos reais!`,
      stateDetail: {
        num1: `${numA}.0 (float)`,
        num2: `${numB}.0 (float)`,
        conversão: `"${numA}" e "${numB}" convertidos com sucesso`
      }
    },
    {
      title: "3. Avaliação Condicional (if / elif)",
      badge: "if / elif",
      codeHighlight: `if opcao == '${operation === 'add' ? '1' : operation === 'sub' ? '2' : operation === 'mul' ? '3' : '4'}':\n    resultado = ${
        operation === 'add' ? 'adicionar' : operation === 'sub' ? 'subtrair' : operation === 'mul' ? 'multiplicar' : 'dividir'
      }(num1, num2)`,
      description: `O interpretador testa as condições em ordem até encontrar uma verdadeira. Como opcao == "${
        operation === 'add' ? '1' : operation === 'sub' ? '2' : operation === 'mul' ? '3' : '4'
      }", o Python prepara para invocar a função correspondente.`,
      stateDetail: {
        condiçãoTestada: `opcao == '${operation === 'add' ? '1' : operation === 'sub' ? '2' : operation === 'mul' ? '3' : '4'}'`,
        resultadoTeste: "True (Verdadeiro)",
        funçãoAcionada: operation === 'add' ? "adicionar" : operation === 'sub' ? "subtrair" : operation === 'mul' ? "multiplicar" : "dividir"
      }
    },
    {
      title: "4. Execução da Função na Memória",
      badge: "Chamada de Função",
      codeHighlight: operation === 'div'
        ? `def dividir(a, b):\n    if b == 0:  # ${numB} == 0 -> ${isZeroDivision ? 'True!' : 'False'}\n        return "Erro: Não é possível dividir por zero!"\n    return a / b  # ${numA} / ${numB}`
        : `def ${operation === 'add' ? 'adicionar' : operation === 'sub' ? 'subtrair' : 'multiplicar'}(a, b):\n    return a ${
            operation === 'add' ? '+' : operation === 'sub' ? '-' : '*'
          } b`,
      description: operation === 'div' && isZeroDivision
        ? "⚠️ ALERTA: O divisor 'b' é 0! A condição 'if b == 0:' é ativada e a função retorna uma mensagem de erro sem tentar dividir, salvando o programa do travamento."
        : `Os argumentos (${numA}, ${numB}) são atribuídos aos parâmetros locais (a, b). A operação aritmética é calculada pela CPU.`,
      stateDetail: {
        parâmetros: `a = ${numA}, b = ${numB}`,
        verificaçãoSegurança: operation === 'div' ? (isZeroDivision ? "DIVISÃO POR ZERO DETECTADA!" : "Divisor seguro (b != 0)") : "Operação direta",
        retornoGerado: isZeroDivision
          ? '"Erro: Não é possível dividir por zero!"'
          : operation === 'add'
          ? `${numA + numB}`
          : operation === 'sub'
          ? `${numA - numB}`
          : operation === 'mul'
          ? `${numA * numB}`
          : `${numA / numB}`
      }
    },
    {
      title: "5. Retorno do Valor e Exibição (f-string print)",
      badge: "return & print",
      codeHighlight: isZeroDivision
        ? `if isinstance(resultado, str):\n    print(resultado)  # "Erro: Não é possível dividir por zero!"`
        : `print(f"Resultado: {num1} ${operation === 'add' ? '+' : operation === 'sub' ? '-' : operation === 'mul' ? '*' : '/'} {num2} = {resultado}")`,
      description: isZeroDivision
        ? "O programa verifica que o resultado é uma string de erro e imprime a mensagem amigável no console. O loop 'while' recomeça e pede uma nova operação."
        : `A função principal recebe o resultado e o insere no texto usando uma f-string formatada. O usuário vê o resultado final na tela!`,
      stateDetail: {
        saídaConsole: isZeroDivision
          ? "Erro: Não é possível dividir por zero!"
          : `Resultado: ${numA} ${operation === 'add' ? '+' : operation === 'sub' ? '-' : operation === 'mul' ? '*' : '/'} ${numB} = ${
              operation === 'add'
                ? numA + numB
                : operation === 'sub'
                ? numA - numB
                : operation === 'mul'
                ? numA * numB
                : numA / numB
            }`,
        statusPrograma: "Pronto para o próximo cálculo (Loop while True)"
      }
    }
  ];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            <Layers className="w-4 h-4" />
            <span>Simulador Visual Passo a Passo</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400">Pilha & Fluxo de Dados</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            O Que Acontece por Dentro do Python?
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Acompanhe o caminho exato que uma instrução percorre desde o teclado do usuário até o retorno da CPU.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Recomeçar do passo 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-colors"
            title="Passo anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? "Pausar" : "Auto-Play"}</span>
          </button>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStep === steps.length - 1}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 rounded-lg transition-colors"
            title="Próximo passo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Parameter Setup Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Configure a Expressão Matemática:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* First Number */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Primeiro Número (num1):
            </label>
            <input
              type="number"
              value={numA}
              onChange={(e) => {
                setNumA(Number(e.target.value));
                setCurrentStep(0);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          {/* Operation Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Operação:
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setOperation('add');
                  setCurrentStep(0);
                }}
                className={`py-1.5 text-xs font-bold rounded transition-colors ${
                  operation === 'add'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                +
              </button>
              <button
                onClick={() => {
                  setOperation('sub');
                  setCurrentStep(0);
                }}
                className={`py-1.5 text-xs font-bold rounded transition-colors ${
                  operation === 'sub'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                -
              </button>
              <button
                onClick={() => {
                  setOperation('mul');
                  setCurrentStep(0);
                }}
                className={`py-1.5 text-xs font-bold rounded transition-colors ${
                  operation === 'mul'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                *
              </button>
              <button
                onClick={() => {
                  setOperation('div');
                  setCurrentStep(0);
                }}
                className={`py-1.5 text-xs font-bold rounded transition-colors ${
                  operation === 'div'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                /
              </button>
            </div>
          </div>

          {/* Second Number */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Segundo Número (num2):
              </label>
              {operation === 'div' && (
                <button
                  onClick={() => {
                    setNumB(0);
                    setCurrentStep(0);
                  }}
                  className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline font-medium"
                >
                  Testar com 0
                </button>
              )}
            </div>
            <input
              type="number"
              value={numB}
              onChange={(e) => {
                setNumB(Number(e.target.value));
                setCurrentStep(0);
              }}
              className={`w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-950 border rounded-lg font-mono ${
                operation === 'div' && numB === 0
                  ? 'border-rose-400 text-rose-600 dark:text-rose-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Progress Timeline Tracker */}
      <div className="grid grid-cols-5 gap-2">
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isDone = idx < currentStep;
          return (
            <button
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                setIsPlaying(false);
              }}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isActive
                  ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 shadow-sm'
                  : isDone
                  ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'bg-white/40 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Passo {idx + 1}</span>
                {isDone && <Check className="w-3 h-3 text-emerald-500" />}
              </div>
              <div
                className={`text-xs font-bold truncate ${
                  isActive
                    ? 'text-purple-700 dark:text-purple-300'
                    : 'text-slate-800 dark:text-slate-300'
                }`}
              >
                {step.badge}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Stage Visualization Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
              {steps[currentStep].badge}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-2">
              {steps[currentStep].title}
            </h3>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Etapa {currentStep + 1} de {steps.length}
          </div>
        </div>

        {/* Visual Pipeline Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Explanation & Code snippet (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {steps[currentStep].description}
            </p>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs font-mono text-slate-200 shadow-inner overflow-x-auto">
              <div className="text-[11px] text-slate-500 mb-2 uppercase tracking-wider font-sans">
                Código Executado Neste Passo:
              </div>
              <pre className="text-sky-300 whitespace-pre-wrap leading-relaxed">
                {steps[currentStep].codeHighlight}
              </pre>
            </div>
          </div>

          {/* Machine State Visualizer (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 rounded-xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-500" />
                Estado Interno do Interpretador
              </div>

              <div className="space-y-2 text-xs font-mono">
                {Object.entries(steps[currentStep].stateDetail).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800/80"
                  >
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-sans">
                      {key}
                    </div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5 break-all">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isZeroDivision && currentStep >= 3 && (
              <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Prevenção em Ação:</strong> Se não houvesse o{' '}
                  <code className="bg-rose-100 dark:bg-rose-900/60 px-1 py-0.2 rounded font-mono">
                    if b == 0:
                  </code>
                  , o Python lançaria um <code className="font-mono">ZeroDivisionError</code> e abortaria o programa!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
