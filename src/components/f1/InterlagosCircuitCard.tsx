import React from 'react';
import { Flag, Compass, Timer, MapPin, Wind, Mountain, Zap } from 'lucide-react';

export const InterlagosCircuitCard: React.FC = () => {
  const sectors = [
    {
      setor: 1,
      nome: 'Setor 1: Reta dos Boxes ao S do Senna',
      extensao: '1.420 metros',
      curvas: 'Curva 1 e 2 (S do Senna) · Curva 3 (Curva do Sol)',
      vMax: '340 km/h',
      vMin: '110 km/h',
      tempoMedio: '18.420 s',
      desafio: 'Forte frenagem em descida no fim da reta principal. Ponto nobre de ultrapassagem com DRS.'
    },
    {
      setor: 2,
      nome: 'Setor 2: Miolo Técnico & Descida do Lago',
      extensao: '1.640 metros',
      curvas: 'Descida do Lago · Laranjinha · Pinheirinho · Bico de Pato',
      vMax: '285 km/h',
      vMin: '78 km/h',
      tempoMedio: '35.840 s',
      desafio: 'Curvas de raio variável e hairpin lento no Bico de Pato. Exige máxima tração e pressão aerodinâmica.'
    },
    {
      setor: 3,
      nome: 'Setor 3: Junção & Subida dos Boxes (Pé no Porão)',
      extensao: '1.249 metros',
      curvas: 'Curva 12 (Junção) · Subida dos Boxes · Curva do Café',
      vMax: '348 km/h',
      vMin: '135 km/h',
      tempoMedio: '16.150 s',
      desafio: 'Aceleração contínua em aclive de 40 metros até a reta principal. Vital para a velocidade final.'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header Info - Light, welcoming, compact */}
      <div className="p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-500" />
        
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>São Paulo · Brasil</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="text-slate-500 dark:text-slate-400">Autódromo José Carlos Pace</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Ficha Técnica & Setores de Interlagos
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Dados de engenharia e telemetria oficial do Grande Prêmio do Brasil de Fórmula 1.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs font-mono">
          <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-emerald-800 dark:text-emerald-300">
            <span className="block text-[10px] uppercase font-sans text-emerald-600 dark:text-emerald-400 font-semibold">
              Extensão
            </span>
            <span className="font-bold text-xs sm:text-sm">4.309 metros</span>
          </div>

          <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-lg text-amber-800 dark:text-amber-300">
            <span className="block text-[10px] uppercase font-sans text-amber-600 dark:text-amber-400 font-semibold">
              Sentido
            </span>
            <span className="font-bold text-xs sm:text-sm">Anti-Horário</span>
          </div>
        </div>
      </div>

      {/* Physics & Atmospheric Conditions at Interlagos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-white/95 dark:bg-slate-900/90 rounded-xl border border-slate-200/90 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
            <Mountain className="w-3.5 h-3.5 text-emerald-600" />
            <span>Altitude (800m)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Interlagos está a ~800m de altitude. O ar rarefeito reduz a densidade para <code className="font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1 py-0.5 rounded">1.18 kg/m³</code>, exigindo maior inclinação das asas.
          </p>
        </div>

        <div className="p-3.5 bg-white/95 dark:bg-slate-900/90 rounded-xl border border-slate-200/90 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs">
            <Wind className="w-3.5 h-3.5 text-amber-600" />
            <span>2 Zonas de DRS</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Reta Principal e Reta Oposta. A abertura da asa traseira reduz o arrasto em até 25%, elevando as velocidades até <span className="font-mono font-bold text-amber-700 dark:text-amber-400">348 km/h</span>.
          </p>
        </div>

        <div className="p-3.5 bg-white/95 dark:bg-slate-900/90 rounded-xl border border-slate-200/90 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-semibold text-xs">
            <Timer className="w-3.5 h-3.5 text-sky-600" />
            <span>Recorde da Pista</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Recorde oficial em corrida: <strong className="text-slate-900 dark:text-white font-mono bg-sky-50 dark:bg-sky-950/60 px-1 py-0.5 rounded">1:10.540</strong> (Valtteri Bottas, 2018). Velocidade média superior a 220 km/h.
          </p>
        </div>
      </div>

      {/* Sectors Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Flag className="w-4 h-4 text-emerald-600" />
          Análise Setor por Setor (Metodologia GCCD)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sectors.map((sec) => (
            <div
              key={sec.setor}
              className="p-3.5 bg-white/95 dark:bg-slate-900/90 rounded-xl border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[11px] border border-emerald-200 dark:border-emerald-800/50">
                    Setor {sec.setor}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{sec.extensao}</span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mb-1">
                  {sec.nome}
                </h4>

                <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono mb-2 bg-slate-50 dark:bg-slate-950/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
                  {sec.curvas}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sec.desafio}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-500 block uppercase font-sans">V-Max:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm">{sec.vMax}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-500 block uppercase font-sans">Tempo:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400 text-xs sm:text-sm">{sec.tempoMedio}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
