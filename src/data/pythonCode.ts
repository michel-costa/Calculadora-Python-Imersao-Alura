export interface CodeSection {
  id: string;
  title: string;
  lines: [number, number]; // 1-indexed start and end line
  shortBadge: string;
  summary: string;
  explanation: string;
  keyConcepts: string[];
  snippet: string;
}

export type CalculatorMode = 'basica' | 'cientifica';

export const PYTHON_CALCULATOR_CODE = `# ==============================================================================
# CALCULADORA SIMPLES EM PYTHON (4 OPERAÇÕES BÁSICAS)
# ==============================================================================
# Este programa foi feito para quem está começando a aprender Python!
# Ele organiza cada operação em uma função e usa um menu interativo com 'while'.

# ------------------------------------------------------------------------------
# 1. DEFINIÇÃO DAS FUNÇÕES MATEMÁTICAS
# Funções são blocos reutilizáveis de código iniciados pela palavra 'def'.
# ------------------------------------------------------------------------------

def adicionar(a, b):
    """Retorna a soma de dois números."""
    return a + b

def subtrair(a, b):
    """Retorna a diferença entre dois números."""
    return a - b

def multiplicar(a, b):
    """Retorna o produto de dois números."""
    return a * b

def dividir(a, b):
    """Retorna a divisão do primeiro número pelo segundo.
    Inclui proteção contra divisão por zero."""
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b

# ------------------------------------------------------------------------------
# 2. FUNÇÃO PRINCIPAL QUE CONTROLA O MENU E O FLUXO DO PROGRAMA
# ------------------------------------------------------------------------------

def calculadora():
    print("=" * 40)
    print("   BEM-VINDO À CALCULADORA EM PYTHON!   ")
    print("=" * 40)

    # Loop infinito que só para quando o usuário escolher a opção de sair
    while True:
        print("\\nEscolha a operação desejada:")
        print("1 - Adição (+)")
        print("2 - Subtração (-)")
        print("3 - Multiplicação (*)")
        print("4 - Divisão (/)")
        print("5 - Sair do programa")

        # input() lê o que o usuário digita no teclado como texto (string)
        opcao = input("\\nDigite o número da sua opção (1-5): ").strip()

        # Verifica se o usuário quer encerrar o programa
        if opcao == '5':
            print("\\nObrigado por usar a calculadora! Bons estudos em Python! 👋")
            break

        # Verifica se a opção digitada é válida antes de pedir os números
        if opcao not in ('1', '2', '3', '4'):
            print("❌ Opção inválida! Por favor, escolha um número de 1 a 5.")
            continue

        # Coleta e conversão dos números com proteção contra textos
        try:
            num1 = float(input("Digite o primeiro número: "))
            num2 = float(input("Digite o segundo número: "))
        except ValueError:
            print("❌ Entrada inválida! Por favor, digite apenas números válidos.")
            continue

        # Realiza o cálculo de acordo com a opção escolhida
        print("\\n" + "-" * 30)
        if opcao == '1':
            resultado = adicionar(num1, num2)
            print(f"Resultado: {num1} + {num2} = {resultado}")
        elif opcao == '2':
            resultado = subtrair(num1, num2)
            print(f"Resultado: {num1} - {num2} = {resultado}")
        elif opcao == '3':
            resultado = multiplicar(num1, num2)
            print(f"Resultado: {num1} * {num2} = {resultado}")
        elif opcao == '4':
            resultado = dividir(num1, num2)
            if isinstance(resultado, str):
                print(resultado)  # Exibe a mensagem amigável de erro
            else:
                print(f"Resultado: {num1} / {num2} = {resultado}")
        print("-" * 30)

# ------------------------------------------------------------------------------
# 3. PONTO DE ENTRADA DO SCRIPT
# Garante que a calculadora execute quando o arquivo for rodado diretamente
# ------------------------------------------------------------------------------
if __name__ == "__main__":
    calculadora()
`;

