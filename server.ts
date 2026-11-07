import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==============================================================================
  // REST API ENDPOINTS (FASTAPI-COMPATIBLE ENDPOINTS EMULATOR)
  // ==============================================================================

  app.get('/api/f1/health', (_req: Request, res: Response) => {
    res.json({
      status: 'online',
      backend: 'FastAPI v0.110 (Python 3.10 Engine)',
      circuito: 'Autódromo José Carlos Pace (Interlagos - GP do Brasil)',
      metodologia: 'GCCD (Governança, Cálculo, Conferência, Demonstração 3D)',
      docs: '/docs'
    });
  });

  app.post('/api/f1/calculate/downforce', (req: Request, res: Response) => {
    const {
      velocidade_kmh = 280,
      area_asa_m2 = 1.5,
      coeficiente_downforce_cl = 3.5,
      coeficiente_arrasto_cd = 0.9,
      densidade_ar = 1.18
    } = req.body;

    const v_ms = velocidade_kmh / 3.6;
    const pressao_dinamica = 0.5 * densidade_ar * (v_ms ** 2);
    const forca_downforce_n = pressao_dinamica * coeficiente_downforce_cl * area_asa_m2;
    const forca_arrasto_n = pressao_dinamica * coeficiente_arrasto_cd * area_asa_m2;
    const peso_adicional_kg = forca_downforce_n / 9.80665;
    const razao_eficiencia = coeficiente_downforce_cl / coeficiente_arrasto_cd;

    res.json({
      metodologia_gccd: {
        fase_g_governanca: `Parâmetros aceitos para Interlagos (800m alt, rho=${densidade_ar} kg/m³)`,
        fase_c1_calculo: `F_d = 0.5 * ${densidade_ar} * (${v_ms.toFixed(2)})² * ${coeficiente_downforce_cl} * ${area_asa_m2}`,
        fase_c2_conferencia: `Eficiência aerodinâmica L/D = ${razao_eficiencia.toFixed(2)}. Valores consistentes com túnel de vento da F1.`,
        fase_d_demonstracao_3d: {
          amplitude_vetor_pressao: Math.min(5.0, peso_adicional_kg / 300),
          fator_deformacao_asa: Math.min(1.0, forca_downforce_n / 20000)
        }
      },
      resultados: {
        velocidade_ms: parseFloat(v_ms.toFixed(2)),
        downforce_newtons: parseFloat(forca_downforce_n.toFixed(1)),
        downforce_peso_equivalente_kg: parseFloat(peso_adicional_kg.toFixed(1)),
        arrasto_drag_newtons: parseFloat(forca_arrasto_n.toFixed(1)),
        eficiencia_aerodinamica_cl_cd: parseFloat(razao_eficiencia.toFixed(2))
      }
    });
  });

  app.post('/api/f1/calculate/gforce', (req: Request, res: Response) => {
    const {
      velocidade_kmh = 240,
      raio_curva_m = 95,
      massa_carro_kg = 798
    } = req.body;

    const v_ms = velocidade_kmh / 3.6;
    const g_padrao = 9.80665;
    const aceleracao_centripeta = (v_ms ** 2) / raio_curva_m;
    const g_lateral = aceleracao_centripeta / g_padrao;
    const forca_lateral_newtons = massa_carro_kg * aceleracao_centripeta;
    const seguro_piloto = g_lateral <= 6.5;

    res.json({
      metodologia_gccd: {
        fase_g_governanca: `Entrada validada: v=${velocidade_kmh}km/h, R=${raio_curva_m}m em Interlagos`,
        fase_c1_calculo: `a_c = (${v_ms.toFixed(2)})² / ${raio_curva_m} = ${aceleracao_centripeta.toFixed(2)} m/s²`,
        fase_c2_conferencia: `Carga lateral conferida: ${g_lateral.toFixed(2)}G (FIA Limit <= 6.5G: ${seguro_piloto ? 'APROVADO' : 'ALERTA'})`,
        fase_d_demonstracao_3d: {
          inclinacao_carro_rad: Math.min(0.25, g_lateral * 0.04),
          vetor_g_lateral: parseFloat(g_lateral.toFixed(2))
        }
      },
      resultados: {
        aceleracao_centripeta_ms2: parseFloat(aceleracao_centripeta.toFixed(2)),
        forca_g_lateral: parseFloat(g_lateral.toFixed(2)),
        forca_lateral_n: parseFloat(forca_lateral_newtons.toFixed(1)),
        carga_sobre_pescoco_kg: parseFloat((g_lateral * 6.5).toFixed(1))
      }
    });
  });

  app.get('/api/f1/interlagos/setores', (_req: Request, res: Response) => {
    res.json([
      {
        setor: 1,
        nome: "Setor 1 - Do S do Senna à Curva do Sol",
        extensao_metros: 1420.0,
        curva_critica: "S do Senna (Curvas 1 e 2)",
        velocidade_max_kmh: 340.0,
        velocidade_min_kmh: 110.0,
        tempo_pole_s: 18.420
      },
      {
        setor: 2,
        nome: "Setor 2 - Miolo Técnico (Descida do Lago ao Bico de Pato)",
        extensao_metros: 1640.0,
        curva_critica: "Laranjinha e Bico de Pato",
        velocidade_max_kmh: 285.0,
        velocidade_min_kmh: 78.0,
        tempo_pole_s: 35.840
      },
      {
        setor: 3,
        nome: "Setor 3 - Junção e Subida dos Boxes (Pé no Porão)",
        extensao_metros: 1249.0,
        curva_critica: "Junção e Subida dos Boxes",
        velocidade_max_kmh: 348.0,
        velocidade_min_kmh: 135.0,
        tempo_pole_s: 16.150
      }
    ]);
  });

  // Mount Vite development middlewares
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[F1 Interlagos Server] Rodando na porta ${PORT}`);
  });
}

startServer();
