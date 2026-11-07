# ==============================================================================
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
        print("\n--- MENU DE OPERAÇÕES ---")
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

        opcao = input("\nEscolha a operação (0-12): ").strip()

        if opcao == '0':
            print("\nEncerrando a calculadora científica. Bons cálculos! 🧪")
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
