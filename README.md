# 🏎️ F1 GP do Brasil — Telemetria Científica & Engenharia Interlagos

> **Laboratório Interativo de Engenharia de Pista, Modelagem Aerodinâmica 3D e Backend FastAPI baseado na Metodologia GCCD.**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/Frontend-React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/CSS-Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/3D-Three.js-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Metodologia](https://img.shields.io/badge/Metodologia-GCCD-059669?style=flat-square)](#-a-metodologia-gccd)

---

## 📌 Descrição do Projeto

O **F1 GP do Brasil — Telemetria & Engenharia Interlagos** é uma aplicação completa que une **educação em programação (Python)**, **cálculo científico aero-espacial/automobilístico** e **computação gráfica 3D**, ambientada no icônico **Autódromo José Carlos Pace (Interlagos, São Paulo)**.

A plataforma resolve desde as dúvidas iniciais de quem está aprendendo programação (estruturação de algoritmos, tipos numéricos, menus e tratamento de exceções) até a simulação avançada das forças atuantes em um monoposto de Fórmula 1 a mais de 300 km/h na descida do *S do Senna* ou na aceleração da *Subida dos Boxes*.

Todo o fluxo computacional segue a **Metodologia GCCD** (**G**overnança, **C**álculo, **C**onferência e **D**emonstração 3D), garantindo consistência técnica, validação de grandezas físicas e visualização espacial em tempo real.

---

## 🌟 Principais Recursos

### 1. 🔬 Metodologia GCCD Aplicada
- **(G) Governança:** Validação rigorosa de inputs com modelos **Pydantic** — limites físicos de velocidade (0–400 km/h), área de asa, coeficientes $C_L$ e $C_D$, além da densidade atmosférica de Interlagos a 800m de altitude ($\rho = 1{,}18 \text{ kg/m³}$).
- **(C) Cálculo Científico:** Determinação da pressão dinâmica ($q = \frac{1}{2} \rho v^2$), downforce vertical ($F_d$), força de arrasto ($F_x$) e aceleração lateral centrípeta no *S do Senna* ($a_c = \frac{v^2}{R}$, convertida em forças $g$).
- **(C) Conferência Analítica:** Testes de consistência física, verificação da razão de eficiência aerodinâmica ($L/D$) e tolerâncias mecânicas antes da emissão dos resultados.
- **(D) Demonstração 3D:** Renderização vetorial dinâmica com **Three.js**, refletindo a deflexão das asas, vetores de sustentação negativa e escoamento em túnel de vento.

### 2. 🏁 Engenharia & Telemetria de Interlagos
- **Setores Oficiais:** Detalhamento do Setor 1 (Reta dos Boxes ao S do Senna), Setor 2 (Miolo técnico: Laranjinha, Pinheirinho e Bico de Pato) e Setor 3 (Junção e Subida dos Boxes).
- **Altitude e Clima:** Modelagem do impacto do ar rarefeito paulistano no resfriamento e na pressão aerodinâmica.
- **Zonas de DRS:** Simulação da redução de arrasto na Reta Principal e na Reta Oposta.

### 3. 🏎️ Simulador 3D Interativo (Three.js)
- **Monoposto F1 em Livrea GP do Brasil:** Chassi verde esmeralda (`#009c3b`), bico e asas em amarelo canário (`#ffdf00`) e halo em azul velocidade (`#002776`).
- **3 Modos de Visualização:**
  - `Carro Completo`: Inspeção orbital em 360°, aro de titânio e vetor de downforce reativo.
  - `Túnel de Vento`: Simulação de partículas de fluxo aerodinâmico conforme a velocidade ajustada.
  - `Circuito 3D`: Traçado altimétrico de 4.309 metros com desnível real de 40 metros.
- **Modo Aramado (Wireframe)** e controles de rotação contínua.

### 4. ⚡ Backend FastAPI (Python) & Explorer Integrado
- Endpoints REST documentados e testáveis diretamente na interface:
  - `POST /api/f1/calculate/downforce` — Cálculo de pressão aerodinâmica e carga em kg.
  - `POST /api/f1/calculate/gforce` — Cálculo de aceleração lateral e força centrípeta em curvas.
  - `GET /api/f1/interlagos/setores` — Ficha técnica dos 3 setores de Interlagos.
  - `GET /api/f1/health` — Monitoramento de integridade da API.
- Código Python completo em `backend/main.py` disponível para download (`main.py`) com 1 clique.

### 5. 🐍 Didática Python para Iniciantes
- Código-fonte limpo com comentários explicativos para:
  - Calculadora de 4 operações básicas (`calculadora.py`).
  - Calculadora científica completa com módulo `math` (`calculadora_cientifica.py`).
- **Terminal Simulator:** Console virtual integrado que simula a execução interativa de scripts Python direto no navegador.

---

## 🎨 Design & Experiência de Uso

- **Visual Leve e Acolhedor:** Paleta equilibrada com inspiração no GP de Interlagos (tons suaves de ardósia, verde esmeralda e amarelo quente).
- **Design Compacto e Proporcional:** Componentes otimizados para visualização sem necessidade de rolagem excessiva.
- **Modos Claro & Escuro:** Alternância de tema fluida através de um toggle no cabeçalho.
- **100% Responsivo:** Experiência consistente em smartphones (360px+), tablets e monitores widescreen.

---

## 📐 Estrutura de Pastas

```text
├── backend/
│   └── main.py                     # API nativa em FastAPI com Pydantic e metodologia GCCD
├── src/
│   ├── components/
│   │   ├── f1/
│   │   │   ├── F1TelemetryGCCD.tsx         # Dashboard de telemetria, controles e métricas
│   │   │   ├── Interlagos3D.tsx            # Viewport Three.js (carro, túnel de vento, pista)
│   │   │   ├── InterlagosCircuitCard.tsx   # Ficha técnica e setores de Interlagos
│   │   │   └── FastApiExplorer.tsx         # Testador de rotas REST e documentação do backend
│   │   ├── GccdMethodologyTab.tsx          # Explicação detalhada dos 4 pilares da GCCD
│   │   ├── CodeViewer.tsx                  # Visualizador interativo de código Python
│   │   └── TerminalSimulator.tsx           # Simulador do terminal de linha de comando
│   ├── data/
│   │   └── pythonCode.ts                   # Códigos Python comentados para aprendizagem
│   ├── App.tsx                             # Componente raiz com navegação compacta e tema
│   ├── main.tsx                            # Ponto de entrada do React
│   └── index.css                           # Estilos globais e tokens Tailwind CSS v4
├── server.ts                               # Servidor full-stack Express integrando a API
├── package.json                            # Dependências e scripts
└── README.md                               # Documentação oficial do projeto
```

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **Python** (versão 3.10 ou superior, para rodar o backend standalone)

### 1. Clonando o Repositório
```bash
git clone https://github.com/seu-usuario/f1-gp-brasil-telemetria.git
cd f1-gp-brasil-telemetria
```

### 2. Executando o Frontend & Servidor Integrado
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (Porta 3000)
npm run dev
```
Abra o navegador em `http://localhost:3000`.

### 3. (Opcional) Executando o Backend FastAPI nativo em Python
Se preferir executar diretamente o servidor Python com Uvicorn:
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
```
Acesse a documentação interativa Swagger em `http://localhost:8000/docs`.

---

## 🧪 Exemplos de Requisições da API

### Cálculo de Downforce Aerodinâmico
```bash
curl -X POST "http://localhost:3000/api/f1/calculate/downforce" \
  -H "Content-Type: application/json" \
  -d '{
    "velocidade_kmh": 315,
    "area_asa_m2": 1.5,
    "coeficiente_downforce_cl": 3.6,
    "coeficiente_arrasto_cd": 0.9,
    "densidade_ar": 1.18
  }'
```

**Resposta JSON:**
```json
{
  "metodologia_gccd": {
    "fase_g_governanca": "Parâmetros aceitos para Interlagos (800m alt, rho=1.18 kg/m³)",
    "fase_c1_calculo": "F_d = 0.5 * 1.18 * (87.50)² * 3.6 * 1.5",
    "fase_c2_conferencia": "Eficiência aerodinâmica L/D = 4.00. Valores consistentes com túnel de vento da F1.",
    "fase_d_demonstracao_3d": {
      "amplitude_vetor_pressao": 5.0,
      "fator_deformacao_asa": 1.0
    }
  },
  "resultados": {
    "velocidade_ms": 87.5,
    "downforce_newtons": 24410.8,
    "downforce_peso_equivalente_kg": 2489.2,
    "arrasto_drag_newtons": 6102.7,
    "eficiencia_aerodinamica_cl_cd": 4.0
  }
}
```

---

## 📚 Metodologia GCCD em Detalhes

| Fase | Significado | Aplicação no Projeto |
| :---: | :--- | :--- |
| **G** | **Governança** | Validação de tipos, fronteiras físicas aceitáveis e coerência das grandezas de entrada. |
| **C** | **Cálculo** | Modelagem das equações físicas aerodinâmicas e cinemáticas com precisão numérica. |
| **C** | **Conferência** | Prova real analítica, razão de sustentação/arrasto ($L/D$) e conferência de integridade. |
| **D** | **Demonstração 3D** | Projeção espacial tridimensional do comportamento dinâmico do veículo e escoamento do ar. |

---

## 📄 Licença

Distribuído sob a licença **Apache 2.0**. Consulte o arquivo de licença para mais informações.
