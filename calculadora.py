# ==============================================================================
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
        print("\nEscolha a operação desejada:")
        print("1 - Adição (+)")
        print("2 - Subtração (-)")
        print("3 - Multiplicação (*)")
        print("4 - Divisão (/)")
        print("5 - Sair do programa")

        # input() lê o que o usuário digita no teclado como texto (string)
        opcao = input("\nDigite o número da sua opção (1-5): ").strip()

        # Verifica se o usuário quer encerrar o programa
        if opcao == '5':
            print("\nObrigado por usar a calculadora! Bons estudos em Python! 👋")
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
        print("\n" + "-" * 30)
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
