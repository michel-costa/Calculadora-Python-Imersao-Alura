import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, RotateCcw, ArrowRight, CheckCircle2, AlertTriangle, Bug, Atom, Calculator } from 'lucide-react';
import { CalculatorMode } from '../data/pythonCode';

interface TerminalLine {
  id: string;
  type: 'system' | 'prompt' | 'input' | 'output' | 'error' | 'success';
  text: string;
}

type ProgramState =
  | 'WAITING_OPCAO'
  | 'WAITING_NUM1'
  | 'WAITING_NUM2'
  | 'WAITING_UNARY_NUM'
  | 'FINISHED';

export const TerminalSimulator: React.FC = () => {
  const [terminalMode, setTerminalMode] = useState<CalculatorMode>('basica');
  const [inputVal, setInputVal] = useState('');
  const [progState, setProgState] = useState<ProgramState>('WAITING_OPCAO');
  const [selectedOpcao, setSelectedOpcao] = useState<string>('');
  const [num1Val, setNum1Val] = useState<number | null>(null);

  const getInitialLines = (mode: CalculatorMode): TerminalLine[] => {
    if (mode === 'basica') {
      return [
        { id: '1', type: 'system', text: '$ python calculadora.py' },
        { id: '2', type: 'system', text: '========================================' },
        { id: '3', type: 'system', text: '   BEM-VINDO À CALCULADORA EM PYTHON!   ' },
        { id: '4', type: 'system', text: '========================================' },
        { id: '5', type: 'output', text: '\nEscolha a operação desejada:' },
        { id: '6', type: 'output', text: '1 - Adição (+)' },
        { id: '7', type: 'output', text: '2 - Subtração (-)' },
        { id: '8', type: 'output', text: '3 - Multiplicação (*)' },
        { id: '9', type: 'output', text: '4 - Divisão (/)' },
        { id: '10', type: 'output', text: '5 - Sair do programa' },
        { id: '11', type: 'prompt', text: 'Digite o número da sua opção (1-5): ' },
      ];
    } else {
      return [
        { id: '1', type: 'system', text: '$ python calculadora_cientifica.py' },
        { id: '2', type: 'system', text: '================================================' },
        { id: '3', type: 'system', text: '     CALCULADORA CIENTÍFICA EM PYTHON 🔬     ' },
        { id: '4', type: 'system', text: '     Constantes: π = 3.14159 | e = 2.71828' },
        { id: '5', type: 'system', text: '================================================' },
        { id: '6', type: 'output', text: '\n--- MENU DE OPERAÇÕES ---' },
        { id: '7', type: 'output', text: ' [BÁSICAS]\n  1 - Adição (+)         2 - Subtração (-)\n  3 - Multiplicação (*)  4 - Divisão (/)\n  5 - Potência (x^y)' },
        { id: '8', type: 'output', text: ' [CIENTÍFICAS / UNÁRIAS]\n  6 - Raiz Quadrada (√)  7 - Fatorial (n!)\n  8 - Seno (graus)       9 - Cosseno (graus)\n 10 - Tangente (graus)  11 - Logaritmo base 10\n 12 - Logaritmo natural ln\n  0 - Sair do programa' },
        { id: '9', type: 'prompt', text: 'Escolha a operação (0-12): ' },
      ];
    }
  };

  const [lines, setLines] = useState<TerminalLine[]>(() => getInitialLines('basica'));

  // Inspector memory state for the learner
  const [memoryState, setMemoryState] = useState({
    opcao: 'None',
    num1: 'None',
    num2: 'None',
    ultimoResultado: 'Nenhum',
    funcaoAtiva: 'Nenhuma'
  });

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLine = (type: TerminalLine['type'], text: string) => {
    setLines((prev) => [...prev, { id: Math.random().toString(), type, text }]);
  };

  const switchMode = (newMode: CalculatorMode) => {
    setTerminalMode(newMode);
    setLines(getInitialLines(newMode));
    setProgState('WAITING_OPCAO');
    setSelectedOpcao('');
    setNum1Val(null);
    setInputVal('');
    setMemoryState({
      opcao: 'None',
      num1: 'None',
      num2: 'None',
      ultimoResultado: 'Nenhum',
      funcaoAtiva: 'Nenhuma'
    });
  };

  const showMenuPrompts = () => {
    if (terminalMode === 'basica') {
      addLine('output', '\nEscolha a operação desejada:');
      addLine('output', '1 - Adição (+)');
      addLine('output', '2 - Subtração (-)');
      addLine('output', '3 - Multiplicação (*)');
      addLine('output', '4 - Divisão (/)');
      addLine('output', '5 - Sair do programa');
      addLine('prompt', 'Digite o número da sua opção (1-5): ');
    } else {
      addLine('output', '\n--- MENU DE OPERAÇÕES ---');
      addLine('output', ' [BÁSICAS]\n  1 - Adição (+)         2 - Subtração (-)\n  3 - Multiplicação (*)  4 - Divisão (/)\n  5 - Potência (x^y)');
      addLine('output', ' [CIENTÍFICAS / UNÁRIAS]\n  6 - Raiz Quadrada (√)  7 - Fatorial (n!)\n  8 - Seno (graus)       9 - Cosseno (graus)\n 10 - Tangente (graus)  11 - Logaritmo base 10\n 12 - Logaritmo natural ln\n  0 - Sair do programa');
      addLine('prompt', 'Escolha a operação (0-12): ');
    }
    setProgState('WAITING_OPCAO');
    setSelectedOpcao('');
    setNum1Val(null);
  };

  const handleInputSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (progState === 'FINISHED') return;

    const trimmed = inputVal.trim();
    setInputVal('');
    addLine('input', trimmed);

    // ==========================================
    // 1. WAITING FOR OPERATION OPTION
    // ==========================================
    if (progState === 'WAITING_OPCAO') {
      if (terminalMode === 'basica') {
        if (trimmed === '5') {
          addLine('success', '\nObrigado por usar a calculadora! Bons estudos em Python! 👋');
          addLine('system', '[Processo concluído com código 0]');
          setProgState('FINISHED');
          setMemoryState((prev) => ({ ...prev, opcao: "'5' (Sair)", funcaoAtiva: 'break' }));
          return;
        }

        if (!['1', '2', '3', '4'].includes(trimmed)) {
          addLine('error', '❌ Opção inválida! Por favor, escolha um número de 1 a 5.');
          showMenuPrompts();
          return;
        }

        setSelectedOpcao(trimmed);
        const basicFuncs: Record<string, string> = {
          '1': 'adicionar(a, b)',
          '2': 'subtrair(a, b)',
          '3': 'multiplicar(a, b)',
          '4': 'dividir(a, b)'
        };
        setMemoryState((prev) => ({
          ...prev,
          opcao: `'${trimmed}'`,
          funcaoAtiva: basicFuncs[trimmed] || 'Nenhuma'
        }));

        addLine('prompt', 'Digite o primeiro número: ');
        setProgState('WAITING_NUM1');
        return;
      } else {
        // SCIENTIFIC MODE
        if (trimmed === '0') {
          addLine('success', '\nEncerrando a calculadora científica. Bons cálculos! 🧪');
          addLine('system', '[Processo concluído com código 0]');
          setProgState('FINISHED');
          setMemoryState((prev) => ({ ...prev, opcao: "'0' (Sair)", funcaoAtiva: 'break' }));
          return;
        }

        const validOptions = Array.from({ length: 13 }, (_, i) => i.toString());
        if (!validOptions.includes(trimmed)) {
          addLine('error', '❌ Opção inválida! Escolha um número de 0 a 12.');
          showMenuPrompts();
          return;
        }

        setSelectedOpcao(trimmed);
        const sciFuncs: Record<string, string> = {
          '1': 'adicionar(a, b)',
          '2': 'subtrair(a, b)',
          '3': 'multiplicar(a, b)',
          '4': 'dividir(a, b)',
          '5': 'math.pow(base, expoente)',
          '6': 'math.sqrt(x)',
          '7': 'math.factorial(n)',
          '8': 'math.sin(rad)',
          '9': 'math.cos(rad)',
          '10': 'math.tan(rad)',
          '11': 'math.log10(x)',
          '12': 'math.log(x)'
        };

        setMemoryState((prev) => ({
          ...prev,
          opcao: `'${trimmed}'`,
          funcaoAtiva: sciFuncs[trimmed] || 'Nenhuma'
        }));

        // Binary operations (1 to 5) take two numbers
        if (['1', '2', '3', '4', '5'].includes(trimmed)) {
          addLine('prompt', 'Digite o primeiro número (ou base): ');
          setProgState('WAITING_NUM1');
        } else {
          // Unary operations (6 to 12) take one number
          addLine(
            'prompt',
            ['8', '9', '10'].includes(trimmed)
              ? 'Digite o ângulo em graus (ex: 30, 45, 90): '
              : ['11', '12'].includes(trimmed)
              ? 'Digite o valor x para o logaritmo (x > 0): '
              : trimmed === '7'
              ? 'Digite um número inteiro não negativo (ex: 5): '
              : 'Digite o número (ou x >= 0 para raiz): '
          );
          setProgState('WAITING_UNARY_NUM');
        }
        return;
      }
    }

    // ==========================================
    // 2. WAITING FOR NUM1 (BINARY)
    // ==========================================
    if (progState === 'WAITING_NUM1') {
      const parsed = parseFloat(trimmed.replace(',', '.'));
      if (isNaN(parsed)) {
        addLine('error', '❌ Entrada inválida! Por favor, digite apenas números válidos.');
        showMenuPrompts();
        return;
      }

      setNum1Val(parsed);
      setMemoryState((prev) => ({ ...prev, num1: `${parsed}` }));
      addLine('prompt', selectedOpcao === '5' ? 'Digite o expoente (y): ' : 'Digite o segundo número: ');
      setProgState('WAITING_NUM2');
      return;
    }

    // ==========================================
    // 3. WAITING FOR NUM2 (BINARY)
    // ==========================================
    if (progState === 'WAITING_NUM2') {
      const parsed2 = parseFloat(trimmed.replace(',', '.'));
      if (isNaN(parsed2)) {
        addLine('error', '❌ Entrada inválida! Por favor, digite apenas números válidos.');
        showMenuPrompts();
        return;
      }

      const n1 = num1Val ?? 0;
      const n2 = parsed2;
      setMemoryState((prev) => ({ ...prev, num2: `${n2}` }));
      addLine('system', '-----------------------------------');

      let resText = '';
      if (selectedOpcao === '1') {
        const res = n1 + n2;
        resText = `Resultado: ${n1} + ${n2} = ${res}`;
        addLine('success', resText);
        setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res}` }));
      } else if (selectedOpcao === '2') {
        const res = n1 - n2;
        resText = `Resultado: ${n1} - ${n2} = ${res}`;
        addLine('success', resText);
        setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res}` }));
      } else if (selectedOpcao === '3') {
        const res = n1 * n2;
        resText = `Resultado: ${n1} * ${n2} = ${res}`;
        addLine('success', resText);
        setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res}` }));
      } else if (selectedOpcao === '4') {
        if (n2 === 0) {
          const err = 'Erro: Não é possível dividir por zero!';
          addLine('error', err);
          setMemoryState((prev) => ({ ...prev, ultimoResultado: 'Erro (ZeroDivision)' }));
        } else {
          const res = n1 / n2;
          resText = `Resultado: ${n1} / ${n2} = ${res}`;
          addLine('success', resText);
          setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res}` }));
        }
      } else if (selectedOpcao === '5') {
        const res = Math.pow(n1, n2);
        resText = `Resultado: ${n1} ^ ${n2} = ${res}`;
        addLine('success', resText);
        setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res}` }));
      }
      addLine('system', '-----------------------------------');
      showMenuPrompts();
      return;
    }

    // ==========================================
    // 4. WAITING FOR UNARY NUMBER (SCIENTIFIC)
    // ==========================================
    if (progState === 'WAITING_UNARY_NUM') {
      const parsed = parseFloat(trimmed.replace(',', '.'));
      if (isNaN(parsed)) {
        addLine('error', '❌ Entrada inválida! Por favor, digite um número válido.');
        showMenuPrompts();
        return;
      }

      setMemoryState((prev) => ({ ...prev, num1: `${parsed}`, num2: 'N/A (Unária)' }));
      addLine('system', '-----------------------------------');

      if (selectedOpcao === '6') {
        // Raiz quadrada
        if (parsed < 0) {
          addLine('error', 'Erro: Raiz de número negativo não é real!');
          setMemoryState((prev) => ({ ...prev, ultimoResultado: 'Erro (Raiz < 0)' }));
        } else {
          const res = Math.sqrt(parsed);
          addLine('success', `Resultado: √${parsed} = ${res}`);
          setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res}` }));
        }
      } else if (selectedOpcao === '7') {
        // Fatorial
        if (parsed < 0) {
          addLine('error', 'Erro: Fatorial não existe para números negativos!');
          setMemoryState((prev) => ({ ...prev, ultimoResultado: 'Erro (Fatorial < 0)' }));
        } else if (!Number.isInteger(parsed)) {
          addLine('error', 'Erro: Fatorial só é válido para inteiros!');
          setMemoryState((prev) => ({ ...prev, ultimoResultado: 'Erro (Não inteiro)' }));
        } else if (parsed > 170) {
          addLine('error', 'Erro: Número muito grande para cálculo de fatorial!');
        } else {
          let f = 1;
          for (let i = 2; i <= parsed; i++) f *= i;
          addLine('success', `Resultado: ${parsed}! = ${f}`);
          setMemoryState((prev) => ({ ...prev, ultimoResultado: `${f}` }));
        }
      } else if (selectedOpcao === '8') {
        // Seno
        const rad = (parsed * Math.PI) / 180;
        const res = Math.sin(rad);
        addLine('success', `Resultado: sin(${parsed}°) = ${parseFloat(res.toFixed(6))}`);
        setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res.toFixed(6)}` }));
      } else if (selectedOpcao === '9') {
        // Cosseno
        const rad = (parsed * Math.PI) / 180;
        const res = Math.cos(rad);
        addLine('success', `Resultado: cos(${parsed}°) = ${parseFloat(res.toFixed(6))}`);
        setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res.toFixed(6)}` }));
      } else if (selectedOpcao === '10') {
        // Tangente
        if (parsed % 180 === 90 || parsed % 180 === -90) {
          addLine('error', 'Erro: Tangente indefinida para este ângulo!');
          setMemoryState((prev) => ({ ...prev, ultimoResultado: 'Indefinida' }));
        } else {
          const rad = (parsed * Math.PI) / 180;
          const res = Math.tan(rad);
          addLine('success', `Resultado: tan(${parsed}°) = ${parseFloat(res.toFixed(6))}`);
          setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res.toFixed(6)}` }));
        }
      } else if (selectedOpcao === '11') {
        // Log10
        if (parsed <= 0) {
          addLine('error', 'Erro: Logaritmo só é definido para números maiores que zero!');
          setMemoryState((prev) => ({ ...prev, ultimoResultado: 'Erro (Log <= 0)' }));
        } else {
          const res = Math.log10(parsed);
          addLine('success', `Resultado: log10(${parsed}) = ${res}`);
          setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res}` }));
        }
      } else if (selectedOpcao === '12') {
        // Ln
        if (parsed <= 0) {
          addLine('error', 'Erro: Logaritmo natural exige x > 0!');
          setMemoryState((prev) => ({ ...prev, ultimoResultado: 'Erro (Ln <= 0)' }));
        } else {
          const res = Math.log(parsed);
          addLine('success', `Resultado: ln(${parsed}) = ${res}`);
          setMemoryState((prev) => ({ ...prev, ultimoResultado: `${res}` }));
        }
      }

      addLine('system', '-----------------------------------');
      showMenuPrompts();
    }
  };

  const handleReset = () => {
    setLines(getInitialLines(terminalMode));
    setProgState('WAITING_OPCAO');
    setSelectedOpcao('');
    setNum1Val(null);
    setInputVal('');
    setMemoryState({
      opcao: 'None',
      num1: 'None',
      num2: 'None',
      ultimoResultado: 'Nenhum',
      funcaoAtiva: 'Nenhuma'
    });
  };

  return (
    <div className="space-y-6">
      {/* Intro info bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Terminal className="w-4 h-4" />
            <span>Terminal Interativo</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-slate-500 dark:text-slate-400">
              {terminalMode === 'basica' ? 'Python Aritmético' : 'Python Científico (math)'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            Console Python ao Vivo
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Alterne entre o modo Básico e Científico e interaja digitando no console como se estivesse no seu computador.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Mode toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => switchMode('basica')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                terminalMode === 'basica'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Básica</span>
            </button>
            <button
              onClick={() => switchMode('cientifica')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                terminalMode === 'cientifica'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Científica</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar</span>
          </button>
        </div>
      </div>

      {/* Quick Test Shortcuts */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Testes Rápidos:</span>
        {terminalMode === 'basica' ? (
          <>
            <button
              onClick={() => {
                setTerminalMode('basica');
                setProgState('WAITING_OPCAO');
                setInputVal('1');
              }}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              Opção 1 (Soma)
            </button>
            <button
              onClick={() => {
                setTerminalMode('basica');
                setProgState('WAITING_OPCAO');
                setInputVal('4');
              }}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              Opção 4 (Divisão)
            </button>
            <button
              onClick={() => {
                setTerminalMode('basica');
                setProgState('WAITING_OPCAO');
                setInputVal('5');
              }}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              Opção 5 (Sair)
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setProgState('WAITING_OPCAO');
                setInputVal('6');
              }}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              Opção 6 (√ Raiz Quadrada)
            </button>
            <button
              onClick={() => {
                setProgState('WAITING_OPCAO');
                setInputVal('7');
              }}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              Opção 7 (n! Fatorial)
            </button>
            <button
              onClick={() => {
                setProgState('WAITING_OPCAO');
                setInputVal('8');
              }}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              Opção 8 (Seno)
            </button>
            <button
              onClick={() => {
                setProgState('WAITING_OPCAO');
                setInputVal('5');
              }}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              Opção 5 (x^y Potência)
            </button>
            <button
              onClick={() => {
                setProgState('WAITING_OPCAO');
                setInputVal('11');
              }}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              Opção 11 (log10)
            </button>
          </>
        )}
      </div>

      {/* Main Terminal Window & Live Memory Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Terminal Screen (65%) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col font-mono text-xs">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-slate-400 text-xs ml-2">
                bash - {terminalMode === 'basica' ? 'calculadora.py' : 'calculadora_cientifica.py'}
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>Em Execução</span>
            </div>
          </div>

          {/* Terminal Output Stream */}
          <div className="p-4 overflow-y-auto max-h-[460px] min-h-[380px] space-y-1 text-slate-200">
            {lines.map((line) => {
              if (line.type === 'system') {
                return (
                  <div key={line.id} className="text-slate-500">
                    {line.text}
                  </div>
                );
              }
              if (line.type === 'prompt') {
                return (
                  <div key={line.id} className="text-amber-400 font-semibold pt-1">
                    {line.text}
                  </div>
                );
              }
              if (line.type === 'input') {
                return (
                  <div key={line.id} className="text-sky-300 flex items-center gap-2 font-bold">
                    <span className="text-slate-500">&gt;</span>
                    <span>{line.text}</span>
                  </div>
                );
              }
              if (line.type === 'error') {
                return (
                  <div key={line.id} className="text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{line.text}</span>
                  </div>
                );
              }
              if (line.type === 'success') {
                return (
                  <div key={line.id} className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{line.text}</span>
                  </div>
                );
              }
              return (
                <div key={line.id} className="whitespace-pre-wrap text-slate-300">
                  {line.text}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Interactive Input Form */}
          <form
            onSubmit={handleInputSubmit}
            className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-t border-slate-800"
          >
            <span className="text-emerald-400 font-bold select-none">&gt;&gt;&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              disabled={progState === 'FINISHED'}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                progState === 'FINISHED'
                  ? 'Programa encerrado. Clique em "Reiniciar" acima.'
                  : progState === 'WAITING_OPCAO'
                  ? terminalMode === 'basica'
                    ? 'Digite 1, 2, 3, 4 ou 5 e pressione Enter...'
                    : 'Digite o número da operação (0 a 12) e pressione Enter...'
                  : 'Digite o valor numérico e pressione Enter...'
              }
              className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none text-xs font-mono"
              autoFocus
            />
            <button
              type="submit"
              disabled={progState === 'FINISHED' || !inputVal.trim()}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded text-xs font-medium transition-colors flex items-center gap-1"
            >
              <span>Enviar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Live Memory & State Inspector (35%) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Inspetor de Memória do Python
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Tempo Real</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Veja as variáveis e chamadas de biblioteca que o interpretador Python executa:
            </p>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500">opcao:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {memoryState.opcao}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500">num1 (ou x):</span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  {memoryState.num1}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500">num2 (ou exp):</span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">
                  {memoryState.num2}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500">função / módulo:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {memoryState.funcaoAtiva}
                </span>
              </div>

              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <span className="text-emerald-800 dark:text-emerald-300 font-sans font-medium">
                  Último Retorno:
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {memoryState.ultimoResultado}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              {terminalMode === 'basica' ? (
                <>💡 <strong>Dica Básica:</strong> O Python opera as 4 funções básicas com os operadores nativos <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">+</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">-</code>, <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">*</code> e <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">/</code>.</>
              ) : (
                <>🔬 <strong>Dica Científica:</strong> No modo científico, usamos <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">import math</code> para acessar algoritmos ultra-rápidos compilados em C para raízes, senos e logaritmos!</>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