export const PYTHON_SCIENTIFIC_CALCULATOR_CODE = `# ==============================================================================
# CALCULADORA CIENTÍFICA EM PYTHON (COM MÓDULO MATH)
# ==============================================================================
# Uma calculadora científica vai além das 4 operações básicas:
# Ela inclui potência, raiz quadrada, trigonometria, logaritmo, fatorial e constantes!
# Para isso, importamos o módulo nativo 'math' do Python (não precisa instalar nada).

import math

# ------------------------------------------------------------------------------
# 1. OPERAÇÕES BINÁRIAS (RECEBEM DOIS NÚMEROS: a e b)
# ------------------------------------------------------------------------------

def adicionar(a, b):
    return a + b

def subtrair(a, b):
    return a - b

def multiplicar(a, b):
    return a * b

def dividir(a, b):
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b

def potencia(base, expoente):
    """Calcula a base elevada ao expoente (ex: 2 ** 3 = 8)."""
    return math.pow(base, expoente)

# ------------------------------------------------------------------------------
# 2. OPERAÇÕES UNÁRIAS CIENTÍFICAS (RECEBEM UM ÚNICO NÚMERO: x)
# ------------------------------------------------------------------------------

def raiz_quadrada(x):
    """Calcula a raiz quadrada de x com proteção contra números negativos."""
    if x < 0:
        return "Erro: Raiz de número negativo não é real!"
    return math.sqrt(x)

def seno(graus):
    """Calcula o seno (converte graus para radianos primeiro)."""
    rad = math.radians(graus)
    return math.sin(rad)

def cosseno(graus):
    """Calcula o cosseno (converte graus para radianos primeiro)."""
    rad = math.radians(graus)
    return math.cos(rad)

def tangente(graus):
    """Calcula a tangente de um ângulo em graus."""
    if graus % 180 == 90:
        return "Erro: Tangente indefinida para este ângulo!"
    rad = math.radians(graus)
    return math.tan(rad)

def logaritmo_base10(x):
    """Calcula o logaritmo na base 10 (exige x > 0)."""
    if x <= 0:
        return "Erro: Logaritmo só é definido para números maiores que zero!"
    return math.log10(x)

def logaritmo_natural(x):
    """Calcula o logaritmo natural ln(x) na base Euler e."""
    if x <= 0:
        return "Erro: Logaritmo natural exige x > 0!"
    return math.log(x)

def fatorial(x):
    """Calcula o fatorial de um número inteiro não negativo (ex: 5! = 120)."""
    if x < 0:
        return "Erro: Fatorial não existe para números negativos!"
    if not float(x).is_integer():
        return "Erro: Fatorial só é válido para inteiros!"
    return math.factorial(int(x))

# ------------------------------------------------------------------------------
# 3. MENU PRINCIPAL DA CALCULADORA CIENTÍFICA
# ------------------------------------------------------------------------------

def calculadora_cientifica():
    print("=" * 48)
    print("     CALCULADORA CIENTÍFICA EM PYTHON 🔬     ")
    print(f"     Constantes: π = {math.pi:.5f} | e = {math.e:.5f}")
    print("=" * 48)

    while True:
        print("\\n--- MENU DE OPERAÇÕES ---")
        print(" [BÁSICAS]")
        print("  1 - Adição (+)         2 - Subtração (-)")
        print("  3 - Multiplicação (*)  4 - Divisão (/)")
        print("  5 - Potência (x^y)")
        print(" [CIENTÍFICAS / UNÁRIAS]")
        print("  6 - Raiz Quadrada (√)  7 - Fatorial (n!)")
        print("  8 - Seno (graus)       9 - Cosseno (graus)")
        print(" 10 - Tangente (graus)  11 - Logaritmo base 10")
        print(" 12 - Logaritmo natural ln")
        print("  0 - Sair do programa")

        opcao = input("\\nEscolha a operação (0-12): ").strip()

        if opcao == '0':
            print("\\nEncerrando a calculadora científica. Bons cálculos! 🧪")
            break

        opcoes_validas = [str(i) for i in range(13)]
        if opcao not in opcoes_validas:
            print("❌ Opção inválida! Escolha um número de 0 a 12.")
            continue

        # Operações com 2 números (Binárias: 1 a 5)
        if opcao in ('1', '2', '3', '4', '5'):
            try:
                num1 = float(input("Digite o primeiro número: "))
                num2 = float(input("Digite o segundo número: "))
            except ValueError:
                print("❌ Entrada inválida! Digite valores numéricos.")
                continue

            print("-" * 35)
            if opcao == '1':
                print(f"Resultado: {num1} + {num2} = {adicionar(num1, num2)}")
            elif opcao == '2':
                print(f"Resultado: {num1} - {num2} = {subtrair(num1, num2)}")
            elif opcao == '3':
                print(f"Resultado: {num1} * {num2} = {multiplicar(num1, num2)}")
            elif opcao == '4':
                res = dividir(num1, num2)
                print(res if isinstance(res, str) else f"Resultado: {num1} / {num2} = {res}")
            elif opcao == '5':
                print(f"Resultado: {num1} ^ {num2} = {potencia(num1, num2)}")
            print("-" * 35)

        # Operações com 1 número (Unárias: 6 a 12)
        else:
            try:
                num = float(input("Digite o número (ou ângulo em graus): "))
            except ValueError:
                print("❌ Entrada inválida! Digite um número válido.")
                continue

            print("-" * 35)
            if opcao == '6':
                res = raiz_quadrada(num)
                print(res if isinstance(res, str) else f"Resultado: √{num} = {res}")
            elif opcao == '7':
                res = fatorial(num)
                print(res if isinstance(res, str) else f"Resultado: {int(num)}! = {res}")
            elif opcao == '8':
                print(f"Resultado: sin({num}°) = {seno(num):.6f}")
            elif opcao == '9':
                print(f"Resultado: cos({num}°) = {cosseno(num):.6f}")
            elif opcao == '10':
                res = tangente(num)
                print(res if isinstance(res, str) else f"Resultado: tan({num}°) = {res:.6f}")
            elif opcao == '11':
                res = logaritmo_base10(num)
                print(res if isinstance(res, str) else f"Resultado: log10({num}) = {res}")
            elif opcao == '12':
                res = logaritmo_natural(num)
                print(res if isinstance(res, str) else f"Resultado: ln({num}) = {res}")
            print("-" * 35)

if __name__ == "__main__":
    calculadora_cientifica()
`;

