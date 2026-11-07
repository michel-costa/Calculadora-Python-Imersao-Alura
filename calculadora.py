# FastAPI Backend - F1 GP do Brasil (Interlagos)
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="F1 GP do Brasil - Telemetria Interlagos")

class Aerodinamica(BaseModel):
    velocidade_kmh: float
    coeficiente_downforce_cl: float = 3.6
    area_asa_m2: float = 1.5

@app.post("/api/f1/calculate/downforce")
def calcular_downforce(dados: Aerodinamica):
    v_ms = dados.velocidade_kmh / 3.6
    # Densidade do ar em Interlagos (800m altitude)
    rho = 1.18
    q = 0.5 * rho * (v_ms ** 2)
    downforce_n = q * dados.coeficiente_downforce_cl * dados.area_asa_m2
    return {
        "downforce_newtons": round(downforce_n, 1),
        "downforce_kg": round(downforce_n / 9.80665, 1)
    }
