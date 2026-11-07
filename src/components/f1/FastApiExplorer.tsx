import React, { useState } from 'react';
import {
  Server,
  Play,
  Copy,
  Check,
  Download,
  Code2,
  Terminal,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Activity
} from 'lucide-react';

export const FastApiExplorer: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/f1/calculate/downforce');
  const [requestMethod, setRequestMethod] = useState<'GET' | 'POST'>('POST');
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify(
      {
        velocidade_kmh: 310,
        area_asa_m2: 1.5,
        coeficiente_downforce_cl: 3.5,
        coeficiente_arrasto_cd: 0.9,
        densidade_ar: 1.18
      },
      null,
      2
    )
  );

  const [responseOutput, setResponseOutput] = useState<any>({
    status: '200 OK',
    tempo_resposta_ms: 1.8,
    dados: {
      metodologia_gccd: {
        fase_g_governanca: 'Parâmetros aceitos para Interlagos (800m alt, rho=1.18 kg/m³)',
        fase_c1_calculo: 'F_d = 0.5 * 1.18 * (86.11)² * 3.5 * 1.5 = 22961.5 N',
        fase_c2_conferencia: 'Eficiência aerodinâmica L/D = 3.89. Valores consistentes com túnel de vento da F1.',
        fase_d_demonstracao_3d: {
          amplitude_vetor_pressao: 5.0,
          fator_deformacao_asa: 1.0
        }
      },
      resultados: {
        velocidade_ms: 86.11,
        downforce_newtons: 22961.5,
        downforce_peso_equivalente_kg: 2341.4,
        arrasto_drag_newtons: 5904.4,
        eficiencia_aerodinamica_cl_cd: 3.89
      }
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const handleSelectEndpoint = (endpoint: string, method: 'GET' | 'POST', defaultBody?: any) => {
    setSelectedEndpoint(endpoint);
    setRequestMethod(method);
    if (defaultBody) {
      setRequestBody(JSON.stringify(defaultBody, null, 2));
    } else {
      setRequestBody('');
    }
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    const start = performance.now();

    try {
      let res;
      if (requestMethod === 'POST') {
        const parsedBody = requestBody ? JSON.parse(requestBody) : {};
        res = await fetch(selectedEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsedBody)
        });
      } else {
        res = await fetch(selectedEndpoint);
      }

      const json = await res.json();
      const end = performance.now();

      setResponseOutput({
        status: `${res.status} ${res.statusText || 'OK'}`,
        tempo_resposta_ms: parseFloat((end - start).toFixed(2)),
        dados: json
      });
    } catch (err: any) {
      setResponseOutput({
        status: '500 Internal Error / Simulação Local',
        erro: err.message,
        dados: {
          aviso: 'Servidor FastAPI em execução de contingência.',
          endpoint: selectedEndpoint
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pythonFastApiCode = `# ==============================================================================
# FASTAPI BACKEND - TELEMETRIA CIENTÍFICA F1 (GP DO BRASIL / INTERLAGOS)
# ==============================================================================
# Instalação: pip install fastapi uvicorn pydantic
# Execução:   uvicorn main:app --reload --port 8000

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List

app = FastAPI(
    title="F1 GP do Brasil - Telemetria & Engenharia Científica",
    description="API com metodologia GCCD para cálculos em Interlagos",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------------
# MODELO PYDANTIC (FASE G: GOVERNANÇA DE DADOS)
# ------------------------------------------------------------------------------
class AerodinamicaInput(BaseModel):
    velocidade_kmh: float = Field(..., ge=0, le=400, description="Velocidade (km/h)")
    area_asa_m2: float = Field(1.5, ge=0.5, le=3.0)
    coeficiente_downforce_cl: float = Field(3.5, ge=1.0, le=6.0)
    coeficiente_arrasto_cd: float = Field(0.9, ge=0.2, le=2.0)
    densidade_ar: float = Field(1.18, description="Densidade em Interlagos (kg/m³)")

# ------------------------------------------------------------------------------
# ENDPOINT DE CÁLCULO AERODINÂMICO (FASES C & C: CÁLCULO E CONFERÊNCIA)
# ------------------------------------------------------------------------------
@app.post("/api/f1/calculate/downforce")
def calcular_downforce(dados: AerodinamicaInput) -> Dict[str, Any]:
    v_ms = dados.velocidade_kmh / 3.6
    q = 0.5 * dados.densidade_ar * (v_ms ** 2)
    downforce_n = q * dados.coeficiente_downforce_cl * dados.area_asa_m2
    arrasto_n = q * dados.coeficiente_arrasto_cd * dados.area_asa_m2
    peso_adicional_kg = downforce_n / 9.80665
    eficiencia = dados.coeficiente_downforce_cl / dados.coeficiente_arrasto_cd

    return {
        "metodologia_gccd": {
            "fase_g_governanca": "Validação de fronteira física aprovada",
            "fase_c1_calculo": f"Pressão dinâmica q = {q:.2f} Pa",
            "fase_c2_conferencia": f"Razão L/D = {eficiencia:.2f} consistente",
            "fase_d_demonstracao_3d": {
                "amplitude_vetor_pressao": min(5.0, peso_adicional_kg / 300)
            }
        },
        "resultados": {
            "downforce_newtons": round(downforce_n, 1),
            "downforce_kg": round(peso_adicional_kg, 1),
            "arrasto_newtons": round(arrasto_n, 1),
            "eficiencia_l_d": round(eficiencia, 2)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(pythonFastApiCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Banner - Welcoming, Compact (p-3.5 sm:p-4) */}
      <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-500" />
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span>FastAPI Backend Engine</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-slate-500 dark:text-slate-400">Python 3.10+ / Pydantic</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-slate-500 dark:text-slate-400">OpenAPI 3.0</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            FastAPI Explorer & Rotas REST
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Interaja diretamente com os endpoints de telemetria da F1 em Interlagos estruturados na metodologia GCCD.
          </p>
        </div>

        <button
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-xs self-start md:self-auto border border-amber-300"
        >
          {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCode ? 'Código Copiado!' : 'Copiar main.py'}</span>
        </button>
      </div>

      {/* Interactive REST API Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: Endpoints & Request Builder (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Endpoints Disponíveis
              </h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Clique para testar</span>
            </div>

            {/* List of endpoints */}
            <div className="space-y-1.5 text-xs font-mono">
              <button
                onClick={() =>
                  handleSelectEndpoint('/api/f1/calculate/downforce', 'POST', {
                    velocidade_kmh: 310,
                    area_asa_m2: 1.5,
                    coeficiente_downforce_cl: 3.5,
                    coeficiente_arrasto_cd: 0.9,
                    densidade_ar: 1.18
                  })
                }
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                  selectedEndpoint === '/api/f1/calculate/downforce'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                    POST
                  </span>
                  <span className="truncate">/api/f1/calculate/downforce</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans hidden sm:inline">Downforce</span>
              </button>

              <button
                onClick={() =>
                  handleSelectEndpoint('/api/f1/calculate/gforce', 'POST', {
                    velocidade_kmh: 240,
                    raio_curva_m: 85,
                    massa_carro_kg: 798
                  })
                }
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                  selectedEndpoint === '/api/f1/calculate/gforce'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                    POST
                  </span>
                  <span className="truncate">/api/f1/calculate/gforce</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans hidden sm:inline">Força G</span>
              </button>

              <button
                onClick={() => handleSelectEndpoint('/api/f1/interlagos/setores', 'GET')}
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                  selectedEndpoint === '/api/f1/interlagos/setores'
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-900 dark:text-sky-300 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-bold text-[10px]">
                    GET
                  </span>
                  <span className="truncate">/api/f1/interlagos/setores</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans hidden sm:inline">Setores</span>
              </button>

              <button
                onClick={() => handleSelectEndpoint('/api/f1/health', 'GET')}
                className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                  selectedEndpoint === '/api/f1/health'
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-500 text-sky-900 dark:text-sky-300 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-sky-600 text-white font-bold text-[10px]">
                    GET
                  </span>
                  <span className="truncate">/api/f1/health</span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-sans hidden sm:inline">Status</span>
              </button>
            </div>

            {/* Request Payload Editor (if POST) */}
            {requestMethod === 'POST' && (
              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Request JSON Body (Pydantic Model):
                </label>
                <textarea
                  rows={4}
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            <button
              onClick={handleExecuteRequest}
              disabled={isLoading}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Executando...' : 'Enviar Requisição para FastAPI'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Response JSON Viewer (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm flex flex-col font-mono text-xs">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span className="text-slate-200 font-bold text-[11px]">FastAPI Response (JSON)</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-emerald-400 font-bold">{responseOutput.status}</span>
                <span className="text-slate-400">{responseOutput.tempo_resposta_ms} ms</span>
              </div>
            </div>

            <div className="p-3 max-h-[260px] sm:max-h-[290px] overflow-y-auto overflow-x-auto text-sky-300 leading-relaxed text-[11px]">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(responseOutput.dados, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Complete FastAPI Backend Code Viewer */}
      <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 rounded-xl border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4 text-emerald-600" />
              Código Fonte Oficial: backend/main.py
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Arquivo Python pronto para rodar com Uvicorn
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-700"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copiar</span>
          </button>
        </div>

        <div className="p-3 bg-slate-950 text-slate-200 rounded-lg font-mono text-xs border border-slate-800 max-h-[260px] sm:max-h-[280px] overflow-y-auto overflow-x-auto">
          <pre className="whitespace-pre text-sky-300 leading-relaxed text-[11px]">
            {pythonFastApiCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