export const CODE_SECTIONS: CodeSection[] = [
  {
    id: "funcoes",
    title: "1. Funções Matemáticas (def & return)",
    lines: [11, 28],
    shortBadge: "def / return",
    summary: "Blocos isolados e reutilizáveis para cada operação aritmética.",
    explanation:
      "Em Python, usamos a palavra-chave 'def' para definir funções. Cada função recebe dois parâmetros ('a' e 'b') e devolve a resposta com 'return'. Separar o código em funções pequenas é uma das melhores práticas da programação, pois facilita testes e evita repetição de código.",
    keyConcepts: [
      "Palavra-chave 'def' cria uma nova função.",
      "Parâmetros '(a, b)' são as variáveis que a função espera receber.",
      "Comando 'return' envia o resultado de volta para quem chamou a função.",
      "Docstrings (\"\"\" ... \"\"\") documentam o propósito da função."
    ],
    snippet: `def adicionar(a, b):
    return a + b`
  },
  {
    id: "divisao-zero",
    title: "2. Proteção contra Divisão por Zero",
    lines: [23, 28],
    shortBadge: "if b == 0",
    summary: "Validação matemática que impede o travamento do programa.",
    explanation:
      "Na matemática e na computação, dividir qualquer número por 0 é impossível e gera um erro fatal chamado 'ZeroDivisionError'. Aqui, usamos uma condição simples 'if b == 0:' antes de tentar a divisão para retornar um aviso seguro em vez de quebrar a execução do programa.",
    keyConcepts: [
      "Condição 'if b == 0' intercepta o divisor perigoso.",
      "Retorna uma mensagem amigável para o usuário.",
      "Evita o encerramento abrupto com ZeroDivisionError."
    ],
    snippet: `def dividir(a, b):
    if b == 0:
        return "Erro: Não é possível dividir por zero!"
    return a / b`
  },
  {
    id: "loop-menu",
    title: "3. Loop Contínuo com 'while True' e 'break'",
    lines: [38, 55],
    shortBadge: "while True",
    summary: "Permite que a calculadora faça múltiplos cálculos consecutivos.",
    explanation:
      "Sem um laço de repetição, o programa executaria uma única conta e fecharia imediatamente. O 'while True:' cria um loop que se repete indefinidamente. Quando o usuário digita '5', o comando 'break' interrompe o loop e encerra a calculadora com elegância.",
    keyConcepts: [
      "'while True' repete o bloco de código indefinidamente.",
      "'break' sai imediatamente do laço de repetição.",
      "'strip()' remove espaços acidentais antes ou depois da digitação."
    ],
    snippet: `while True:
    opcao = input(...)
    if opcao == '5':
        break`
  },
  {
    id: "input-conversao",
    title: "4. Entrada de Dados e Conversão com 'float()'",
    lines: [57, 66],
    shortBadge: "input & float",
    summary: "Como ler valores digitados e convertê-los de texto para números.",
    explanation:
      "A função 'input()' sempre devolve os dados digitados como Texto (String). Se você somar \"5\" + \"3\" sem converter, o Python resulta em \"53\" (concatenação). Por isso, usamos 'float()' para converter o texto em número decimal com ponto flutuante (suportando inteiros e decimais como 3.14).",
    keyConcepts: [
      "input() sempre retorna o tipo 'str' (texto).",
      "float() converte a string para número com casas decimais.",
      "try/except ValueError protege o programa caso alguém digite letras."
    ],
    snippet: `num1 = float(input("Digite o primeiro número: "))
num2 = float(input("Digite o segundo número: "))`
  },
  {
    id: "condicionais",
    title: "5. Tomada de Decisão com 'if / elif / else'",
    lines: [68, 86],
    shortBadge: "if / elif",
    summary: "Encaminha os números para a função correta baseado na escolha.",
    explanation:
      "A estrutura 'if' (se) e 'elif' (senão se) verifica qual opção foi escolhida pelo usuário. Se 'opcao == \"1\"', chama 'adicionar(num1, num2)'. Se 'opcao == \"2\"', chama 'subtrair', e assim por diante. O uso de 'f-strings' (ex: f\"{num1} + {num2} = {resultado}\") permite interpolar variáveis diretamente no texto impresso.",
    keyConcepts: [
      "'==' compara igualdade (diferente de '=' que é atribuição).",
      "'elif' testa condições alternativas em cadeia.",
      "f-strings (f\"...\") formatam o texto com variáveis de forma limpa."
    ],
    snippet: `if opcao == '1':
    resultado = adicionar(num1, num2)
elif opcao == '2':
    resultado = subtrair(num1, num2)`
  },
  {
    id: "entry-point",
    title: "6. Ponto de Entrada (__name__ == '__main__')",
    lines: [88, 93],
    shortBadge: "__name__",
    summary: "Padrão da comunidade Python para inicialização profissional.",
    explanation:
      "Esta verificação checa se o script está sendo executado diretamente (por exemplo no terminal) ou se foi importado como um módulo dentro de outro projeto. Quando executamos o arquivo diretamente, o Python define a variável especial '__name__' como '__main__', disparando a função calculadora().",
    keyConcepts: [
      "Padrão profissional da linguagem Python.",
      "Permite reaproveitar as funções em outros arquivos no futuro sem disparar a calculadora automaticamente."
    ],
    snippet: `if __name__ == "__main__":
    calculadora()`
  }
];

