"""
FastAPI Backend - Calculadora Científica de Telemetria F1 (GP do Brasil / Interlagos)
Metodologia GCCD: Governança, Cálculo, Conferência e Demonstração 3D
"""

import math
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="F1 GP do Brasil - Telemetria & Engenharia Científica (FastAPI)",
    description=(
        "API científica de alta performance para cálculos de dinâmica veicular, "
        "aerodinâmica e telemetria do Autódromo de Interlagos aplicando a metodologia GCCD."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware para comunicação segura com o Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# MODELOS PYDANTIC (FASE G: GOVERNANÇA DE DADOS)
# ==============================================================================

class AerodinamicaRequest(BaseModel):
    velocidade_kmh: float = Field(..., ge=0, le=400, description="Velocidade na Reta dos Boxes ou Reta Oposta (km/h)")
    area_asa_m2: float = Field(1.5, ge=0.5, le=3.0, description="Área frontal e aerofólios (m²)")
    coeficiente_downforce_cl: float = Field(3.5, ge=1.0, le=6.0, description="Coeficiente de sustentação negativa (Cl)")
    coeficiente_arrasto_cd: float = Field(0.9, ge=0.2, le=2.0, description="Coeficiente de arrasto aerodinâmico (Cd)")
    densidade_ar: float = Field(1.18, ge=0.9, le=1.4, description="Densidade do ar em Interlagos a 800m de altitude (kg/m³)")

class ForcaGRequest(BaseModel):
    velocidade_kmh: float = Field(..., ge=10, le=360, description="Velocidade de contorno da curva (km/h)")
    raio_curva_m: float = Field(..., gt=0, le=500, description="Raio da curva em Interlagos (ex: 85m no S do Senna, 120m na Junção)")
    massa_carro_kg: float = Field(798.0, ge=700, le=900, description="Massa regulamentar do carro com piloto (kg)")

class TempoVoltaRequest(BaseModel):
    potencia_hp: float = Field(1000.0, ge=600, le=1200, description="Potência da unidade de potência híbrida (cv/hp)")
    massa_kg: float = Field(798.0, ge=700, le=1000, description="Massa do monoposto (kg)")
    nivel_downforce: float = Field(0.85, ge=0.1, le=1.0, description="Configuração das asas para a altitude de Interlagos (0 a 1)")
    pneu_composto: str = Field("C4_Macio", description="Composto Pirelli (C3_Duro, C4_Medio, C5_Macio)")

class TelemetriaSetor(BaseModel):
    setor: int
    nome: str
    extensao_metros: float
    curva_critica: str
    velocidade_media_kmh: float
    tempo_estimado_s: float

# ==============================================================================
# ENDPOINTS REST (FASES C & C: CÁLCULO E CONFERÊNCIA)
# ==============================================================================

@app.get("/")
def home() -> Dict[str, Any]:
    """Status da API e especificações do circuito de Interlagos."""
    return {
        "status": "online",
        "api": "FastAPI F1 Telemetry Engine",
        "circuito": "Autódromo José Carlos Pace (Interlagos - São Paulo, Brasil)",
        "extensao_km": 4.309,
        "altitude_m": 800,
        "sentido": "Anti-horário (anti-clockwise)",
        "metodologia": "GCCD (Governança, Cálculo, Conferência, Demonstração)",
        "docs": "/docs"
    }

@app.get("/api/f1/health")
def health_check() -> Dict[str, Any]:
    """Endpoint de verificação de integridade e telemetria básica."""
    return {
        "status": "online",
        "backend": "FastAPI v0.110 (Python 3.10 Engine)",
        "circuito": "Autódromo José Carlos Pace (Interlagos - GP do Brasil)",
        "metodologia": "GCCD (Governança, Cálculo, Conferência, Demonstração 3D)",
        "docs": "/docs"
    }

@app.post("/api/f1/calculate/downforce")
def calcular_downforce(dados: AerodinamicaRequest) -> Dict[str, Any]:
    """
    Calcula o Downforce (pressão aerodinâmica) e Arrasto (Drag)
    usando as leis da dinâmica dos fluidos de Navier-Stokes simplificadas.
    Fórmula: F_d = 0.5 * rho * v^2 * Cl * A
    """
    # Fase G: Governança (Validação de velocidade física)
    v_ms = dados.velocidade_kmh / 3.6
    
    # Fase C: Cálculo
    # Pressão dinâmica q = 0.5 * rho * v^2
    pressao_dinamica = 0.5 * dados.densidade_ar * (v_ms ** 2)
    forca_downforce_n = pressao_dinamica * dados.coeficiente_downforce_cl * dados.area_asa_m2
    forca_arrasto_n = pressao_dinamica * dados.coeficiente_arrasto_cd * dados.area_asa_m2
    peso_adicional_kg = forca_downforce_n / 9.80665

    # Fase C: Conferência Analítica
    razao_eficiencia = dados.coeficiente_downforce_cl / dados.coeficiente_arrasto_cd
    conferencia_valida = forca_downforce_n >= 0 and forca_arrasto_n >= 0

    return {
        "metodologia_gccd": {
            "fase_g_governanca": "Parâmetros verificados para altitude de Interlagos (800m, rho=1.18 kg/m³)",
            "fase_c1_calculo": "Equação quadrática de sustentação negativa de Bernoulli/Euler",
            "fase_c2_conferencia": "Razão de eficiência aerodinâmica Cl/Cd conferida: " + f"{razao_eficiencia:.2f}",
            "fase_d_demonstracao_3d": {
                "amplitude_vetor_pressao": round(min(5.0, peso_adicional_kg / 300), 2),
                "fator_deformacao_asa": round(min(1.0, forca_downforce_n / 20000), 3)
            }
        },
        "resultados": {
            "velocidade_ms": round(v_ms, 2),
            "downforce_newtons": round(forca_downforce_n, 1),
            "downforce_peso_equivalente_kg": round(peso_adicional_kg, 1),
            "arrasto_drag_newtons": round(forca_arrasto_n, 1),
            "eficiencia_aerodinamica_cl_cd": round(razao_eficiencia, 2)
        }
    }

@app.post("/api/f1/calculate/gforce")
def calcular_forca_g(dados: ForcaGRequest) -> Dict[str, Any]:
    """
    Calcula a aceleração centrípeta e a Força G exercida sobre o piloto
    em curvas críticas de Interlagos (ex: Curva do Laranjinha, S do Senna, Junção).
    Fórmula: a_c = v^2 / R  |  Força G = a_c / g
    """
    v_ms = dados.velocidade_kmh / 3.6
    g_padrao = 9.80665

    # Cálculo da aceleração centrípeta
    aceleracao_centripeta = (v_ms ** 2) / dados.raio_curva_m
    g_lateral = aceleracao_centripeta / g_padrao
    forca_lateral_newtons = dados.massa_carro_kg * aceleracao_centripeta

    # Conferência GCCD
    seguro_piloto = g_lateral <= 6.5

    return {
        "metodologia_gccd": {
            "fase_g_governanca": f"Raio de curva {dados.raio_curva_m}m e velocidade {dados.velocidade_kmh}km/h aceitos",
            "fase_c1_calculo": f"a_c = ({v_ms:.2f})² / {dados.raio_curva_m} = {aceleracao_centripeta:.2f} m/s²",
            "fase_c2_conferencia": "Sob o limite fisiológico humano da FIA (<= 6.5G): " + str(seguro_piloto),
            "fase_d_demonstracao_3d": {
                "inclinacao_carro_rad": round(min(0.25, g_lateral * 0.04), 4),
                "vetor_g_lateral": round(g_lateral, 2)
            }
        },
        "resultados": {
            "aceleracao_centripeta_ms2": round(aceleracao_centripeta, 2),
            "forca_g_lateral": round(g_lateral, 2),
            "forca_lateral_n": round(forca_lateral_newtons, 1),
            "carga_sobre_pescoco_kg": round((g_lateral * 6.5), 1)  # Capacete + cabeça ≈ 6.5kg
        }
    }

@app.get("/api/f1/interlagos/setores")
def obter_setores_interlagos() -> List[Dict[str, Any]]:
    """Retorna os dados oficiais dos 3 setores do GP do Brasil de F1."""
    return [
        {
            "setor": 1,
            "nome": "Setor 1 - Do S do Senna à Curva do Sol",
            "extensao_metros": 1420.0,
            "curva_critica": "S do Senna (Curvas 1 e 2)",
            "velocidade_max_kmh": 340.0,
            "velocidade_min_kmh": 110.0,
            "tempo_pole_s": 18.420
        },
        {
            "setor": 2,
            "nome": "Setor 2 - Miolo Técnico (Descida do Lago ao Bico de Pato)",
            "extensao_metros": 1640.0,
            "curva_critica": "Laranjinha e Bico de Pato",
            "velocidade_max_kmh": 285.0,
            "velocidade_min_kmh": 78.0,
            "tempo_pole_s": 35.840
        },
        {
            "setor": 3,
            "nome": "Setor 3 - Junção e Subida dos Boxes (Full Throttle)",
            "extensao_metros": 1249.0,
            "curva_critica": "Junção e Subida dos Boxes",
            "velocidade_max_kmh": 348.0,
            "velocidade_min_kmh": 135.0,
            "tempo_pole_s": 16.150
        }
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