export const CODE_SECTIONS_SCIENTIFIC: CodeSection[] = [
  {
    id: "import-math",
    title: "1. Módulo Nativo 'math' do Python",
    lines: [8, 9],
    shortBadge: "import math",
    summary: "Importa a biblioteca padrão de funções matemáticas avançadas do C.",
    explanation:
      "O Python já traz embutido o módulo 'math'. Ele contém implementações otimizadas e super rápidas para trigonometria, logaritmos, constantes e potências, sem você precisar instalar nada de fora.",
    keyConcepts: [
      "'import math' dá acesso a dezenas de ferramentas prontas.",
      "math.pi traz o número Pi (3.14159...) e math.e traz o número de Euler (2.71828...).",
      "Não requer nenhuma instalação externa via pip."
    ],
    snippet: `import math
print(math.pi)  # 3.141592653589793`
  },
  {
    id: "unarias-binarias",
    title: "2. Operações Binárias vs Unárias",
    lines: [13, 40],
    shortBadge: "1 vs 2 números",
    summary: "Diferença conceitual entre operações que precisam de 2 números e de 1 número.",
    explanation:
      "Na calculadora científica, temos dois tipos de operações: as binárias (como soma, multiplicação e potência x^y) que precisam de dois números (base e expoente), e as unárias (como raiz quadrada √x, seno, cosseno, ln e fatorial n!) que atuam sobre um único valor de entrada.",
    keyConcepts: [
      "Binárias: a + b, a - b, a * b, a / b, a ^ b (precisam de num1 e num2).",
      "Unárias: √x, sin(x), cos(x), log10(x), n! (precisam apenas de num)."
    ],
    snippet: `def potencia(base, expoente): return math.pow(base, expoente)
def raiz_quadrada(x): return math.sqrt(x)`
  },
  {
    id: "validacoes-cientificas",
    title: "3. Validações Avançadas (Raiz negativa, Log <= 0, Fatorial)",
    lines: [42, 85],
    shortBadge: "Tratamento de erros",
    summary: "Impedindo erros matemáticos clássicos da ciência e engenharia.",
    explanation:
      "Calculadoras científicas exigem validações extras: não existe raiz real de número negativo (x < 0), logaritmo não aceita zero ou negativos (x <= 0) e fatorial só existe para números inteiros não negativos. O código trata cada um desses casos com mensagens instrutivas.",
    keyConcepts: [
      "if x < 0 em raiz_quadrada evita ValueError no math.sqrt().",
      "if x <= 0 em logaritmos protege contra indefinição matemática.",
      "is_integer() garante que fatorial seja chamado apenas para números inteiros."
    ],
    snippet: `if x < 0:
    return "Erro: Raiz de número negativo não é real!"`
  },
  {
    id: "trigonometria-radianos",
    title: "4. Trigonometria & Radianos (math.radians)",
    lines: [50, 68],
    shortBadge: "sin, cos, tan",
    summary: "Por que converter graus para radianos antes de calcular.",
    explanation:
      "Em computação, as funções trigonométricas (seno, cosseno, tangente) operam internamente na unidade de radianos, e não em graus. A função 'math.radians(graus)' converte o ângulo habitual que usamos no dia a dia (ex: 90°, 180°) para radianos antes de calcular.",
    keyConcepts: [
      "math.radians(180) = π (3.14159 radianos).",
      "seno de 90° graus = 1.0.",
      "cosseno de 0° graus = 1.0."
    ],
    snippet: `rad = math.radians(graus)
return math.sin(rad)`
  }
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "O que a função input() do Python sempre retorna por padrão?",
    options: [
      "Um número inteiro (int)",
      "Um texto / sequência de caracteres (str)",
      "Um número decimal (float)",
      "Um valor booleano (True ou False)"
    ],
    correctIndex: 1,
    explanation:
      "Exato! input() sempre devolve uma String (str). Por isso precisamos usar int() ou float() quando queremos fazer contas matemáticas!"
  },
  {
    id: 2,
    question: "Para que serve a instrução 'break' dentro de um loop 'while'?",
    options: [
      "Pausa o loop por alguns segundos",
      "Reinicia o loop a partir do início",
      "Interrompe e encerra imediatamente a execução do loop",
      "Exibe uma mensagem de erro na tela"
    ],
    correctIndex: 2,
    explanation:
      "Correto! O comando 'break' quebra o laço de repetição, fazendo o Python continuar a execução logo após o bloco do while."
  },
  {
    id: 3,
    question: "Qual biblioteca nativa do Python fornece funções como raiz quadrada (sqrt), seno e o valor de Pi?",
    options: [
      "numpy",
      "math",
      "calculator",
      "science"
    ],
    correctIndex: 1,
    explanation:
      "Muito bem! O módulo 'math' faz parte da biblioteca padrão do Python e vem pronto para uso com 'import math' sem instalar nada!"
  },
  {
    id: 4,
    question: "Por que devemos converter ângulos em graus para radianos em Python?",
    options: [
      "Porque o Python só aceita números menores que 10",
      "Porque as funções math.sin, math.cos e math.tan esperam o ângulo em radianos",
      "Para transformar o número em inteiro",
      "Para evitar divisão por zero"
    ],
    correctIndex: 1,
    explanation:
      "Exatamente! As funções trigonométricas da biblioteca math operam em radianos. A função math.radians(graus) faz essa conversão facilmente."
  }
];
